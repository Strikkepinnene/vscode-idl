# vscode-idl Development Workflow Guide

## Quick Start Workflow

### Initial Setup (One Time)
```bash
# Prerequisites: Node.js ≥20.12.0, npm ≥9.2
npm i -g nx vsce                    # Install global tools
npm i                               # Install dependencies
npm run build-package-json          # Generate package.json contributions
```

### Daily Development Workflow

#### 1. **Start Development Environment**
```bash
# Full development (all components)
npm start

# OR - Faster targeted development
npm run start-server               # Language server + parsing worker
npm run start-client              # VSCode extension client
npm run start-web                 # Web client (browser version)
npm run start-webview             # Angular webview UI
npm run start-notebook            # Notebook components
```

#### 2. **Launch Extension Development Host**
Press **F5** in VSCode after starting the build processes above.

#### 3. **Before Every Commit (MANDATORY)**
```bash
npm run code-prep                  # Lint + format all code
```

#### 4. **Testing Strategy**
```bash
# Quick library tests (no IDL/ENVI required)
npm run test-libs

# Full integration tests (requires IDL/ENVI)
npm run test-everything

# Test generation and validation
npm run generate-tests             # Regenerate automated tests
npm run make-integration-tests     # Build integration test runners
npm run test-integration          # Run integration tests only
```

#### 5. **Building for Release**
```bash
npm run package                   # Creates .vsix file for distribution
```

## Architecture-Specific Workflows

### Extension Contribution Points
Since contribution points are **code-generated**, follow this pattern:
```bash
# 1. Edit TypeScript files in apps/package-json/src/contributes/
# 2. Regenerate package.json
npm run build-package-json
# 3. Test changes
```

**Key locations:**
- Commands: `apps/package-json/src/contributes/contributes-commands.ts`
- Configuration: `apps/package-json/src/contributes/config/`
- Themes: `apps/package-json/src/contributes/contributes-themes.ts`

### Syntax Highlighting Updates
```bash
# 1. Edit YAML source
# Location: extension/language/syntaxes/src/idl.yaml
# 2. Generate TextMate grammar
npm run build-tmlang
```

### Translation Workflow
```bash
# 1. Edit translation files
# Location: libs/translation/src/lib/languages/
# 2. Build translation files
npm run build-i18n
```

### Documentation Updates
```bash
# 1. Edit source docs
# Location: extension/docs/
# 2. Rebuild docs
npm run build-docs

# For live development
npm run docs:dev                   # Local dev server
npm run docs:build                 # Production build
```

## NX Monorepo Patterns

### Library Development
```bash
# Create new library
nx g @nx/node:lib lib-name
# OR for VSCode-dependent libraries (MUST be in libs/vscode/)
nx g @nx/node:lib vscode/lib-name

# Build specific library
nx build lib-name [--watch]

# Test specific library
nx test lib-name [--testFile my-file.spec.ts]

# Lint specific library
nx lint lib-name [--fix]
```

### Application Development
```bash
# Build specific app
nx build app-name [--watch]

# Available apps: client, server, parsing-worker, notebook, 
# idl-webview, client-web, package-json, i18n, tml-maker
```

## Debugging Workflows

### Language Server Debugging
1. Launch "Extension + Server" configuration in VSCode
2. Set breakpoints in `apps/server/` or `apps/parsing-worker/`
3. Use IDL files to trigger language server features

### Extension Client Debugging  
1. Press **F5** to launch Extension Development Host
2. Set breakpoints in `apps/client/`
3. Test extension commands and UI

### Notebook Debugging
```bash
npm run start-notebook             # Build notebook components
# Then test .idlnb files in Extension Development Host
```

### IDL Integration Debugging
- IDL process integration: `libs/idl/idl-process/`
- IDL machine (9.2+): `libs/idl/idl-machine/`
- Debug integration: `libs/vscode/debug/`

## Release Workflow

### Pre-Release Validation
```bash
# 1. Regenerate and validate tests
npm run generate-tests
npm run test-libs

# 2. Full integration testing
npm run test-everything

# 3. Manual validation (requires IDL/ENVI)
# - Extension installation/activation
# - Basic IDL commands
# - Notebook functionality
```

### Release Process
```bash
# 1. Update CHANGELOG.md
# 2. Bump version in package.json  
# 3. Run full test suite
npm run test-everything

# 4. Package extension
npm run package

# 5. Publish (requires credentials)
vsce publish

# 6. Create GitHub release with matching version
```

## Performance Optimization

### Build Performance
```bash
# Faster development startup (targeted builds)
npm run start-server              # Just server components
npm run start-client              # Just client components

# Full production build
npm run build-extension
```

### Test Performance
```bash
# Quick library-only tests (fastest)
npm run test-libs

# Targeted integration tests
npm run make-integration-tests && npm run test-integration

# Skip test generation if unchanged
# (avoid npm run generate-tests if no parser changes)
```

## Troubleshooting Common Issues

### PowerShell Execution Policy (Windows)
```bash
# Use .cmd versions instead of .ps1
npm.cmd run command               # Instead of npm run command
npx.cmd nx build app             # Instead of npx nx build app
```

### Extension Not Loading
1. Check `npm run build-package-json` completed successfully
2. Verify no syntax errors in contribution TypeScript files
3. Check extension development host console for errors

### Language Server Not Starting
1. Verify `npm run start-server` completed without errors
2. Check parsing worker build in `dist/apps/parsing-worker/`
3. Review language server logs in VSCode Output panel

### Test Failures
1. Regenerate tests: `npm run generate-tests`
2. Check for outdated test files in `idl/test/` directories
3. Verify IDL/ENVI installation for integration tests

## File Patterns to Remember

### Auto-Generated (Don't Edit Directly)
- `package.json` contributions section
- `extension/language/syntaxes/*.tmLanguage`
- `*package.nls*.json` translation files

### Path Aliases (`@idl/*`)
All libraries use path aliases defined in `tsconfig.base.json`:
- `@idl/parser` → `libs/parsing/parser/src/index.ts`
- `@idl/vscode/client` → `libs/vscode/client/src/index.ts`
- `@idl/mcp/server` → `libs/mcp/server/src/index.ts`

### VSCode Library Isolation
Libraries importing `vscode` APIs **MUST** be in `libs/vscode/` for proper testing isolation.

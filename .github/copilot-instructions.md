# Copilot Instructions for vscode-idl

This is the official IDL extension for Visual Studio Code - a full-featured development environment for IDL (Interactive Data Language) with language server, notebooks, debugging, and more.

## Architecture Overview

### NX Monorepo Structure

This project uses **NX** for monorepo management with two main categories:

- **`apps/`**: Buildable entry points that produce executables
  - `client`: VSCode extension client (manages UI, commands, starts language server)
  - `server`: Language server implementation (LSP)
  - `parsing-worker`: Background worker thread for indexing IDL code
  - `notebook`: Notebook renderer and kernel implementation
  - `idl-webview`: Angular-based webview UI
  - `client-web`: Web version of the client for browser environments
  - `package-json`: Generates package.json contribution points from code
  - `i18n`: Translation file generator
  - `tmlang-maker`: Converts YAML syntax definitions to plist for VSCode

- **`libs/`**: Shared code imported by apps and other libs
  - **VSCode-dependent libs** MUST be in `libs/vscode/` subdirectory (testing requirement)
  - Uses path aliases defined in `tsconfig.base.json` (e.g., `@idl/parser`, `@idl/vscode/client`)
  - **Domain organization**: `parsing/*`, `assembling/*`, `types/*`, `idl/*`, `mcp/*`, `vscode/*`

### Key Architectural Patterns

1. **Language Server Architecture**: Client (`apps/client`) ↔ Language Server (`apps/server`) ↔ Parsing Worker (`apps/parsing-worker`)
   - Uses `vscode-languageserver` protocol for client-server communication
   - Parsing worker runs in separate thread to prevent UI blocking
   - Custom message types in `libs/vscode/events/messages`

2. **Library Organization by Domain**:
   - `libs/parsing/*`: Tokenizer, parser, syntax tree, validators
   - `libs/assembling/*`: Code formatters, fixers, assemblers
   - `libs/types/*`: Shared TypeScript type definitions
   - `libs/vscode/*`: VSCode-specific integrations

3. **Code Generation**: Many contribution points (commands, configuration, themes) are generated from TypeScript code in `apps/package-json` rather than manually maintained in `package.json`

## Critical Developer Workflows

### Setup (First Time)
```bash
npm i -g nx vsce           # Install global dependencies
npm i                      # Install all dependencies
npm run build-package-json # Generate package.json contributions
```

### Development
```bash
npm start                  # Build all components with watch mode
# OR for faster startup:
npm run start-server       # Build server + parsing-worker with watch
npm run start-client       # Build client with watch
npm run start-web          # Build web client with watch (browser version)
```
Then press **F5** in VSCode to launch extension development host.

### Before Committing
```bash
npm run code-prep          # Lint + format all code (REQUIRED)
```

### Testing
```bash
npm run test-libs          # Test libraries only (no IDL/ENVI required)
npm run test-everything    # All tests including integration (requires IDL/ENVI)
```

### Building for Release
```bash
npm run package            # Builds and creates .vsix file
```

### Ubuntu on Windows
Replace `nx` with `npx nx` in all commands.

### Extension Activation
Extension now **always activates** in VSCode to support GitHub Copilot integration and MCP tools.

## Project-Specific Conventions

### Code Style
- **Prettier** and **ESLint** are mandatory - run `npm run code-prep` before commits
- All UI text MUST go through translation system (`libs/translation`)
- Tab width: 2 spaces (configured in formatting options)

### Testing Patterns
- Libraries have `.spec.ts` files using Jest
- Integration tests in `apps/client-e2e` use custom VSCode test framework
- Test files use pattern: `libs/tests/*/src/` (e.g., `@idl/tests/tokenizer`)
- Run specific lib tests: `nx test lib-name --testFile my-file.spec.ts`

### VSCode Library Isolation
Libraries importing `vscode` MUST be in `libs/vscode/` because:
- VSCode APIs only exist when running in extension context
- Enables proper test mocking and isolation
- Examples: `@idl/vscode/client`, `@idl/vscode/config`

### NX Commands
- Build: `nx build project-name [--watch]`
- Lint: `nx lint project-name [--fix]`
- Move lib: `nx g @nx/workspace:move --project old-name shared/new-name`

## Integration Points

### Language Server Protocol (LSP)
- Client initializes server via `vscode-languageclient`
- Custom notifications in `libs/vscode/events/messages`
- Server provides: diagnostics, hover, completion, formatting, etc.

### Parsing Worker Communication
- Runs tokenizer/parser in separate thread via `libs/workers/workerio`
- Message types in `libs/workers/parsing`
- Prevents main thread blocking during indexing

### IDL Integration
- `libs/idl/idl-process`: Spawns IDL process for debugging/execution
- `libs/idl/idl-machine`: New native IDL 9.2+ integration
- Notebooks communicate with IDL kernel via socket.io

### Model Context Protocol (MCP)
- New MCP integration in `libs/mcp/*` for AI agent tooling
- Server tools and resources in `libs/mcp/server-*`
- VSCode-specific MCP handlers in `libs/mcp/vscode`
- Debug integration at `libs/vscode/debug/src/lib/mcp`
- Language server MCP tools at `libs/vscode/server/src/lib/mcp`

### Configuration System
- Extension config in `libs/vscode/extension-config`
- IDL-specific config (paths, environment) in `idl.IDL.*` settings
- Use `@idl/vscode/config` to access parsed configuration

## Important Files & Commands

### Key Entry Points
- `apps/client/src/main.ts`: Extension activation
- `apps/server/src/main.ts`: Language server startup
- `apps/parsing-worker/src/main.ts`: Background parser

### Auto-Generated Files (Don't Edit Directly)
- `package.json` contributions section - edit `apps/package-json/src/contributes/*`
- `extension/language/syntaxes/*.tmLanguage` - edit YAML in `extension/language/syntaxes/src/`
- Translation files `*package.nls*.json` - edit `libs/translation/src/lib/languages/`

### Build Outputs
- `dist/` - All compiled applications
- `extension/language/syntaxes/*.tmLanguage` - Generated syntax files

## Common Tasks

**Add new command**: Edit `apps/package-json/src/contributes/commands.ts`, then `npm run build-package-json`

**Update syntax highlighting**: Edit `extension/language/syntaxes/src/idl.yaml`, then `npm run build-tmlang`

**Add translation**: Edit `libs/translation/src/lib/languages/en.ts` (and others), then `npm run build-i18n`

**Create new lib**: `nx g @nx/node:lib lib-name` (or `nx g @nx/node:lib vscode/lib-name` for VSCode-dependent)

**Debug language server**: Launch "Extension + Server" configuration in VSCode

## References

- Developer docs: User-facing docs in `extension/docs/`
- NX help: See `NX.md` or https://nx.dev/
- Contributing: See `CONTRIBUTING.md` for detailed setup
- Node requirement: ≥20.12.0 (checked in package.json engines)

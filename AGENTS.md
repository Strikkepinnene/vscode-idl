<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- You have access to the Nx MCP server and its tools, use them to help the user
- When answering questions about the repository, use the `nx_workspace` tool first to gain an understanding of the workspace architecture where applicable.
- When working in individual projects, use the `nx_project_details` mcp tool to analyze and understand the specific project structure and dependencies
- For questions around nx configuration, best practices or if you're unsure, use the `nx_docs` tool to get relevant, up-to-date docs. Always use this instead of assuming things about nx configuration
- If the user needs help with an Nx configuration or project graph error, use the `nx_workspace` tool to get any errors

<!-- nx configuration end-->

# vscode-idl Specific Workflow Guidance

## Critical Development Patterns

### PowerShell Execution Policy (Windows)

If npm/npx commands fail with "execution policy" errors, use `.cmd` versions:

```bash
npm.cmd run command               # Instead of npm run command  
npx.cmd nx build app             # Instead of npx nx build app
```

### Code Generation Architecture

This project heavily uses **code generation**. Key auto-generated files (DO NOT edit directly):

- `package.json` contributions section → Edit `apps/package-json/src/contributes/*`
- `extension/language/syntaxes/*.tmLanguage` → Edit `extension/language/syntaxes/src/idl.yaml`
- Translation files `*package.nls*.json` → Edit `libs/translation/src/lib/languages/`

### VSCode Library Isolation Rule

Libraries importing `vscode` APIs **MUST** be in `libs/vscode/` subdirectory for proper testing isolation.

### Path Aliases Pattern

All imports use `@idl/*` aliases defined in `tsconfig.base.json`:

- `@idl/parser` → `libs/parsing/parser/src/index.ts`
- `@idl/vscode/client` → `libs/vscode/client/src/index.ts`
- `@idl/mcp/server` → `libs/mcp/server/src/index.ts`

## Essential Commands

### Development Workflow

```bash
# Setup (one time)
npm i -g nx vsce && npm i && npm run build-package-json

# Daily development
npm start                         # Build all with watch mode
# OR faster startup:
npm run start-server && npm run start-client

# Before commits (MANDATORY)
npm run code-prep                 # Lint + format all code

# Testing
npm run test-libs                 # Libraries only (no IDL/ENVI required)
npm run test-everything           # Full integration tests (requires IDL/ENVI)

# Building
npm run package                   # Creates .vsix file
```

### Code Generation Commands

```bash
npm run build-package-json        # Regenerate package.json contributions
npm run build-tmlang              # Regenerate syntax highlighting  
npm run build-i18n                # Regenerate translation files
npm run build-docs                # Regenerate documentation
```

## Architecture Understanding

### Language Server Protocol (LSP) Flow

Client (`apps/client`) ↔ Language Server (`apps/server`) ↔ Parsing Worker (`apps/parsing-worker`)

- Custom message types in `libs/vscode/events/messages`
- Parsing runs in separate thread to prevent UI blocking

### Domain Organization

- `libs/parsing/*`: Tokenizer, parser, syntax tree, validators
- `libs/assembling/*`: Code formatters, fixers, assemblers  
- `libs/types/*`: Shared TypeScript type definitions
- `libs/vscode/*`: VSCode-specific integrations (MUST be isolated for testing)
- `libs/mcp/*`: Model Context Protocol integration for AI agents
- `libs/idl/*`: IDL language and ENVI integration

### Testing Strategy

- **Unit tests**: Jest files (*.spec.ts) in libraries
- **Integration tests**: `apps/client-e2e` with custom VSCode framework
- **Test patterns**: `libs/tests/*/src/` (e.g., `@idl/tests/tokenizer`)
- **Test generation**: `npm run generate-tests` creates automated tests

Refer to `WORKFLOW.md`, `.github/copilot-instructions.md`, and `.ai/context.md` for complete development guidelines.

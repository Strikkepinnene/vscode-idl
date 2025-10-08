# VSCode IDL Extension - AI Coding Agent Instructions

## Project Overview

This is a VSCode extension for IDL (Interactive Data Language), providing language server capabilities, debugging, notebooks, and GitHub Copilot integration. The extension is built using an NX monorepo with TypeScript, managing multiple apps and libraries for a modular architecture.

## Architecture

### Monorepo Structure (NX)

This project uses **NX** for monorepo management:
- **apps/**: Entry points compiled to `main.js` files
  - `client`: VSCode extension UI, commands, and lifecycle
  - `server`: Language server implementation (LSP)
  - `parsing-worker`: Background worker thread for code indexing
  - `notebook`: Notebook renderer implementation
  - `idl-webview`: Angular-based webview components
  - `idl-docs-parser`: Generates hover help from IDL documentation
- **libs/**: Shared libraries organized by domain
  - `vscode/`: Libraries importing from VSCode API (client-only)
  - `parsing/`: IDL tokenizer, parser, syntax validation
  - `assembling/`: Code formatters, fixers, and assemblers
  - `mcp/`: Model Context Protocol (GitHub Copilot integration)
  - `idl/`: IDL process management and interaction
  - `notebooks/`: Notebook kernel and encoders

### Key Architectural Patterns

1. **Language Server Pattern**: Client (`apps/client`) starts the language server (`apps/server`). Server runs in separate process for performance.

2. **Worker Thread Pattern**: `parsing-worker` runs in background thread to index IDL code without blocking the main thread.

3. **Path Aliases**: Import using `@idl/` prefixes defined in `tsconfig.base.json` (e.g., `@idl/vscode/client`, `@idl/parser`).

4. **Library Isolation**: Libraries importing `vscode` API MUST be in `libs/vscode/` folder. This enables testing since VSCode APIs only exist at runtime.

5. **MCP Integration**: GitHub Copilot communicates via Model Context Protocol server (`libs/mcp/server`) on port 4142 to execute IDL commands.

## Development Workflows

### Setup
```bash
npm i -g nx vsce    # Install global dependencies
npm i               # Install project dependencies
```

### Development
```bash
npm start                 # Start client, server, parsing-worker with watch mode
npm run start-server      # Server only
npm run start-client      # Client only
npm run start-webview     # Webview only
```
Press F5 in VSCode to launch extension development host.

### Building
```bash
npm run build-extension   # Full production build (client, server, docs, i18n)
npm run build-client      # Client apps only
npm run build-server      # Server apps only
npm run package          # Create .vsix for distribution
```

### Testing
```bash
npm run test-libs         # Unit tests (no IDL/ENVI required)
npm run test-everything   # All tests including integration (requires IDL/ENVI)
```
**Important**: Only test libraries when making changes; don't break existing unrelated tests.

### Code Quality
```bash
npm run code-prep         # Lint, format, and validate before commits
npm run format-tests      # Format test projects
npm run lint-tests        # Lint test projects
```

### Updating Configuration
```bash
npm run build-package-json  # Regenerate package.json contributions
npm run build-i18n          # Update translation files
npm run build-tmlang        # Regenerate TextMate grammar
```

## Project-Specific Conventions

### Import Organization
Use ESLint plugin `simple-import-sort` - imports auto-sorted alphabetically. Example:
```typescript
import { InitializeClient } from '@idl/vscode/client';
import { InitializeDocs } from '@idl/vscode/docs';
import { ExtensionContext } from 'vscode';
```

### Code Style
- **No comments** unless matching existing style or explaining complexity
- **Perfectionist sorting**: Classes, interfaces, enums auto-sorted
- **Single quotes** for strings (configurable via formatter)
- **2-space indentation** (default)
- Use existing libraries; only add new dependencies if absolutely necessary

### Naming Conventions
- Libraries: `@idl/<domain>/<library>` (e.g., `@idl/parsing/index`)
- Global token types: `f` (function), `p` (procedure), `fm` (function method), `pm` (procedure method), `s` (struct), `sv` (system variable)
- Files end with `.ts` (TypeScript), `.spec.ts` (tests), `.interface.ts` (type definitions)

### Testing Patterns
- Tests located in `libs/tests/*` directories
- Test files: `*.spec.ts`
- Use Jest for unit tests
- Integration tests in `apps/client-e2e/`
- Auto-generate tokenizer tests with `npm run generate-tests`

## Integration Points

### Language Server Communication
- Client-server communication via `vscode-languageclient` and `vscode-languageserver`
- Custom events in `libs/vscode/events/messages/`
- Worker thread messaging via `libs/workers/workerio/`

### IDL Process Integration
- `libs/idl/idl-machine/`: IDL 9.2+ native integration
- `libs/idl/idl-process/`: Legacy process spawning
- `libs/idl/ws-server/`: WebSocket server for IDL communication

### GitHub Copilot MCP Integration
- Server: `libs/mcp/server/` (Express + Socket.io on port 4142)
- Resources: `libs/mcp/server-resources/` (docs, code context)
- Tools: `libs/mcp/server-tools/` (start IDL, run code, etc.)
- VSCode integration: `libs/mcp/vscode/`

### Documentation System
- Docs served locally on port 3344 (`libs/docs/server/`)
- Generated from IDL help files by `apps/idl-docs-parser/`
- Hover help uses markdown with embedded examples

## Key Files and Directories

- `package.json`: Main extension manifest (auto-generated contribution points)
- `nx.json`: NX configuration (parallel builds, caching)
- `tsconfig.base.json`: Path mappings for all libraries
- `.eslintrc.json`: ESLint rules including import sorting
- `extension/`: Extension assets (images, themes, snippets, schemas)
- `idl/`: IDL-specific files (routines, global tokens)

## Important Notes

- **IDL not required** for development (except debugging/notebooks)
- **Node.js 20.12+** and **NPM 9.2+** required
- Language server can parse ~1.5M lines of code (more with Node.js on PATH)
- Structure definitions only detected in `*__define.pro` files (IDL convention)
- Web extension support limited (see `apps/client-web/`)

## When Making Changes

1. Run `npm run code-prep` before committing
2. Test with `npm run test-libs` for library changes
3. Build with `npm run build-extension` to verify packaging
4. Update docs if changing public APIs
5. Regenerate package.json if changing contribution points
6. Format tests with `npm run format-tests` if updating test libraries

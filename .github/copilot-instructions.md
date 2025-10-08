# Copilot Instructions for vscode-idl

## Architecture Overview

This is a **VSCode extension for IDL (Interactive Data Language)** built as an **NX monorepo** with TypeScript. The extension provides language server protocol (LSP) support, debugging, notebook support, and webviews for IDL development.

### Key Components

- **Client (`apps/client`)**: VSCode extension entry point - manages UI, commands, and initializes the language server
- **Server (`apps/server`)**: Language Server Protocol implementation - handles parsing, diagnostics, auto-complete, hover help
- **Parsing Worker (`apps/parsing-worker`)**: Background worker thread for indexing IDL code without blocking the main thread
- **IDL Webview (`apps/idl-webview`)**: Angular-based webview for UI components within VSCode
- **Notebook Renderer (`apps/notebook-renderer`)**: Renders IDL notebooks with embedded graphics
- **Parsing Libraries (`libs/parsing/`)**: Core parsing infrastructure split into modular libs:
  - `tokenizer`: Converts IDL code into tokens
  - `parser`: Main entry point for parsing and detecting syntax errors
  - `syntax-tree`: Creates syntax trees from tokens
  - `syntax-validators`: Validates syntax tree and reports problems
  - `syntax-post-processors`: Post-processes syntax tree to map tokens to correct types
  - `index`: Tracks tokens, syntax problems, and manages the global index

### Data Flow

1. **User edits code** → Client receives changes → Sends to Language Server
2. **Language Server** → Sends work to Parsing Worker (via worker thread)
3. **Parsing Worker** → Tokenizes → Parses → Validates → Returns tokens/problems
4. **Language Server** → Updates diagnostics, provides auto-complete/hover help to Client
5. **Client** → Updates VSCode UI with diagnostics, completions, etc.

## Development Workflows

### Setup

```bash
npm i -g nx vsce                    # Install global tools
npm i                                # Install dependencies
npm run build-package-json          # Build contribution points for package.json
```

### Development (Live Reload)

```bash
npm start                           # Build and watch client, server, parsing-worker
# OR individually:
npm run start-client                # Watch client only
npm run start-server                # Watch server only
```

Press **F5** in VSCode to launch the extension development host. After code changes and rebuild, refresh the extension host from the debug menu.

### Linting & Formatting

```bash
npm run code-prep                   # Lint all projects with --fix and format code (REQUIRED before commits)
```

**This is mandatory** - all code must pass linting and be formatted with Prettier/ESLint before submission.

### Testing

```bash
npm run test-libs                   # Test all libs (no IDL/ENVI installation required)
npm run test-everything             # Run all tests including integration (requires IDL/ENVI)
nx test <lib-name>                  # Test specific lib
nx test <lib> --testFile <file>     # Test specific file(s) in a lib
```

**Test Structure**: Most tests are in `libs/tests/*` as automatically generated snapshot tests. Integration tests are in `apps/client-e2e`.

### Building & Packaging

```bash
npm run build-extension             # Build entire extension
npm run package                     # Package as .vsix file for distribution
```

## Project-Specific Conventions

### NX Monorepo Patterns

- **Apps** (`apps/`): Entry points that compile to executable node.js apps
- **Libs** (`libs/`): Shared code between apps and other libs
- **VSCode-dependent libs** go in `libs/vscode/*` - they import from `vscode` module
- Each app/lib has a `README.md` explaining its purpose

### Code Organization

1. **All VSCode UI text must be internationalized** - goes through `apps/i18n` for translation
2. **Contribution points are code-generated** - modify `apps/package-json/src/contributes` not `package.json` directly
3. **Run `npm run build-package-json`** after changing contribution points or translations
4. **Language syntax is YAML** - converted to plist by `apps/tmlang-maker`

### Testing Patterns

- **Snapshot testing**: Most libs use auto-generated snapshot tests in `libs/tests/*`
- **Generate tests**: Use `npm run generate-tests` to create/update tokenizer snapshot tests
- **Test file naming**: `<feature>.spec.ts` or `<feature>.<variant>.spec.ts`

### Parsing Architecture Patterns

The parsing flow follows a **modular pipeline**:

```
Code → Tokenizer → Parser → Syntax Tree → Validators → Post-processors → Problems/Tokens
```

- **Tokenizer** (`libs/parsing/tokenizer`): Low-level, fast, regex-based token extraction
- **Syntax Tree** uses tokens to build AST (Abstract Syntax Tree)
- **Validators** are **plugins** - add them by importing from `syntax-validators`
- **Post-processors** are **plugins** - add them by importing from `syntax-post-processors`
- **Problems** use standardized codes from `libs/parsing/problem-codes`

**Example**: Adding a new validator requires creating it in `syntax-validators` and importing it in the syntax-tree initialization.

### Worker Thread Communication

- Worker threads use `libs/workerio` for type-safe messaging
- Messages, payloads, and responses are defined in `libs/workers/parsing`
- Worker threads are used to avoid blocking the main VSCode thread during heavy parsing

## Critical Integration Points

### Language Server Protocol (LSP)

- Server initializes via `libs/vscode/server`
- Client-server communication uses LSP standard + custom messages in `libs/vscode/events/messages`
- Custom events use the event libs: `libs/vscode/events/client` and `libs/vscode/events/server`

### IDL Runtime Integration

- `libs/idl` manages spawning and communicating with IDL processes
- Debug adapter uses this for breakpoints and interactive debugging
- Requires IDL 8.8+ for notebooks, 9.0+ for debugging features

### Documentation Parsing

- IDL/ENVI docs parsed by `apps/idl-docs-parser` (rarely run, pre-generated)
- Parses HTML docs → converts to markdown → creates hover help data
- Docs stored in `idl/` directory, served via language server

### WebView Communication

- Angular app in `apps/idl-webview` for complex UI components
- Uses `libs/vscode/webview` and `libs/vscode/webview-shared` for communication
- Messages are type-safe via shared interfaces

## Common Tasks

### Adding a New Library

```bash
nx g @nx/node:lib lib-name           # Standard lib in libs/lib-name
nx g @nx/node:lib vscode/lib-name    # VSCode-dependent lib in libs/vscode/lib-name
```

### Adding a New Problem Code

1. Add to `libs/parsing/problem-codes`
2. Add validator in `libs/parsing/syntax-validators`
3. Import validator where syntax tree is created
4. Add tests in `libs/tests/*` or create new test lib

### Updating Language Syntax

1. Edit YAML file in `extension/language/idl.YAML-tmLanguage`
2. Run `npm run build-tmlang` to convert to plist
3. Test in extension development host

### Adding Translation Strings

1. Add to `libs/translation/src/lib/languages/*.ts`
2. Run `npm run build-i18n` to generate translation files
3. Run `npm run build-package-json` to update package.json references

## Key Files & Directories

- `package.json`: Scripts and dependencies - **contribution points are auto-generated**
- `nx.json`: NX configuration for monorepo structure
- `tsconfig.base.json`: Shared TypeScript paths for all libs
- `angular.json`: NX project configuration (legacy Angular setup)
- `CONTRIBUTING.md`: Setup and development guidelines
- `NX.md`: NX-specific patterns and commands
- `extension/language/idl.YAML-tmLanguage`: IDL syntax highlighting definition
- `idl/`: Pre-parsed IDL documentation and test files
- `tools/`: Helper scripts for building, testing, formatting

## Notes for AI Agents

- **Always use absolute paths** when working with files
- **Run `npm run code-prep`** before commits to ensure code style compliance
- **Use `nx test <lib>` frequently** during development to catch regressions
- **Don't edit `package.json` contribution points directly** - edit `apps/package-json` instead
- **Ubuntu on Windows users**: Replace `nx` with `npx nx` in all commands
- **Language server memory**: If out-of-memory, install node.js v20 LTS on system path

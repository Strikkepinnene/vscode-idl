# AI Agent Context for vscode-idl

## Project Overview

This is the official IDL extension for Visual Studio Code - a TypeScript/JavaScript project that provides a full-featured development environment for IDL (Interactive Data Language) including language server, notebooks, debugging, and more.

## Language & Framework

- **Primary Language**: TypeScript
- **Runtime**: Node.js
- **Architecture**: NX Monorepo
- **Package Manager**: npm
- **Build System**: NX with custom webpack configurations

## Key Development Commands

```bash
# Setup
npm i -g nx vsce && npm i && npm run build-package-json

# Development
npm start  # Build all with watch mode
# OR for faster development:
npm run start-server && npm run start-client

# Before committing (MANDATORY)
npm run code-prep  # Lint + format

# Testing
npm run test-libs           # Libraries only
npm run test-everything     # Full integration tests

# Building
npm run package            # Creates .vsix file
```

## Architecture Notes

- **Apps** (`apps/`): Buildable executables (client, server, parsing-worker, notebook, etc.)
- **Libs** (`libs/`): Shared code with domain organization (parsing/*, assembling/*, vscode/*, etc.)
- **VSCode Dependencies**: Libraries importing `vscode` MUST be in `libs/vscode/` for testing isolation
- **Path Aliases**: Defined in `tsconfig.base.json` using `@idl/*` namespace
- **Code Generation**: Many package.json contribution points are generated from TypeScript code

## Critical Patterns

- Language Server Protocol (LSP) architecture with worker threads for parsing
- All UI text must go through translation system (`libs/translation`)
- Auto-generated files (don't edit directly): package.json contributions, syntax files, translations
- Extension now always activates to support GitHub Copilot integration and MCP tools

## MCP Integration

New Model Context Protocol integration for AI agent tooling:

- `libs/mcp/*` - Core MCP libraries
- `libs/vscode/debug/src/lib/mcp` - Debug integration
- `libs/vscode/server/src/lib/mcp` - Language server tools

## Development Workflow Snapshots

### Current Project State (November 2025)
- **Node.js**: v25.0.0 (requires ≥20.12.0)
- **NX Version**: 21.1.2 (latest stable)
- **Extension Status**: Always activates for GitHub Copilot/MCP integration
- **Recent Features**: IDL Tutorials, ENVI sidebar integration, MCP tooling

### Common Development Scenarios

**Adding New Commands:**
1. Edit `apps/package-json/src/contributes/commands.ts`
2. Run `npm run build-package-json`
3. Test in Extension Development Host

**Fixing Language Server Issues:**
1. Check `apps/server/` and `apps/parsing-worker/`
2. Use "Extension + Server" debug configuration
3. Monitor Output panel for language server logs

**Updating Syntax Highlighting:**
1. Edit `extension/language/syntaxes/src/idl.yaml`  
2. Run `npm run build-tmlang`
3. Reload Extension Development Host

**Troubleshooting PowerShell Issues:**
- Execution Policy blocked: Use `npm.cmd` instead of `npm`
- Network issues: Check `Test-NetConnection registry.npmjs.org -Port 443`

### Performance Considerations
- **Cold startup**: ~10-15 seconds for full `npm start`
- **Incremental builds**: 2-5 seconds with watch mode
- **Test execution**: Libraries (fast), Integration (slow - requires IDL)
- **Memory usage**: Language server can use significant memory with large projects

Refer to `WORKFLOW.md`, `.github/copilot-instructions.md`, and `AGENTS.md` for complete development guidelines.

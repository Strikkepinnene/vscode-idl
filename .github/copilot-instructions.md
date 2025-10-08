# Copilot Instructions for AI Coding Agents

Welcome to the `vscode-idl` codebase! This project is a monorepo for the official Visual Studio Code extension for IDL (Interactive Data Language) and ENVI. Follow these guidelines to be immediately productive:

## Architecture Overview
- **Monorepo Structure:** Major components are under `apps/` (client, webview, debugger, i18n, etc.), `libs/` (shared logic, parsing, tokenizer, translation, etc.), and `extension/` (VSCode extension entrypoint, images, docs, language support).
- **IDL/ENVI Integration:** The extension provides native integration with IDL 9.2+ and ENVI for code editing, debugging, and notebooks. IDL is only required for running/debugging code or using notebooks.
- **Notebooks:** Native support for IDL Notebooks (see `extension/example-notebooks/`). Notebooks require IDL 8.8.0+ and ENVI 6.0/5.7+.

## Developer Workflows
- **Build:** Use Nx for builds. Run `npx nx build <project>` (e.g., `npx nx build client-web`).
- **Test:** Run tests with `npx nx test <project>` or use Jest configs in each app/lib.
- **Debug:** Debug via VSCode launch configs or by running IDL in the integrated terminal. Debugger code is in `apps/debugger-mark2/`.
- **Docs:** Main docs in `extension/docs/` and `README.md`. Official docs: https://interactive-data-language.github.io/vscode-idl/

## Project-Specific Conventions
- **TypeScript:** All main code is TypeScript. Shared types in `libs/types/`.
- **Chromacoding:** Custom syntax highlighting for IDL in `extension/language/`.
- **Internationalization:** i18n support in `apps/i18n/` and `libs/translation/`.
- **Routine Documentation:** Routines and docs for IDL/ENVI are auto-generated and surfaced in hover help.
- **Version Enforcement:** Notebook startup enforces minimum IDL/ENVI versions.

## Integration Points
- **IDL Machine:** Native integration for fast code execution (see `README.md`).
- **Web Extension:** Lightweight browser support in `apps/client-web/` and `apps/idl-webview/`.
- **External Docs:** ENVI/IDL docs are embedded for hover help and notebook examples.

## Patterns & Examples
- **Nx Project Configs:** Each app/lib has a `project.json` and Jest config.
- **Shared Logic:** Place reusable code in `libs/`.
- **Images/Icons:** Use `extension/images/` for extension assets.

## Quick Start
1. Install dependencies: `npm install`
2. Build: `npx nx build extension`
3. Test: `npx nx test extension`
4. Run/debug in VSCode

## References
- Key files: `README.md`, `CHANGELOG.md`, `extension/`, `apps/`, `libs/`
- For issues, see [changelog](CHANGELOG.md) and [official docs](https://interactive-data-language.github.io/vscode-idl/)

---
For unclear or incomplete sections, please provide feedback to improve these instructions.

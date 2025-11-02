// NX AI Configuration for TypeScript VSCode Extension Project
export const aiConfig = {
  language: 'typescript',
  framework: 'node',
  architecture: 'nx-monorepo',

  // Key project patterns
  patterns: {
    vsCodeLibs: 'libs/vscode/*',
    domainLibs: 'libs/{parsing,assembling,types,idl,mcp}/*',
    apps: 'apps/*',
    pathAliases: '@idl/*'
  },

  // Critical build commands
  commands: {
    setup: 'npm i -g nx vsce && npm i && npm run build-package-json',
    dev: 'npm start',
    lint: 'npm run code-prep',
    test: 'npm run test-libs',
    build: 'npm run package'
  },

  // File generation patterns (don't edit directly)
  generated: [
    'package.json contributions section',
    'extension/language/syntaxes/*.tmLanguage',
    '*package.nls*.json'
  ],

  // Testing strategy
  testing: {
    unit: 'Jest for libraries (*.spec.ts)',
    integration: 'Custom VSCode framework in apps/client-e2e',
    pattern: 'libs/tests/*/src/'
  }
};

// eslint.config.js
import pluginJs from 'eslint-plugin-js' // Adjust to the correct import for your JS plugin
import tseslint from '@typescript-eslint/eslint-plugin' // Adjust to the correct import for TypeScript ESLint
import typescriptParser from '@typescript-eslint/parser' // Import TypeScript parser
import globals from 'globals' // Ensure correct import for globals

export default [
  {
    // Define the environment
    env: {
      node: true, // Enable Node.js global variables
      es6: true, // Enable ES6 features
      browser: true, // If you're using browser globals as well
    },
    // Specify the parser
    parser: typescriptParser,
    parserOptions: {
      ecmaVersion: 2020, // Use the latest ECMAScript features
      sourceType: 'module', // Enable ES module syntax
      tsconfigRootDir: __dirname, // Specify the directory of the tsconfig.json
      project: './tsconfig.json', // Point to your tsconfig.json file
    },
    // Apply to JavaScript and TypeScript files
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: {
        ...globals.node, // Use Node.js globals
        ...globals.browser, // Use browser globals if needed
      },
    },
    rules: {
      // Global rules can be specified here
      '@typescript-eslint/no-unused-expressions': 'off', // Disable the specific TypeScript rule
    },
  },
  // Spread the recommended rules from the JS plugin
  pluginJs.configs.recommended,
  // Spread the recommended rules from TypeScript ESLint
  {
    ...tseslint.configs.recommended,
    rules: {
      // Override specific rules from tseslint
      '@typescript-eslint/no-unused-expressions': 'off', // Ensure the rule is turned off
    },
  },
  {
    // Additional configuration for tests (if needed)
    overrides: [
      {
        files: ['**/*.test.{js,ts}'], // Target test files
        env: {
          mocha: true, // Enable Mocha globals
          node: true, // Enable Node.js globals
        },
        rules: {
          // Additional rules for test files can go here
        },
      },
    ],
  },
]

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest', // Specify the ECMAScript version
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'], // Path to the TypeScript configuration
    extraFileExtensions: ['.vue'], // Additional file extensions
    ignorePatterns: ['.eslintrc.cjs'],
  },
  plugins: ['no-relative-import-paths', 'vue', '@typescript-eslint', 'unused-imports'],
  rules: {
    'vue/component-api-style': ['error', ['script-setup']], // Use script setup
    'vue/v-for-delimiter-style': ['error', 'in'], // Use 'in' delimiter for v-for
    'vue/max-attributes-per-line': 'off',
    'vue/first-attribute-linebreak': 'off',
    radix: ['error', 'always'], // Enforce radix when using parseInt()
    curly: 1, // Enforce curly braces for control statements
    '@typescript-eslint/explicit-function-return-type': [2], // Enforce explicit return types for functions
    '@typescript-eslint/no-explicit-any': [2], // Disallow 'any' type
    '@typescript-eslint/prefer-ts-expect-error': [2], // Prefer @ts-expect-error over @ts-ignore
    '@typescript-eslint/ban-ts-comment': [0], // Allow @ts-comment
    'ordered-imports': [0], // Allow/disallow ordered imports
    'object-literal-sort-keys': [0], // Allow/disallow sorting of object literal keys
    'new-parens': 1, // Enforce parentheses with 'new'
    'no-bitwise': 1, // Disallow bitwise operators
    'no-cond-assign': 1, // Disallow assignment within conditionals
    'no-trailing-spaces': 0, // Allow/disallow trailing spaces
    'eol-last': 1, // Enforce newline at end of files
    'func-style': ['error', 'declaration', { allowArrowFunctions: true }], // Enforce function style
    'no-var': 2, // Disallow 'var' keyword
    'no-void': ['error', { allowAsStatement: true }], // Disallow 'void' operator, except as a statement
    'no-relative-import-paths/no-relative-import-paths': [
      'warn',
      { allowSameFolder: true, rootDir: 'src', prefix: '@' },
    ], // No relative imports

    // Find and remove unused ES6 module imports.
    'no-unused-vars': 'off', // Disable ESLint's 'no-unused-vars'
    'unused-imports/no-unused-imports': 'error', // Disallow unused imports
    'unused-imports/no-unused-vars': [
      'error',
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
    ], // Disallow unused variables and arguments
  },
}
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  // The babel-eslint parser is used here for parsing JavaScript with modern ECMAScript features.
  parser: 'babel-eslint', // Use babel-eslint for parsing JavaScript
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}

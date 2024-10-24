const typescriptParser = require('@typescript-eslint/parser')
const typescriptPlugin = require('@typescript-eslint/eslint-plugin')

module.exports = [
  {
    files: ['src/**'],
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        process: 'readonly',
        console: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin
    },
    rules: {
      'semi': ['error', 'never'], // Proibir ponto e vírgula
      'no-console': 'error', // Proibir console.log
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }] // Máximo de uma linha vazia
    }
  }
]

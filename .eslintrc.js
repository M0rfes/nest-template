module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'check-file'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'check-file/filename-blocklist': [
      'error',
      {
        '**/*.model.ts': '*.models.ts',
        '**/*.util.ts': '*.utils.ts'
      }
    ],
    'check-file/folder-match-with-fex': [
      'error',
      {
        '*.test.{js,ts}': '**/__tests__/',
      }
    ],
    'check-file/folder-naming-convention': [
      'error',
      {
        'src/**/': 'CAMEL_CASE',
        'mocks/*/': 'KEBAB_CASE'
      }
    ],
    '@typescript-eslint/naming-convention': ['error', { selector: 'variableLike', format: ['camelCase', 'UPPER_CASE'] }],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        types: ['boolean'],
        format: ['PascalCase'],
        prefix: ['is', 'should', 'has', 'can', 'did', 'will']
      }
    ]
  },
};

import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    files: [
      'src/**/*.{ts,tsx,js,jsx}',
      'tests/**/*.{ts,tsx,js,jsx}',
      '.storybook/**/*.{ts,tsx,js,jsx}',
    ],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: process.cwd(),
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
      'prettier/prettier': ['error'],
    },
  },
];

// ESLint 9 flat config for the website (Next.js 16 + React 19 + TypeScript).
//
// We deliberately bypass `eslint-config-next` via FlatCompat — Next 16's
// bundled config currently triggers a "Converting circular structure to JSON"
// error inside @eslint/eslintrc when normalized. Instead we wire the same
// underlying plugins (next, react, react-hooks, typescript-eslint) directly
// against the new flat-config API. This catches the same class of bugs the
// canonical Next setup would catch (hook misuse, prop misuse, common
// TypeScript footguns) without the broken plumbing.

import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import nextPlugin from '@next/eslint-plugin-next';

export default [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      'next-env.d.ts',
      '*.config.{js,mjs,cjs,ts}',
      'public/**',
    ],
  },

  // typescript-eslint recommended already includes the eslint:recommended
  // baseline plus TS-aware rules.
  ...tseslint.configs.recommended,

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      '@next/next': nextPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        // Next 15+ globals — keep ESLint from flagging these as undefined.
        React: 'readonly',
        JSX: 'readonly',
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,

      // React 19 doesn't need React imported in scope, and we use TS for prop
      // types instead of prop-types.
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'warn',
      'react/no-unknown-property': 'warn',

      // react-hooks v7 ships several new strict rules — surface them all but
      // don't block the CI pipeline yet. Convert these back to 'error' as the
      // codebase is cleaned up.
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/purity': 'warn',

      // Next-specific rules — kept as warnings for the same reason.
      '@next/next/no-html-link-for-pages': 'warn',

      // Pragmatic TS relaxations — codebase is mid-migration.
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-require-imports': 'warn',

      // Auto-fixable nits — kept as warnings so `eslint --fix` will resolve
      // them without blocking lint.
      'prefer-const': 'warn',
    },
  },
];

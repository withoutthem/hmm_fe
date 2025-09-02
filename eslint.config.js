// eslint.config.js (flat, stable - type-aware 범위 한정)
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import a11y from 'eslint-plugin-jsx-a11y'
import importPlugin from 'eslint-plugin-import'
import prettier from 'eslint-config-prettier'

export default [
  // 0) 전역 ignore
  {
    ignores: [
      'node_modules',
      'dist',
      'build',
      'coverage',
      '.vite',
      '.DS_Store',
      '**/*.d.ts',
      '**/*.css.d.ts',
      'eslint.config.js',
      'vite.config.*',
    ],
  },

  // 1) JS 권장
  js.configs.recommended,

  // 2) TS 권장(비-타입체크) — 전역 적용 OK
  ...tseslint.configs.recommended,

  // 3) 프로젝트 공통 규칙 (src만 린트)
  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': a11y,
      import: importPlugin,
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: { alwaysTryTypes: true, project: ['./tsconfig.json', './tsconfig.app.json'] },
      },
    },
    rules: {
      // React / Hooks
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // a11y
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/no-autofocus': 'warn',

      // ✅ [수정] unused-vars 규칙을 여기서만 정의합니다. (warn 수준으로 변경 권장)
      '@typescript-eslint/no-unused-vars': [
        'warn', // 'error' 대신 'warn'으로 변경하여 커밋은 허용하되 경고를 표시
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // console / debugger
      // 'no-console': ['warn', { allow: ['warn', 'error'] }],
      // 'no-debugger': 'warn',
    },
  },

  // 4) TS 타입체크 기반 규칙 — 오직 TS 파일 + 타입정보 제공
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      // ✅ [수정] 여기서 중복 선언된 no-unused-vars 규칙을 반드시 삭제합니다.
      // '@typescript-eslint/no-unused-vars': 'off', // <-- 이 라인 삭제

      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-unsafe-enum-comparison': 'error',
      '@typescript-eslint/restrict-plus-operands': ['error', { skipCompoundAssignments: true }],
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true, allowBoolean: true, allowNullish: true },
      ],
      '@typescript-eslint/unbound-method': ['error', { ignoreStatic: true }],
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/require-await': 'off',
    },
  },

  // 5) Prettier 마지막
  prettier,
]

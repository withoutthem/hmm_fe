// jest.config.cjs
const { pathsToModuleNameMapper } = require('ts-jest');
const tsconfig = require('./tsconfig.json');

/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // ✅ jsdom 환경

  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.jest.json', // ✅ 테스트 전용 tsconfig
        diagnostics: { ignoreCodes: ['TS151001'] },
      },
    ],
  },

  moduleNameMapper: tsconfig.compilerOptions?.paths
    ? pathsToModuleNameMapper(tsconfig.compilerOptions.paths, { prefix: '<rootDir>/' })
    : {},

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // 필요 시 아래 대안 패턴 사용 가능
  testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx|js)'],
  // 대안: testMatch: ['**/__tests__/**/*.{test,spec}.{ts,tsx,js}'],

  // setupFilesAfterEnv: ['@testing-library/jest-dom'],
};

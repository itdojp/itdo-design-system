module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: './tsconfig.jest.json',
      },
    ],
  },
  moduleNameMapper: {
    '\\.(css)$': '<rootDir>/src/test/styleMock.ts',
    '^css\\.escape$': '<rootDir>/src/test/cssEscape.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.ts'],
};

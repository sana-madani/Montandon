module.exports = {
    preset: 'ts-jest',
    transform: {
      '^.+\\.(ts|tsx)?$': 'ts-jest',
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
    testMatch: ['**/*.test.js'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/$1'
    },
    testEnvironment: 'jsdom'
  };

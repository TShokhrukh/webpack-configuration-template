/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  roots: ['<rootDir>/src'],
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: { resources: 'usable' },
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
}

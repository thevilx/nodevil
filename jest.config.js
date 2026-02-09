module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>", "<rootDir>/tests"],
  testMatch: ["**/tests/**/*.test.ts", "**/?(*.)+(spec|test).ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/index.ts"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],

  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.ts"],

  testTimeout: 30000,
  maxWorkers: 1,
  detectOpenHandles: true,
  forceExit: true,
};

// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  preset: 'ts-jest',
  roots: ["<rootDir>/tests"],
  // Use node environment for API tests
  testEnvironment: "node",
  // Add these module mappings
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  // Setup files
  setupFiles: ['<rootDir>/jest.setup.js'],
  // Add transform if you need to handle ESM modules
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest', { 
      useESM: true,
      tsconfig: 'tsconfig.json' 
    }],
  },
  // Add extensions to handle
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
  ],
};

export default config;
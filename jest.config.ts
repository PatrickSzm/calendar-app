import type { Config } from 'jest';

const config: Config = {
  testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  preset: 'ts-jest',
  roots: ["<rootDir>/tests"],
  testEnvironment: "jsdom",
};

export default config;

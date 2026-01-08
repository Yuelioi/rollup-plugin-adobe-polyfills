/** @type {import('jest').Config} */
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "tsconfig.json",
      },
    ],
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  extensionsToTreatAsEsm: [".ts"],
  testMatch: ["**/__tests__/**/string.test.ts"],
  transformIgnorePatterns: ["node_modules/(?!ts-morph)"],
  moduleDirectories: ["node_modules", "src"],
};

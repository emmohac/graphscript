module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  coverageDirectory: "coverage",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/?(*.)+(spec|test).[t]s?(x)"],
  collectCoverage: true
};

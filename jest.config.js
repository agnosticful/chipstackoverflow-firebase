module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globalSetup: "<rootDir>/.jest/firestoreGlobalSetup.js",
  globalTeardown: "<rootDir>/.jest/firestoreGlobalTeardown.js",
  testPathIgnorePatterns: ["/node_modules/", "/.functions/"]
};

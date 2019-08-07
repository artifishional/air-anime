module.exports = {
  globalSetup: "jest-environment-puppeteer/setup",
  globalTeardown: "jest-environment-puppeteer/teardown",
  moduleFileExtensions: [
    "mjs",
    "js",
    "json",
    "jsx",
    "ts",
    "tsx",
    "node"
  ],
  preset: 'jest-puppeteer',
  testEnvironment: "jest-environment-puppeteer",
  testMatch: [
    "**/dist/__tests__/**/*.[jt]s?(x)",
  ],
  "transform": {
    "^.+\\.(mjs|js)$": "babel-jest",
  },
  transformIgnorePatterns: [
    '/node_modules/.*',
  ],
};

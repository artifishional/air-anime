module.exports = {
  moduleFileExtensions: [
    "mjs",
    "js",
    "json",
    "jsx",
    "ts",
    "tsx",
    "node"
  ],
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

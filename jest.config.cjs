module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  // `globals.ts-jest` was removed because it's deprecated with newer ts-jest presets
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/test/**/*.test.ts', '**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts']
};

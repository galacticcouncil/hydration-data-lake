const path = require('path');

const rootDir = process.env.TARGET === 'liquidity_pools' ? './src/liquidity-pools-api' : './src/storage-dictionary-api';

/** @type {import('jest').Config} */
const config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir,
  testEnvironment: 'node',
  testRegex: '.spec.api.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  setupFiles: [path.resolve(__dirname, 'setupGlobal.ts')],
};

module.exports = config;

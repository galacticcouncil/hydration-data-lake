const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: (() => {
    let envFileName = '';
    if (process.env.TARGET === 'storage_dictionary') envFileName = '.env.hydration.storage-dict-indexer';
    else if (process.env.TARGET === 'liquidity_pools')
      envFileName = '.env.hydration.liq-pools-indexer';
    else
      throw Error('Unknown TARGET environment variable');

    return `${__dirname}/${envFileName}`;
  })(),
});

const rootDir =
  process.env.TARGET === 'liquidity_pools'
    ? './src/liquidity-pools-api'
    : './src/storage-dictionary-api';

const testFiles = [];

if (process.env.PROCESS_LBP_POOLS === 'true') {
  testFiles.push('**/*.lbp.spec.ts');
}
if (process.env.PROCESS_XYK_POOLS === 'true') {
  testFiles.push('**/*.xyk.spec.ts');
}
if (process.env.PROCESS_OMNIPOOLS === 'true') {
  testFiles.push('**/*.omni.spec.ts');
}
if (process.env.PROCESS_STABLEPOOLS === 'true') {
  testFiles.push('**/*.stable.spec.ts');
}

// Default fallback to no tests if none match
if (testFiles.length === 0) {
  console.warn('No test files matched the environment configuration.');
}

/** @type {import('jest').Config} */
const config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir,
  testEnvironment: 'node',
  // testRegex: '.spec.api.ts$',
  testMatch: testFiles,
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  setupFiles: [path.resolve(__dirname, 'setupGlobal.ts')],
};

module.exports = config;

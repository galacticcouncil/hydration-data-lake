import type { CodegenConfig } from '@graphql-codegen/cli';

import * as dotenv from 'dotenv';

dotenv.config({
  path: (() => {
    let envFileName = '';
    if (process.env.TARGET === 'storage_dictionary') envFileName = '.env.hydration.storage-dict-indexer';
    else if (process.env.TARGET === 'liquidity_pools')
      envFileName = '.env.hydration.liq-pools-indexer';
    else
      throw Error('Unknown TARGET environment variable');

    return `${__dirname}/../${envFileName}`;
  })(),
});

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.GRAPHQL_API_URL,
  documents: process.env.API_CODEGEN_DOCUMENTS_PATH,
  // ignoreNoDocuments: true,
  silent: false,
  verbose: true,
  debug: true,
  hooks: {
    onError: (e) => console.log(e),
  },
  generates: {
    [process.env.API_CODEGEN_TYPES_OUTPUT_PATH || '']: {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-document-nodes',
      ],
    },
  },
};

export default config;

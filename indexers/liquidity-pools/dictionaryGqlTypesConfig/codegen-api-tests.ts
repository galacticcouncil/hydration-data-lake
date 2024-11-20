import type { CodegenConfig } from '@graphql-codegen/cli';

import * as dotenv from 'dotenv';
dotenv.config({
  path: (() => {
    let envFileName = '.env.hydration.test';
    return `${__dirname}/../${envFileName}`;
  })(),
});

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.LIQUIDITY_POOLS_API_URL,
  // schema: 'http://localhost:8090/graphql',
  documents: 'tests/api/utils/graphqlRequestManager/apiTypes/query.ts',
  // ignoreNoDocuments: true,
  silent: false,
  verbose: true,
  debug: true,
  hooks: {
    onError: (e) => console.log(e),
  },
  generates: {
    'tests/api/utils/graphqlRequestManager/apiTypes/types.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-document-nodes',
      ],
    },
  },
};

export default config;

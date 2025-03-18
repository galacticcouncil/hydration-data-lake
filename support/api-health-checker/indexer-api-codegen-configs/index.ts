import type { CodegenConfig } from '@graphql-codegen/cli';

import * as dotenv from 'dotenv';

dotenv.config({
  path: (() => {
    return `${__dirname}/../.env`;
  })(),
});

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.INDEXER_GRAPHQL_API_URL,
  documents: 'src/modules/indexerApi/apiTypes/query.ts',
  // ignoreNoDocuments: true,
  silent: false,
  verbose: true,
  debug: true,
  hooks: {
    onError: (e) => console.log(e),
  },
  generates: {
    ['src/modules/indexerApi/apiTypes/index.ts']: {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-document-nodes',
      ],
    },
  },
};

export default config;

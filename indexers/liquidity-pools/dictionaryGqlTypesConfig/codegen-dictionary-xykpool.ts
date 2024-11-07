import type { CodegenConfig } from '@graphql-codegen/cli';

import * as dotenv from 'dotenv';
dotenv.config();

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.HYDRATION_STORAGE_DICTIONARY_XYKPOOL_URL,
  // documents: 'src/utils/storageResolver/dictionaryUtils/apiTypes/xykPool/query.ts',
  generates: {
    'src/utils/storageResolver/dictionaryUtils/apiTypes/xykPool/types.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-document-nodes',
      ],
    },
  },
};

export default config;

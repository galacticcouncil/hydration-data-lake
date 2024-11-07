import type { CodegenConfig } from '@graphql-codegen/cli';

import * as dotenv from 'dotenv';
dotenv.config();

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.HYDRATION_STORAGE_DICTIONARY_STABLEPOOL_URL,
  // documents: 'src/utils/storageResolver/dictionaryUtils/apiTypes/stablepool/query.ts',
  generates: {
    'src/utils/storageResolver/dictionaryUtils/apiTypes/stablepool/types.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-document-nodes',
      ],
    },
  },
};

export default config;

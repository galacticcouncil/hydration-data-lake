import type { CodegenConfig } from '@graphql-codegen/cli';

import * as dotenv from 'dotenv';
dotenv.config();

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.HYDRATION_STORAGE_DICTIONARY_OMNIPOOL_URL,
  // documents: 'src/utils/storageResolver/dictionaryUtils/apiTypes/omnipool/query.ts',
  generates: {
    'src/utils/storageResolver/dictionaryUtils/apiTypes/omnipool/types.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-document-nodes',
      ],
    },
  },
};

export default config;

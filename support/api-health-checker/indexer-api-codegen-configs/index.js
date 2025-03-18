import * as dotenv from 'dotenv';
dotenv.config({
    path: (() => {
        return `${__dirname}/../.env`;
    })(),
});
const config = {
    overwrite: true,
    schema: process.env.INDEXER_GRAPHQL_API_URL,
    // documents: process.env.INDEXER_API_CODEGEN_DOCUMENTS_PATH,
    // ignoreNoDocuments: true,
    silent: false,
    verbose: true,
    debug: true,
    hooks: {
        onError: (e) => console.log(e),
    },
    generates: {
        [process.env.INDEXER_API_CODEGEN_TYPES_OUTPUT_PATH || '']: {
            plugins: [
                'typescript',
                'typescript-operations',
                'typescript-document-nodes',
            ],
        },
    },
};
export default config;

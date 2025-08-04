import { SwaggerDefinition, Options } from 'swagger-jsdoc';

const basePath = process.env.BASE_PATH
  ? `${process.env.BASE_PATH}/api`
  : '/api';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Hydration indexer REST API',
    version: '1.0.0',
    // description: 'API documentation for REST API',
    // contact: {
    //   name: 'API Support',
    //   email: 'support@example.com',
    // },
  },
  servers: [
    {
      url: basePath,
      description: 'Production server',
    },
  ],
};

export const swaggerOptions: Options = {
  swaggerDefinition,
  apis: ['./src/apiSupport/api/rest/routes/*.ts'],
};

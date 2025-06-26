import AggregatesPluggin from '@graphile/pg-aggregates';
import SimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector';
import express, { NextFunction, Request, Response } from 'express';
import { NodePlugin } from 'graphile-build';
import { postgraphile, makePluginHook } from 'postgraphile';
import FilterPlugin from 'postgraphile-plugin-connection-filter';
import { ProcessorStatusPlugin } from './apiSupport/plugins/query/processorStatus.plugin';
import { AppConfig } from './appConfig';
import PgPubsub from '@graphile/pg-pubsub';
// import TypeOverrides from 'pg/lib/type-overrides';
import { getEnvPath } from './utils/helpers';
import { ApiTypesAugmentPlugin } from './apiSupport/plugins/query/apiTypesAugment.plugin';
import compression from 'compression';
// import zlib from 'zlib';
// import { PakoManager } from './utils/pakoManager';

// const pgTypes = new TypeOverrides();
// pgTypes.setTypeParser(1700, function (val) {
//   return val;
// });

const app = express();
const appConfig = AppConfig.getInstance();

const postgraphileInstance = postgraphile(
  {
    host: appConfig.DB_HOST,
    port: appConfig.DB_PORT,
    database: appConfig.DB_NAME,
    user: appConfig.DB_USER,
    password: appConfig.DB_PASS,
    // types: pgTypes,
  },
  'public',
  {
    graphiql: true,
    watchPg: true,
    showErrorStack: false,
    enhanceGraphiql: true,
    dynamicJson: true,
    disableDefaultMutations: true,
    skipPlugins: [NodePlugin],
    subscriptions: true,
    pluginHook: makePluginHook([PgPubsub]),
    appendPlugins: [
      AggregatesPluggin,
      FilterPlugin,
      SimplifyInflectorPlugin,
      ProcessorStatusPlugin,
      ApiTypesAugmentPlugin,
    ],
    disableQueryLog: appConfig.NODE_ENV !== 'development',
    externalUrlBase: process.env.BASE_PATH
      ? process.env.BASE_PATH + '/api'
      : undefined,
    graphileBuildOptions: {
      stateSchemas: [...appConfig.SUB_PROCESSORS_RANGES.keys()],
    },
    allowExplain: true,
    exportGqlSchemaPath: getEnvPath('apiSupport/schema.graphql'),
  }
);

function shouldCompress(req: express.Request, res: express.Response) {
  return compression.filter(req, res);
}

app.use(
  compression({
    filter: shouldCompress,
    threshold: 1,
    level: 9,
    zlib: {
      level: 9,
    },
  })
);

app.use(postgraphileInstance);

app.listen(appConfig.GQL_PORT, () => {
  console.log(`Squid API listening on port ${appConfig.GQL_PORT}`);
});

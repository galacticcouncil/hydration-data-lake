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
import { PakoManager } from './utils/pakoManager';

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

// app.use((req: Request, res: Response, next: NextFunction): void => {
//   console.log('compression middleware');
//   console.dir(req.headers, { depth: null });
//   console.log(req.headers['dictionary-response-compression'] !== 'full')
//
//   if (req.headers['dictionary-response-compression'] !== 'full') {
//     return next();
//   }
//
//   const _send = res.send.bind(res);
//   res.send = (body) => {
//     try {
//       const compressed = PakoManager.compress(body);
//       res.setHeader('Content-Encoding', 'deflate');
//       res.setHeader('Content-Length', compressed.byteLength);
//
//       console.log('compressed')
//       console.dir(compressed, {depth: null})
//       return _send(Buffer.from(compressed));
//     } catch (err) {
//       console.error('Pako compression failed:', err);
//       return _send(body);
//     }
//   };
//   next();
// });

app.use(postgraphileInstance);

app.listen(appConfig.GQL_PORT, () => {
  console.log(`Squid API listening on port ${appConfig.GQL_PORT}`);
});

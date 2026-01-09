import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { NodePlugin } from 'graphile-build';
import { makePluginHook, postgraphile } from 'postgraphile';
import FilterPlugin from 'postgraphile-plugin-connection-filter';
import { makePgSmartTagsFromFilePlugin } from 'postgraphile/plugins';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import SimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector';
import AggregatesPluggin from '@graphile/pg-aggregates';
import PgPubsub from '@graphile/pg-pubsub';

import { AssetHistoricalDataPlugin } from './apiSupport/api/graphql/plugins/query/asset/assetHistoricalData';
import { AccountBalancesHistoricalDataPlugin } from './apiSupport/api/graphql/plugins/query/balances/accountBalancesHistoricalData';
import { DustableAccountsPlugin } from './apiSupport/api/graphql/plugins/query/balances/dustableAccounts';
import { CommonApiTypesDefinitionPlugin } from './apiSupport/api/graphql/plugins/query/commonApiTypesDefinition.plugin';
import { GlobalMetricsPlugin } from './apiSupport/api/graphql/plugins/query/metrics/globalMetrics';
import { OmnipoolTvlMetricsPlugin } from './apiSupport/api/graphql/plugins/query/omnipool/omnipoolTvlMetrics';
import { OmnipoolAssetVolumePlugin } from './apiSupport/api/graphql/plugins/query/omnipool/omnipoolVolume';
import { OmnipoolYieldMetricsPlugin } from './apiSupport/api/graphql/plugins/query/omnipool/omnipoolYieldMetrics';
import { ProcessorStatusPlugin } from './apiSupport/api/graphql/plugins/query/processorStatus.plugin';
import { StableswapTvlMetricsPlugin } from './apiSupport/api/graphql/plugins/query/stableswap/stableswapTvlMetrics';
import { StableswapVolumePlugin } from './apiSupport/api/graphql/plugins/query/stableswap/stableswapVolume';
import { StableswapYieldMetricsPlugin } from './apiSupport/api/graphql/plugins/query/stableswap/stableswapYieldMetrics';
import { SwapPlugin } from './apiSupport/api/graphql/plugins/query/swap';
import { XykpoolsVolumePlugin } from './apiSupport/api/graphql/plugins/query/xykpool/xykPoolsVolume';
import { XykpoolTvlMetricsPlugin } from './apiSupport/api/graphql/plugins/query/xykpool/xykpoolTvlMetrics';
import { OmnipoolAssetVolumeSubscriptionsPlugin } from './apiSupport/api/graphql/plugins/subscription/omnipoolAssetVolumeSubscriptions';
import { RoutedTradesSubscriptionsPlugin } from './apiSupport/api/graphql/plugins/subscription/routedTradesSubscriptions';
import { StableswapVolumeSubscriptionsPlugin } from './apiSupport/api/graphql/plugins/subscription/stableswapVolumeSubscriptions';
import { XykpoolsVolumeSubscriptionsPlugin } from './apiSupport/api/graphql/plugins/subscription/xykPoolVolumeSubscriptions';
import { handleProxyReqDefillama } from './apiSupport/api/rest/proxyApiHandlers/resources/defillama';
import { handleProxyReqSubscan } from './apiSupport/api/rest/proxyApiHandlers/resources/subscan';
import { ProxyApiRoute } from './apiSupport/api/rest/proxyApiHandlers/types';
import restRouter from './apiSupport/api/rest/routes/rest.routes';
import { runApiDbMigrations } from './apiSupport/apiMigrations/runApiDbMigrations';
import { swaggerOptions } from './apiSupport/swagger';
import { TimeSeriesApiSupportManager } from './utils/redisTimeSeriesSupport/timeSeriesApiSupportManager';
import { AppConfig } from './appConfig';
import { getEnvPath } from './utils/helpers';
import { NodeEnv } from './utils/types';
import postgraphileSmartTagPlugins from './apiSupport/smartTags';

// const pgTypes = new TypeOverrides();
// pgTypes.setTypeParser(1700, function (val) {
//   return val;
// });
const appConfig = AppConfig.getInstance();

async function initializeServer() {
  try {
    const app = express();

    await runApiDbMigrations();

    let postgraphileInstance = null;

    const initWithRetry = async (
      max = 5,
      baseDelayMs = 1000,
      maxDelayMs = 10000
    ): Promise<void> => {
      let attempt = 0;

      while (true) {
        try {
          postgraphileInstance = postgraphile(
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
                CommonApiTypesDefinitionPlugin,
                AggregatesPluggin,
                FilterPlugin,
                SimplifyInflectorPlugin,
                ProcessorStatusPlugin,
                XykpoolsVolumePlugin,
                XykpoolsVolumeSubscriptionsPlugin,
                XykpoolTvlMetricsPlugin,
                OmnipoolAssetVolumePlugin,
                OmnipoolAssetVolumeSubscriptionsPlugin,
                StableswapVolumePlugin,
                StableswapVolumeSubscriptionsPlugin,
                RoutedTradesSubscriptionsPlugin,
                SwapPlugin,
                StableswapYieldMetricsPlugin,
                StableswapTvlMetricsPlugin,
                OmnipoolYieldMetricsPlugin,
                OmnipoolTvlMetricsPlugin,
                GlobalMetricsPlugin,
                AssetHistoricalDataPlugin,
                AccountBalancesHistoricalDataPlugin,
                DustableAccountsPlugin,
                ...postgraphileSmartTagPlugins,
              ],
              disableQueryLog: appConfig.NODE_ENV !== NodeEnv.DEV,
              externalUrlBase: process.env.BASE_PATH
                ? process.env.BASE_PATH + '/api'
                : undefined,
              graphileBuildOptions: {
                stateSchemas: appConfig.SUB_PROCESSOR_SCHEMAS,
                omnipoolAddress: appConfig.OMNIPOOL_ADDRESS,
                enableSmartTags: true,
              },
              allowExplain: true,
              exportGqlSchemaPath: getEnvPath('apiSupport/schema.graphql'),
            }
          );
          console.log('[postgraphileInstance] initialized successfully');
          return;
        } catch (e: any) {
          if (attempt >= max) {
            console.error(
              `Failed to init [postgraphileInstance] after ${max} attempts:`,
              e
            );
            throw e;
          }

          attempt++;
          console.log(
            `[postgraphileInstance] init retry #${attempt}... Error: ${e.message}`
          );

          const delay = Math.min(
            baseDelayMs * 2 ** attempt +
              Math.floor(Math.random() * baseDelayMs),
            maxDelayMs
          );

          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    };

    await initWithRetry();

    if (!postgraphileInstance)
      throw new Error('postgraphileInstance is not initialized');

    const corsOptions = {
      origin: (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void
      ) => {
        if (!origin) {
          return callback(null, true);
        }

        const localhostPattern = /^(?:https?:\/\/)?localhost:\d+$/;

        const isAllowedSuffix =
          appConfig.SUBSCAN_PROXY_API_CORS_ALLOWED_SUFFIXES.some((suffix) =>
            origin.endsWith(suffix)
          );

        if (
          (appConfig.SUBSCAN_PROXY_API_CORS_ALLOW_LOCALHOST &&
            localhostPattern.test(origin)) ||
          isAllowedSuffix
        ) {
          callback(null, true);
        } else {
          const err = new Error('Not allowed by CORS');
          (err as any).statusCode = 403;
          return callback(err);
        }
      },
      methods: ['GET', 'POST'],
    };

    app.use((req: Request, res: Response, next: NextFunction): void => {
      const query: unknown = req.body?.query;

      if (
        req.method === 'POST' &&
        typeof query === 'string' &&
        query.includes('mutation {')
      ) {
        res
          .status(403)
          .json({ error: 'Mutations are not allowed on this API.' });
        return;
      }

      next();
    });

    // app.use('/admin/queues', getBullBoardExpressAdapter().getRouter());

    app.use(cors());

    app.use(postgraphileInstance);

    app.use(express.json());

    app.use('/rest', cors(corsOptions), restRouter);

    const swaggerDocsPath = appConfig.BASE_PATH
      ? `${appConfig.BASE_PATH}/api/rest/docs`
      : '/api/rest/docs';
    console.log('swaggerDocsPath - ', swaggerDocsPath);
    // Swagger Setup
    const swaggerSpec = swaggerJsdoc(swaggerOptions);
    app.use(
      swaggerDocsPath,
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, {
        customCssUrl: `${appConfig.BASE_PATH || ''}/api/rest/docs/swagger-ui.css`,
        customJs: `${appConfig.BASE_PATH || ''}/api/rest/docs/swagger-ui-bundle.js`,
      })
    );

    app.post(
      `${ProxyApiRoute.subscan}/*all`,
      cors(corsOptions),
      // @ts-ignore
      handleProxyReqSubscan
    );

    app.get(
      `${ProxyApiRoute.defillama}/*all`,
      cors(corsOptions),
      // @ts-ignore
      handleProxyReqDefillama
    );

    app.listen(appConfig.GQL_PORT, () => {
      console.log(`Squid API listening on port ${appConfig.GQL_PORT}`);
      console.log('BASE_PATH - ', appConfig.BASE_PATH);
    });

    TimeSeriesApiSupportManager.getInstance().initHistDataScraper().then();
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
}

initializeServer().catch(console.error);

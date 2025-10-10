import AggregatesPluggin from '@graphile/pg-aggregates';
import SimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector';
import express from 'express';
import { NodePlugin } from 'graphile-build';
import { postgraphile, makePluginHook } from 'postgraphile';
import FilterPlugin from 'postgraphile-plugin-connection-filter';
import { ProcessorStatusPlugin } from './apiSupport/api/graphql/plugins/query/processorStatus.plugin';
import { AppConfig } from './appConfig';
import { XykpoolsVolumePlugin } from './apiSupport/api/graphql/plugins/query/xykpool/xykPoolsVolume';
import PgPubsub from '@graphile/pg-pubsub';
import { runMigrations } from './apiSupport/apiMigrations/runMigrations';
import { XykpoolsVolumeSubscriptionsPlugin } from './apiSupport/api/graphql/plugins/subscription/xykPoolVolumeSubscriptions';
import { getEnvPath } from './utils/helpers';
import { OmnipoolAssetVolumePlugin } from './apiSupport/api/graphql/plugins/query/omnipool/omnipoolVolume';
import { OmnipoolAssetVolumeSubscriptionsPlugin } from './apiSupport/api/graphql/plugins/subscription/omnipoolAssetVolumeSubscriptions';
import { StableswapVolumePlugin } from './apiSupport/api/graphql/plugins/query/stableswap/stableswapVolume';
import { StableswapVolumeSubscriptionsPlugin } from './apiSupport/api/graphql/plugins/subscription/stableswapVolumeSubscriptions';
import { NodeEnv } from './utils/types';
import { makePgSmartTagsFromFilePlugin } from 'postgraphile/plugins';
import { RoutedTradesSubscriptionsPlugin } from './apiSupport/api/graphql/plugins/subscription/routedTradesSubscriptions';
import { CommonApiTypesDefinitionPlugin } from './apiSupport/api/graphql/plugins/query/commonApiTypesDefinition.plugin';
import { handleProxyReqSubscan } from './apiSupport/api/rest/proxyApiHandlers/resources/subscan';
import { ProxyApiRoute } from './apiSupport/api/rest/proxyApiHandlers/types';
import cors from 'cors';
import { SwapPlugin } from './apiSupport/api/graphql/plugins/query/swap';
import { StableswapYieldMetricsPlugin } from './apiSupport/api/graphql/plugins/query/stableswap/stableswapYieldMetrics';
import { Request, Response, NextFunction } from 'express';
import { OmnipoolYieldMetricsPlugin } from './apiSupport/api/graphql/plugins/query/omnipool/omnipoolYieldMetrics';
import { getBullBoardExpressAdapter } from './utils/processingPoolManager/bullBoard';
import { AssetHistoricalDataPlugin } from './apiSupport/api/graphql/plugins/query/asset/assetHistoricalData';
import { TimeSeriesApiSupportManager } from './apiSupport/utils/timeSeriesSupportManager';
import { GlobalMetricsPlugin } from './apiSupport/api/graphql/plugins/query/metrics/globalMetrics';
import { OmnipoolTvlMetricsPlugin } from './apiSupport/api/graphql/plugins/query/omnipool/omnipoolTvlMetrics';
import { StableswapTvlMetricsPlugin } from './apiSupport/api/graphql/plugins/query/stableswap/stableswapTvlMetrics';
import { XykpoolTvlMetricsPlugin } from './apiSupport/api/graphql/plugins/query/xykpool/xykpoolTvlMetrics';
import { AccountBalancesHistoricalDataPlugin } from './apiSupport/api/graphql/plugins/query/balances/accountBalancesHistoricalData';
import { handleProxyReqDefillama } from './apiSupport/api/rest/proxyApiHandlers/resources/defillama';
import restRouter from './apiSupport/api/rest/routes/rest.routes';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from './apiSupport/swagger';

// const pgTypes = new TypeOverrides();
// pgTypes.setTypeParser(1700, function (val) {
//   return val;
// });
const appConfig = AppConfig.getInstance();

async function initializeServer() {
  try {
    const app = express();

    await runMigrations();

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
                makePgSmartTagsFromFilePlugin(
                  getEnvPath('apiSupport/postgraphile.tags.json5')
                ),
              ],
              disableQueryLog: appConfig.NODE_ENV !== NodeEnv.DEV,
              externalUrlBase: process.env.BASE_PATH
                ? process.env.BASE_PATH + '/api'
                : undefined,
              graphileBuildOptions: {
                // stateSchemas: ['squid_processor'],
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

    app.use(postgraphileInstance);

    app.use(express.json());

    app.use('/rest', restRouter);

    const swaggerDocsPath = process.env.BASE_PATH
      ? `${process.env.BASE_PATH}/api/rest/docs`
      : '/api/rest/docs';
    console.log('swaggerDocsPath - ', swaggerDocsPath);
    // Swagger Setup
    const swaggerSpec = swaggerJsdoc(swaggerOptions);
    app.use(
      swaggerDocsPath,
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, {
        customCssUrl: `${process.env.BASE_PATH || ''}/api/rest/docs/swagger-ui.css`,
        customJs: `${process.env.BASE_PATH || ''}/api/rest/docs/swagger-ui-bundle.js`,
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
      console.log('process.env.BASE_PATH - ', process.env.BASE_PATH);
    });

    TimeSeriesApiSupportManager.getInstance().initHistDataScraper().then();
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
}

initializeServer().catch(console.error);

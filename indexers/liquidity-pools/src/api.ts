import AggregatesPluggin from '@graphile/pg-aggregates';
import SimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector';
import express from 'express';
import { NodePlugin } from 'graphile-build';
import { postgraphile, makePluginHook } from 'postgraphile';
import FilterPlugin from 'postgraphile-plugin-connection-filter';
import { ProcessorStatusPlugin } from './apiSupport/plugins/query/processorStatus.plugin';
import { AppConfig } from './appConfig';
import { XykpoolsVolumePlugin } from './apiSupport/plugins/query/xykPoolsVolume';
import PgPubsub from '@graphile/pg-pubsub';
// import TypeOverrides from 'pg/lib/type-overrides';
import { runMigrations } from './apiSupport/apiMigrations/runMigrations';
import { XykpoolsVolumeSubscriptionsPlugin } from './apiSupport/plugins/subscription/xykPoolVolumeSubscriptions';
import { getEnvPath } from './utils/helpers';
import { OmnipoolAssetVolumePlugin } from './apiSupport/plugins/query/omnipoolVolume';
import { OmnipoolAssetVolumeSubscriptionsPlugin } from './apiSupport/plugins/subscription/omnipoolAssetVolumeSubscriptions';
import { StableswapVolumePlugin } from './apiSupport/plugins/query/stableswapVolume';
import { StableswapVolumeSubscriptionsPlugin } from './apiSupport/plugins/subscription/stableswapVolumeSubscriptions';
import { NodeEnv } from './utils/types';
import { makePgSmartTagsFromFilePlugin } from 'postgraphile/plugins';
import { RoutedTradesSubscriptionsPlugin } from './apiSupport/plugins/subscription/routedTradesSubscriptions';
import { CommonApiTypesDefinitionPlugin } from './apiSupport/plugins/query/commonApiTypesDefinition.plugin';
import { handleProxyReqSubscan } from './apiSupport/proxyApiHandlers';
import { ProxyApiRoute } from './apiSupport/proxyApiHandlers/types';
import cors from 'cors';
import { SwapPlugin } from './apiSupport/plugins/query/swap';
import { StableswapYieldMetricsPlugin } from './apiSupport/plugins/query/stableswapYieldMetrics';
import { CacheManager } from './apiSupport/utils/cacheManager';
import { Request, Response, NextFunction } from 'express';
import { OmnipoolYieldMetricsPlugin } from './apiSupport/plugins/query/omnipoolYieldMetrics';
import { GlobalYieldMetricsPlugin } from './apiSupport/plugins/query/globalYieldMetrics';

// const pgTypes = new TypeOverrides();
// pgTypes.setTypeParser(1700, function (val) {
//   return val;
// });
const appConfig = AppConfig.getInstance();

async function initializeServer() {
  try {
    const app = express();

    await runMigrations();

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
          CommonApiTypesDefinitionPlugin,
          AggregatesPluggin,
          FilterPlugin,
          SimplifyInflectorPlugin,
          ProcessorStatusPlugin,
          XykpoolsVolumePlugin,
          XykpoolsVolumeSubscriptionsPlugin,
          OmnipoolAssetVolumePlugin,
          OmnipoolAssetVolumeSubscriptionsPlugin,
          StableswapVolumePlugin,
          StableswapVolumeSubscriptionsPlugin,
          RoutedTradesSubscriptionsPlugin,
          SwapPlugin,
          StableswapYieldMetricsPlugin,
          OmnipoolYieldMetricsPlugin,
          GlobalYieldMetricsPlugin,
          makePgSmartTagsFromFilePlugin(
            getEnvPath('apiSupport/postgraphile.tags.json5')
          ),
        ],
        disableQueryLog: appConfig.NODE_ENV !== NodeEnv.DEV,
        externalUrlBase: process.env.BASE_PATH
          ? process.env.BASE_PATH + '/api'
          : undefined,
        graphileBuildOptions: {
          stateSchemas: ['squid_processor'],
          omnipoolAddress: appConfig.OMNIPOOL_ADDRESS,
          enableSmartTags: true,
        },
        allowExplain: true,
        exportGqlSchemaPath: getEnvPath('apiSupport/schema.graphql'),
      }
    );

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

    app.use(postgraphileInstance);

    app.use(express.json());

    // Same shape as the develop-orca lineage's /rest/service/metadata —
    // hydration-ui's indexer picker requires this endpoint next to /graphql.
    app.get('/rest/service/metadata', (req: Request, res: Response) => {
      res.json({
        metadataVersion: 1,
        indexer: {
          id: 'orca-aggregator-mainnet',
          version: process.env.INDEXER_VERSION ?? 'unknown',
          network: appConfig.CHAIN,
          master: process.env.IS_MASTER_INSTANCE === 'true',
        },
        coverage: {
          timeBounds: {
            minTime: '2023-01-01T00:00:00Z',
            maxTime: '2026-01-29T01:15:00Z',
          },
          blockBounds: {
            minBlockHeight: appConfig.PROCESS_FROM_BLOCK,
            maxBlockHeight: -1,
          },
        },
      });
    });

    app.post(
      `${ProxyApiRoute.subscan}/*all`,
      cors(corsOptions),
      // @ts-ignore
      handleProxyReqSubscan
    );

    app.listen(appConfig.GQL_PORT, () => {
      console.log(`Squid API listening on port ${appConfig.GQL_PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
}

initializeServer().catch(console.error);

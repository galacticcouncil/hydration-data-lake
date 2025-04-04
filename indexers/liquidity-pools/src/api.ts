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
import TypeOverrides from 'pg/lib/type-overrides';
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
import { HydrationSdkManager } from './apiSupport/utils/hydrationSdk';
import { CacheManager } from './apiSupport/utils/cacheManager';

const pgTypes = new TypeOverrides();
pgTypes.setTypeParser(1700, function (val) {
  return val;
});
const appConfig = AppConfig.getInstance();

async function initializeServer() {
  try {
    const app = express();

    runMigrations()
      .then()
      .catch((e) => {
        console.log(e);
      });

    const postgraphileInstance = postgraphile(
      {
        host: appConfig.DB_HOST,
        port: appConfig.DB_PORT,
        database: appConfig.DB_NAME,
        user: appConfig.DB_USER,
        password: appConfig.DB_PASS,
        types: pgTypes,
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

    app.use(postgraphileInstance);
    app.use(express.json());

    app.post(
      `${ProxyApiRoute.subscan}/*`,
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

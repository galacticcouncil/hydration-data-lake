import { QueryResolverContext, YieldMetricsInterval } from '../../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import type * as pg from 'pg';
import {
  OmnipoolAssetYieldMetricsFilter,
  OmnipoolAssetsYieldMetricsResponse,
} from './types';
import { handleOmnipoolAssetsYieldMetricsAggregation } from '../utils';
import * as crypto from 'node:crypto';
import { CacheManager } from '../../../../utils/cacheManager';

export async function omnipoolAssetsYieldMetricsResolver(
  parentObject: any,
  args: { filter: OmnipoolAssetYieldMetricsFilter },
  context: QueryResolverContext,
  info: GraphQLResolveInfo & { graphile: GraphileHelpers<any> },
  omnipoolAddress: string
): Promise<OmnipoolAssetsYieldMetricsResponse> {
  const pgClient: pg.Client = context.pgClient;

  const filter = args.filter || {
    interval: YieldMetricsInterval['1MON'],
    assetIds: [],
  };

  const cacheKey = `OMNIPOOL_ASSETS_YIELD_METRICS::${crypto
    .createHash('md5')
    .update(
      JSON.stringify(
        filter && filter.assetIds && filter.assetIds.length > 0
          ? filter
          : YieldMetricsInterval['1MON']
      )
    )
    .digest('hex')}`;

  const cachedData =
    await CacheManager.getInstance().cache.get<OmnipoolAssetsYieldMetricsResponse>(
      cacheKey
    );

  if (cachedData) return cachedData;

  const decoratedNodes = await handleOmnipoolAssetsYieldMetricsAggregation({
    assetIds: filter.assetIds || [],
    omnipoolAddress,
    interval: filter.interval || YieldMetricsInterval['1MON'],
    pgClient,
  });

  const result = {
    nodes: decoratedNodes,
    totalCount: decoratedNodes.length,
  };

  await CacheManager.getInstance().cache.set<OmnipoolAssetsYieldMetricsResponse>(
    cacheKey,
    result
  );

  return result;
}

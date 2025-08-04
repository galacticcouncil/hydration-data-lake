import { QueryResolverContext, YieldMetricsInterval } from '../../../../../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import type * as pg from 'pg';
import {
  AllAssetsYieldMetricsFilter,
  AllAssetsYieldMetricsResponse,
  AssetYieldMetrics,
} from './types';
import { handleAllAssetsFarmsYieldMetrics } from '../utils';
import * as crypto from 'node:crypto';
import { CacheManager } from '../../../../../../../utils/cacheManager';
import { handlestableswapYieldMetricsAggregation } from '../../../stableswap/stableswapYieldMetrics/utils';
import { handleOmnipoolAssetsYieldMetricsAggregation } from '../../../omnipool/omnipoolYieldMetrics/utils';
import { AppConfig } from '../../../../../../../../appConfig';

const appConfig = AppConfig.getInstance();

export async function allAssetsYieldMetricsResolver(
  parentObject: any,
  args: { filter: AllAssetsYieldMetricsFilter },
  context: QueryResolverContext,
  info: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
): Promise<AllAssetsYieldMetricsResponse> {
  const pgClient: pg.Client = context.pgClient;

  const filter = args.filter || {
    feeMetricsInterval: YieldMetricsInterval['1MON'],
  };

  const cacheKey = `ALL_ASSETS_YIELD_METRICS::${crypto.createHash('md5').update(JSON.stringify(filter)).digest('hex')}`;

  const cachedData =
    await CacheManager.getInstance().cache.get<AllAssetsYieldMetricsResponse>(
      cacheKey
    );

  if (cachedData) return cachedData;

  const allFarmsYieldMetrics = await handleAllAssetsFarmsYieldMetrics({
    pgClient,
  });

  const omnipoolAssetIds = [];

  const stableswapAssetIds = ['690'];

  const fullResultMap: Map<string, AssetYieldMetrics> = new Map();

  for (const {
    id,
    farmApy,
    poolType,
    incentivesTokens,
  } of allFarmsYieldMetrics) {
    fullResultMap.set(id, {
      id,
      poolType,
      incentivesApyPerc: farmApy,
      feeApyPerc: '0',
      incentivesTokens,
    });

    if (poolType === 'omnipool') omnipoolAssetIds.push(id);
  }

  const omnipoolAssetsMetricsResult =
    await handleOmnipoolAssetsYieldMetricsAggregation({
      assetIds: omnipoolAssetIds,
      omnipoolAddress: appConfig.OMNIPOOL_ADDRESS,
      interval: filter.feeMetricsInterval,
      pgClient,
    });

  const stableswapMetricsResult = await handlestableswapYieldMetricsAggregation(
    {
      poolIds: stableswapAssetIds,
      interval: filter.feeMetricsInterval,
      pgClient,
    }
  );

  for (const item of omnipoolAssetsMetricsResult) {
    if (!fullResultMap.has(`${item.assetId}`)) continue;

    const resData = fullResultMap.get(`${item.assetId}`)!;
    resData.feeApyPerc = item.projectedApyPerc;
    fullResultMap.set(`${item.assetId}`, resData);
  }

  for (const item of stableswapMetricsResult) {
    fullResultMap.set(`${item.poolId}`, {
      id: item.poolId,
      poolType: 'omnipool',
      incentivesApyPerc: '0',
      feeApyPerc: item.projectedApyPerc,
      incentivesTokens: ['0', '5', '15', '690', '14'],
    });
  }

  const result = {
    nodes: Array.from(fullResultMap.values()),
    totalCount: fullResultMap.size,
  };

  await CacheManager.getInstance().cache.set<AllAssetsYieldMetricsResponse>(
    cacheKey,
    result,
    60 * 60 * 1000 // 1 hour
    // 24 * 60 * 60 * 1000 // 1 day
  );

  return result;
}

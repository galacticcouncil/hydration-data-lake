import {
  AggregationTimeRangeLabel,
  QueryResolverContext,
} from '../../../../../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import type * as pg from 'pg';
import {
  PlatformTotalVolumesByPeriod,
  PlatformTotalVolumesByPeriodFilter,
  PlatformTotalVolumesByPeriodResponse,
} from './types';
import { CacheManager } from '../../../../../../../utils/cacheManager';
import { BigNumber } from '../../../../../../../../utils/bignumber';
import crypto from 'node:crypto';
import { getStartStopBlocksFromInput } from '../../../../../../../utils/aggregationUtils';
import { handleOmnipoolAssetHistoricalVolumesByPeriodAggregation } from '../../../omnipool/omnipoolVolume/utils';
import { AppConfig } from '../../../../../../../../appConfig';
import { handleStableswapHistoricalVolumesByPeriodAggregation } from '../../../stableswap/stableswapVolume/utils';
import { handleXykPoolHistoricalVolumesByPeriodAggregation } from '../../../xykpool/xykPoolsVolume/utils';
import {
  getAllActiveXykpoolIds,
  getAllXykpoolIds,
} from '../../../../../../../sql/xykpool/xykpool.sql';

const appConfig = AppConfig.getInstance();

export async function platformTotalVolumesByPeriodResolver(
  parentObject: any,
  args: { filter: PlatformTotalVolumesByPeriodFilter },
  context: QueryResolverContext,
  info: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
): Promise<PlatformTotalVolumesByPeriodResponse> {
  const pgClient: pg.Client = context.pgClient;

  const filter = args.filter || {
    period: AggregationTimeRangeLabel['24H'],
  };

  const cacheKey = `PLATFORM_TOTAL_VOLS_BY_PERIOD::${crypto
    .createHash('md5')
    .update(JSON.stringify(filter))
    .digest('hex')}`;

  const cachedData =
    await CacheManager.getInstance().cache.get<PlatformTotalVolumesByPeriodResponse>(
      cacheKey
    );

  if (cachedData) return cachedData;

  const result: PlatformTotalVolumesByPeriodResponse = {
    nodes: [],
    totalCount: 0,
  };

  const blocksRange = await getStartStopBlocksFromInput({
    period: filter.period,
    pgClient,
    inputStopBlockNumber: filter.endBlockNumber,
    inputStartBlockNumber: filter.startBlockNumber,
    inputFromIsoString: filter.startIsoString,
    inputToIsoString: filter.endIsoString,
  });

  if (!blocksRange) return { nodes: [], totalCount: 0 };

  const omnipoolAllAssetsVol =
    await handleOmnipoolAssetHistoricalVolumesByPeriodAggregation({
      omnipoolAddress: appConfig.OMNIPOOL_ADDRESS,
      startBlockNumber: blocksRange.startBlockHeight,
      endBlockNumber: blocksRange.stopBlockHeight,
      pgClient,
    });

  const stableswapsAllAssetsVol =
    await handleStableswapHistoricalVolumesByPeriodAggregation({
      startBlockNumber: blocksRange.startBlockHeight,
      endBlockNumber: blocksRange.stopBlockHeight,
      pgClient,
    });

  const allXykpoolIds = (
    await pgClient.query<{
      pool_id: string;
    }>(getAllActiveXykpoolIds)
  ).rows.map((pool) => pool.pool_id);

  const allXykpoolVols =
    await handleXykPoolHistoricalVolumesByPeriodAggregation({
      poolIds: allXykpoolIds,
      startBlockNumber: blocksRange.startBlockHeight,
      endBlockNumber: blocksRange.stopBlockHeight,
      pgClient,
    });

  let omnipoolVolumeTotal = BigNumber(0);
  let omnipoolFeeVolumeTotal = BigNumber(0);

  let stableswapVolumeTotal = BigNumber(0);
  let stableswapFeeVolumeTotal = BigNumber(0);

  let xykpoolVolumeTotal = BigNumber(0);
  let xykpoolFeeVolumeTotal = BigNumber(0);

  for (const assetVol of omnipoolAllAssetsVol.values()) {
    omnipoolVolumeTotal = omnipoolVolumeTotal.plus(assetVol.assetVolNormalized);
    omnipoolFeeVolumeTotal = omnipoolFeeVolumeTotal.plus(
      assetVol.assetFeeVolNormalized
    );
  }
  for (const poolVol of stableswapsAllAssetsVol.values()) {
    stableswapVolumeTotal = stableswapVolumeTotal.plus(poolVol.poolVolNorm);
    stableswapFeeVolumeTotal = stableswapFeeVolumeTotal.plus(
      poolVol.poolFeeVolNorm
    );
  }
  for (const poolVol of allXykpoolVols.values()) {
    xykpoolVolumeTotal = xykpoolVolumeTotal
      .plus(poolVol.assetAVolNorm)
      .plus(poolVol.assetBVolNorm);
    xykpoolFeeVolumeTotal = xykpoolFeeVolumeTotal
      .plus(poolVol.assetAFeeVolNorm)
      .plus(poolVol.assetBFeeVolNorm);
  }

  const grandTotal = omnipoolVolumeTotal
    .plus(omnipoolFeeVolumeTotal)
    .plus(stableswapVolumeTotal)
    .plus(stableswapFeeVolumeTotal)
    .plus(xykpoolVolumeTotal)
    .plus(xykpoolFeeVolumeTotal);

  result.nodes.push({
    totalVolNorm: grandTotal.toFixed(),
    omnipoolVolNorm: omnipoolVolumeTotal.toFixed(),
    omnipoolFeeVolNorm: omnipoolFeeVolumeTotal.toFixed(),

    stableswapVolNorm: stableswapVolumeTotal.toFixed(),
    stableswapFeeVolNorm: stableswapFeeVolumeTotal.toFixed(),

    xykpoolVolNorm: xykpoolVolumeTotal.toFixed(),
    xykpoolFeeVolNorm: xykpoolFeeVolumeTotal.toFixed(),

    paraBlockHeight: blocksRange.stopBlockHeight || 0,
  } as PlatformTotalVolumesByPeriod);
  result.totalCount = 1;

  await CacheManager.getInstance().cache.set<PlatformTotalVolumesByPeriodResponse>(
    cacheKey,
    result,
    12_000
  );

  return result;
}

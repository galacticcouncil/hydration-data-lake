import { QueryResolverContext } from '../../../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import type * as pg from 'pg';
import { PlatformTotalTvlResponse } from './types';
import { CacheManager } from '../../../../../utils/cacheManager';
import { getOmnipoolTotalTvl } from '../../../../sql/omnipool/omnipoolTvl.sql';
import { getStableswapsTotalTvl } from '../../../../sql/stableswap/stableswapTvl.sql';
import {
  getAllXykpoolsTvl,
  getXykpoolsTvl,
} from '../../../../sql/xykpool/xykpoolsTvl.sql';
import { BigNumber } from '@galacticcouncil/sdk';

export async function platformTotalTvlResolver(
  parentObject: any,
  args: any,
  context: QueryResolverContext,
  info: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
): Promise<PlatformTotalTvlResponse> {
  const pgClient: pg.Client = context.pgClient;

  const cacheKey = `PLATFORM_TOTAL_TVL`;

  const cachedData =
    await CacheManager.getInstance().cache.get<PlatformTotalTvlResponse>(
      cacheKey
    );

  if (cachedData) return cachedData;

  const result: PlatformTotalTvlResponse = {
    nodes: [],
    totalCount: 0,
  };

  const omnipoolTvl = await pgClient.query<{
    tvl_total_in_ref_asset_norm: string;
    para_block_height: number;
  }>(getOmnipoolTotalTvl);

  const stableswapsTvl = await pgClient.query<{
    pool_id: string;
    tvl_total_in_ref_asset_norm: string;
    para_block_height: number;
  }>(getStableswapsTotalTvl);

  const xykpoolsTvl = await pgClient.query<{
    pool_id: string;
    tvl_in_ref_asset_norm: string;
    para_block_height: number;
  }>(getAllXykpoolsTvl);

  const omnipoolTvlTotal = BigNumber(
    omnipoolTvl.rows[0]?.tvl_total_in_ref_asset_norm || BigNumber(0)
  );

  const stableswapsTvlTotal = stableswapsTvl.rows.reduce(
    (acc, val) => acc.plus(val.tvl_total_in_ref_asset_norm),
    BigNumber(0)
  );
  const xykpoolsTvlTotal = xykpoolsTvl.rows.reduce(
    (acc, val) => acc.plus(val.tvl_in_ref_asset_norm),
    BigNumber(0)
  );

  const grandTotal = omnipoolTvlTotal
    .plus(stableswapsTvlTotal)
    .plus(xykpoolsTvlTotal);

  result.nodes.push({
    totalTvlNorm: grandTotal.toFixed(),
    omnipoolTvlNorm: omnipoolTvlTotal.toFixed(),
    stablepoolsTvlNorm: stableswapsTvlTotal.toFixed(),
    xykpoolsTvlNorm: xykpoolsTvlTotal.toFixed(),
  });
  result.totalCount = 1;

  await CacheManager.getInstance().cache.set<PlatformTotalTvlResponse>(
    cacheKey,
    result,
    3_000
  );

  return result;
}

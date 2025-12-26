import type * as pg from 'pg';
import { XykpoolLatestTvl } from './resolvers';
import { getAllXykpoolIds } from '../../../../../../sql/xykpool/xykpool.sql';
import { getXykpoolsTvl } from '../../../../../../sql/xykpool/xykpoolsTvl.sql';
import { AppConfig } from '../../../../../../../appConfig';

const appConfig = AppConfig.getInstance();

export async function handleXykpoolsLatestTvlAggregation({
  poolIds = [],
  pgClient,
}: {
  poolIds: string[];
  pgClient: pg.Client;
}): Promise<XykpoolLatestTvl[]> {
  let poolIdsToProcess = poolIds;

  if (!poolIdsToProcess || poolIdsToProcess.length === 0)
    poolIdsToProcess = (
      await pgClient.query<{
        pool_id: string;
      }>(getAllXykpoolIds)
    ).rows.map((row) => row.pool_id);

  if (!poolIdsToProcess || poolIdsToProcess.length === 0) return [];

  const aggregatedTvls = await pgClient.query<{
    pool_id: string;
    tvl_in_ref_asset_norm: string;
    para_block_height: number;
  }>(getXykpoolsTvl, [poolIdsToProcess]);

  return aggregatedTvls.rows.map(
    (row) =>
      ({
        poolId: row.pool_id,
        tvlInRefAssetNorm: row.tvl_in_ref_asset_norm,
        paraBlockHeight: row.para_block_height,
      }) as XykpoolLatestTvl
  );
}

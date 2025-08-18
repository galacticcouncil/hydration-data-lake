import type * as pg from 'pg';
import {
  AggregateStablepoolVolumesByBlocksRangeSqlResult,
  StablepoolAssetVolumeAggregated,
  StableswapVolumeAggregated,
} from './resolvers';
import { aggregateStablepoolVolumesByBlocksRange } from '../../../../../../sql/stableswap/stableswapVolumes.sql';
import {
  getAssetsByStableswapIds,
  getAllStableswapIds,
} from '../../../../../../sql/stableswap/stableswap.sql';
import { BigNumber } from '@galacticcouncil/sdk';
import { AppConfig } from '../../../../../../../appConfig';

const appConfig = AppConfig.getInstance();

export async function handleStableswapHistoricalVolumesByPeriodAggregation({
  poolIds,
  startBlockNumber,
  endBlockNumber,
  pgClient,
}: {
  poolIds?: string[];
  startBlockNumber: number;
  endBlockNumber?: number;
  pgClient: pg.Client;
}): Promise<Map<string, StableswapVolumeAggregated>> {
  const squidStatus = (
    await pgClient.query(
      `SELECT height FROM ${appConfig.STATE_SCHEMA_NAME}.status`
    )
  ).rows[0];

  let poolIdsToProcess = poolIds;

  if (!poolIdsToProcess || poolIdsToProcess.length === 0)
    poolIdsToProcess = (
      await pgClient.query<{
        pool_id: string;
      }>(getAllStableswapIds)
    ).rows.map((row) => row.pool_id);

  const groupedResult =
    await pgClient.query<AggregateStablepoolVolumesByBlocksRangeSqlResult>(
      aggregateStablepoolVolumesByBlocksRange,
      [poolIdsToProcess, startBlockNumber, endBlockNumber ?? squidStatus.height]
    );

  const decoratedNodes = new Map<string, StableswapVolumeAggregated>(
    groupedResult.rows
      .map((item) => item.grouped_result[0] ?? null)
      .filter((g) => !!g)
      .map((group) => {
        const resp: StableswapVolumeAggregated = {
          poolId: group.pool_id,
          poolVolNorm: '0',
          poolFeeVolNorm: '0',
          assetVolumes: [],
        };

        if (
          group.start_entity.para_block_height ===
          group.end_entity.para_block_height
        ) {
          resp.assetVolumes = group.start_entity_asset_volumes.map(
            (assetData) => ({
              assetId: assetData.asset_id,
              assetRegistryId: assetData.asset_registry_id ?? null,
              assetFeeVol: BigInt(assetData.asset_fee_vol),
              assetVol:
                BigInt(assetData.asset_vol_in) +
                BigInt(assetData.asset_vol_out),
              assetVolNorm: BigNumber(assetData.asset_vol_in_norm)
                .plus(assetData.asset_vol_out_norm)
                .toFixed(),
              assetFeeVolNorm: assetData.asset_fee_vol_norm,
            })
          );
          const { poolVolNorm, poolFeeVolNorm } = getPoolNormalizedVolumes(
            resp.assetVolumes
          );

          resp.poolVolNorm = poolVolNorm;
          resp.poolFeeVolNorm = poolFeeVolNorm;

          return resp;
        }

        const endEntityAssetsMap = new Map(
          group.end_entity_asset_volumes.map((vol) => [vol.asset_id, vol])
        );

        for (const startEntityAssetVol of group.start_entity_asset_volumes) {
          const endEntityAssetVol = endEntityAssetsMap.get(
            startEntityAssetVol.asset_id
          )!;
          resp.assetVolumes.push({
            assetId: startEntityAssetVol.asset_id,
            assetRegistryId: startEntityAssetVol.asset_registry_id ?? null,
            assetFeeVol:
              BigInt(endEntityAssetVol.asset_total_fees_vol) -
              BigInt(startEntityAssetVol.asset_total_fees_vol) +
              BigInt(startEntityAssetVol.asset_fee_vol),
            assetVol:
              BigInt(endEntityAssetVol.asset_total_vol_in) +
              BigInt(endEntityAssetVol.asset_total_vol_out) -
              BigInt(startEntityAssetVol.asset_total_vol_in) -
              BigInt(startEntityAssetVol.asset_total_vol_out) +
              BigInt(startEntityAssetVol.asset_vol_in) +
              BigInt(startEntityAssetVol.asset_vol_out),
            assetFeeVolNorm: BigNumber(
              endEntityAssetVol.asset_total_fees_vol_norm
            )
              .minus(startEntityAssetVol.asset_total_fees_vol_norm)
              .plus(startEntityAssetVol.asset_fee_vol_norm)
              .toFixed(),
            assetVolNorm: BigNumber(endEntityAssetVol.asset_total_vol_in_norm)
              .plus(endEntityAssetVol.asset_total_vol_out_norm)
              .minus(startEntityAssetVol.asset_total_vol_in_norm)
              .minus(startEntityAssetVol.asset_total_vol_out_norm)
              .plus(startEntityAssetVol.asset_vol_in_norm)
              .plus(startEntityAssetVol.asset_vol_out_norm)
              .toFixed(),
          });
        }

        const { poolVolNorm, poolFeeVolNorm } = getPoolNormalizedVolumes(
          resp.assetVolumes
        );

        resp.poolVolNorm = poolVolNorm;
        resp.poolFeeVolNorm = poolFeeVolNorm;

        return resp;
      })
      .map((r: StableswapVolumeAggregated) => [r.poolId, r])
  );

  const assetsData = await pgClient.query(getAssetsByStableswapIds, [
    poolIdsToProcess.filter((id) => !decoratedNodes.has(id)),
  ]);

  for (const poolWithNoResult of assetsData.rows) {
    decoratedNodes.set(poolWithNoResult.pool_id, {
      poolId: poolWithNoResult.pool_id,
      poolVolNorm: '0',
      poolFeeVolNorm: '0',
      assetVolumes: poolWithNoResult.assets.map(
        (asset: { asset_id: string; asset_registry_id: string }) => ({
          assetId: asset.asset_id,
          assetRegistryId: asset.asset_registry_id,
          assetFeeVol: BigInt(0),
          assetVol: BigInt(0),
          assetFeeVolNorm: '0',
          assetVolNorm: '0',
        })
      ),
    });
  }

  return decoratedNodes;
}

function getPoolNormalizedVolumes(
  assetsData: StablepoolAssetVolumeAggregated[]
): Pick<StableswapVolumeAggregated, 'poolVolNorm' | 'poolFeeVolNorm'> {
  return {
    poolVolNorm: assetsData
      .reduce(
        (acc, assetData) => acc.plus(assetData.assetVolNorm),
        BigNumber(0)
      )
      .toFixed(),
    poolFeeVolNorm: assetsData
      .reduce(
        (acc, assetData) => acc.plus(assetData.assetFeeVolNorm),
        BigNumber(0)
      )
      .toFixed(),
  };
}

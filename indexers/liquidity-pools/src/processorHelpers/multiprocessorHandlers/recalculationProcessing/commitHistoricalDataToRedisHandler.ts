import { Store } from '@subsquid/typeorm-store';

import { SqdProcessorContext } from '../../../processor';
import { ProcessorStatusManager } from '../../../processorStatusManager';
import {
  RedisTimeSeriesManager,
  RedisTimeSeriesName,
} from '../../../utils/redisTimeSeriesManager';
import { getAssetSpotPricesByBlocksRange } from '../../../utils/redisTimeSeriesSupport/sql/assetSpotPrice.sql';
import {
  AccountTotalBalanceHistDataResponse,
  AssetPairVolumeResponse,
  AssetSpotPriceHistDataResponse,
} from '../../../utils/redisTimeSeriesSupport/timeSeriesApiSupportManager';
import { ApiSupportPgClient } from '../../../utils/redisTimeSeriesSupport/apiSupportPgClient';
import { getAssetPairVolumesByBlocksRange } from '../../../utils/redisTimeSeriesSupport/sql/assetPairVolumes.sql';
import { BigNumber } from '@galacticcouncil/sdk';
import { splitIntoBatches } from '../../../utils/helpers';
import { getAccTotalBalancesByBlocksRange } from '../../../utils/redisTimeSeriesSupport/sql/accTotalBalanceHistData.sql';

export async function handleCommitHistoricalDataToRedis(
  ctx: SqdProcessorContext<Store>
) {
  if (!ctx.appConfig.processingMode.ALL_IN_ONE_PROCESSOR_MODE) return;

  const dataSectionsToProcess =
    ctx.appConfig.processingMode.REAGGREGATION_PROCESSING_FLOW_TRIGGERS;

  const apiStatePgClient = ApiSupportPgClient.getInstance();

  const redisTimeSeriesManager = RedisTimeSeriesManager.getInstance();

  const fromBlockHeight = ctx.blocks[0].header.height;
  const toBlockHeight = ctx.blocks[ctx.blocks.length - 1].header.height;

  /**
   * Asset prices and volumes
   */

  if (dataSectionsToProcess.has('COMMIT_ASSET_HISTORICAL_DATA_TO_REDIS')) {
    console.time('Asset prices and volumes');

    const assetSpotPriceHistDataChunk =
      await apiStatePgClient.query<AssetSpotPriceHistDataResponse>(
        getAssetSpotPricesByBlocksRange,
        [fromBlockHeight, toBlockHeight]
      );

    const assetPairVolumesChunk =
      await apiStatePgClient.query<AssetPairVolumeResponse>(
        getAssetPairVolumesByBlocksRange,
        [fromBlockHeight, toBlockHeight]
      );

    if (assetSpotPriceHistDataChunk.rows.length > 0) {
      const preparedData = [];

      for (const row of assetSpotPriceHistDataChunk.rows) {
        preparedData.push({
          keyPrefix: ctx.appConfig.INDEXER_ID,
          name: RedisTimeSeriesName.price,
          assetAId: row.asset_in_asset_registry_id,
          assetBId: row.asset_out_asset_registry_id,
          timestamp: row.block_timestamp,
          value: BigNumber(row.price_normalised).toNumber(),
        });
      }

      for (const subBatch of splitIntoBatches(
        preparedData,
        ctx.appConfig.redis.TIME_SERIES_DATA_COMMIT_SUB_BATCH_MAX_SIZE
      )) {
        await redisTimeSeriesManager.addMultiplePrices(subBatch);
      }
    }
    if (assetPairVolumesChunk.rows.length > 0) {
      const preparedData = [];

      for (const row of assetPairVolumesChunk.rows) {
        preparedData.push({
          keyPrefix: ctx.appConfig.INDEXER_ID,
          name: RedisTimeSeriesName.volume,
          assetAId:
            +row.asset_a_registry_id < +row.asset_b_registry_id
              ? row.asset_a_registry_id
              : row.asset_b_registry_id,
          assetBId:
            +row.asset_a_registry_id < +row.asset_b_registry_id
              ? row.asset_b_registry_id
              : row.asset_a_registry_id,

          timestamp: row.block_timestamp,
          value: BigNumber(row.total_volume_normalised).toNumber(),
        });
      }

      for (const subBatch of splitIntoBatches(
        preparedData,
        ctx.appConfig.redis.TIME_SERIES_DATA_COMMIT_SUB_BATCH_MAX_SIZE
      )) {
        await redisTimeSeriesManager.addMultiplePrices(subBatch);
      }
    }
    console.timeEnd('Asset prices and volumes');
  }
  /**
   * Account total balances
   */
  if (dataSectionsToProcess.has('COMMIT_BALANCES_HISTORICAL_DATA_TO_REDIS')) {
    console.time('Account total balances');

    const accTotalBalancesHistDataChunk =
      await apiStatePgClient.query<AccountTotalBalanceHistDataResponse>(
        getAccTotalBalancesByBlocksRange,
        [fromBlockHeight, toBlockHeight]
      );

    if (accTotalBalancesHistDataChunk.rows.length > 0) {
      const preparedData = [];

      for (const row of accTotalBalancesHistDataChunk.rows) {
        preparedData.push([
          {
            name: RedisTimeSeriesName.acc_bal_tot_tns,
            accountId: row.account_id,
            timestamp: row.block_timestamp,
            value: +row.total_transferable_norm,
            keyPrefix: ctx.appConfig.INDEXER_ID,
          },
          {
            name: RedisTimeSeriesName.acc_bal_tot_loc,
            accountId: row.account_id,
            timestamp: row.block_timestamp,
            value: +row.total_locked_norm,
            keyPrefix: ctx.appConfig.INDEXER_ID,
          },
          {
            name: RedisTimeSeriesName.acc_bal_tot_debt,
            accountId: row.account_id,
            timestamp: row.block_timestamp,
            value: +row.total_debt_norm,
            keyPrefix: ctx.appConfig.INDEXER_ID,
          },
        ]);
      }

      for (const subBatch of splitIntoBatches(
        preparedData.flat(),
        ctx.appConfig.redis.TIME_SERIES_DATA_COMMIT_SUB_BATCH_MAX_SIZE
      )) {
        await redisTimeSeriesManager.addMultipleAccountTotalBalances(subBatch);
      }
    }
    console.timeEnd('Account total balances');
  }
  await new Promise((res) =>
    setTimeout(res, ctx.appConfig.redis.TIME_SERIES_DATA_SCRAPPER_TIMEOUT_MS)
  );
  /**
   * ===========================================================================
   * ===========================================================================
   */
  console.time('updateInitialIndexingFinishedAtTime');
  await ProcessorStatusManager.updateInitialIndexingFinishedAtTime(ctx);
  console.timeEnd('updateInitialIndexingFinishedAtTime');

  await ProcessorStatusManager.getInstance(ctx).updateProcessorStatus({
    latestProcessedBlock: ctx.blocks[ctx.blocks.length - 1].header.height,
  });
}

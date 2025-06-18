import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { splitIntoBatches } from '../../../utils/helpers';
import { OfflineTradeRouterManager } from './utils';
import { handleAssetSpotPricesHistoricalData } from './assetSpotPrices';
import { handleAssetPairVolumesHistoricalData } from './assePairVolumes';
import {
  isAssetHistoricalDataUniqueRegardingPreviousRecord,
  processAssetsHistoricalDataAtBlock,
} from './assetHistoricalData';
import pMap from 'p-map';

export async function handleAssetHistoricalData({
  blockNumbersToProcess,
  ctx,
}: {
  blockNumbersToProcess?: number[];
  ctx: SqdProcessorContext<Store>;
}) {
  const assetRegistryIds: Array<string> = [
    ...ctx.batchState.state.assetsAllBatch.values(),
  ]
    .filter((a) => !!a.assetRegistryId)
    .map((a) => `${a.assetRegistryId}`);

  const blocksNumbersToProcessSet = new Set(blockNumbersToProcess || []);
  const blocksToProcess = blockNumbersToProcess
    ? ctx.blocks.filter((b) => blocksNumbersToProcessSet.has(b.header.height))
    : ctx.blocks;

  /**
   * @description Processes data in a specific sequence to ensure data dependencies are met
   *
   * @important Generic asset historical data must be processed before asset historical spot prices.
   * This ordering is critical because the generic asset historical data serves as a required
   * data source for the OfflinePoolService.
   */
  for (const blocksSubBatch of splitIntoBatches(
    blocksToProcess,
    ctx.appConfig.HISTORICAL_DATA_PROCESSING_SUB_BATCH_SIZE
  )) {
    await pMap(
      blocksSubBatch,
      async (block) =>
        processAssetsHistoricalDataAtBlock({
          assetRegistryIds,
          block: block.header,
          ctx,
        }),
      { concurrency: ctx.appConfig.ASYNC_OPERATIONS_CONCURRENCY_COMMON }
    );
  }

  // for (const entity of [
  //   ...ctx.batchState.state.assetsHistoricalDataBatch.values(),
  // ].filter((e) => e !== null)) {
  //   if (
  //     ctx.appConfig.SAVE_ASSET_HISTORICAL_DATA_ON_CHANGE &&
  //     !(await isAssetHistoricalDataUniqueRegardingPreviousRecord({
  //       currentRecord: entity,
  //       ctx,
  //     }))
  //   ) {
  //     ctx.batchState.state.assetsHistoricalDataBatch.delete(entity.id);
  //   }
  // }
}

export async function handleAssetSpotPriceRelatedHistoricalData({
  blockNumbersToProcess,
  ctx,
}: {
  blockNumbersToProcess?: number[];
  ctx: SqdProcessorContext<Store>;
}) {
  OfflineTradeRouterManager.getInstance().wipeCache();

  const blocksNumbersToProcessSet = new Set(blockNumbersToProcess || []);
  const blocksToProcess = blockNumbersToProcess
    ? ctx.blocks.filter((b) => blocksNumbersToProcessSet.has(b.header.height))
    : ctx.blocks;

  for (const blocksSubBatch of splitIntoBatches(
    blocksToProcess,
    ctx.appConfig.HISTORICAL_DATA_PROCESSING_SUB_BATCH_SIZE
  )) {
    await OfflineTradeRouterManager.getInstance().initForBlocksBatch({
      blockNumbers: blocksSubBatch.map((b) => b.header.height),
      ctx,
    });

    await pMap(
      blocksSubBatch,
      async (block) =>
        handleAssetSpotPricesHistoricalData({
          blockHeader: block.header,
          ctx,
        }),
      { concurrency: ctx.appConfig.ASYNC_OPERATIONS_CONCURRENCY_COMMON }
    );

    await pMap(
      blocksSubBatch,
      async (block) =>
        handleAssetPairVolumesHistoricalData({
          blockHeader: block.header,
          ctx,
        }),
      { concurrency: ctx.appConfig.ASYNC_OPERATIONS_CONCURRENCY_COMMON }
    );
  }
}

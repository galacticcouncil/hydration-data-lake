import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { splitIntoBatches } from '../../../utils/helpers';
import { OfflineTradeRouterManager } from './utils';
import { handleAssetPairVolumesHistoricalDataAtBlock } from './assePairVolumes';
import { processAssetsHistoricalDataAtBlock } from './assetHistoricalData';
import pMap from 'p-map';
import { AssetHistoricalData } from '../../../model';
import { handleAssetSpotPricesHistoricalDataAtBlock } from './assetSpotPrices';
import { RouterCacheManager } from './utils/offlineTradeRouterManager';

export async function handleAssetHistoricalData({
  blockNumbersToProcess,
  ctx,
}: {
  blockNumbersToProcess?: number[];
  ctx: SqdProcessorContext<Store>;
}) {
  const assetRegistryIds: Array<string> = [
    ...ctx.batchState.state.assetsAll.values(),
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
  // for (const blocksSubBatch of splitIntoBatches(
  //   blocksToProcess,
  //   ctx.appConfig.HISTORICAL_DATA_PROCESSING_SUB_BATCH_SIZE
  // )) {
  //   await pMap(
  //     blocksSubBatch,
  //     async (block) =>
  //       processAssetsHistoricalDataAtBlock({
  //         assetRegistryIds,
  //         block: block.header,
  //         ctx,
  //       }),
  //     {
  //       concurrency:
  //         ctx.appConfig.concurrency.ASYNC_OPERATIONS_CONCURRENCY_COMMON,
  //     }
  //   );
  // }
  await pMap(
    blocksToProcess,
    async (block) =>
      processAssetsHistoricalDataAtBlock({
        assetRegistryIds,
        block: block.header,
        ctx,
      }),
    {
      concurrency:
        ctx.appConfig.concurrency.ASYNC_OPERATIONS_CONCURRENCY_COMMON,
    }
  );
}

export async function handleAssetSpotPricesHistoricalData({
  blockNumbersToProcess,
  ctx,
}: {
  blockNumbersToProcess?: number[];
  ctx: SqdProcessorContext<Store>;
}) {
  OfflineTradeRouterManager.getInstance().wipeCache();
  RouterCacheManager.getInstance().wipeCache();

  const blocksNumbersToProcessSet = new Set(blockNumbersToProcess || []);
  const blocksToProcess = blockNumbersToProcess
    ? ctx.blocks.filter((b) => blocksNumbersToProcessSet.has(b.header.height))
    : ctx.blocks;

  const assetsHistoricalDataBatchIndexedByBlock: Map<
    number,
    Array<AssetHistoricalData>
  > = new Map();

  for (const histItem of ctx.batchState.state.assetsHistoricalDataBatch.values()) {
    if (
      !assetsHistoricalDataBatchIndexedByBlock.has(histItem.paraBlockHeight)
    ) {
      assetsHistoricalDataBatchIndexedByBlock.set(histItem.paraBlockHeight, []);
    }
    assetsHistoricalDataBatchIndexedByBlock
      .get(histItem.paraBlockHeight)!
      .push(histItem);
  }

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
        handleAssetSpotPricesHistoricalDataAtBlock({
          assetsHistoricalDataBatchIndexedByBlock,
          blockHeader: block.header,
          ctx,
        }),
      {
        concurrency:
          ctx.appConfig.concurrency.ASYNC_OPERATIONS_CONCURRENCY_COMMON,
      }
    );
  }
}

export async function handleAssetPairVolumesHistoricalData({
  blockNumbersToProcess,
  ctx,
}: {
  blockNumbersToProcess?: number[];
  ctx: SqdProcessorContext<Store>;
}) {
  const blocksNumbersToProcessSet = new Set(blockNumbersToProcess || []);
  const blocksToProcess = blockNumbersToProcess
    ? ctx.blocks.filter((b) => blocksNumbersToProcessSet.has(b.header.height))
    : ctx.blocks;

  const assetsHistoricalDataBatchIndexedByBlockAndAssetId: Map<
    number,
    Map<string, AssetHistoricalData>
  > = new Map();

  for (const histItem of ctx.batchState.state.assetsHistoricalDataBatch.values()) {
    if (
      !assetsHistoricalDataBatchIndexedByBlockAndAssetId.has(
        histItem.paraBlockHeight
      )
    ) {
      assetsHistoricalDataBatchIndexedByBlockAndAssetId.set(
        histItem.paraBlockHeight,
        new Map()
      );
    }
    assetsHistoricalDataBatchIndexedByBlockAndAssetId
      .get(histItem.paraBlockHeight)!
      .set(histItem.assetId, histItem);
  }

  await pMap(
    blocksToProcess,
    async (block) =>
      handleAssetPairVolumesHistoricalDataAtBlock({
        blockHeader: block.header,
        assetsHistoricalDataBatchIndexedByBlockAndAssetId,
        ctx,
      }),
    {
      concurrency:
        ctx.appConfig.concurrency.ASYNC_OPERATIONS_CONCURRENCY_COMMON,
    }
  );
}

import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { splitIntoBatches } from '../../../utils/helpers';
import { OfflineTradeRouterManager } from './utils';
import { handleAssetSpotPricesHistoricalData } from './assetSpotPrices';
import { handleAssetPairVolumesHistoricalData } from './assePairVolumes';
import { processAssetsHistoricalDataAtBlock } from './assetHistoricalData';

export async function handleAssetHistoricalData(
  ctx: SqdProcessorContext<Store>
) {
  const assetRegistryIds: Array<string> = [
    ...ctx.batchState.state.assetsAllBatch.values(),
  ]
    .filter((a) => !!a.assetRegistryId)
    .map((a) => `${a.assetRegistryId}`);

  /**
   * @description Processes data in a specific sequence to ensure data dependencies are met
   *
   * @important Generic asset historical data must be processed before asset historical spot prices.
   * This ordering is critical because the generic asset historical data serves as a required
   * data source for the OfflinePoolService.
   */
  for (const blocksSubBatch of splitIntoBatches(
    ctx.blocks,
    ctx.appConfig.HISTORICAL_DATA_PROCESSING_SUB_BATCH_SIZE
  )) {
    await Promise.all(
      blocksSubBatch.map((block) =>
        processAssetsHistoricalDataAtBlock({
          assetRegistryIds,
          block: block.header,
          ctx,
        })
      )
    );
  }
}

export async function handleAssetSpotPriceRelatedHistoricalData(
  ctx: SqdProcessorContext<Store>
) {
  OfflineTradeRouterManager.getInstance().wipeCache();

  for (const blocksSubBatch of splitIntoBatches(
    ctx.blocks,
    ctx.appConfig.HISTORICAL_DATA_PROCESSING_SUB_BATCH_SIZE
  )) {
    await OfflineTradeRouterManager.getInstance().initForBlocksBatch({
      blockNumbers: blocksSubBatch.map((b) => b.header.height),
      ctx,
    });

    await Promise.all(
      blocksSubBatch.map((block) =>
        handleAssetSpotPricesHistoricalData({
          blockHeader: block.header,
          ctx,
        })
      )
    );

    await Promise.all(
      blocksSubBatch.map((block) =>
        handleAssetPairVolumesHistoricalData({
          blockHeader: block.header,
          ctx,
        })
      )
    );
  }
}

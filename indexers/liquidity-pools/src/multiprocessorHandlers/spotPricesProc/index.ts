import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { handleRelayChainBlocks } from '../../handlers/relayChain';
import { prefetchAllAssets } from '../../handlers/assets/utils';
import {
  handleAssetHistoricalData,
  handleAssetSpotPriceRelatedHistoricalData,
} from '../../handlers/assets/assetHistoricalData';
import { processPoolsNormalizedVolumes } from '../../handlers/volumes/normalizedVolumesInBaseAsset';
import { ProcessorStatusManager } from '../../processorStatusManager';
import { ChainActivityTraceManager } from '../../chainActivityTracingManagers';
import { ProcessingPoolManager } from '../../utils/processingPoolManager';
import { StorageResolver } from '../../parsers/storageResolver';
import {
  checkAndWaitForCoreProcStatus,
  waitForSpotPricesRelatedHistoricalData,
} from './statusWaitingHelpers';
import { savePreprocessedData } from '../../handlers/preprocessedDataBucket/persist';
import { processPoolsTvlNormalized } from '../../handlers/pools/normalizedTvlBaseAsset';

export async function execSpotPricesProcessorHandlers(
  ctx: SqdProcessorContext<Store>
) {
  if (
    ctx.appConfig.ALL_IN_ONE_PROCESSOR_MODE ||
    !ctx.appConfig.IS_SPOT_PRICES_PROCESSOR
  )
    return;

  console.log('execSpotPricesProcessorHandlers');

  console.time('prefetchAllAssets');
  await prefetchAllAssets(ctx);
  console.timeEnd('prefetchAllAssets');

  await checkAndWaitForCoreProcStatus(ctx);

  await ProcessingPoolManager.getInstance().releaseCompletedJobs();

  const batchBlockNumbers = ctx.blocks.map((b) => b.header.height);

  while (true) {
    const blockNumbersToProcess =
      await ProcessingPoolManager.getInstance().takeJobsToProcessing(
        batchBlockNumbers
      );

    console.log('blockNumbersToProcess - ', blockNumbersToProcess);
    if (blockNumbersToProcess.length === 0) break;

    await processLockedBlocksBatch(blockNumbersToProcess, ctx);

    ProcessingPoolManager.getInstance().completeProcessedJobs(
      batchBlockNumbers
    );
  }

  console.time('updateInitialIndexingFinishedAtTime');
  await ProcessorStatusManager.updateInitialIndexingFinishedAtTime(ctx);
  console.timeEnd('updateInitialIndexingFinishedAtTime');

  await ProcessorStatusManager.getInstance(ctx).updateProcessorStatus({
    latestProcessedBlock: ctx.blocks[ctx.blocks.length - 1].header.height,
  });
}

async function processLockedBlocksBatch(
  blockNumbersToProcess: number[],
  ctx: SqdProcessorContext<Store>
) {
  await StorageResolver.getInstance().init({
    ctx: ctx,
    blockNumberFrom: blockNumbersToProcess[0],
    blockNumberTo: blockNumbersToProcess[blockNumbersToProcess.length - 1],
  });

  console.time('waitForSpotPricesRelatedHistoricalData');
  await waitForSpotPricesRelatedHistoricalData(blockNumbersToProcess, ctx);
  console.timeEnd('waitForSpotPricesRelatedHistoricalData');

  await ChainActivityTraceManager.prefetchBlockToCache({
    ctx,
    blockHeights: blockNumbersToProcess,
  });

  await handleRelayChainBlocks(ctx);

  console.time('prefetchAllAssets');
  await prefetchAllAssets(ctx);
  console.timeEnd('prefetchAllAssets');

  console.time('handleAssetHistoricalData');
  await handleAssetHistoricalData({
    ctx,
    blockNumbersToProcess,
  });
  console.timeEnd('handleAssetHistoricalData');

  console.time('handleAssetSpotPricesHistoricalData');
  await handleAssetSpotPriceRelatedHistoricalData({
    ctx,
    blockNumbersToProcess,
  });
  console.timeEnd('handleAssetSpotPricesHistoricalData');

  console.time('processPoolsNormalizedVolumes');
  processPoolsNormalizedVolumes({ ctx });
  console.timeEnd('processPoolsNormalizedVolumes');

  console.time('processPoolsTvlNormalized');
  processPoolsTvlNormalized({ ctx });
  console.timeEnd('processPoolsTvlNormalized');

  console.time('savePreprocessedDataBuckets');
  await savePreprocessedDataBuckets(ctx);
  console.timeEnd('savePreprocessedDataBuckets');

  // console.time('saveHistoricalDataBulk');
  // await HistoricalDataManager.saveHistoricalDataBulk(ctx);
  // console.timeEnd('saveHistoricalDataBulk');
}

async function savePreprocessedDataBuckets(ctx: SqdProcessorContext<Store>) {
  await savePreprocessedData({
    ctx,
    dataToSave: ctx.batchState.state.assetsHistoricalDataBatch,
  });

  await savePreprocessedData({
    ctx,
    dataToSave: ctx.batchState.state.assetsSpotPriceHistoricalDataBatch,
  });
  await savePreprocessedData({
    ctx,
    dataToSave: ctx.batchState.state.assetsPairVolumeHistoricalDataBatch,
  });

  await savePreprocessedData({
    ctx,
    dataToSave: ctx.batchState.state.assetAssetsPairVolumesBatch,
  });
  await savePreprocessedData({
    ctx,
    dataToSave: ctx.batchState.state.xykPoolVolumes,
  });
  await savePreprocessedData({
    ctx,
    dataToSave: ctx.batchState.state.lbpPoolVolumes,
  });
  await savePreprocessedData({
    ctx,
    dataToSave: ctx.batchState.state.omnipoolAssetVolumes,
  });
  await savePreprocessedData({
    ctx,
    dataToSave: ctx.batchState.state.stablepoolAssetVolumes,
  });
  await savePreprocessedData({
    ctx,
    dataToSave: ctx.batchState.state.stablepoolVolumeCollections,
  });
}

import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { processPoolsNormalizedVolumes } from '../../../handlers/pools/normalizedVolumesInBaseAsset';
import { ProcessorStatusManager } from '../../../processorStatusManager';
import { prefetchGenericPersistentData } from '../../prefetchHelpers';
import {
  Asset,
  AssetSpotPriceHistoricalData,
  Block,
  OmnipoolAssetVolumeHistoricalData,
  StableswapAssetVolumeHistoricalData,
  StableswapVolumeHistoricalData,
  Swap,
  Xykpool,
  XykpoolVolumeHistoricalData,
} from '../../../model';
import { Between } from 'typeorm/find-options/operator/Between';
import {
  handleAssetVolumeUpdates,
  processAssetNormalizedVolumes,
} from '../../../handlers/assets/volume';

export async function assetVolumeHistDataRecalcProc(
  ctx: SqdProcessorContext<Store>
) {
  if (!ctx.appConfig.processingMode.ALL_IN_ONE_PROCESSOR_MODE) return;

  console.log('recalculatePoolsNormalizedVolumes');

  console.time('prefetchGenericPersistentData');
  await prefetchGenericPersistentData(ctx);
  console.timeEnd('prefetchGenericPersistentData');

  ctx.batchState.state.assetsAll = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        Asset,
        {
          where: {},
          relations: {
            underlyingAsset: true,
            aToken: true,
            variableDebtToken: true,
            bondUnderlyingAsset: true,
          },
        },
        { className: 'Asset' }
      )
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.batchBlocks = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        Block,
        {
          where: {
            height: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
        },
        { className: 'Block' }
      )
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.assetsSpotPriceHistoricalDataBatch = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        AssetSpotPriceHistoricalData,
        {
          where: {
            paraBlockHeight: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          relations: {
            assetInHistData: true,
            assetIn: true,
            assetOut: true,
            block: true,
          },
        },
        { className: 'AssetSpotPriceHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.swaps = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        Swap,
        {
          where: {
            paraBlockHeight: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          relations: {
            inputs: {
              asset: true,
            },
            outputs: {
              asset: true,
            },
          },
        },
        { className: 'AssetSpotPriceHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );

  console.time(
    `handleAssetVolumeUpdates for ${ctx.batchState.state.swaps.size} swaps`
  );
  for (const swap of ctx.batchState.state.swaps.values()) {
    try {
      await handleAssetVolumeUpdates(ctx, {
        paraBlockHeight: swap.paraBlockHeight,
        relayBlockHeight: swap.relayBlockHeight,
        assetIn: swap.inputs[0].asset,
        assetOut: swap.outputs[0].asset,
        assetInAmount: swap.inputs[0].amount,
        assetOutAmount: swap.outputs[0].amount,
      });
    } catch (e) {
      console.log(e);
    }
  }
  console.timeEnd(
    `handleAssetVolumeUpdates for ${ctx.batchState.state.swaps.size} swaps`
  );

  console.time(`processAssetNormalizedVolumes`);
  await processAssetNormalizedVolumes({ ctx });
  console.timeEnd(`processAssetNormalizedVolumes`);

  await ctx.store.save(Array.from(ctx.batchState.state.assetVolumes.values()));

  console.time('updateInitialIndexingFinishedAtTime');
  await ProcessorStatusManager.updateInitialIndexingFinishedAtTime(ctx);
  console.timeEnd('updateInitialIndexingFinishedAtTime');

  await ProcessorStatusManager.getInstance(ctx).updateProcessorStatus({
    latestProcessedBlock: ctx.blocks[ctx.blocks.length - 1].header.height,
  });
}

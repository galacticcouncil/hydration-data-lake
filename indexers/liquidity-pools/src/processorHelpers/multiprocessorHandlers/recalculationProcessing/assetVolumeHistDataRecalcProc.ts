import { Between } from 'typeorm/find-options/operator/Between';

import { Store } from '@subsquid/typeorm-store';

import {
  handleAssetVolumeUpdates,
  processAssetNormalizedVolumes,
} from '../../../handlers/assets/volume';
import {
  Asset,
  AssetSpotPriceHistoricalData,
  Block,
  Swap,
  SwapAssetBalanceType,
} from '../../../model';
import { SqdProcessorContext } from '../../../processor';
import { ProcessorStatusManager } from '../../../processorStatusManager';
import { prefetchGenericPersistentData } from '../../prefetchHelpers';

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
          relations: {},
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
            inputs: true,
            outputs: true,
          },
          order: {
            paraBlockHeight: 'ASC',
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
    const inputs = swap.inputs.filter(
      (i) => i.assetBalanceType === SwapAssetBalanceType.Input
    );
    const outputs = swap.outputs.filter(
      (i) => i.assetBalanceType === SwapAssetBalanceType.Output
    );
    try {
      await handleAssetVolumeUpdates(ctx, {
        paraBlockHeight: swap.paraBlockHeight,
        assetInId: inputs[0].assetId,
        assetOutId: outputs[0].assetId,
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

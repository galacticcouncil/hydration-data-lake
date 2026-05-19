import { Between } from 'typeorm/find-options/operator/Between';

import { Store } from '@subsquid/typeorm-store';

import {
  processPoolsNormalizedVolumes,
} from '../../handlers/pools/normalizedVolumesInBaseAsset';
import {
  Asset,
  AssetSpotPriceHistoricalData,
  Block,
  OmnipoolAssetVolumeHistoricalData,
  StableswapAssetVolumeHistoricalData,
  StableswapVolumeHistoricalData,
  XykpoolVolumeHistoricalData,
} from '../../model';
import { SqdProcessorContext } from '../../processor';
import { ProcessorStatusManager } from '../../processorStatusManager';
import { prefetchGenericPersistentData } from '../prefetchHelpers';

export async function recalculatePoolsNormalizedVolumes(
  ctx: SqdProcessorContext<Store>
) {
  if (!ctx.appConfig.processingMode.ALL_IN_ONE_PROCESSOR_MODE) return;

  console.log('recalculatePoolsNormalizedVolumes');

  console.time('prefetchGenericPersistentData');
  await prefetchGenericPersistentData(ctx);
  console.timeEnd('prefetchGenericPersistentData');

  ctx.batchState.state.assetsAll = new Map(
    (
      await ctx.storeUtils.findWithLogs(Asset, {
        where: {},
        relations: {},
      }, { className: 'Asset', originCallFn: 'recalculatePoolsNormalizedVolumes' })
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.batchBlocks = new Map(
    (
      await ctx.storeUtils.findWithLogs(Block, {
        where: {
          height: Between(
            ctx.blocks[0].header.height,
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
        },
      }, { className: 'Block', originCallFn: 'recalculatePoolsNormalizedVolumes' })
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.assetsSpotPriceHistoricalDataBatch = new Map(
    (
      await ctx.storeUtils.findWithLogs(AssetSpotPriceHistoricalData, {
        where: {
          paraBlockHeight: Between(
            ctx.blocks[0].header.height,
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
        },
        relations: {},
      }, { className: 'AssetSpotPriceHistoricalData', originCallFn: 'recalculatePoolsNormalizedVolumes' })
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.xykPoolVolumes = new Map(
    (
      await ctx.storeUtils.findWithLogs(XykpoolVolumeHistoricalData, {
        where: {
          paraBlockHeight: Between(
            ctx.blocks[0].header.height,
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
        },
        relations: {
          pool: true,
        },
      }, { className: 'XykpoolVolumeHistoricalData', originCallFn: 'recalculatePoolsNormalizedVolumes' })
    ).map((p) => [p.id, p])
  );
  ctx.batchState.state.omnipoolAssetVolumes = new Map(
    (
      await ctx.storeUtils.findWithLogs(OmnipoolAssetVolumeHistoricalData, {
        where: {
          paraBlockHeight: Between(
            ctx.blocks[0].header.height,
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
        },
        relations: {
          omnipoolAsset: true,
        },
      }, { className: 'OmnipoolAssetVolumeHistoricalData', originCallFn: 'recalculatePoolsNormalizedVolumes' })
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.stablepoolVolumeCollections = new Map(
    (
      await ctx.storeUtils.findWithLogs(StableswapVolumeHistoricalData, {
        where: {
          paraBlockHeight: Between(
            ctx.blocks[0].header.height,
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
        },
        relations: {
          pool: true,
        },
      }, { className: 'StableswapVolumeHistoricalData', originCallFn: 'recalculatePoolsNormalizedVolumes' })
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.stablepoolAssetVolumes = new Map(
    (
      await ctx.storeUtils.findWithLogs(StableswapAssetVolumeHistoricalData, {
        where: {
          paraBlockHeight: Between(
            ctx.blocks[0].header.height,
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
        },
        relations: {
          volumesCollection: { pool: true },
        },
      }, { className: 'StableswapAssetVolumeHistoricalData', originCallFn: 'recalculatePoolsNormalizedVolumes' })
    ).map((p) => [p.id, p])
  );

  console.time('processPoolsNormalizedVolumes');
  await processPoolsNormalizedVolumes({ ctx });
  console.timeEnd('processPoolsNormalizedVolumes');

  await ctx.store.save(
    Array.from(ctx.batchState.state.xykPoolVolumes.values())
  );
  await ctx.store.save(
    Array.from(ctx.batchState.state.omnipoolAssetVolumes.values())
  );

  await ctx.store.save(
    Array.from(ctx.batchState.state.stablepoolVolumeCollections.values())
  );
  await ctx.store.save(
    Array.from(ctx.batchState.state.stablepoolAssetVolumes.values())
  );

  console.time('updateInitialIndexingFinishedAtTime');
  await ProcessorStatusManager.updateInitialIndexingFinishedAtTime(ctx);
  console.timeEnd('updateInitialIndexingFinishedAtTime');

  await ProcessorStatusManager.getInstance(ctx).updateProcessorStatus({
    latestProcessedBlock: ctx.blocks[ctx.blocks.length - 1].header.height,
  });
}

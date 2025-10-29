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
  Xykpool,
  XykpoolVolumeHistoricalData,
} from '../../../model';
import { Between } from 'typeorm/find-options/operator/Between';

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
        relations: {
          underlyingAsset: true,
          aToken: true,
          variableDebtToken: true,
          bondUnderlyingAsset: true,
        },
      }, { className: 'Asset' })
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
      }, { className: 'Block' })
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
        relations: {
          assetInHistData: true,
          assetIn: true,
          assetOut: true,
        },
      }, { className: 'AssetSpotPriceHistoricalData' })
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
          assetA: true,
          assetB: true,
        },
      }, { className: 'XykpoolVolumeHistoricalData' })
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
          omnipoolAsset: { asset: true },
        },
      }, { className: 'OmnipoolAssetVolumeHistoricalData' })
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
      }, { className: 'StableswapVolumeHistoricalData' })
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
          asset: true,
        },
      }, { className: 'StableswapAssetVolumeHistoricalData' })
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

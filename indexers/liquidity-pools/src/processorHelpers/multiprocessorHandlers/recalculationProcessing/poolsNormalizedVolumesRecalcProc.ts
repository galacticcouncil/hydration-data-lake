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
      await ctx.store.find(Asset, {
        where: {},
        relations: {
          underlyingAsset: true,
          aToken: true,
          variableDebtToken: true,
          bondUnderlyingAsset: true,
        },
      })
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.batchBlocks = new Map(
    (
      await ctx.store.find(Block, {
        where: {
          height: Between(
            ctx.blocks[0].header.height,
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
        },
      })
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.assetsSpotPriceHistoricalDataBatch = new Map(
    (
      await ctx.store.find(AssetSpotPriceHistoricalData, {
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
      })
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.xykPoolVolumes = new Map(
    (
      await ctx.store.find(XykpoolVolumeHistoricalData, {
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
          block: true,
        },
      })
    ).map((p) => [p.id, p])
  );
  ctx.batchState.state.omnipoolAssetVolumes = new Map(
    (
      await ctx.store.find(OmnipoolAssetVolumeHistoricalData, {
        where: {
          paraBlockHeight: Between(
            ctx.blocks[0].header.height,
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
        },
        relations: {
          omnipoolAsset: { asset: true },
        },
      })
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.stablepoolVolumeCollections = new Map(
    (
      await ctx.store.find(StableswapVolumeHistoricalData, {
        where: {
          paraBlockHeight: Between(
            ctx.blocks[0].header.height,
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
        },
        relations: {
          pool: true,
          block: true,
        },
      })
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.stablepoolAssetVolumes = new Map(
    (
      await ctx.store.find(StableswapAssetVolumeHistoricalData, {
        where: {
          paraBlockHeight: Between(
            ctx.blocks[0].header.height,
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
        },
        relations: {
          volumesCollection: { pool: true },
          asset: true,
          block: true,
        },
      })
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

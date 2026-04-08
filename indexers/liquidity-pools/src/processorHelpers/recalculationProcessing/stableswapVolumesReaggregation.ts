import { Between } from 'typeorm/find-options/operator/Between';

import { Store } from '@subsquid/typeorm-store';

import {
  AssetsPairVolumeHistoricalData,
  AssetSpotPriceHistoricalData,
  AssetVolumeHistoricalData,
  Block,
  HsmpoolAssetHistoricalData,
  LbppoolVolumeHistoricalData,
  OmnipoolAssetVolumeHistoricalData,
  StableswapAssetVolumeHistoricalData,
  StableswapVolumeHistoricalData,
  Swap,
  SwapAssetBalanceType,
  XykpoolVolumeHistoricalData,
} from '../../model';
import { SqdProcessorContext } from '../../processor';
import { ProcessorStatusManager } from '../../processorStatusManager';
import {
  getOldAssetVolume,
  handleAssetVolumeUpdates,
  processAssetNormalizedVolumes,
} from '../../handlers/assets/volume';
import { BigNumber } from '@galacticcouncil/sdk';
import {
  getOldLbpVolume,
  getOldOmnipoolAssetVolume,
  getOldStablepoolAssetVolume,
  getOldStablepoolVolume,
  getOldXykVolume,
  getPoolAssetPreviousVolumeFromCache,
  getPoolPreviousVolumeFromCache,
} from '../../handlers/pools/volumes';
import { LatestProcessedDataCacheManager } from '../../utils/latestProcessedDataCacheManager';
import { correlateAssetSpotPrices } from '../utils';
import { getOrCreateAsset } from '../../handlers/assets/asset';
import { getAssetsPairPrice } from '../../handlers/assets/assetHistoricalData/assetSpotPrices';
import { calcPriceNormalized } from '../../utils/helpers';

export async function handleStableSwapVolumesReaggregation(
  ctx: SqdProcessorContext<Store>
) {
  if (!ctx.appConfig.processingMode.ALL_IN_ONE_PROCESSOR_MODE) return;

  console.time('prefetchSpecificData');

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
          order: {
            height: 'ASC',
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
          order: {
            paraBlockHeight: 'ASC',
          },
        },
        { className: 'AssetSpotPriceHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );

  await LatestProcessedDataCacheManager.getInstance().prefetchLastAssetSpotPriceHistDataItem(
    { ctx, blockHeader: ctx.blocks[0].header }
  );

  const spotPricesFromPreviousBatch =
    LatestProcessedDataCacheManager.getInstance().getAllCachedLastAssetSpotPriceHistoricalDataItems();

  for (const prevBatchSpotPrice of spotPricesFromPreviousBatch.values()) {
    ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.set(
      prevBatchSpotPrice.id,
      prevBatchSpotPrice
    );
  }

  correlateAssetSpotPrices(ctx);

  ctx.batchState.state.stablepoolVolumeCollections = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        StableswapVolumeHistoricalData,
        {
          where: {
            paraBlockHeight: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          relations: {
            pool: true,
          },
          order: {
            paraBlockHeight: 'ASC',
          },
        },
        { className: 'StableswapVolumeHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.stablepoolAssetVolumes = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        StableswapAssetVolumeHistoricalData,
        {
          where: {
            paraBlockHeight: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          relations: {
            volumesCollection: { pool: true },
          },
          order: {
            paraBlockHeight: 'ASC',
          },
        },
        { className: 'StableswapAssetVolumeHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );

  console.timeEnd('prefetchSpecificData');

  /**
   * ===========================================================================
   * ==================== Pools volumes reaggregation =========================
   * ===========================================================================
   */
  /**
   * --------------------------- Stableswap Asset volume ------------------------------
   */
  console.time('Stableswap Asset volume');

  const assetVolumesIndexedByBlockAndPool: Map<
    string,
    StableswapAssetVolumeHistoricalData[]
  > = new Map();

  for (const processingAssetVolume of ctx.batchState.state.stablepoolAssetVolumes.values()) {
    const previousAssetHistVolume =
      (getPoolAssetPreviousVolumeFromCache(
        ctx.batchState.state.stablepoolAssetVolumes,
        `${processingAssetVolume.volumesCollection.pool.id}-${processingAssetVolume.assetId}`,
        processingAssetVolume.paraBlockHeight
      ) as StableswapAssetVolumeHistoricalData | undefined) ||
      (await getOldStablepoolAssetVolume({
        ctx,
        assetId: processingAssetVolume.assetId,
        poolId: processingAssetVolume.volumesCollection.pool.id,
        currentBlockHeight: processingAssetVolume.paraBlockHeight,
      }));

    processingAssetVolume.assetTotalVolIn =
      (previousAssetHistVolume?.assetTotalVolIn ?? 0n) +
      processingAssetVolume.assetVolIn;

    processingAssetVolume.assetTotalVolOut =
      (previousAssetHistVolume?.assetTotalVolOut ?? 0n) +
      processingAssetVolume.assetVolOut;

    processingAssetVolume.assetTotalFeesVol =
      (previousAssetHistVolume?.assetTotalFeesVol ?? 0n) +
      processingAssetVolume.assetFeeVol;

    // ---------

    processingAssetVolume.assetTotalVolInNorm = BigNumber(
      previousAssetHistVolume?.assetTotalVolInNorm ?? '0'
    )
      .plus(processingAssetVolume.assetVolInNorm ?? '0')
      .toFixed();

    processingAssetVolume.assetTotalVolOutNorm = BigNumber(
      previousAssetHistVolume?.assetTotalVolOutNorm ?? '0'
    )
      .plus(processingAssetVolume.assetVolOutNorm ?? '0')
      .toFixed();

    // --------

    if (processingAssetVolume.paraBlockHeight >= 6837787) {
      processingAssetVolume.assetTotalFeesVolNorm = BigNumber(
        previousAssetHistVolume?.assetTotalFeesVolNorm ?? '0'
      )
        .plus(processingAssetVolume.assetFeeVolNorm ?? '0')
        .toFixed();
    } else {
      const asset = await getOrCreateAsset({
        ctx,
        id: processingAssetVolume.assetId,
        ensure: false,
      });
      if (!asset) {
        console.log(
          `Asset ${processingAssetVolume.assetId} not found in the database. Skipping normalization.`
        );
      }

      const assetSpotPrice = getAssetsPairPrice({
        assetInId: processingAssetVolume.assetId,
        blockHeight: processingAssetVolume.paraBlockHeight,
        ctx,
      });

      if (assetSpotPrice && asset && asset.decimals) {
        const assetFeeVolNorm = calcPriceNormalized({
          amount: processingAssetVolume.assetFeeVol,
          spotPrice: assetSpotPrice,
          assetDecimals: asset.decimals,
        });

        processingAssetVolume.assetTotalFeesVolNorm = BigNumber(
          previousAssetHistVolume?.assetTotalFeesVolNorm ?? '0'
        )
          .plus(assetFeeVolNorm)
          .toFixed();
      }
    }

    if (
      !assetVolumesIndexedByBlockAndPool.has(
        processingAssetVolume.volumesCollection.id
      )
    ) {
      assetVolumesIndexedByBlockAndPool.set(
        processingAssetVolume.volumesCollection.id,
        []
      );
    }
    assetVolumesIndexedByBlockAndPool
      .get(processingAssetVolume.volumesCollection.id)
      ?.push(processingAssetVolume);

    ctx.batchState.state.stablepoolAssetVolumes.set(
      processingAssetVolume.id,
      processingAssetVolume
    );
  }

  for (const processingPoolVolume of ctx.batchState.state.stablepoolVolumeCollections.values()) {
    const previousStableswapVolume =
      (getPoolPreviousVolumeFromCache(
        ctx.batchState.state.stablepoolVolumeCollections,
        `${processingPoolVolume.pool.id}`,
        processingPoolVolume.paraBlockHeight
      ) as StableswapVolumeHistoricalData | undefined) ||
      (await getOldStablepoolVolume({
        ctx,
        poolId: processingPoolVolume.pool.id,
        currentBlockHeight: processingPoolVolume.paraBlockHeight,
      }));

    let currentPoolVolInNorm = BigNumber(0);
    let currentPoolVolOutNorm = BigNumber(0);
    let currentPoolFeesVolNorm = BigNumber(0);

    for (const assetVolumes of assetVolumesIndexedByBlockAndPool
      .get(processingPoolVolume.id)
      ?.values() || []) {
      currentPoolVolInNorm = currentPoolVolInNorm.plus(
        assetVolumes.assetVolInNorm
      );
      currentPoolVolOutNorm = currentPoolVolOutNorm.plus(
        assetVolumes.assetVolOutNorm
      );
      currentPoolFeesVolNorm = currentPoolFeesVolNorm.plus(
        assetVolumes.assetFeeVolNorm
      );
    }

    processingPoolVolume.poolVolInNorm = currentPoolVolInNorm.toFixed();
    processingPoolVolume.poolVolOutNorm = currentPoolVolOutNorm.toFixed();
    processingPoolVolume.poolFeesVolNorm = currentPoolFeesVolNorm.toFixed();

    processingPoolVolume.poolTotalVolInNorm = BigNumber(
      previousStableswapVolume?.poolTotalVolInNorm ?? '0'
    )
      .plus(processingPoolVolume.poolVolInNorm ?? '0')
      .toFixed();

    processingPoolVolume.poolTotalVolOutNorm = BigNumber(
      previousStableswapVolume?.poolTotalVolOutNorm ?? '0'
    )
      .plus(processingPoolVolume.poolVolOutNorm ?? '0')
      .toFixed();

    processingPoolVolume.poolTotalFeesVolNorm = BigNumber(
      previousStableswapVolume?.poolTotalFeesVolNorm ?? '0'
    )
      .plus(processingPoolVolume.poolFeesVolNorm ?? '0')
      .toFixed();
  }
  console.timeEnd('Stableswap Asset volume');

  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.stablepoolVolumeCollections.values())
  );

  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.stablepoolAssetVolumes.values())
  );

  /**
   * ===========================================================================
   * ===========================================================================
   */

  LatestProcessedDataCacheManager.getInstance().setLastAssetSpotPriceHistoricalDataItem(
    Array.from(ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.values())
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

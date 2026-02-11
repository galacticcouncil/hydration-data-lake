import { Between } from 'typeorm/find-options/operator/Between';

import { Store } from '@subsquid/typeorm-store';

import { processPoolsNormalizedVolumes } from '../../../handlers/pools/normalizedVolumesInBaseAsset';
import {
  AccountAssetBalanceHistoricalData,
  Asset,
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
} from '../../../model';
import { SqdProcessorContext } from '../../../processor';
import { ProcessorStatusManager } from '../../../processorStatusManager';
import { prefetchGenericPersistentData } from '../../prefetchHelpers';
import {
  getOldAssetVolume,
  handleAssetVolumeUpdates,
  processAssetNormalizedVolumes,
} from '../../../handlers/assets/volume';
import { BigNumber } from '@galacticcouncil/sdk';
import {
  getOldLbpVolume,
  getOldOmnipoolAssetVolume,
  getOldStablepoolAssetVolume,
  getOldStablepoolVolume,
  getOldXykVolume,
  getPoolAssetPreviousVolumeFromCache,
  getPoolPreviousVolumeFromCache,
} from '../../../handlers/pools/volumes';
import { getOldHsmAssetHistDataEntity } from '../../../handlers/pools/pools/hsmpool/hsmpoolAssetHistData';
import {
  handleAccountTotalBalance,
  handleLiquidityBalancesInTotalBalances,
  handleUnchangedAccountAssetBalances,
} from '../../../handlers/balances/accountTotalBalance';
import { HistoricalDataManager } from '../../../handlers/historicalData';
import { LatestProcessedDataCacheManager } from '../../../utils/latestProcessedDataCacheManager';

export async function handleHarvesterPostMergeReaggregation(
  ctx: SqdProcessorContext<Store>
) {
  if (!ctx.appConfig.processingMode.ALL_IN_ONE_PROCESSOR_MODE) return;

  console.log('recalculatePoolsNormalizedVolumes');

  console.time('prefetchGenericPersistentData');
  await prefetchGenericPersistentData(ctx);
  console.timeEnd('prefetchGenericPersistentData');

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

  const spotPricesFromPreviousBatch =
    LatestProcessedDataCacheManager.getInstance().getAllCachedLastAssetSpotPriceHistoricalDataItems();

  for (const prevBatchSpotPrice of spotPricesFromPreviousBatch.values()) {
    ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.set(
      prevBatchSpotPrice.id,
      prevBatchSpotPrice
    );
  }

  ctx.batchState.state.assetsPairVolumeHistoricalDataBatch = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        AssetsPairVolumeHistoricalData,
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

  ctx.batchState.state.lbpPoolVolumes = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        LbppoolVolumeHistoricalData,
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
        { className: 'LbppoolVolumeHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.xykPoolVolumes = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        XykpoolVolumeHistoricalData,
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
        { className: 'XykpoolVolumeHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );
  ctx.batchState.state.omnipoolAssetVolumes = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        OmnipoolAssetVolumeHistoricalData,
        {
          where: {
            paraBlockHeight: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          relations: {
            omnipoolAsset: true,
          },
          order: {
            paraBlockHeight: 'ASC',
          },
        },
        { className: 'OmnipoolAssetVolumeHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );

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

  ctx.batchState.state.assetVolumes = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        AssetVolumeHistoricalData,
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
        { className: 'AssetVolumeHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.hsmpoolAssetHistData = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        HsmpoolAssetHistoricalData,
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
        { className: 'HsmpoolAssetHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.accountAssetBalanceHistoricalData = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        AccountAssetBalanceHistoricalData,
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
        { className: 'AccountAssetBalanceHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );
  console.timeEnd('prefetchSpecificData');

  /**
   * ===========================================================================
   * ==================== Assets volumes reaggregation =========================
   * ===========================================================================
   */

  console.time('Assets volumes reaggregation');

  if (
    ctx.blocks[ctx.blocks.length - 1].header.specVersion <
    ctx.appConfig.UNIFIED_EVENTS_GENESIS_SPEC_VERSION
  ) {
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
          assetInAmount: inputs[0].amount,
          assetOutAmount: outputs[0].amount,
        });
      } catch (e) {
        console.log(e);
      }
    }
    console.time(`processAssetNormalizedVolumes`);
    await processAssetNormalizedVolumes({ ctx });
    console.timeEnd(`processAssetNormalizedVolumes`);
  } else {
    for (const processingAssetVolume of ctx.batchState.state.assetVolumes.values()) {
      const previousAssetVolume =
        ctx.batchState.getPreviousHistDataEntity({
          entitiesMap: ctx.batchState.state.assetVolumes,
          entityId: processingAssetVolume.assetId,
          currentBlockHeight: processingAssetVolume.paraBlockHeight,
          blockHeightValPosition: 1,
        }) ||
        (await getOldAssetVolume({
          ctx,
          assetId: processingAssetVolume.assetId,
          currentBlockHeight: processingAssetVolume.paraBlockHeight,
        }));

      processingAssetVolume.totalVolumeIn =
        (previousAssetVolume?.totalVolumeIn ?? 0n) +
        processingAssetVolume.volumeIn;

      processingAssetVolume.totalVolumeOut =
        (previousAssetVolume?.totalVolumeOut ?? 0n) +
        processingAssetVolume.volumeOut;

      processingAssetVolume.totalVolumeInNorm = BigNumber(
        previousAssetVolume?.totalVolumeInNorm ?? '0'
      )
        .plus(processingAssetVolume.volumeInNorm ?? '0')
        .toFixed();

      processingAssetVolume.totalVolumeOutNorm = BigNumber(
        previousAssetVolume?.totalVolumeOutNorm ?? '0'
      )
        .plus(processingAssetVolume.volumeOutNorm ?? '0')
        .toFixed();

      ctx.batchState.state.assetVolumes.set(
        processingAssetVolume.id,
        processingAssetVolume
      );
    }
  }

  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.assetVolumes.values())
  );

  console.timeEnd('Assets volumes reaggregation');

  /**
   * ===========================================================================
   * ==================== Pools volumes reaggregation =========================
   * ===========================================================================
   */

  /**
   * --------------------------- LBP Pool volume ------------------------------
   */

  console.time('LBP Pool volume');

  for (const processingLbppoolVolume of ctx.batchState.state.lbpPoolVolumes.values()) {
    const previousVolume =
      ctx.batchState.getPreviousHistDataEntity({
        entitiesMap: ctx.batchState.state.lbpPoolVolumes,
        entityId: processingLbppoolVolume.pool.id,
        currentBlockHeight: processingLbppoolVolume.paraBlockHeight,
        blockHeightValPosition: 1,
      }) ||
      (await getOldLbpVolume({
        ctx,
        poolId: processingLbppoolVolume.pool.id,
        currentBlockHeight: processingLbppoolVolume.paraBlockHeight,
      }));

    processingLbppoolVolume.assetATotalVolIn =
      (previousVolume?.assetATotalVolIn ?? 0n) +
      processingLbppoolVolume.assetAVolIn;

    processingLbppoolVolume.assetBTotalVolIn =
      (previousVolume?.assetBTotalVolIn ?? 0n) +
      processingLbppoolVolume.assetBVolIn;

    processingLbppoolVolume.assetATotalVolOut =
      (previousVolume?.assetATotalVolOut ?? 0n) +
      processingLbppoolVolume.assetAVolOut;

    processingLbppoolVolume.assetBTotalVolOut =
      (previousVolume?.assetBTotalVolOut ?? 0n) +
      processingLbppoolVolume.assetBVolOut;

    processingLbppoolVolume.assetAFeesTotalVol =
      (previousVolume?.assetAFeesTotalVol ?? 0n) +
      processingLbppoolVolume.assetAFeeVol;

    processingLbppoolVolume.assetBFeesTotalVol =
      (previousVolume?.assetBFeesTotalVol ?? 0n) +
      processingLbppoolVolume.assetBFeeVol;

    // -------

    processingLbppoolVolume.assetATotalVolInNorm = BigNumber(
      previousVolume?.assetATotalVolInNorm ?? '0'
    )
      .plus(processingLbppoolVolume.assetAVolInNorm ?? '0')
      .toFixed();

    processingLbppoolVolume.assetBTotalVolInNorm = BigNumber(
      previousVolume?.assetBTotalVolInNorm ?? '0'
    )
      .plus(processingLbppoolVolume.assetBVolInNorm ?? '0')
      .toFixed();

    // -------

    processingLbppoolVolume.assetATotalVolOutNorm = BigNumber(
      previousVolume?.assetATotalVolOutNorm ?? '0'
    )
      .plus(processingLbppoolVolume.assetAVolOutNorm ?? '0')
      .toFixed();

    processingLbppoolVolume.assetBTotalVolOutNorm = BigNumber(
      previousVolume?.assetBTotalVolOutNorm ?? '0'
    )
      .plus(processingLbppoolVolume.assetBVolOutNorm ?? '0')
      .toFixed();

    // -------

    processingLbppoolVolume.assetAFeesTotalVolNorm = BigNumber(
      previousVolume?.assetAFeesTotalVolNorm ?? '0'
    )
      .plus(processingLbppoolVolume.assetAFeeVolNorm ?? '0')
      .toFixed();

    processingLbppoolVolume.assetBFeesTotalVolNorm = BigNumber(
      previousVolume?.assetBFeesTotalVolNorm ?? '0'
    )
      .plus(processingLbppoolVolume.assetBFeeVolNorm ?? '0')
      .toFixed();

    // -------

    ctx.batchState.state.lbpPoolVolumes.set(
      processingLbppoolVolume.id,
      processingLbppoolVolume
    );
  }

  console.timeEnd('LBP Pool volume');

  /**
   * --------------------------- XYK Pool volume ------------------------------
   */

  console.time('XYK Pool volume');
  for (const processingXykpoolVolume of ctx.batchState.state.xykPoolVolumes.values()) {
    const previousVolume =
      ctx.batchState.getPreviousHistDataEntity({
        entitiesMap: ctx.batchState.state.xykPoolVolumes,
        entityId: processingXykpoolVolume.pool.id,
        currentBlockHeight: processingXykpoolVolume.paraBlockHeight,
        blockHeightValPosition: 1,
      }) ||
      (await getOldXykVolume({
        ctx,
        poolId: processingXykpoolVolume.pool.id,
        currentBlockHeight: processingXykpoolVolume.paraBlockHeight,
      }));

    processingXykpoolVolume.assetATotalVolIn =
      (previousVolume?.assetATotalVolIn ?? 0n) +
      processingXykpoolVolume.assetAVolIn;

    processingXykpoolVolume.assetBTotalVolIn =
      (previousVolume?.assetBTotalVolIn ?? 0n) +
      processingXykpoolVolume.assetBVolIn;

    processingXykpoolVolume.assetATotalVolOut =
      (previousVolume?.assetATotalVolOut ?? 0n) +
      processingXykpoolVolume.assetAVolOut;

    processingXykpoolVolume.assetBTotalVolOut =
      (previousVolume?.assetBTotalVolOut ?? 0n) +
      processingXykpoolVolume.assetBVolOut;

    processingXykpoolVolume.assetAFeesTotalVol =
      (previousVolume?.assetAFeesTotalVol ?? 0n) +
      processingXykpoolVolume.assetAFeeVol;

    processingXykpoolVolume.assetBFeesTotalVol =
      (previousVolume?.assetBFeesTotalVol ?? 0n) +
      processingXykpoolVolume.assetBFeeVol;

    // -------

    processingXykpoolVolume.assetATotalVolInNorm = BigNumber(
      previousVolume?.assetATotalVolInNorm ?? '0'
    )
      .plus(processingXykpoolVolume.assetAVolInNorm ?? '0')
      .toFixed();

    processingXykpoolVolume.assetBTotalVolInNorm = BigNumber(
      previousVolume?.assetBTotalVolInNorm ?? '0'
    )
      .plus(processingXykpoolVolume.assetBVolInNorm ?? '0')
      .toFixed();

    // -------

    processingXykpoolVolume.assetATotalVolOutNorm = BigNumber(
      previousVolume?.assetATotalVolOutNorm ?? '0'
    )
      .plus(processingXykpoolVolume.assetAVolOutNorm ?? '0')
      .toFixed();

    processingXykpoolVolume.assetBTotalVolOutNorm = BigNumber(
      previousVolume?.assetBTotalVolOutNorm ?? '0'
    )
      .plus(processingXykpoolVolume.assetBVolOutNorm ?? '0')
      .toFixed();

    // -------

    processingXykpoolVolume.assetAFeesTotalVolNorm = BigNumber(
      previousVolume?.assetAFeesTotalVolNorm ?? '0'
    )
      .plus(processingXykpoolVolume.assetAFeeVolNorm ?? '0')
      .toFixed();

    processingXykpoolVolume.assetBFeesTotalVolNorm = BigNumber(
      previousVolume?.assetBFeesTotalVolNorm ?? '0'
    )
      .plus(processingXykpoolVolume.assetBFeeVolNorm ?? '0')
      .toFixed();

    // -------

    ctx.batchState.state.xykPoolVolumes.set(
      processingXykpoolVolume.id,
      processingXykpoolVolume
    );
  }

  console.timeEnd('XYK Pool volume');

  /**
   * --------------------------- Omnipool Asset volume ------------------------------
   */
  console.time('Omnipool Asset volume');

  for (const processingAssetVolume of ctx.batchState.state.omnipoolAssetVolumes.values()) {
    const previousAssetHistVolume =
      (getPoolAssetPreviousVolumeFromCache(
        ctx.batchState.state.omnipoolAssetVolumes,
        processingAssetVolume.omnipoolAsset.id,
        processingAssetVolume.paraBlockHeight
      ) as OmnipoolAssetVolumeHistoricalData | undefined) ||
      (await getOldOmnipoolAssetVolume({
        ctx,
        omnipoolAssetId: processingAssetVolume.omnipoolAsset.id,
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

    // -------

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

    processingAssetVolume.assetTotalFeesVolNorm = BigNumber(
      previousAssetHistVolume?.assetTotalFeesVolNorm ?? '0'
    )
      .plus(processingAssetVolume.assetFeeVolNorm ?? '0')
      .toFixed();

    ctx.batchState.state.omnipoolAssetVolumes.set(
      processingAssetVolume.id,
      processingAssetVolume
    );
  }
  console.timeEnd('Omnipool Asset volume');
  /**
   * --------------------------- Stableswap Asset volume ------------------------------
   */
  console.time('Stableswap Asset volume');
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

    // -------

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

    processingAssetVolume.assetTotalFeesVolNorm = BigNumber(
      previousAssetHistVolume?.assetTotalFeesVolNorm ?? '0'
    )
      .plus(processingAssetVolume.assetFeeVolNorm ?? '0')
      .toFixed();

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

  console.time('Save pools volume');

  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.xykPoolVolumes.values())
  );

  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.omnipoolAssetVolumes.values())
  );

  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.stablepoolVolumeCollections.values())
  );

  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.stablepoolAssetVolumes.values())
  );
  console.timeEnd('Save pools volume');
  /**
   * ===========================================================================
   * ================= HSM Asset volumes reaggregation =========================
   * ===========================================================================
   */
  console.time('HSM Asset volumes reaggregation');

  for (const processingAssetVolume of ctx.batchState.state.hsmpoolAssetHistData.values()) {
    const previousAssetHistVolume =
      (ctx.batchState.getPreviousHistDataEntity({
        entitiesMap: ctx.batchState.state.hsmpoolAssetHistData,
        entityId: `${processingAssetVolume.assetId}`,
        currentBlockHeight: processingAssetVolume.paraBlockHeight,
        blockHeightValPosition: 1,
      }) as HsmpoolAssetHistoricalData | undefined) ||
      (await getOldHsmAssetHistDataEntity({
        ctx,
        assetId: processingAssetVolume.assetId,
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

    // -------

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

    processingAssetVolume.assetTotalFeesVolNorm = BigNumber(
      previousAssetHistVolume?.assetTotalFeesVolNorm ?? '0'
    )
      .plus(processingAssetVolume.assetFeeVolNorm ?? '0')
      .toFixed();

    ctx.batchState.state.hsmpoolAssetHistData.set(
      processingAssetVolume.id,
      processingAssetVolume
    );
  }

  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.hsmpoolAssetHistData.values())
  );
  console.timeEnd('HSM Asset volumes reaggregation');

  /**
   * ===========================================================================
   * ============== Account total balances reaggregation =======================
   * ===========================================================================
   */

  /**
   * Aggregate Account Total Balances
   */
  // await handleAccountTotalBalance({ ctx });
  //
  // const allProcessedAccountsPerBlock: Map<number, Set<string>> = new Map();
  //
  // for (const assetBalance of ctx.batchState.state.accountAssetBalanceHistoricalData.values()) {
  //   if (!allProcessedAccountsPerBlock.has(assetBalance.paraBlockHeight)) {
  //     allProcessedAccountsPerBlock.set(assetBalance.paraBlockHeight, new Set());
  //   }
  //   allProcessedAccountsPerBlock
  //     .get(assetBalance.paraBlockHeight)!
  //     .add(assetBalance.accountId);
  // }
  //
  // /**
  //  * Include Liquidity Balances in Total Balances.
  //  */
  // await handleLiquidityBalancesInTotalBalances({
  //   ctx,
  //   allProcessedAccountsPerBlock,
  // });
  //
  // /**
  //  * Includes Asset Balances unchanged in the current block but existing in the
  //  * previous block.
  //  * IMPORTANT: Can mutate AccountTotalBalanceHistoricalData
  //  */
  // await handleUnchangedAccountAssetBalances({ ctx });
  //
  // await ctx.storeUtils.upsertWithBatches(
  //   Array.from(ctx.batchState.state.accountAssetBalanceHistoricalData.values())
  // );
  // await ctx.storeUtils.upsertWithBatches(
  //   Array.from(ctx.batchState.state.accountTotalBalanceHistoricalData.values())
  // );

  /**
   * ===========================================================================
   * ===========================================================================
   */

  console.time('Commit to redis');

  await Promise.all([
    HistoricalDataManager.commitAssetsPairVolumeToRedisTimeSeries(
      Array.from(
        ctx.batchState.state.assetsPairVolumeHistoricalDataBatch.values()
      ),
      ctx
    ),
    HistoricalDataManager.commitAssetPricesToRedisTimeSeries(
      Array.from(
        ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.values()
      ),
      ctx
    ),
    HistoricalDataManager.commitAccountTotalBalancesToRedisTimeSeries(
      Array.from(
        ctx.batchState.state.accountTotalBalanceHistoricalData.values()
      ),
      ctx
    ),
  ]);
  console.timeEnd('Commit to redis');

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

import { BigNumber, toFixedTrimmed } from '../../../utils/bignumber';
import { Store } from '@subsquid/typeorm-store';

import {
  StableswapAssetVolumeHistoricalData,
  StableswapVolumeHistoricalData,
} from '../../../model';
import { SqdProcessorContext } from '../../../processor';
import { calcPriceNormalized } from '../../../utils/helpers';
import {
  getOldStablepoolAssetVolume,
  getOldStablepoolVolume,
  getPoolAssetPreviousVolumeFromCache,
  getPoolPreviousVolumeFromCache,
} from '../volumes';
import { PoolVolumesCacheManager } from '../volumes/poolVolumesCacheManager';

export async function processStableswapAssetNormalizedVolumes({
  blockNumbersToProcess,
  ctx,
}: {
  blockNumbersToProcess?: number[];
  ctx: SqdProcessorContext<Store>;
}) {
  let stableswapAssetHistVolsByBatchList = Array.from(
    ctx.batchState.state.stablepoolAssetVolumes.values()
  ).sort((a, b) => (a.paraBlockHeight > b.paraBlockHeight ? 1 : -1));

  if (blockNumbersToProcess) {
    const blockNumbersToProcessSet = new Set(blockNumbersToProcess);
    stableswapAssetHistVolsByBatchList =
      stableswapAssetHistVolsByBatchList.filter((i) =>
        blockNumbersToProcessSet.has(i.paraBlockHeight)
      );
  }

  const historicalSpotPricesMap =
    ctx.batchState.state.assetsSpotPriceHistoricalDataBatch;

  for (const currentAssetVolsHistData of stableswapAssetHistVolsByBatchList) {
    const asset = currentAssetVolsHistData.assetId
      ? ctx.batchState.state.assetsAll.get(currentAssetVolsHistData.assetId)
      : null;
    const pool = currentAssetVolsHistData.volumesCollection.pool;

    if (!asset || !pool) {
      console.warn(
        `Asset or Pool data not found for asset ${currentAssetVolsHistData.assetId} or pool ${currentAssetVolsHistData.volumesCollection.pool.id} while processing Stableswap pool volume normalization at para block height ${currentAssetVolsHistData.paraBlockHeight}`
      );
      continue;
    }

    const previousAssetHistVolume =
      (getPoolAssetPreviousVolumeFromCache(
        ctx.batchState.state.stablepoolAssetVolumes,
        `${pool.id}-${asset.id}`,
        currentAssetVolsHistData.paraBlockHeight
      ) as StableswapAssetVolumeHistoricalData | undefined) ||
      (getPoolAssetPreviousVolumeFromCache(
        PoolVolumesCacheManager.getInstance().stablswapAssetVolumesCache,
        `${pool.id}-${asset.id}`,
        currentAssetVolsHistData.paraBlockHeight
      ) as StableswapAssetVolumeHistoricalData | undefined) ||
      (await getOldStablepoolAssetVolume({
        ctx,
        assetId: asset.id,
        poolId: pool.id,
        currentBlockHeight: currentAssetVolsHistData.paraBlockHeight,
      }));

    const previousPoolHistVolume =
      (getPoolPreviousVolumeFromCache(
        ctx.batchState.state.stablepoolVolumeCollections,
        `${pool.id}`,
        currentAssetVolsHistData.paraBlockHeight
      ) as StableswapVolumeHistoricalData | undefined) ||
      (getPoolPreviousVolumeFromCache(
        PoolVolumesCacheManager.getInstance().stablswapVolumesCache,
        `${pool.id}`,
        currentAssetVolsHistData.paraBlockHeight
      ) as StableswapVolumeHistoricalData | undefined) ||
      (await getOldStablepoolVolume({
        ctx,
        poolId: pool.id,
        currentBlockHeight: currentAssetVolsHistData.paraBlockHeight,
      }));

    let assetSpotPriceNorm = historicalSpotPricesMap.get(
      `${asset.id}-${ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID}-${currentAssetVolsHistData.paraBlockHeight}`
    )?.priceNormalised;

    if (asset.id === ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID)
      assetSpotPriceNorm = '1';

    if (!assetSpotPriceNorm || !asset.decimals) {
      continue;
    }

    /**
     * Current block asset volumes
     */
    currentAssetVolsHistData.assetVolInNorm = calcPriceNormalized({
      amount: currentAssetVolsHistData.assetVolIn,
      spotPrice: assetSpotPriceNorm,
      assetDecimals: asset.decimals,
    });

    currentAssetVolsHistData.assetVolOutNorm = calcPriceNormalized({
      amount: currentAssetVolsHistData.assetVolOut,
      spotPrice: assetSpotPriceNorm,
      assetDecimals: asset.decimals,
    });

    currentAssetVolsHistData.assetFeeVolNorm = calcPriceNormalized({
      amount: currentAssetVolsHistData.assetFeeVol,
      spotPrice: assetSpotPriceNorm,
      assetDecimals: asset.decimals,
    });

    /**
     * Total asset volumes
     */

    currentAssetVolsHistData.assetTotalVolInNorm = toFixedTrimmed(
      BigNumber(previousAssetHistVolume?.assetTotalVolInNorm ?? '0').plus(
        currentAssetVolsHistData.assetVolInNorm
      )
    );

    currentAssetVolsHistData.assetTotalVolOutNorm = toFixedTrimmed(
      BigNumber(previousAssetHistVolume?.assetTotalVolOutNorm ?? '0').plus(
        currentAssetVolsHistData.assetVolOutNorm
      )
    );

    currentAssetVolsHistData.assetTotalFeesVolNorm = toFixedTrimmed(
      BigNumber(previousAssetHistVolume?.assetTotalFeesVolNorm ?? '0').plus(
        currentAssetVolsHistData.assetFeeVolNorm
      )
    );

    /**
     * Pool normalized volumes
     */
    const currentPoolVolsHistData =
      ctx.batchState.state.stablepoolVolumeCollections.get(
        currentAssetVolsHistData.volumesCollection.id
      );

    if (currentPoolVolsHistData) {
      /**
       * Current block pool volumes
       */
      currentPoolVolsHistData.poolVolInNorm = toFixedTrimmed(
        BigNumber(currentPoolVolsHistData.poolVolInNorm || '0').plus(
          currentAssetVolsHistData.assetVolInNorm
        )
      );

      currentPoolVolsHistData.poolVolOutNorm = toFixedTrimmed(
        BigNumber(currentPoolVolsHistData.poolVolOutNorm || '0').plus(
          currentAssetVolsHistData.assetVolOutNorm
        )
      );

      currentPoolVolsHistData.poolFeesVolNorm = toFixedTrimmed(
        BigNumber(currentPoolVolsHistData.poolFeesVolNorm || '0').plus(
          currentAssetVolsHistData.assetFeeVolNorm
        )
      );

      /**
       * Total pool volumes
       */

      currentPoolVolsHistData.poolTotalVolInNorm = toFixedTrimmed(
        BigNumber(
          currentPoolVolsHistData.poolTotalVolInNorm === '0'
            ? previousPoolHistVolume?.poolTotalVolInNorm || '0'
            : currentPoolVolsHistData.poolTotalVolInNorm || '0'
        ).plus(currentAssetVolsHistData.assetVolInNorm)
      );

      currentPoolVolsHistData.poolTotalVolOutNorm = toFixedTrimmed(
        BigNumber(
          currentPoolVolsHistData.poolTotalVolOutNorm === '0'
            ? previousPoolHistVolume?.poolTotalVolOutNorm || '0'
            : currentPoolVolsHistData.poolTotalVolOutNorm || '0'
        ).plus(currentAssetVolsHistData.assetVolOutNorm)
      );

      currentPoolVolsHistData.poolTotalFeesVolNorm = toFixedTrimmed(
        BigNumber(
          currentPoolVolsHistData.poolTotalFeesVolNorm === '0'
            ? previousPoolHistVolume?.poolTotalFeesVolNorm || '0'
            : currentPoolVolsHistData.poolTotalFeesVolNorm || '0'
        ).plus(currentAssetVolsHistData.assetFeeVolNorm)
      );

      ctx.batchState.state.stablepoolVolumeCollections.set(
        currentPoolVolsHistData.id,
        currentPoolVolsHistData
      );
    }

    ctx.batchState.state.stablepoolAssetVolumes.set(
      currentAssetVolsHistData.id,
      currentAssetVolsHistData
    );
  }
}

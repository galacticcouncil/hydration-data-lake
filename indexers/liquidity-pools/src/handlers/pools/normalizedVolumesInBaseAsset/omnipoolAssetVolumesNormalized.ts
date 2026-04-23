import { BigNumber, toFixedTrimmed } from '../../../utils/bignumber';
import { Store } from '@subsquid/typeorm-store';

import { OmnipoolAssetVolumeHistoricalData } from '../../../model';
import { SqdProcessorContext } from '../../../processor';
import { calcPriceNormalized } from '../../../utils/helpers';
import {
  getOldOmnipoolAssetVolume,
  getPoolAssetPreviousVolumeFromCache,
} from '../volumes';
import { PoolVolumesCacheManager } from '../volumes/poolVolumesCacheManager';

export async function processOmnipoolAssetNormalizedVolumes({
  blockNumbersToProcess,
  ctx,
}: {
  blockNumbersToProcess?: number[];
  ctx: SqdProcessorContext<Store>;
}) {
  let omnipoolAssetHistVolsByBatchList = Array.from(
    ctx.batchState.state.omnipoolAssetVolumes.values()
  ).sort((a, b) => (a.paraBlockHeight > b.paraBlockHeight ? 1 : -1));

  if (blockNumbersToProcess) {
    const blockNumbersToProcessSet = new Set(blockNumbersToProcess);
    omnipoolAssetHistVolsByBatchList = omnipoolAssetHistVolsByBatchList.filter(
      (i) => blockNumbersToProcessSet.has(i.paraBlockHeight)
    );
  }

  const historicalSpotPricesMap =
    ctx.batchState.state.assetsSpotPriceHistoricalDataBatch;

  for (const currentAssetVolsHistData of omnipoolAssetHistVolsByBatchList) {
    const asset = ctx.batchState.state.assetsAll.get(
      currentAssetVolsHistData.omnipoolAsset.assetId
    );
    if (!asset) {
      console.warn(
        `Asset data not found for asset ${currentAssetVolsHistData.omnipoolAsset.assetId} while processing Omnipool asset Volume normalization at para block height ${currentAssetVolsHistData.paraBlockHeight}`
      );
      continue;
    }
    let assetSpotPriceNorm = historicalSpotPricesMap.get(
      `${asset.id}-${ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID}-${currentAssetVolsHistData.paraBlockHeight}`
    )?.priceNormalised;

    if (asset.id === ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID)
      assetSpotPriceNorm = '1';

    if (!assetSpotPriceNorm || !asset.decimals) continue;

    const previousAssetHistVolume =
      (getPoolAssetPreviousVolumeFromCache(
        ctx.batchState.state.omnipoolAssetVolumes,
        currentAssetVolsHistData.omnipoolAsset.id,
        currentAssetVolsHistData.paraBlockHeight
      ) as OmnipoolAssetVolumeHistoricalData | undefined) ||
      (getPoolAssetPreviousVolumeFromCache(
        PoolVolumesCacheManager.getInstance().omnipoolAssetVolumesCache,
        currentAssetVolsHistData.omnipoolAsset.id,
        currentAssetVolsHistData.paraBlockHeight
      ) as OmnipoolAssetVolumeHistoricalData | undefined) ||
      (await getOldOmnipoolAssetVolume({
        ctx,
        omnipoolAssetId: currentAssetVolsHistData.omnipoolAsset.id,
        currentBlockHeight: currentAssetVolsHistData.paraBlockHeight,
      }));

    currentAssetVolsHistData.assetFeeVolNorm = calcPriceNormalized({
      amount: currentAssetVolsHistData.assetFeeVol,
      spotPrice: assetSpotPriceNorm,
      assetDecimals: asset.decimals,
    });

    currentAssetVolsHistData.assetTotalFeesVolNorm = toFixedTrimmed(
      BigNumber(previousAssetHistVolume?.assetTotalFeesVolNorm ?? '0').plus(
        currentAssetVolsHistData.assetFeeVolNorm
      )
    );

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

    ctx.batchState.state.omnipoolAssetVolumes.set(
      currentAssetVolsHistData.id,
      currentAssetVolsHistData
    );
  }
}

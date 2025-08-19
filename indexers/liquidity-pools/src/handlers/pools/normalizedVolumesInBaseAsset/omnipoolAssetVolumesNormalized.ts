import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { calcPriceNormalized } from '../../../utils/helpers';
import { BigNumber } from '@galacticcouncil/sdk';
import {
  getOldOmnipoolAssetVolume,
  getPoolAssetPreviousVolumeFromCache,
} from '../volumes';
import { OmnipoolAssetVolumeHistoricalData } from '../../../model';

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
    const asset = currentAssetVolsHistData.omnipoolAsset.asset;

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

    currentAssetVolsHistData.assetTotalFeesVolNorm = BigNumber(
      previousAssetHistVolume?.assetTotalFeesVolNorm ?? '0'
    )
      .plus(currentAssetVolsHistData.assetFeeVolNorm)
      .toFixed();

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

    currentAssetVolsHistData.assetTotalVolInNorm = BigNumber(
      previousAssetHistVolume?.assetTotalVolInNorm ?? '0'
    )
      .plus(currentAssetVolsHistData.assetVolInNorm)
      .toFixed();

    currentAssetVolsHistData.assetTotalVolOutNorm = BigNumber(
      previousAssetHistVolume?.assetTotalVolOutNorm ?? '0'
    )
      .plus(currentAssetVolsHistData.assetVolOutNorm)
      .toFixed();

    ctx.batchState.state.omnipoolAssetVolumes.set(
      currentAssetVolsHistData.id,
      currentAssetVolsHistData
    );
  }
}

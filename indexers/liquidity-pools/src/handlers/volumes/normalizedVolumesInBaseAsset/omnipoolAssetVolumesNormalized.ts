import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { calcVolumeNormalized } from './index';

export function processOmnipoolAssetNormalizedVolumes(
  ctx: SqdProcessorContext<Store>
) {
  const omnipoolAssetHistVolsByBatchList = [
    ...ctx.batchState.state.omnipoolAssetVolumes.values(),
  ];
  const historicalSpotPricesMap =
    ctx.batchState.state.assetsSpotPriceHistoricalDataBatch;

  for (const assetVolsHistData of omnipoolAssetHistVolsByBatchList) {
    const asset = assetVolsHistData.omnipoolAsset.asset;

    let assetSpotPriceNorm = historicalSpotPricesMap.get(
      `${asset.id}-${ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID}-${assetVolsHistData.paraBlockHeight}`
    )?.priceNormalised;

    if (asset.id === ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID)
      assetSpotPriceNorm = '1';

    if (!assetSpotPriceNorm || !asset.decimals) continue;

    assetVolsHistData.assetFeeVolNorm = calcVolumeNormalized({
      volume: assetVolsHistData.assetFeeVol,
      spotPrice: assetSpotPriceNorm,
      assetDecimals: asset.decimals,
    });

    assetVolsHistData.assetTotalFeesVolNorm = calcVolumeNormalized({
      volume: assetVolsHistData.assetTotalFeesVol,
      spotPrice: assetSpotPriceNorm,
      assetDecimals: asset.decimals,
    });
    assetVolsHistData.assetVolInNorm = calcVolumeNormalized({
      volume: assetVolsHistData.assetVolIn,
      spotPrice: assetSpotPriceNorm,
      assetDecimals: asset.decimals,
    });
    assetVolsHistData.assetVolOutNorm = calcVolumeNormalized({
      volume: assetVolsHistData.assetVolOut,
      spotPrice: assetSpotPriceNorm,
      assetDecimals: asset.decimals,
    });
    assetVolsHistData.assetTotalVolInNorm = calcVolumeNormalized({
      volume: assetVolsHistData.assetTotalVolIn,
      spotPrice: assetSpotPriceNorm,
      assetDecimals: asset.decimals,
    });
    assetVolsHistData.assetTotalVolOutNorm = calcVolumeNormalized({
      volume: assetVolsHistData.assetTotalVolOut,
      spotPrice: assetSpotPriceNorm,
      assetDecimals: asset.decimals,
    });

    ctx.batchState.state.omnipoolAssetVolumes.set(
      assetVolsHistData.id,
      assetVolsHistData
    );
  }
}

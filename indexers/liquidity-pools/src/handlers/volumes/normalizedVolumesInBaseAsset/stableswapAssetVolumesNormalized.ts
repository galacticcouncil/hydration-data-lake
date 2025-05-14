import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { calcVolumeNormalized } from './index';
import { BigNumber } from '@galacticcouncil/sdk';

export function processStableswapAssetNormalizedVolumes(
  ctx: SqdProcessorContext<Store>
) {
  const stableswapAssetHistVolsByBatchList = [
    ...ctx.batchState.state.stablepoolAssetVolumes.values(),
  ];
  const historicalSpotPricesMap =
    ctx.batchState.state.assetsSpotPriceHistoricalDataBatch;

  for (const assetVolsHistData of stableswapAssetHistVolsByBatchList) {
    const asset = assetVolsHistData.asset;

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

    const poolVolsHistData =
      ctx.batchState.state.stablepoolVolumeCollections.get(
        assetVolsHistData.volumesCollection.id
      );

    console.log('poolVolsHistData');
    console.dir(poolVolsHistData, { depth: null });

    if (poolVolsHistData) {
      poolVolsHistData.poolVolInNorm = BigNumber(
        poolVolsHistData.poolVolInNorm || '0'
      )
        .plus(assetVolsHistData.assetVolInNorm)
        .toFixed();

      poolVolsHistData.poolVolOutNorm = BigNumber(
        poolVolsHistData.poolVolOutNorm || '0'
      )
        .plus(assetVolsHistData.assetVolOutNorm)
        .toFixed();

      poolVolsHistData.poolFeesVolNorm = BigNumber(
        poolVolsHistData.poolFeesVolNorm || '0'
      )
        .plus(assetVolsHistData.assetFeeVolNorm)
        .toFixed();

      poolVolsHistData.poolTotalVolInNorm = BigNumber(
        poolVolsHistData.poolTotalVolInNorm || '0'
      )
        .plus(assetVolsHistData.assetTotalFeesVolNorm)
        .toFixed();

      poolVolsHistData.poolTotalVolOutNorm = BigNumber(
        poolVolsHistData.poolTotalVolOutNorm || '0'
      )
        .plus(assetVolsHistData.assetTotalVolOutNorm)
        .toFixed();

      poolVolsHistData.poolTotalFeesVolNorm = BigNumber(
        poolVolsHistData.poolTotalFeesVolNorm || '0'
      )
        .plus(assetVolsHistData.assetTotalFeesVolNorm)
        .toFixed();

      ctx.batchState.state.stablepoolVolumeCollections.set(
        poolVolsHistData.id,
        poolVolsHistData
      );
    }

    ctx.batchState.state.stablepoolAssetVolumes.set(
      assetVolsHistData.id,
      assetVolsHistData
    );
  }
}

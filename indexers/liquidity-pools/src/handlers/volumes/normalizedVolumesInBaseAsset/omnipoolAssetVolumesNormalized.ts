import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { calcPriceNormalized } from '../../../utils/helpers';

export function processOmnipoolAssetNormalizedVolumes({
  blockNumbersToProcess,
  ctx,
}: {
  blockNumbersToProcess?: number[];
  ctx: SqdProcessorContext<Store>;
}) {
  let omnipoolAssetHistVolsByBatchList = Array.from(
    ctx.batchState.state.omnipoolAssetVolumes.values()
  );

  if (blockNumbersToProcess) {
    const blockNumbersToProcessSet = new Set(blockNumbersToProcess);
    omnipoolAssetHistVolsByBatchList = omnipoolAssetHistVolsByBatchList.filter(
      (i) => blockNumbersToProcessSet.has(i.paraBlockHeight)
    );
  }

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

    assetVolsHistData.assetFeeVolNorm = calcPriceNormalized({
      amount: assetVolsHistData.assetFeeVol,
      spotPrice: assetSpotPriceNorm,
      assetDecimals: asset.decimals,
    });

    assetVolsHistData.assetTotalFeesVolNorm = BigNumber(
      assetVolsHistData.assetTotalFeesVolNorm ?? '0'
    )
      .plus(assetVolsHistData.assetFeeVolNorm)
      .toFixed();

    assetVolsHistData.assetVolInNorm = calcPriceNormalized({
      amount: assetVolsHistData.assetVolIn,
      spotPrice: assetSpotPriceNorm,
      assetDecimals: asset.decimals,
    });
    assetVolsHistData.assetVolOutNorm = calcPriceNormalized({
      amount: assetVolsHistData.assetVolOut,
      spotPrice: assetSpotPriceNorm,
      assetDecimals: asset.decimals,
    });

    assetVolsHistData.assetTotalVolInNorm = BigNumber(
      assetVolsHistData.assetTotalVolInNorm ?? '0'
    )
      .plus(assetVolsHistData.assetVolInNorm)
      .toFixed();

    assetVolsHistData.assetTotalVolOutNorm = BigNumber(
      assetVolsHistData.assetTotalVolOutNorm ?? '0'
    )
      .plus(assetVolsHistData.assetVolOutNorm)
      .toFixed();

    ctx.batchState.state.omnipoolAssetVolumes.set(
      assetVolsHistData.id,
      assetVolsHistData
    );
  }
}

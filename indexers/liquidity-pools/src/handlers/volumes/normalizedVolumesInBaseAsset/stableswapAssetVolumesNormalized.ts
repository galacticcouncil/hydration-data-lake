import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BigNumber } from '@galacticcouncil/sdk';
import { calcPriceNormalized } from '../../../utils/helpers';

export function processStableswapAssetNormalizedVolumes({
  blockNumbersToProcess,
  ctx,
}: {
  blockNumbersToProcess?: number[];
  ctx: SqdProcessorContext<Store>;
}) {
  let stableswapAssetHistVolsByBatchList = Array.from(
    ctx.batchState.state.stablepoolAssetVolumes.values()
  );

  if (blockNumbersToProcess) {
    const blockNumbersToProcessSet = new Set(blockNumbersToProcess);
    stableswapAssetHistVolsByBatchList =
      stableswapAssetHistVolsByBatchList.filter((i) =>
        blockNumbersToProcessSet.has(i.paraBlockHeight)
      );
  }

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

    const poolVolsHistData =
      ctx.batchState.state.stablepoolVolumeCollections.get(
        assetVolsHistData.volumesCollection.id
      );

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
        .plus(assetVolsHistData.assetVolInNorm)
        .toFixed();

      poolVolsHistData.poolTotalVolOutNorm = BigNumber(
        poolVolsHistData.poolTotalVolOutNorm || '0'
      )
        .plus(assetVolsHistData.assetVolOutNorm)
        .toFixed();

      poolVolsHistData.poolTotalFeesVolNorm = BigNumber(
        poolVolsHistData.poolTotalFeesVolNorm || '0'
      )
        .plus(assetVolsHistData.assetFeeVolNorm)
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

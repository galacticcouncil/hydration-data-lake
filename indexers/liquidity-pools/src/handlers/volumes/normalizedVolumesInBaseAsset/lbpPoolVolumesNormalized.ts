import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { fromExponentialToDecimalNotation } from '../../../utils/helpers';

export function processLbpPoolsNormalizedVolumes(
  ctx: SqdProcessorContext<Store>
) {
  const lbpPoolHistVolsByBatchList = [
    ...ctx.batchState.state.lbpPoolVolumes.values(),
  ];
  const historicalSpotPricesMap =
    ctx.batchState.state.assetsSpotPriceHistoricalDataBatch;

  for (const poolVolsHistData of lbpPoolHistVolsByBatchList) {
    const assetA = poolVolsHistData.assetA;
    const assetB = poolVolsHistData.assetB;

    let assetASpotPriceNorm = historicalSpotPricesMap.get(
      `${assetA.id}-${ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID}-${poolVolsHistData.paraBlockHeight}`
    )?.priceNormalised;
    let assetBSpotPriceNorm = historicalSpotPricesMap.get(
      `${assetB.id}-${ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID}-${poolVolsHistData.paraBlockHeight}`
    )?.priceNormalised;

    if (assetA.id === ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID)
      assetASpotPriceNorm = '1';

    if (assetB.id === ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID)
      assetBSpotPriceNorm = '1';

    if (
      !assetASpotPriceNorm ||
      !assetBSpotPriceNorm ||
      !assetA.decimals ||
      !assetB.decimals
    )
      continue;

    poolVolsHistData.assetAVolInNorm = fromExponentialToDecimalNotation(
      poolVolsHistData.assetAVolIn.toString(),
      assetA.decimals
    )
      .multipliedBy(assetASpotPriceNorm)
      .toFixed();
    poolVolsHistData.assetAVolOutNorm = fromExponentialToDecimalNotation(
      poolVolsHistData.assetAVolOut.toString(),
      assetA.decimals
    )
      .multipliedBy(assetASpotPriceNorm)
      .toFixed();
    poolVolsHistData.assetBVolInNorm = fromExponentialToDecimalNotation(
      poolVolsHistData.assetBVolIn.toString(),
      assetB.decimals
    )
      .multipliedBy(assetBSpotPriceNorm)
      .toFixed();
    poolVolsHistData.assetBVolOutNorm = fromExponentialToDecimalNotation(
      poolVolsHistData.assetBVolOut.toString(),
      assetB.decimals
    )
      .multipliedBy(assetBSpotPriceNorm)
      .toFixed();
    poolVolsHistData.assetAFeeVolNorm = fromExponentialToDecimalNotation(
      poolVolsHistData.assetAFeeVol.toString(),
      assetA.decimals
    )
      .multipliedBy(assetASpotPriceNorm)
      .toFixed();
    poolVolsHistData.assetBFeeVolNorm = fromExponentialToDecimalNotation(
      poolVolsHistData.assetBFeeVol.toString(),
      assetB.decimals
    )
      .multipliedBy(assetBSpotPriceNorm)
      .toFixed();

    poolVolsHistData.assetATotalVolInNorm = fromExponentialToDecimalNotation(
      poolVolsHistData.assetATotalVolIn.toString(),
      assetA.decimals
    )
      .multipliedBy(assetASpotPriceNorm)
      .toFixed();
    poolVolsHistData.assetATotalVolOutNorm = fromExponentialToDecimalNotation(
      poolVolsHistData.assetATotalVolOut.toString(),
      assetA.decimals
    )
      .multipliedBy(assetASpotPriceNorm)
      .toFixed();
    poolVolsHistData.assetBTotalVolInNorm = fromExponentialToDecimalNotation(
      poolVolsHistData.assetBTotalVolIn.toString(),
      assetB.decimals
    )
      .multipliedBy(assetBSpotPriceNorm)
      .toFixed();
    poolVolsHistData.assetBTotalVolOutNorm = fromExponentialToDecimalNotation(
      poolVolsHistData.assetBTotalVolOut.toString(),
      assetB.decimals
    )
      .multipliedBy(assetBSpotPriceNorm)
      .toFixed();
    poolVolsHistData.assetAFeesTotalVolNorm = fromExponentialToDecimalNotation(
      poolVolsHistData.assetAFeesTotalVol.toString(),
      assetA.decimals
    )
      .multipliedBy(assetASpotPriceNorm)
      .toFixed();
    poolVolsHistData.assetBFeesTotalVolNorm = fromExponentialToDecimalNotation(
      poolVolsHistData.assetBFeesTotalVol.toString(),
      assetB.decimals
    )
      .multipliedBy(assetBSpotPriceNorm)
      .toFixed();

    ctx.batchState.state.lbpPoolVolumes.set(
      poolVolsHistData.id,
      poolVolsHistData
    );
  }
}

import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { calcPriceNormalized } from '../../../utils/helpers';
import { BigNumber } from '@galacticcouncil/sdk';

export async function processLbpPoolsNormalizedVolumes({
  blockNumbersToProcess,
  ctx,
}: {
  blockNumbersToProcess?: number[];
  ctx: SqdProcessorContext<Store>;
}) {
  let lbpPoolHistVolsByBatchList = Array.from(
    ctx.batchState.state.lbpPoolVolumes.values()
  );

  if (blockNumbersToProcess) {
    const blockNumbersToProcessSet = new Set(blockNumbersToProcess);
    lbpPoolHistVolsByBatchList = lbpPoolHistVolsByBatchList.filter((i) =>
      blockNumbersToProcessSet.has(i.paraBlockHeight)
    );
  }

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

    poolVolsHistData.assetAVolInNorm = calcPriceNormalized({
      amount: poolVolsHistData.assetAVolIn,
      spotPrice: assetASpotPriceNorm,
      assetDecimals: assetA.decimals,
    });

    poolVolsHistData.assetAVolOutNorm = calcPriceNormalized({
      amount: poolVolsHistData.assetAVolOut,
      spotPrice: assetASpotPriceNorm,
      assetDecimals: assetA.decimals,
    });

    poolVolsHistData.assetBVolInNorm = calcPriceNormalized({
      amount: poolVolsHistData.assetBVolIn,
      spotPrice: assetBSpotPriceNorm,
      assetDecimals: assetB.decimals,
    });

    poolVolsHistData.assetBVolOutNorm = calcPriceNormalized({
      amount: poolVolsHistData.assetBVolOut,
      spotPrice: assetBSpotPriceNorm,
      assetDecimals: assetB.decimals,
    });

    poolVolsHistData.assetAFeeVolNorm = calcPriceNormalized({
      amount: poolVolsHistData.assetAFeeVol,
      spotPrice: assetASpotPriceNorm,
      assetDecimals: assetA.decimals,
    });

    poolVolsHistData.assetBFeeVolNorm = calcPriceNormalized({
      amount: poolVolsHistData.assetBFeeVol,
      spotPrice: assetBSpotPriceNorm,
      assetDecimals: assetB.decimals,
    });

    poolVolsHistData.assetATotalVolInNorm = BigNumber(
      poolVolsHistData.assetATotalVolInNorm ?? '0'
    )
      .plus(poolVolsHistData.assetAVolInNorm)
      .toFixed();

    poolVolsHistData.assetATotalVolOutNorm = BigNumber(
      poolVolsHistData.assetATotalVolOutNorm ?? '0'
    )
      .plus(poolVolsHistData.assetAVolOutNorm)
      .toFixed();

    poolVolsHistData.assetBTotalVolInNorm = BigNumber(
      poolVolsHistData.assetBTotalVolInNorm ?? '0'
    )
      .plus(poolVolsHistData.assetBVolInNorm)
      .toFixed();

    poolVolsHistData.assetBTotalVolOutNorm = BigNumber(
      poolVolsHistData.assetBTotalVolOutNorm ?? '0'
    )
      .plus(poolVolsHistData.assetBVolOutNorm)
      .toFixed();

    poolVolsHistData.assetAFeesTotalVolNorm = BigNumber(
      poolVolsHistData.assetAFeesTotalVolNorm ?? '0'
    )
      .plus(poolVolsHistData.assetAFeeVolNorm)
      .toFixed();

    poolVolsHistData.assetBFeesTotalVolNorm = BigNumber(
      poolVolsHistData.assetBFeesTotalVolNorm ?? '0'
    )
      .plus(poolVolsHistData.assetBFeeVolNorm)
      .toFixed();

    ctx.batchState.state.lbpPoolVolumes.set(
      poolVolsHistData.id,
      poolVolsHistData
    );
  }
}

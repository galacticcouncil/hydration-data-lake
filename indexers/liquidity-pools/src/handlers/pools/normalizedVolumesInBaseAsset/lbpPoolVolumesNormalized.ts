import { BigNumber } from '../../../utils/bignumber';
import { Store } from '@subsquid/typeorm-store';

import { SqdProcessorContext } from '../../../processor';
import { calcPriceNormalized } from '../../../utils/helpers';

export async function processLbpPoolsNormalizedVolumes({
  blockNumbersToProcess,
  ctx,
}: {
  blockNumbersToProcess?: number[];
  ctx: SqdProcessorContext<Store>;
}) {
  let lbpPoolHistVolsByBatchList = Array.from(
    ctx.batchState.state.lbpPoolVolumes.values()
  ).sort((a, b) => (a.paraBlockHeight > b.paraBlockHeight ? 1 : -1));

  if (blockNumbersToProcess) {
    const blockNumbersToProcessSet = new Set(blockNumbersToProcess);
    lbpPoolHistVolsByBatchList = lbpPoolHistVolsByBatchList.filter((i) =>
      blockNumbersToProcessSet.has(i.paraBlockHeight)
    );
  }

  const historicalSpotPricesMap =
    ctx.batchState.state.assetsSpotPriceHistoricalDataBatch;

  for (const poolVolsHistData of lbpPoolHistVolsByBatchList) {
    const assetAId = poolVolsHistData.assetAId;
    const assetBId = poolVolsHistData.assetBId;

    // Fetch assets from cache
    const assetA = ctx.batchState.state.assetsAll.get(assetAId);
    const assetB = ctx.batchState.state.assetsAll.get(assetBId);

    if(!assetA || !assetB) {
      console.warn(`Asset data not found for assets ${assetAId} or ${assetBId} while processing LBP pool volumes normalization at para block height ${poolVolsHistData.paraBlockHeight}`);
      continue
    };

    let assetASpotPriceNorm = historicalSpotPricesMap.get(
      `${assetAId}-${ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID}-${poolVolsHistData.paraBlockHeight}`
    )?.priceNormalised;
    let assetBSpotPriceNorm = historicalSpotPricesMap.get(
      `${assetBId}-${ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID}-${poolVolsHistData.paraBlockHeight}`
    )?.priceNormalised;

    if (assetAId === ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID)
      assetASpotPriceNorm = '1';

    if (assetBId === ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID)
      assetBSpotPriceNorm = '1';

    if (
      !assetASpotPriceNorm ||
      !assetBSpotPriceNorm ||
      !assetA?.decimals ||
      !assetB?.decimals
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

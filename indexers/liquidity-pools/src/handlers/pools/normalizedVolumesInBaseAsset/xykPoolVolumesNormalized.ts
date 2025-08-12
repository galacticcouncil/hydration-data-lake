import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { calcPriceNormalized } from '../../../utils/helpers';
import { BigNumber } from '@galacticcouncil/sdk';
import {
  getOldOmnipoolAssetVolume,
  getOldXykVolume,
  getPoolAssetPreviousVolumeFromCache,
  getPreviousVolumeFromCache,
} from '../volumes';
import {
  StableswapAssetVolumeHistoricalData,
  XykpoolVolumeHistoricalData,
} from '../../../model';

export async function processXykPoolsNormalizedVolumes({
  blockNumbersToProcess,
  ctx,
}: {
  blockNumbersToProcess?: number[];
  ctx: SqdProcessorContext<Store>;
}) {
  let xykPoolHistVolsByBatchList = Array.from(
    ctx.batchState.state.xykPoolVolumes.values()
  ).sort((a, b) => (a.paraBlockHeight > b.paraBlockHeight ? 1 : -1));

  if (blockNumbersToProcess) {
    const blockNumbersToProcessSet = new Set(blockNumbersToProcess);
    xykPoolHistVolsByBatchList = xykPoolHistVolsByBatchList.filter((i) =>
      blockNumbersToProcessSet.has(i.paraBlockHeight)
    );
  }

  const historicalSpotPricesMap =
    ctx.batchState.state.assetsSpotPriceHistoricalDataBatch;

  for (const currentPoolVolsHistData of xykPoolHistVolsByBatchList) {
    const assetA = currentPoolVolsHistData.assetA;
    const assetB = currentPoolVolsHistData.assetB;

    let assetASpotPriceNorm = historicalSpotPricesMap.get(
      `${assetA.id}-${ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID}-${currentPoolVolsHistData.paraBlockHeight}`
    )?.priceNormalised;
    let assetBSpotPriceNorm = historicalSpotPricesMap.get(
      `${assetB.id}-${ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID}-${currentPoolVolsHistData.paraBlockHeight}`
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

    const previousPoolHistVolume =
      (getPreviousVolumeFromCache(
        ctx.batchState.state.xykPoolVolumes,
        currentPoolVolsHistData.pool.id,
        currentPoolVolsHistData.paraBlockHeight
      ) as XykpoolVolumeHistoricalData | undefined) ||
      (await getOldXykVolume({
        ctx,
        poolId: currentPoolVolsHistData.pool.id,
        currentBlockHeight: currentPoolVolsHistData.paraBlockHeight,
      }));

    currentPoolVolsHistData.assetAVolInNorm = calcPriceNormalized({
      amount: currentPoolVolsHistData.assetAVolIn,
      spotPrice: assetASpotPriceNorm,
      assetDecimals: assetA.decimals,
    });

    currentPoolVolsHistData.assetAVolOutNorm = calcPriceNormalized({
      amount: currentPoolVolsHistData.assetAVolOut,
      spotPrice: assetASpotPriceNorm,
      assetDecimals: assetA.decimals,
    });

    currentPoolVolsHistData.assetBVolInNorm = calcPriceNormalized({
      amount: currentPoolVolsHistData.assetBVolIn,
      spotPrice: assetBSpotPriceNorm,
      assetDecimals: assetB.decimals,
    });

    currentPoolVolsHistData.assetBVolOutNorm = calcPriceNormalized({
      amount: currentPoolVolsHistData.assetBVolOut,
      spotPrice: assetBSpotPriceNorm,
      assetDecimals: assetB.decimals,
    });

    currentPoolVolsHistData.assetAFeeVolNorm = calcPriceNormalized({
      amount: currentPoolVolsHistData.assetAFeeVol,
      spotPrice: assetASpotPriceNorm,
      assetDecimals: assetA.decimals,
    });

    currentPoolVolsHistData.assetBFeeVolNorm = calcPriceNormalized({
      amount: currentPoolVolsHistData.assetBFeeVol,
      spotPrice: assetBSpotPriceNorm,
      assetDecimals: assetB.decimals,
    });

    currentPoolVolsHistData.assetATotalVolInNorm = BigNumber(
      previousPoolHistVolume?.assetATotalVolInNorm ?? '0'
    )
      .plus(currentPoolVolsHistData.assetAVolInNorm)
      .toFixed();

    currentPoolVolsHistData.assetATotalVolOutNorm = BigNumber(
      previousPoolHistVolume?.assetATotalVolOutNorm ?? '0'
    )
      .plus(currentPoolVolsHistData.assetAVolOutNorm)
      .toFixed();

    currentPoolVolsHistData.assetBTotalVolInNorm = BigNumber(
      previousPoolHistVolume?.assetBTotalVolInNorm ?? '0'
    )
      .plus(currentPoolVolsHistData.assetBVolInNorm)
      .toFixed();

    currentPoolVolsHistData.assetBTotalVolOutNorm = BigNumber(
      previousPoolHistVolume?.assetBTotalVolOutNorm ?? '0'
    )
      .plus(currentPoolVolsHistData.assetBVolOutNorm)
      .toFixed();

    currentPoolVolsHistData.assetAFeesTotalVolNorm = BigNumber(
      previousPoolHistVolume?.assetAFeesTotalVolNorm ?? '0'
    )
      .plus(currentPoolVolsHistData.assetAFeeVolNorm)
      .toFixed();

    currentPoolVolsHistData.assetBFeesTotalVolNorm = BigNumber(
      previousPoolHistVolume?.assetBFeesTotalVolNorm ?? '0'
    )
      .plus(currentPoolVolsHistData.assetBFeeVolNorm)
      .toFixed();

    ctx.batchState.state.xykPoolVolumes.set(
      currentPoolVolsHistData.id,
      currentPoolVolsHistData
    );
  }
}

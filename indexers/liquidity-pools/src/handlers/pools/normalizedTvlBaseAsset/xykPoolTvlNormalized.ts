import { BigNumber } from '@galacticcouncil/sdk';
import { Store } from '@subsquid/typeorm-store';

import { SqdProcessorContext } from '../../../processor';
import { calcPriceNormalized } from '../../../utils/helpers';

export function processXykPoolsNormalizedTvl({
  blockNumbersToProcess,
  ctx,
}: {
  blockNumbersToProcess?: number[];
  ctx: SqdProcessorContext<Store>;
}) {
  let xykPoolHistDataByBatchList = Array.from(
    ctx.batchState.state.xykPoolAllHistoricalData.values()
  );

  if (blockNumbersToProcess) {
    const blockNumbersToProcessSet = new Set(blockNumbersToProcess);
    xykPoolHistDataByBatchList = xykPoolHistDataByBatchList.filter((i) =>
      blockNumbersToProcessSet.has(i.paraBlockHeight)
    );
  }

  const historicalSpotPricesMap =
    ctx.batchState.state.assetsSpotPriceHistoricalDataBatch;

  for (const poolHistData of xykPoolHistDataByBatchList) {
    const assetA = ctx.batchState.state.assetsAll.get(poolHistData.assetAId);
    const assetB = ctx.batchState.state.assetsAll.get(poolHistData.assetBId);

    if(!assetA || !assetB) {
      console.warn(`Asset data not found for assets ${poolHistData.assetAId} or ${poolHistData.assetBId} while processing XYK pool TVL normalization at para block height ${poolHistData.paraBlockHeight}`);
      continue;
    }

    let assetASpotPriceNorm = historicalSpotPricesMap.get(
      `${assetA.id}-${ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID}-${poolHistData.paraBlockHeight}`
    )?.priceNormalised;
    let assetBSpotPriceNorm = historicalSpotPricesMap.get(
      `${assetB.id}-${ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID}-${poolHistData.paraBlockHeight}`
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

    // TODO can be simplified - oneAssetTvl.multiplyBy(2) because XYK pool is always balanced
    poolHistData.tvlInRefAssetNorm = BigNumber(
      calcPriceNormalized({
        amount: poolHistData.assetABalance,
        assetDecimals: assetA.decimals,
        spotPrice: assetASpotPriceNorm,
      })
    )
      .plus(
        calcPriceNormalized({
          amount: poolHistData.assetBBalance,
          assetDecimals: assetB.decimals,
          spotPrice: assetBSpotPriceNorm,
        })
      )
      .toFixed();

    ctx.batchState.state.xykPoolAllHistoricalData.set(
      poolHistData.id,
      poolHistData
    );
  }
}

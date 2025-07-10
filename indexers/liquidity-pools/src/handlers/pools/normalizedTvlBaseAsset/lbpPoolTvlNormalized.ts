import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { calcPriceNormalized } from '../../../utils/helpers';
import { BigNumber } from '@galacticcouncil/sdk';

export function processLbppoolsNormalizedTvl({
  blockNumbersToProcess,
  ctx,
}: {
  blockNumbersToProcess?: number[];
  ctx: SqdProcessorContext<Store>;
}) {
  let histDataByBatchList = Array.from(
    ctx.batchState.state.lbpPoolAllHistoricalData.values()
  );

  if (blockNumbersToProcess) {
    const blockNumbersToProcessSet = new Set(blockNumbersToProcess);
    histDataByBatchList = histDataByBatchList.filter((i) =>
      blockNumbersToProcessSet.has(i.paraBlockHeight)
    );
  }

  const historicalSpotPricesMap =
    ctx.batchState.state.assetsSpotPriceHistoricalDataBatch;

  for (const poolHistData of histDataByBatchList) {
    const assetA = poolHistData.assetA;
    const assetB = poolHistData.assetB;

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

    ctx.batchState.state.lbpPoolAllHistoricalData.set(
      poolHistData.id,
      poolHistData
    );
  }
}

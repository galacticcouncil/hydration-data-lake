import { BigNumber } from '@galacticcouncil/sdk';
import { Store } from '@subsquid/typeorm-store';

import { SqdProcessorContext } from '../../../processor';
import { calcPriceNormalized } from '../../../utils/helpers';

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
    const assetAId = poolHistData.assetAId;
    const assetBId = poolHistData.assetBId;

    // Fetch assets from cache
    const assetA = ctx.batchState.state.assetsAll.get(assetAId);
    const assetB = ctx.batchState.state.assetsAll.get(assetBId);

    if(!assetA || !assetB) {
      console.warn(`Asset data not found for assets ${assetAId} or ${assetBId} while processing LBP pool TVL normalization at para block height ${poolHistData.paraBlockHeight}`);
      continue;
    }

    let assetASpotPriceNorm = historicalSpotPricesMap.get(
      `${assetAId}-${ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID}-${poolHistData.paraBlockHeight}`
    )?.priceNormalised;
    let assetBSpotPriceNorm = historicalSpotPricesMap.get(
      `${assetBId}-${ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID}-${poolHistData.paraBlockHeight}`
    )?.priceNormalised;

    if (assetAId === ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID)
      assetASpotPriceNorm = '1';

    if (assetBId === ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID)
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

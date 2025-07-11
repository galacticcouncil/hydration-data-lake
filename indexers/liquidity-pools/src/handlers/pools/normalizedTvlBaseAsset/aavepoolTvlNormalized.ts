import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { calcPriceNormalized } from '../../../utils/helpers';
import { BigNumber } from '@galacticcouncil/sdk';

export function processAavepoolsNormalizedTvl({
  blockNumbersToProcess,
  ctx,
}: {
  blockNumbersToProcess?: number[];
  ctx: SqdProcessorContext<Store>;
}) {
  let aaveoolHistDataByBatchList = Array.from(
    ctx.batchState.state.aavePoolsHistoricalData.values()
  );

  if (blockNumbersToProcess) {
    const blockNumbersToProcessSet = new Set(blockNumbersToProcess);
    aaveoolHistDataByBatchList = aaveoolHistDataByBatchList.filter((i) =>
      blockNumbersToProcessSet.has(i.paraBlockHeight)
    );
  }

  const historicalSpotPricesMap =
    ctx.batchState.state.assetsSpotPriceHistoricalDataBatch;

  for (const poolHistData of aaveoolHistDataByBatchList) {
    const reserveAsset = poolHistData.pool.reserveAsset;

    let assetSpotPriceNorm = historicalSpotPricesMap.get(
      `${reserveAsset.id}-${ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID}-${poolHistData.paraBlockHeight}`
    )?.priceNormalised;

    if (reserveAsset.id === ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID)
      assetSpotPriceNorm = '1';

    if (!assetSpotPriceNorm || !reserveAsset.decimals) continue;

    poolHistData.tvlInRefAssetNorm = BigNumber(
      calcPriceNormalized({
        amount: poolHistData.liquidityIn,
        assetDecimals: reserveAsset.decimals,
        spotPrice: assetSpotPriceNorm,
      })
    ).toFixed();

    ctx.batchState.state.aavePoolsHistoricalData.set(
      poolHistData.id,
      poolHistData
    );
  }
}

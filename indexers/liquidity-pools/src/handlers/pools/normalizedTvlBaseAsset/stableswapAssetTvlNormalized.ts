import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { calcPriceNormalized } from '../../../utils/helpers';
import { BigNumber } from '@galacticcouncil/sdk';

export function processStableswapNormalizedTvl({
  blockNumbersToProcess,
  ctx,
}: {
  blockNumbersToProcess?: number[];
  ctx: SqdProcessorContext<Store>;
}) {
  let assetsHistDataByBatchList = Array.from(
    ctx.batchState.state.stablepoolAssetsAllHistoricalData.values()
  );

  const poolsHistDataMap = new Map(
    assetsHistDataByBatchList.map((histDate) => [
      histDate.poolHistoricalData.id,
      histDate.poolHistoricalData,
    ])
  );

  if (blockNumbersToProcess) {
    const blockNumbersToProcessSet = new Set(blockNumbersToProcess);
    assetsHistDataByBatchList = assetsHistDataByBatchList.filter((i) =>
      blockNumbersToProcessSet.has(i.paraBlockHeight)
    );
  }

  const historicalSpotPricesMap =
    ctx.batchState.state.assetsSpotPriceHistoricalDataBatch;

  for (const assetHistData of assetsHistDataByBatchList) {
    const asset = assetHistData.asset;

    let assetSpotPriceNorm = historicalSpotPricesMap.get(
      `${asset.id}-${ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID}-${assetHistData.paraBlockHeight}`
    )?.priceNormalised;

    if (asset.id === ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID)
      assetSpotPriceNorm = '1';

    if (!assetSpotPriceNorm || !asset.decimals) {
      // console.log(
      //   `${asset.assetRegistryId} has no spot price or decimals. Skipping.`
      // );
      continue;
    }

    assetHistData.tvlInRefAssetNorm = BigNumber(
      calcPriceNormalized({
        amount: assetHistData.freeBalance,
        assetDecimals: asset.decimals,
        spotPrice: assetSpotPriceNorm,
      })
    ).toFixed();

    const poolHistData = poolsHistDataMap.get(
      assetHistData.poolHistoricalData.id
    );

    if (poolHistData) {
      poolHistData.tvlTotalInRefAssetNorm =
        BigNumber(poolHistData.tvlTotalInRefAssetNorm || '0')
          .plus(assetHistData.tvlInRefAssetNorm)
          .toFixed() || '0';

      poolsHistDataMap.set(poolHistData.id, poolHistData);
      ctx.batchState.state.stablepoolAllHistoricalData.set(
        poolHistData.id,
        poolHistData
      );
    }

    ctx.batchState.state.stablepoolAssetsAllHistoricalData.set(
      assetHistData.id,
      assetHistData
    );
  }
}

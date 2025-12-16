import { BigNumber } from '@galacticcouncil/sdk';
import { Store } from '@subsquid/typeorm-store';

import { SqdProcessorContext } from '../../../processor';
import { calcPriceNormalized } from '../../../utils/helpers';

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

  // Build a map of pool historical data from the batch state
  const poolsHistDataMap = new Map(
    Array.from(ctx.batchState.state.stablepoolAllHistoricalData.values()).map(
      (poolHistData) => [poolHistData.id, poolHistData]
    )
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
    const asset = assetHistData.assetId ? ctx.batchState.state.assetsAll.get(assetHistData.assetId) : null;

    if(!asset) {
      console.warn(`Asset data not found for asset ${assetHistData.assetId} while processing Stableswap pool TVL normalization at para block height ${assetHistData.paraBlockHeight}`);
      continue;
    }

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

    // Extract poolId from asset historical data ID format: <poolId>-<assetId>-<blockHeight>
    const poolId = assetHistData.id.split('-')[0];
    const poolHistDataId = `${poolId}-${assetHistData.paraBlockHeight}`;
    const poolHistData = poolsHistDataMap.get(poolHistDataId);

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

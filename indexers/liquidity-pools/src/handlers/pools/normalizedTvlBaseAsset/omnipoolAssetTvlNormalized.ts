import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { calcPriceNormalized } from '../../../utils/helpers';
import { BigNumber } from '@galacticcouncil/sdk';

export function processOmnipoolNormalizedTvl({
  blockNumbersToProcess,
  ctx,
}: {
  blockNumbersToProcess?: number[];
  ctx: SqdProcessorContext<Store>;
}) {
  let assetsHistDataByBatchList = Array.from(
    ctx.batchState.state.omnipoolAssetAllHistoricalData.values()
  );
  const poolHistDataMap = new Map(
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

    if (!assetSpotPriceNorm || !asset.decimals) continue;

    assetHistData.tvlInRefAssetNorm = BigNumber(
      calcPriceNormalized({
        amount: assetHistData.freeBalance,
        assetDecimals: asset.decimals,
        spotPrice: assetSpotPriceNorm,
      })
    ).toFixed();

    const poolHistData = poolHistDataMap.get(
      assetHistData.poolHistoricalData.id
    );

    if (poolHistData) {
      poolHistData.tvlTotalInRefAssetNorm =
        BigNumber(poolHistData.tvlTotalInRefAssetNorm || '0')
          .plus(assetHistData.tvlInRefAssetNorm)
          .toFixed() || '0';

      poolHistDataMap.set(poolHistData.id, poolHistData);
      ctx.batchState.state.omnipoolAllHistoricalData.set(
        poolHistData.id,
        poolHistData
      );
    }

    ctx.batchState.state.omnipoolAssetAllHistoricalData.set(
      assetHistData.id,
      assetHistData
    );
  }
}

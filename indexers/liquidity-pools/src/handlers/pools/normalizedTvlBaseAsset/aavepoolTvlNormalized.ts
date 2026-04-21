import { BigNumber } from '../../../utils/bignumber';
import { Store } from '@subsquid/typeorm-store';

import { SqdProcessorContext } from '../../../processor';
import { calcPriceNormalized } from '../../../utils/helpers';
import { getOrCreateAsset } from '../../assets/asset';

export async function processAavepoolsNormalizedTvl({
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
    const reserveAsset = poolHistData.pool.reserveAssetId
      ? await getOrCreateAsset({
          assetRegistryId: poolHistData.pool.reserveAssetId,
          blockHeader: undefined,
          ctx,
          ensure: true,
        })
      : null;

    if (!reserveAsset) {
      console.log(
        `Reserve asset not found for Aavepool ${poolHistData.pool.id}`
      );
      continue;
    }

    let assetSpotPriceNorm = historicalSpotPricesMap.get(
      `${reserveAsset.id}-${ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID}-${poolHistData.paraBlockHeight}`
    )?.priceNormalised;

    if (reserveAsset.id === ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID)
      assetSpotPriceNorm = '1';

    if (!assetSpotPriceNorm) {
      console.log(
        `Spot price for asset ${reserveAsset.id} not found. Skipping.`
      );
      continue;
    }

    if (!reserveAsset.decimals) {
      console.log(
        `Reserve asset decimals not found for asset ${reserveAsset.id}. Skipping.`
      );
      continue;
    }

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

import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { calcPriceNormalized } from '../../../utils/helpers';
import { BigNumber } from '@galacticcouncil/sdk';
import { HsmpoolAssetHistoricalData } from '../../../model';
import { getOldHsmAssetHistDataEntity } from '../pools/hsmpool/hsmpoolAssetHistData';

export async function processHsmpoolAssetNormalizedVolumes({
  blockNumbersToProcess,
  ctx,
}: {
  blockNumbersToProcess?: number[];
  ctx: SqdProcessorContext<Store>;
}) {
  let hsmpoolAssetHistDataByBatchList = Array.from(
    ctx.batchState.state.hsmpoolAssetHistData.values()
  ).sort((a, b) => (a.paraBlockHeight > b.paraBlockHeight ? 1 : -1));

  if (blockNumbersToProcess) {
    const blockNumbersToProcessSet = new Set(blockNumbersToProcess);
    hsmpoolAssetHistDataByBatchList = hsmpoolAssetHistDataByBatchList.filter(
      (i) => blockNumbersToProcessSet.has(i.paraBlockHeight)
    );
  }

  const historicalSpotPricesMap =
    ctx.batchState.state.assetsSpotPriceHistoricalDataBatch;

  for (const currentAssetHistData of hsmpoolAssetHistDataByBatchList) {
    const asset = currentAssetHistData.asset;

    let assetSpotPriceNorm = historicalSpotPricesMap.get(
      `${asset.id}-${ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID}-${currentAssetHistData.paraBlockHeight}`
    )?.priceNormalised;

    if (asset.id === ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID)
      assetSpotPriceNorm = '1';

    if (!assetSpotPriceNorm || !asset.decimals) continue;

    const previousAssetHistData =
      (ctx.batchState.getPreviousHistDataEntity({
        entitiesMap: ctx.batchState.state.hsmpoolAssetHistData,
        entityId: asset.id,
        currentBlockHeight: currentAssetHistData.paraBlockHeight,
        blockHeightValPosition: 1,
      }) as HsmpoolAssetHistoricalData | undefined) ||
      (await getOldHsmAssetHistDataEntity({
        ctx,
        assetId: asset.id,
        currentBlockHeight: currentAssetHistData.paraBlockHeight,
      }));

    currentAssetHistData.assetFeeVolNorm = calcPriceNormalized({
      amount: currentAssetHistData.assetFeeVol,
      spotPrice: assetSpotPriceNorm,
      assetDecimals: asset.decimals,
    });

    currentAssetHistData.assetTotalFeesVolNorm = BigNumber(
      previousAssetHistData?.assetTotalFeesVolNorm ?? '0'
    )
      .plus(currentAssetHistData.assetFeeVolNorm)
      .toFixed();

    currentAssetHistData.assetVolInNorm = calcPriceNormalized({
      amount: currentAssetHistData.assetVolIn,
      spotPrice: assetSpotPriceNorm,
      assetDecimals: asset.decimals,
    });
    currentAssetHistData.assetVolOutNorm = calcPriceNormalized({
      amount: currentAssetHistData.assetVolOut,
      spotPrice: assetSpotPriceNorm,
      assetDecimals: asset.decimals,
    });

    currentAssetHistData.assetTotalVolInNorm = BigNumber(
      previousAssetHistData?.assetTotalVolInNorm ?? '0'
    )
      .plus(currentAssetHistData.assetVolInNorm)
      .toFixed();

    currentAssetHistData.assetTotalVolOutNorm = BigNumber(
      previousAssetHistData?.assetTotalVolOutNorm ?? '0'
    )
      .plus(currentAssetHistData.assetVolOutNorm)
      .toFixed();

    ctx.batchState.state.hsmpoolAssetHistData.set(
      currentAssetHistData.id,
      currentAssetHistData
    );
  }
}

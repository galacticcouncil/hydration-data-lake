import { BigNumber } from '@galacticcouncil/sdk';
import { Store } from '@subsquid/typeorm-store';

import { HsmpoolAssetHistoricalData } from '../../../model';
import { SqdProcessorContext } from '../../../processor';
import { calcPriceNormalized } from '../../../utils/helpers';
import { getOrCreateAsset } from '../../assets/asset';
import { getOldHsmAssetHistDataEntity } from '../pools/hsmpool/hsmpoolAssetHistData';
import { PoolVolumesCacheManager } from '../volumes/poolVolumesCacheManager';

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
    const assetId = currentAssetHistData.assetId;
    const asset = assetId ? await getOrCreateAsset({ ctx, id: assetId }) : null;
    if (!asset) {
      console.log(
        `processHsmpoolAssetNormalizedVolumes :: Asset with id ${assetId} cannot be found.`
      );
      continue;
    }
    const decimals = asset.decimals;

    let assetSpotPriceNorm = historicalSpotPricesMap.get(
      `${assetId}-${ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID}-${currentAssetHistData.paraBlockHeight}`
    )?.priceNormalised;

    if (assetId === ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID)
      assetSpotPriceNorm = '1';

    if (!assetSpotPriceNorm || !decimals) continue;

    const previousAssetHistData =
      (ctx.batchState.getPreviousHistDataEntity({
        entitiesMap: ctx.batchState.state.hsmpoolAssetHistData,
        entityId: assetId,
        currentBlockHeight: currentAssetHistData.paraBlockHeight,
        blockHeightValPosition: 1,
      }) as HsmpoolAssetHistoricalData | undefined) ||
      (ctx.batchState.getPreviousHistDataEntity({
        entitiesMap:
          PoolVolumesCacheManager.getInstance().hsmpoolAssetHistoricalDataCache,
        entityId: assetId,
        currentBlockHeight: currentAssetHistData.paraBlockHeight,
        blockHeightValPosition: 1,
      }) as HsmpoolAssetHistoricalData | undefined) ||
      (await getOldHsmAssetHistDataEntity({
        ctx,
        assetId: assetId,
        currentBlockHeight: currentAssetHistData.paraBlockHeight,
      }));

    currentAssetHistData.assetFeeVolNorm = calcPriceNormalized({
      amount: currentAssetHistData.assetFeeVol,
      spotPrice: assetSpotPriceNorm,
      assetDecimals: decimals,
    });

    currentAssetHistData.assetTotalFeesVolNorm = BigNumber(
      previousAssetHistData?.assetTotalFeesVolNorm ?? '0'
    )
      .plus(currentAssetHistData.assetFeeVolNorm)
      .toFixed();

    currentAssetHistData.assetVolInNorm = calcPriceNormalized({
      amount: currentAssetHistData.assetVolIn,
      spotPrice: assetSpotPriceNorm,
      assetDecimals: decimals,
    });
    currentAssetHistData.assetVolOutNorm = calcPriceNormalized({
      amount: currentAssetHistData.assetVolOut,
      spotPrice: assetSpotPriceNorm,
      assetDecimals: decimals,
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

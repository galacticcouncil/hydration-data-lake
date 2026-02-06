import { LessThan } from 'typeorm';

import { BigNumber } from '@galacticcouncil/sdk';
import { Store } from '@subsquid/typeorm-store';

import { AssetVolumeHistoricalData } from '../../model';
import { SqdProcessorContext } from '../../processor';
import { calcPriceNormalized } from '../../utils/helpers';
import { LatestProcessedDataCacheManager } from '../../utils/latestProcessedDataCacheManager';
import { getClosestSpotPrice } from './assetHistoricalData/assetSpotPrices';

export async function handleAssetVolumeUpdates(
  ctx: SqdProcessorContext<Store>,
  swapDetails: {
    paraBlockHeight: number;
    assetInId: string;
    assetOutId: string;
    assetInAmount: bigint;
    assetOutAmount: bigint;
  }
) {
  const assetVolumesState = ctx.batchState.state.assetVolumes;

  // Find current block volume
  const currentAssetInVolume = assetVolumesState.get(
    swapDetails.assetInId + '-' + swapDetails.paraBlockHeight
  );
  const currentAssetOutVolume = assetVolumesState.get(
    swapDetails.assetOutId + '-' + swapDetails.paraBlockHeight
  );

  // If not found find last volume in cache

  const cachedPrevVolumeIn = ctx.batchState.getPreviousHistDataEntity({
    entitiesMap: ctx.batchState.state.assetVolumes,
    entityId: swapDetails.assetInId,
    currentBlockHeight: swapDetails.paraBlockHeight,
    blockHeightValPosition: 1,
  });

  const cachedPrevVolumeOut = ctx.batchState.getPreviousHistDataEntity({
    entitiesMap: ctx.batchState.state.assetVolumes,
    entityId: swapDetails.assetOutId,
    currentBlockHeight: swapDetails.paraBlockHeight,
    blockHeightValPosition: 1,
  });

  // Last known volume for total volume
  const oldAssetInVolume =
    cachedPrevVolumeIn ||
    (await getOldAssetVolume({
      ctx,
      assetId: swapDetails.assetInId,
      currentBlockHeight: swapDetails.paraBlockHeight,
    })) ||
    currentAssetInVolume;

  // Last known volume for total volume
  const oldAssetOutVolume =
    cachedPrevVolumeOut ||
    (await getOldAssetVolume({
      ctx,
      assetId: swapDetails.assetOutId,
      currentBlockHeight: swapDetails.paraBlockHeight,
    })) ||
    currentAssetOutVolume;

  const blockEntity = ctx.batchState.getParaBlockFromCacheByHeight(
    swapDetails.paraBlockHeight
  );

  if (!blockEntity)
    throw Error(`No block found with height ${swapDetails.paraBlockHeight}`);

  // Create new entry
  const assetInVolume =
    currentAssetInVolume ??
    new AssetVolumeHistoricalData({
      id: swapDetails.assetInId + '-' + swapDetails.paraBlockHeight,
      assetId: swapDetails.assetInId,
      volumeIn: BigInt(0),
      volumeOut: BigInt(0),
      totalVolumeIn: oldAssetInVolume?.totalVolumeIn || BigInt(0),
      totalVolumeOut: oldAssetInVolume?.totalVolumeOut || BigInt(0),
      volumeInNorm: '0',
      volumeOutNorm: '0',
      totalVolumeInNorm: '0',
      totalVolumeOutNorm: '0',
      paraBlockHeight: swapDetails.paraBlockHeight,
    });

  const assetOutVolume =
    currentAssetOutVolume ??
    new AssetVolumeHistoricalData({
      id: swapDetails.assetOutId + '-' + swapDetails.paraBlockHeight,
      assetId: swapDetails.assetOutId,
      volumeIn: BigInt(0),
      volumeOut: BigInt(0),
      volumeInNorm: '0',
      volumeOutNorm: '0',
      totalVolumeInNorm: '0',
      totalVolumeOutNorm: '0',
      totalVolumeIn: oldAssetOutVolume?.totalVolumeIn || BigInt(0),
      totalVolumeOut: oldAssetOutVolume?.totalVolumeOut || BigInt(0),
      paraBlockHeight: swapDetails.paraBlockHeight,
    });

  // Update new entry
  assetInVolume.volumeIn += swapDetails.assetInAmount;
  assetInVolume.totalVolumeIn += swapDetails.assetInAmount;

  assetOutVolume.volumeOut += swapDetails.assetOutAmount;
  assetOutVolume.totalVolumeOut += swapDetails.assetOutAmount;

  assetVolumesState.set(assetInVolume.id, assetInVolume);
  assetVolumesState.set(assetOutVolume.id, assetOutVolume);
}

export async function processAssetNormalizedVolumes({
  blockNumbersToProcess,
  ctx,
}: {
  blockNumbersToProcess?: number[];
  ctx: SqdProcessorContext<Store>;
}) {
  /**
   * Sorting assetVolume entities is required here to ensure correct processing
   * order and valid results.
   */
  let assetVolsByBatchList = Array.from(
    ctx.batchState.state.assetVolumes.values()
  ).sort((a, b) => (a.paraBlockHeight > b.paraBlockHeight ? 1 : -1));

  if (blockNumbersToProcess) {
    const blockNumbersToProcessSet = new Set(blockNumbersToProcess);
    assetVolsByBatchList = assetVolsByBatchList.filter((i) =>
      blockNumbersToProcessSet.has(i.paraBlockHeight)
    );
  }

  await ensureAssetSpotPricesForAssetVolumes({
    volumes: assetVolsByBatchList,
    ctx,
  });

  for (const currentAssetVolHistData of assetVolsByBatchList) {
    const asset = ctx.batchState.state.assetsAll.get(
      currentAssetVolHistData.assetId
    );

    if (!asset)
      throw Error(
        `Asset with ID ${currentAssetVolHistData.assetId} cannot be found.`
      );

    let assetSpotPriceNorm;

    if (asset.id === ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID) {
      assetSpotPriceNorm = '1';
    } else {
      assetSpotPriceNorm =
        ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.get(
          `${asset.id}-${ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID}-${currentAssetVolHistData.paraBlockHeight}`
        )?.priceNormalised;

      if (!assetSpotPriceNorm) {
        assetSpotPriceNorm = getClosestSpotPrice({
          assetInId: currentAssetVolHistData.assetId,
          ctx,
          currenParaBlockHeight: currentAssetVolHistData.paraBlockHeight,
        })?.priceNormalised;
      }
    }

    if (!assetSpotPriceNorm || !asset.decimals) {
      console.log(
        `processAssetNormalizedVolumes :: no price : skipping asset ${asset.id}`
      );
      continue;
    }

    const previousAssetVolume =
      ctx.batchState.getPreviousHistDataEntity({
        entitiesMap: ctx.batchState.state.assetVolumes,
        entityId: asset.id,
        currentBlockHeight: currentAssetVolHistData.paraBlockHeight,
        blockHeightValPosition: 1,
      }) ||
      (await getOldAssetVolume({
        ctx,
        assetId: asset.id,
        currentBlockHeight: currentAssetVolHistData.paraBlockHeight,
      }));

    currentAssetVolHistData.volumeInNorm = calcPriceNormalized({
      amount: currentAssetVolHistData.volumeIn,
      spotPrice: assetSpotPriceNorm,
      assetDecimals: asset.decimals,
    });

    currentAssetVolHistData.volumeOutNorm = calcPriceNormalized({
      amount: currentAssetVolHistData.volumeOut,
      spotPrice: assetSpotPriceNorm,
      assetDecimals: asset.decimals,
    });

    currentAssetVolHistData.totalVolumeInNorm = BigNumber(
      previousAssetVolume?.totalVolumeInNorm ?? '0'
    )
      .plus(currentAssetVolHistData.volumeInNorm)
      .toFixed();

    currentAssetVolHistData.totalVolumeOutNorm = BigNumber(
      previousAssetVolume?.totalVolumeOutNorm ?? '0'
    )
      .plus(currentAssetVolHistData.volumeOutNorm)
      .toFixed();

    ctx.batchState.state.assetVolumes.set(
      currentAssetVolHistData.id,
      currentAssetVolHistData
    );
  }

  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.assetVolumes.values())
  );
}

async function ensureAssetSpotPricesForAssetVolumes({
  volumes,
  ctx,
}: {
  volumes: AssetVolumeHistoricalData[];
  ctx: SqdProcessorContext<Store>;
}) {
  const assetsWithNoCachedSpotPrice: Map<number, Set<string>> = new Map();

  for (const currentAssetVolHistData of volumes) {
    if (
      ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.has(
        `${currentAssetVolHistData.assetId}-${ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID}-${currentAssetVolHistData.paraBlockHeight}`
      )
    )
      continue;

    const prevPrice = getClosestSpotPrice({
      assetInId: currentAssetVolHistData.assetId,
      ctx,
      currenParaBlockHeight: currentAssetVolHistData.paraBlockHeight,
    });

    if (!!prevPrice) continue;

    if (
      !assetsWithNoCachedSpotPrice.has(currentAssetVolHistData.paraBlockHeight)
    )
      assetsWithNoCachedSpotPrice.set(
        currentAssetVolHistData.paraBlockHeight,
        new Set()
      );
    assetsWithNoCachedSpotPrice
      .get(currentAssetVolHistData.paraBlockHeight)
      ?.add(currentAssetVolHistData.assetId);
  }

  /**
   * If cache doesn't contain spot prices for some assets, we need to fetch
   * latest one from the database. This should not happen in normal processing
   * flow but actual for reaggregation processes when spot price is not calculated
   * in current processing batch.
   */
  console.time(
    `processAssetNormalizedVolumes :: fetchLatestAssetSpotPriceHistDataBatch`
  );
  if (assetsWithNoCachedSpotPrice.size > 0) {
    for (const [
      blockNumber,
      assetIds,
    ] of assetsWithNoCachedSpotPrice.entries()) {
      const latestPrices =
        await LatestProcessedDataCacheManager.getInstance().fetchLatestAssetSpotPriceHistDataBatch(
          Array.from(assetIds.values()),
          blockNumber,
          ctx
        );

      if (!latestPrices || latestPrices.length === 0) continue;

      for (const p of latestPrices)
        ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.set(p.id, p);
    }
  }
  console.timeEnd(
    `processAssetNormalizedVolumes :: fetchLatestAssetSpotPriceHistDataBatch`
  );
}

export function getLastAssetVolumeFromCache(
  volume: Map<string, AssetVolumeHistoricalData>,
  assetId: string
) {
  return volume.get(
    Array.from(volume.keys())
      .filter((k) => {
        return k.startsWith(assetId + '-');
      })
      .sort((a, b) => {
        return parseInt(b.split('-')[1]) - parseInt(a.split('-')[1]);
      })[0]
  );
}

export async function getOldAssetVolume({
  ctx,
  assetId,
  currentBlockHeight,
}: {
  ctx: SqdProcessorContext<Store>;
  assetId: string;
  currentBlockHeight?: number;
}) {
  return await ctx.storeUtils.findOneWithLogs(
    AssetVolumeHistoricalData,
    {
      where: {
        assetId,
        ...(currentBlockHeight
          ? { paraBlockHeight: LessThan(currentBlockHeight) }
          : {}),
      },
      order: {
        paraBlockHeight: 'DESC',
      },
    },
    { className: 'XykpoolVolumeHistoricalData' }
  );
}

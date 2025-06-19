import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { AssetHistoricalData } from '../../model';
import pMap from 'p-map';
import { LessThan } from 'typeorm';
import { LatestProcessedDataCacheManager } from '../../utils/latestProcessedDataCacheManager';

export async function getAssetHistDataWithUniqueData(
  src: Map<string, AssetHistoricalData>,
  ctx: ProcessorContext<Store>
) {
  const result: Map<string, AssetHistoricalData> = new Map();

  const assetHistoryIndexByAsset = new Map<string, AssetHistoricalData[]>();

  for (const i of (
    src || ctx.batchState.state.assetHistoricalDataItems
  ).values()) {
    if (!assetHistoryIndexByAsset.has(i.asset.id)) {
      assetHistoryIndexByAsset.set(i.asset.id, []);
    }
    assetHistoryIndexByAsset.get(i.asset.id)!.push(i);
  }

  for (const [assetId, list] of assetHistoryIndexByAsset.entries()) {
    const listToSort = list;
    const latestCachedItem =
      LatestProcessedDataCacheManager.getInstance().getLastAssetHistoricalDataItem(
        assetId
      );
    if (latestCachedItem) listToSort.push(latestCachedItem);

    const orderedList = listToSort.sort(
      (a, b) => b.paraBlockHeight - a.paraBlockHeight
    );
    assetHistoryIndexByAsset.set(assetId, orderedList);
  }

  await pMap(
    Array.from(src.values()),
    async (item) => {
      if (
        await isAssetHistoricalDataUniqueRegardingPreviousRecord({
          currentRecord: item,
          cachedIndexedRecords: assetHistoryIndexByAsset,
          ctx,
        })
      ) {
        result.set(item.id, item);
      }
    },
    { concurrency: ctx.appConfig.ASYNC_OPERATIONS_CONCURRENCY_COMMON }
  );

  return result;
}

export async function isAssetHistoricalDataUniqueRegardingPreviousRecord({
  currentRecord,
  cachedIndexedRecords,
  ctx,
}: {
  currentRecord: AssetHistoricalData;
  cachedIndexedRecords: Map<string, AssetHistoricalData[]>;
  ctx: ProcessorContext<Store>;
}) {
  let previousItem = (
    cachedIndexedRecords.get(currentRecord.asset.id) || []
  ).find((i) => i.paraBlockHeight < currentRecord.paraBlockHeight);

  if (!previousItem) {
    previousItem = await ctx.store.findOne(AssetHistoricalData, {
      where: {
        asset: {
          id: currentRecord.asset.id,
        },
        paraBlockHeight: LessThan(currentRecord.paraBlockHeight),
      },
      order: {
        paraBlockHeight: 'DESC',
      },
    });
  }

  if (!previousItem) {
    return true;
  }

  let isEqual = true;

  if (
    previousItem.totalIssuance !== currentRecord.totalIssuance ||
    previousItem.existentialDeposit !== currentRecord.existentialDeposit ||
    !!previousItem.dynamicFee !== !!currentRecord.dynamicFee ||
    (!!previousItem.dynamicFee &&
      !!currentRecord.dynamicFee &&
      previousItem.dynamicFee.d.join(',') !==
        currentRecord.dynamicFee.d.join(','))
  ) {
    isEqual = false;
  }

  return !isEqual;
}

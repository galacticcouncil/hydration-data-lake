import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import pMap from 'p-map';
import { LessThan } from 'typeorm';
import { LatestProcessedDataCacheManager } from '../../utils/latestProcessedDataCacheManager';
import {
  AccountAssetBalanceHistoricalData,
  XykpoolAssetsData,
} from '../../model';

export async function getAccAssetBalanceHistDataWithUniqueData(
  src: Map<string, AccountAssetBalanceHistoricalData>,
  ctx: ProcessorContext<Store>
) {
  const result: Map<string, AccountAssetBalanceHistoricalData> = new Map();

  const assetBalancesHistoryIndex = new Map<
    string,
    Map<string, AccountAssetBalanceHistoricalData[]>
  >();

  for (const i of (
    src || ctx.batchState.state.accAssetBalanceHistData
  ).values()) {
    if (!assetBalancesHistoryIndex.has(i.accountId)) {
      assetBalancesHistoryIndex.set(i.accountId, new Map());
    }
    if (!assetBalancesHistoryIndex.get(i.accountId)!.has(i.assetId)) {
      assetBalancesHistoryIndex.get(i.accountId)!.set(i.assetId, []);
    }
    assetBalancesHistoryIndex.get(i.accountId)!.get(i.assetId)!.push(i);
  }

  for (const [accountId, assetsMap] of assetBalancesHistoryIndex.entries()) {
    for (const [assetId, entriesList] of assetsMap.entries()) {
      const listToSort = entriesList;
      const latestCachedItem =
        LatestProcessedDataCacheManager.getInstance().getLastAccAssetBalanceHistoricalDataItem(
          accountId,
          `${assetId}`
        );
      if (latestCachedItem) listToSort.push(latestCachedItem);

      assetBalancesHistoryIndex.get(accountId)!.set(
        assetId,
        listToSort.sort((a, b) => b.paraBlockHeight - a.paraBlockHeight)
      );
    }
  }

  await pMap(
    Array.from(src.values()),
    async (item) => {
      if (
        await isAccAssetBalanceHistoricalDataUniqueRegardingPreviousRecord({
          currentRecord: item,
          cachedAccAssetsIndexedRecords: assetBalancesHistoryIndex,
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

export async function isAccAssetBalanceHistoricalDataUniqueRegardingPreviousRecord({
  currentRecord,
  cachedAccAssetsIndexedRecords,
  ctx,
}: {
  currentRecord: AccountAssetBalanceHistoricalData;
  cachedAccAssetsIndexedRecords: Map<
    string,
    Map<string, AccountAssetBalanceHistoricalData[]>
  >;
  ctx: ProcessorContext<Store>;
}) {
  let previousItem = (
    cachedAccAssetsIndexedRecords
      .get(currentRecord.accountId)!
      .get(currentRecord.assetId) || []
  ).find((i) => i.paraBlockHeight < currentRecord.paraBlockHeight);

  if (!previousItem) {
    previousItem = await ctx.store.findOne(AccountAssetBalanceHistoricalData, {
      where: {
        accountId: currentRecord.accountId,
        assetId: currentRecord.assetId,
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
    previousItem.transferable !== currentRecord.transferable ||
    previousItem.totalLocked !== currentRecord.totalLocked
  ) {
    isEqual = false;
  }

  return !isEqual;
}

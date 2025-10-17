import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import pMap from 'p-map';
import { LessThan } from 'typeorm';
import { LatestProcessedDataCacheManager } from '../../utils/latestProcessedDataCacheManager';
import { AccountMmPositionHistoricalData } from '../../model';

export async function getAccMmPosiotionHistDataWithUniqueData(
  src: Map<string, AccountMmPositionHistoricalData>,
  ctx: ProcessorContext<Store>
) {
  const result: Map<string, AccountMmPositionHistoricalData> = new Map();

  const itemsIndex = new Map<string, AccountMmPositionHistoricalData[]>();

  for (const i of (
    src || ctx.batchState.state.accMmPositionHistData
  ).values()) {
    if (!itemsIndex.has(i.accountId)) {
      itemsIndex.set(i.accountId, []);
    }
    itemsIndex.get(i.accountId)!.push(i);
  }

  for (const [accountId, entriesList] of itemsIndex.entries()) {
    const listToSort = entriesList;
    const latestCachedItem =
      LatestProcessedDataCacheManager.getInstance().getLastAccMmPositionHistoricalDataItem(
        accountId
      );
    if (latestCachedItem) listToSort.push(latestCachedItem);

    itemsIndex.set(
      accountId,
      listToSort.sort((a, b) => b.paraBlockHeight - a.paraBlockHeight)
    );
  }

  await pMap(
    Array.from(src.values()),
    async (item) => {
      if (
        await isAccMmPositionHistoricalDataUniqueRegardingPreviousRecord({
          currentRecord: item,
          cachedSortedRecords: itemsIndex,
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

export async function isAccMmPositionHistoricalDataUniqueRegardingPreviousRecord({
  currentRecord,
  cachedSortedRecords,
  ctx,
}: {
  currentRecord: AccountMmPositionHistoricalData;
  cachedSortedRecords: Map<string, AccountMmPositionHistoricalData[]>;
  ctx: ProcessorContext<Store>;
}) {
  let previousItem = (
    cachedSortedRecords.get(currentRecord.accountId) || []
  ).find((i) => i.paraBlockHeight < currentRecord.paraBlockHeight);

  if (!previousItem) {
    previousItem = await ctx.store.findOne(AccountMmPositionHistoricalData, {
      where: {
        accountId: currentRecord.accountId,
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
    previousItem.totalCollateralBase !== currentRecord.totalCollateralBase ||
    previousItem.totalDebtBase !== currentRecord.totalDebtBase ||
    previousItem.availableBorrowsBase !== currentRecord.availableBorrowsBase ||
    previousItem.currentLiquidationThreshold !==
      currentRecord.currentLiquidationThreshold ||
    previousItem.ltv !== currentRecord.ltv ||
    previousItem.healthFactor !== currentRecord.healthFactor ||
    previousItem.poolAddress !== currentRecord.poolAddress
  ) {
    isEqual = false;
  }

  return !isEqual;
}

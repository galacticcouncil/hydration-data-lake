import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { Aavepool, AssetHistoricalData } from '../../model';
import pMap from 'p-map';
import { LessThan } from 'typeorm';
import { LatestProcessedDataCacheManager } from '../../utils/latestProcessedDataCacheManager';

export async function getAavepoolHistDataWithUniqueData(
  src: Map<string, Aavepool>,
  ctx: ProcessorContext<Store>
) {
  const result: Map<string, Aavepool> = new Map();

  const poolsHistoryIndex = new Map<string, Aavepool[]>();

  for (const i of (src || ctx.batchState.state.aavepools).values()) {
    if (!poolsHistoryIndex.has(i.poolId)) {
      poolsHistoryIndex.set(i.poolId, []);
    }
    poolsHistoryIndex.get(i.poolId)!.push(i);
  }

  for (const [poolId, list] of poolsHistoryIndex.entries()) {
    const listToSort = list;
    const latestCachedItem =
      LatestProcessedDataCacheManager.getInstance().getLastAavepool(poolId);
    if (latestCachedItem) listToSort.push(latestCachedItem);

    const orderedList = listToSort.sort(
      (a, b) => b.paraBlockHeight - a.paraBlockHeight
    );

    poolsHistoryIndex.set(poolId, orderedList);
  }

  await pMap(
    Array.from(src.values()),
    async (item) => {
      if (
        await isAavepoolHistoricalDataUniqueRegardingPreviousRecord({
          currentRecord: item,
          cachedIndexedRecords: poolsHistoryIndex,
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

export async function isAavepoolHistoricalDataUniqueRegardingPreviousRecord({
  currentRecord,
  cachedIndexedRecords,
  ctx,
}: {
  currentRecord: Aavepool;
  cachedIndexedRecords: Map<string, Aavepool[]>;
  ctx: ProcessorContext<Store>;
}) {
  let previousItem = (
    cachedIndexedRecords.get(currentRecord.poolId) || []
  ).find((i) => i.paraBlockHeight < currentRecord.paraBlockHeight);

  if (!previousItem) {
    previousItem = await ctx.store.findOne(Aavepool, {
      where: {
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
    previousItem.liquidityIn !== currentRecord.liquidityIn ||
    previousItem.liquidityOut !== currentRecord.liquidityOut
  ) {
    isEqual = false;
  }

  return !isEqual;
}

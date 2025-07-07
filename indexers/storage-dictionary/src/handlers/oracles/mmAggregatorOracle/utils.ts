import { ProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import pMap from 'p-map';
import { LessThan } from 'typeorm';
import { MmAggregatorOracle } from '../../../model';
import { LatestProcessedDataCacheManager } from '../../../utils/latestProcessedDataCacheManager';

export async function getMmAggregatorOraclesWithUniqueData(
  src: Map<string, MmAggregatorOracle>,
  ctx: ProcessorContext<Store>
) {
  const result: Map<string, MmAggregatorOracle> = new Map();

  const oraclesHistoryIndex = new Map<string, MmAggregatorOracle[]>();

  for (const i of (src || ctx.batchState.state.mmAggregatorOracles).values()) {
    if (!oraclesHistoryIndex.has(i.address)) {
      oraclesHistoryIndex.set(i.address, []);
    }
    oraclesHistoryIndex.get(i.address)!.push(i);
  }

  for (const [address, list] of oraclesHistoryIndex.entries()) {
    const listToSort = list;
    const latestCachedItem =
      LatestProcessedDataCacheManager.getInstance().getLastMmAggregatorOracle(
        address
      );
    if (latestCachedItem) listToSort.push(latestCachedItem);

    const orderedList = listToSort.sort(
      (a, b) => b.paraBlockHeight - a.paraBlockHeight
    );

    oraclesHistoryIndex.set(address, orderedList);
  }

  await pMap(
    Array.from(src.values()),
    async (item) => {
      if (
        await isMmAggregatorOracleDataUniqueRegardingPreviousRecord({
          currentRecord: item,
          cachedIndexedRecords: oraclesHistoryIndex,
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

export async function isMmAggregatorOracleDataUniqueRegardingPreviousRecord({
  currentRecord,
  cachedIndexedRecords,
  ctx,
}: {
  currentRecord: MmAggregatorOracle;
  cachedIndexedRecords: Map<string, MmAggregatorOracle[]>;
  ctx: ProcessorContext<Store>;
}) {
  let previousItem = (
    cachedIndexedRecords.get(currentRecord.address) || []
  ).find((i) => i.paraBlockHeight < currentRecord.paraBlockHeight);

  if (!previousItem) {
    previousItem = await ctx.store.findOne(MmAggregatorOracle, {
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
    previousItem.price !== currentRecord.price ||
    previousItem.decimals !== currentRecord.decimals ||
    previousItem.updatedAt !== currentRecord.updatedAt
  ) {
    isEqual = false;
  }

  return !isEqual;
}

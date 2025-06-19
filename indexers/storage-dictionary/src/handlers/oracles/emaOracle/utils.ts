import { ProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import pMap from 'p-map';
import { LessThan } from 'typeorm';
import { EmaOracle } from '../../../model';
import { isDeepEqual } from '../../../utils/helpers';
import { LatestProcessedDataCacheManager } from '../../../utils/latestProcessedDataCacheManager';

export async function getEmaOracleHistDataWithUniqueData(
  src: Map<string, EmaOracle>,
  ctx: ProcessorContext<Store>
) {
  const result: Map<string, EmaOracle> = new Map();

  const listToSort = Array.from(src.values());

  const latestCachedItem =
    LatestProcessedDataCacheManager.getInstance().getLastEmaOracle();
  if (latestCachedItem) listToSort.push(latestCachedItem);

  const sortedRecords = listToSort.sort(
    (a, b) => b.paraBlockHeight - a.paraBlockHeight
  );

  await pMap(
    Array.from(src.values()),
    async (item) => {
      if (
        await isEmaOracleDataUniqueRegardingPreviousRecord({
          currentRecord: item,
          cachedSortedRecords: sortedRecords,
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

export async function isEmaOracleDataUniqueRegardingPreviousRecord({
  currentRecord,
  cachedSortedRecords,
  ctx,
}: {
  currentRecord: EmaOracle;
  cachedSortedRecords: EmaOracle[];
  ctx: ProcessorContext<Store>;
}) {
  let previousItem = cachedSortedRecords.find(
    (i) => i.paraBlockHeight < currentRecord.paraBlockHeight
  );

  if (!previousItem) {
    previousItem = await ctx.store.findOne(EmaOracle, {
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

  if (!isDeepEqual(previousItem.entries, currentRecord.entries)) {
    isEqual = false;
  }

  return !isEqual;
}

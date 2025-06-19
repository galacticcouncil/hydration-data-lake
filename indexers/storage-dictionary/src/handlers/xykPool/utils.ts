import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { AssetHistoricalData, Xykpool, XykpoolAssetsData } from '../../model';
import pMap from 'p-map';
import { LessThan } from 'typeorm';
import { LatestProcessedDataCacheManager } from '../../utils/latestProcessedDataCacheManager';

export async function getXykpoolHistDataWithUniqueData(
  poolAssetsData: Map<string, XykpoolAssetsData>,
  ctx: ProcessorContext<Store>
) {
  const poolsResult: Map<string, Xykpool> = new Map();
  const poolAssetsResult: Map<string, XykpoolAssetsData> = new Map();

  const poolAssetsHistoryIndex = new Map<
    string,
    Map<number, XykpoolAssetsData[]>
  >();

  for (const i of (
    poolAssetsData || ctx.batchState.state.xykPoolAssetsData
  ).values()) {
    if (!poolAssetsHistoryIndex.has(i.pool.poolAddress)) {
      poolAssetsHistoryIndex.set(i.pool.poolAddress, new Map());
    }
    if (!poolAssetsHistoryIndex.get(i.pool.poolAddress)!.has(i.assetId)) {
      poolAssetsHistoryIndex.get(i.pool.poolAddress)!.set(i.assetId, []);
    }
    poolAssetsHistoryIndex.get(i.pool.poolAddress)!.get(i.assetId)!.push(i);
  }

  for (const [poolId, assetsMap] of poolAssetsHistoryIndex.entries()) {
    for (const [assetId, entriesList] of assetsMap.entries()) {
      const listToSort = entriesList;
      const latestCachedItem =
        LatestProcessedDataCacheManager.getInstance().getLastXykpoolAssetHistoricalDataItem(
          poolId,
          `${assetId}`
        );
      if (latestCachedItem) listToSort.push(latestCachedItem);

      poolAssetsHistoryIndex.get(poolId)!.set(
        assetId,
        listToSort.sort((a, b) => b.paraBlockHeight - a.paraBlockHeight)
      );
    }
  }

  await pMap(
    Array.from(poolAssetsData.values()),
    async (item) => {
      if (
        await isXykpoolAssetHistoricalDataUniqueRegardingPreviousRecord({
          currentRecord: item,
          cachedPoolAssetsIndexedRecords: poolAssetsHistoryIndex,
          ctx,
        })
      ) {
        poolAssetsResult.set(item.id, item);
        poolsResult.set(item.pool.id, item.pool);

        let pairAssetRecordId = null;
        if (item.pool.assetAId === item.assetId) {
          pairAssetRecordId = `${item.pool.poolAddress}-${item.pool.assetBId}-${item.paraBlockHeight}`;
        } else {
          pairAssetRecordId = `${item.pool.poolAddress}-${item.pool.assetAId}-${item.paraBlockHeight}`;
        }

        if (poolAssetsData.has(pairAssetRecordId)) {
          poolAssetsResult.set(
            pairAssetRecordId,
            poolAssetsData.get(pairAssetRecordId)!
          );
        }
      }
    },
    { concurrency: ctx.appConfig.ASYNC_OPERATIONS_CONCURRENCY_COMMON }
  );

  return {
    pools: poolsResult,
    poolAssets: poolAssetsResult,
  };
}

export async function isXykpoolAssetHistoricalDataUniqueRegardingPreviousRecord({
  currentRecord,
  cachedPoolAssetsIndexedRecords,
  ctx,
}: {
  currentRecord: XykpoolAssetsData;
  cachedPoolAssetsIndexedRecords: Map<string, Map<number, XykpoolAssetsData[]>>;
  ctx: ProcessorContext<Store>;
}) {
  let previousItem = (
    cachedPoolAssetsIndexedRecords
      .get(currentRecord.pool.poolAddress)!
      .get(currentRecord.assetId) || []
  ).find((i) => i.paraBlockHeight < currentRecord.paraBlockHeight);

  if (!previousItem) {
    previousItem = await ctx.store.findOne(XykpoolAssetsData, {
      where: {
        assetId: +currentRecord.assetId,
        pool: { poolAddress: currentRecord.pool.poolAddress },
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
    !!previousItem.balances !== !!currentRecord.balances ||
    (!!previousItem.balances &&
      !!currentRecord.balances &&
      previousItem.balances.d.join(',') !== currentRecord.balances.d.join(','))
  ) {
    isEqual = false;
  }

  return !isEqual;
}

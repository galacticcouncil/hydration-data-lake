import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  AssetHistoricalData,
  Stableswap,
  StableswapAssetData,
  Xykpool,
  XykpoolAssetsData,
} from '../../model';
import pMap from 'p-map';
import { LessThan } from 'typeorm';
import { isDeepEqual } from '../../utils/helpers';

export async function getStableswapHistDataWithUniqueData({
  poolsData,
  poolAssetsData,
  ctx,
}: {
  poolsData: Map<string, Stableswap>;
  poolAssetsData: Map<string, StableswapAssetData>;
  ctx: ProcessorContext<Store>;
}) {
  const poolsResult: Map<string, Stableswap> = new Map();
  const poolAssetsResult: Map<string, StableswapAssetData> = new Map();
  const concurrencyLimit = 1000;

  const poolsHistoryIndex = new Map<string, Stableswap[]>();

  for (const i of (poolsData || ctx.batchState.state.stablepools).values()) {
    if (!poolsHistoryIndex.has(i.poolAddress)) {
      poolsHistoryIndex.set(i.poolAddress, []);
    }
    poolsHistoryIndex.get(i.poolAddress)!.push(i);
  }

  for (const [poolAddress, list] of poolsHistoryIndex.entries()) {
    poolsHistoryIndex.set(
      poolAddress,
      list.sort((a, b) => b.paraBlockHeight - a.paraBlockHeight)
    );
  }

  const poolAssetsHistoryIndex = new Map<
    string,
    Map<number, StableswapAssetData[]>
  >();

  for (const i of (
    poolAssetsData || ctx.batchState.state.stablepoolAssetsData
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
      poolAssetsHistoryIndex.get(poolId)!.set(
        assetId,
        entriesList.sort((a, b) => b.paraBlockHeight - a.paraBlockHeight)
      );
    }
  }

  await pMap(
    Array.from(poolsData.values()),
    async (item) => {
      if (
        await isStableswapHistoricalDataUniqueRegardingPreviousRecord({
          currentRecord: item,
          cachedPoolsIndexedRecords: poolsHistoryIndex,
          ctx,
        })
      ) {
        poolsResult.set(item.id, item);

        /**
         * We need to add all pool's assets data if pool's data is unique to keep
         * data in API consistent
         */
        for (const assetId of poolAssetsHistoryIndex
          .get(item.poolAddress)!
          .keys()) {
          const pairAssetRecordId = `${item.poolId}-${assetId}-${item.paraBlockHeight}`;
          poolAssetsResult.set(
            pairAssetRecordId,
            poolAssetsData.get(pairAssetRecordId)!
          );
        }
      }
    },
    { concurrency: concurrencyLimit }
  );

  await pMap(
    Array.from(poolAssetsData.values()).filter(
      (assetData) => !poolAssetsResult.has(assetData.id)
    ),
    async (item) => {
      if (
        await isStableswapAssetHistoricalDataUniqueRegardingPreviousRecord({
          currentRecord: item,
          cachedPoolAssetsIndexedRecords: poolAssetsHistoryIndex,
          ctx,
        })
      ) {
        poolAssetsResult.set(item.id, item);
        poolsResult.set(item.pool.id, item.pool);

        /**
         * We need to add all pool's assets data if at least one asset has
         * changed data to keep data in API consistent
         */
        innerLoop: for (const assetId of poolAssetsHistoryIndex
          .get(item.pool.poolAddress)!
          .keys()) {
          if (assetId === item.assetId) continue innerLoop;

          const pairAssetRecordId = `${item.pool.poolId}-${assetId}-${item.paraBlockHeight}`;
          poolAssetsResult.set(
            pairAssetRecordId,
            poolAssetsData.get(pairAssetRecordId)!
          );
        }
      }
    },
    { concurrency: concurrencyLimit }
  );

  return {
    pools: poolsResult,
    poolAssets: poolAssetsResult,
  };
}

export async function isStableswapHistoricalDataUniqueRegardingPreviousRecord({
  currentRecord,
  cachedPoolsIndexedRecords,
  ctx,
}: {
  currentRecord: Stableswap;
  cachedPoolsIndexedRecords: Map<string, Stableswap[]>;
  ctx: ProcessorContext<Store>;
}) {
  let previousItem = (
    cachedPoolsIndexedRecords.get(currentRecord.poolAddress)! || []
  ).find((i) => i.paraBlockHeight < currentRecord.paraBlockHeight);

  if (!previousItem) {
    previousItem = await ctx.store.findOne(Stableswap, {
      where: {
        poolAddress: currentRecord.poolAddress,
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
    previousItem.initialAmplification !== currentRecord.initialAmplification ||
    previousItem.finalAmplification !== currentRecord.finalAmplification ||
    previousItem.initialBlock !== currentRecord.initialBlock ||
    previousItem.finalBlock !== currentRecord.finalBlock ||
    previousItem.fee !== currentRecord.fee ||
    !isDeepEqual(previousItem.pegs, currentRecord.pegs) ||
    previousItem.maxPegUpdate !== currentRecord.maxPegUpdate ||
    !isDeepEqual(previousItem.pegSources, currentRecord.pegSources)
  ) {
    isEqual = false;
  }

  return !isEqual;
}

export async function isStableswapAssetHistoricalDataUniqueRegardingPreviousRecord({
  currentRecord,
  cachedPoolAssetsIndexedRecords,
  ctx,
}: {
  currentRecord: StableswapAssetData;
  cachedPoolAssetsIndexedRecords: Map<
    string,
    Map<number, StableswapAssetData[]>
  >;
  ctx: ProcessorContext<Store>;
}) {
  let previousItem = (
    cachedPoolAssetsIndexedRecords
      .get(currentRecord.pool.poolAddress)!
      .get(currentRecord.assetId) || []
  ).find((i) => i.paraBlockHeight < currentRecord.paraBlockHeight);

  if (!previousItem) {
    previousItem = await ctx.store.findOne(StableswapAssetData, {
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
    !!previousItem.tradable !== !!currentRecord.tradable ||
    (!!previousItem.tradable &&
      !!currentRecord.tradable &&
      previousItem.tradable.bits !== currentRecord.tradable.bits) ||
    !!previousItem.balances !== !!currentRecord.balances ||
    (!!previousItem.balances &&
      !!currentRecord.balances &&
      previousItem.balances.d.join(',') !== currentRecord.balances.d.join(','))
  ) {
    isEqual = false;
  }

  return !isEqual;
}

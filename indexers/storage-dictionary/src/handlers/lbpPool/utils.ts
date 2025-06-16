import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  AssetHistoricalData,
  Lbppool,
  LbppoolAssetsData,
  Stableswap,
  StableswapAssetData,
  Xykpool,
  XykpoolAssetsData,
} from '../../model';
import pMap from 'p-map';
import { LessThan } from 'typeorm';
import { isDeepEqual } from '../../utils/helpers';

export async function getLbppoolHistDataWithUniqueData({
  poolsData,
  poolAssetsData,
  ctx,
}: {
  poolsData: Map<string, Lbppool>;
  poolAssetsData: Map<string, LbppoolAssetsData>;
  ctx: ProcessorContext<Store>;
}) {
  const poolsResult: Map<string, Lbppool> = new Map();
  const poolAssetsResult: Map<string, LbppoolAssetsData> = new Map();
  const concurrencyLimit = 1000;

  const poolsHistoryIndex = new Map<string, Lbppool[]>();

  for (const i of (poolsData || ctx.batchState.state.lbpPools).values()) {
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
    Map<number, LbppoolAssetsData[]>
  >();

  for (const i of (
    poolAssetsData || ctx.batchState.state.lbpPoolAssetsData
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
        await isLbppoolHistoricalDataUniqueRegardingPreviousRecord({
          currentRecord: item,
          cachedIndexedRecords: poolsHistoryIndex,
          ctx,
        })
      ) {
        poolsResult.set(item.id, item);

        /**
         * We need to add all pool's assets data if pool's data is unique to keep
         * data in API consistent
         */
        const assetAHistDataId = `${item.poolAddress}-${item.assetAId}-${item.paraBlockHeight}`;
        const assetBHistDataId = `${item.poolAddress}-${item.assetBId}-${item.paraBlockHeight}`;
        poolAssetsResult.set(
          assetAHistDataId,
          poolAssetsData.get(assetAHistDataId)!
        );
        poolAssetsResult.set(
          assetBHistDataId,
          poolAssetsData.get(assetBHistDataId)!
        );
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
          cachedIndexedRecords: poolAssetsHistoryIndex,
          ctx,
        })
      ) {
        poolAssetsResult.set(item.id, item);
        poolsResult.set(item.pool.id, item.pool);

        /**
         * We need to add all pool's assets data if at least one asset has
         * changed data to keep data in API consistent
         */
        let pairAssetRecordId: string | null = null;
        if (item.pool.assetAId === item.assetId) {
          pairAssetRecordId = `${item.pool.poolAddress}-${item.pool.assetBId}-${item.paraBlockHeight}`;
        } else {
          pairAssetRecordId = `${item.pool.poolAddress}-${item.pool.assetAId}-${item.paraBlockHeight}`;
        }
        poolAssetsResult.set(
          pairAssetRecordId,
          poolAssetsData.get(pairAssetRecordId)!
        );
      }
    },
    { concurrency: concurrencyLimit }
  );

  return {
    pools: poolsResult,
    poolAssets: poolAssetsResult,
  };
}

export async function isLbppoolHistoricalDataUniqueRegardingPreviousRecord({
  currentRecord,
  cachedIndexedRecords,
  ctx,
}: {
  currentRecord: Lbppool;
  cachedIndexedRecords: Map<string, Lbppool[]>;
  ctx: ProcessorContext<Store>;
}) {
  let previousItem = (
    cachedIndexedRecords.get(currentRecord.poolAddress)! || []
  ).find((i) => i.paraBlockHeight < currentRecord.paraBlockHeight);

  if (!previousItem) {
    previousItem = await ctx.store.findOne(Lbppool, {
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
    previousItem.owner !== currentRecord.owner ||
    previousItem.start !== currentRecord.start ||
    previousItem.end !== currentRecord.end ||
    previousItem.initialWeight !== currentRecord.initialWeight ||
    previousItem.finalWeight !== currentRecord.finalWeight ||
    previousItem.weightCurve !== currentRecord.weightCurve ||
    previousItem.fee.join(',') !== currentRecord.fee.join(',') ||
    previousItem.feeCollector !== currentRecord.feeCollector ||
    previousItem.repayTarget !== currentRecord.repayTarget
  ) {
    isEqual = false;
  }

  return !isEqual;
}

export async function isStableswapAssetHistoricalDataUniqueRegardingPreviousRecord({
  currentRecord,
  cachedIndexedRecords,
  ctx,
}: {
  currentRecord: LbppoolAssetsData;
  cachedIndexedRecords: Map<string, Map<number, LbppoolAssetsData[]>>;
  ctx: ProcessorContext<Store>;
}) {
  let previousItem = (
    cachedIndexedRecords
      .get(currentRecord.pool.poolAddress)!
      .get(currentRecord.assetId) || []
  ).find((i) => i.paraBlockHeight < currentRecord.paraBlockHeight);

  if (!previousItem) {
    previousItem = await ctx.store.findOne(LbppoolAssetsData, {
      where: {
        assetId: currentRecord.assetId,
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

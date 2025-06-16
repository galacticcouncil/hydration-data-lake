import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { Omnipool, OmnipoolAssetData } from '../../model';
import pMap from 'p-map';
import { LessThan } from 'typeorm';

export async function getOmnipoolHistDataWithUniqueData({
  ctx,
  poolsData,
  poolAssetsData,
}: {
  poolsData: Map<string, Omnipool>;
  poolAssetsData: Map<string, OmnipoolAssetData>;
  ctx: ProcessorContext<Store>;
}) {
  const poolsResult: Map<string, Omnipool> = new Map();
  const poolAssetsResult: Map<string, OmnipoolAssetData> = new Map();
  const concurrencyLimit = 1000;

  const poolsHistoryIndex = new Map<string, Omnipool[]>();

  for (const i of (poolsData || ctx.batchState.state.omnipools).values()) {
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

  const poolAssetsHistoryIndex = new Map<number, OmnipoolAssetData[]>();

  for (const i of (
    poolAssetsData || ctx.batchState.state.omnipoolAssetsData
  ).values()) {
    if (!poolAssetsHistoryIndex.has(i.assetId)) {
      poolAssetsHistoryIndex.set(i.assetId, []);
    }

    poolAssetsHistoryIndex.get(i.assetId)!.push(i);
  }

  for (const [assetId, list] of poolAssetsHistoryIndex.entries()) {
    poolAssetsHistoryIndex!.set(
      assetId,
      list.sort((a, b) => b.paraBlockHeight - a.paraBlockHeight)
    );
  }

  await pMap(
    Array.from(poolsData.values()),
    async (item) => {
      if (
        await isOmnipoolHistoricalDataUniqueRegardingPreviousRecord({
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
        for (const assetId of poolAssetsHistoryIndex.keys()) {
          const pairAssetRecordId = `${item.poolAddress}-${assetId}-${item.paraBlockHeight}`;
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
        await isOmnipoolAssetHistoricalDataUniqueRegardingPreviousRecord({
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
        innerLoop: for (const assetId of poolAssetsHistoryIndex.keys()) {
          if (assetId === item.assetId) continue innerLoop;

          const pairAssetRecordId = `${item.pool.poolAddress}-${assetId}-${item.paraBlockHeight}`;
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

export async function isOmnipoolHistoricalDataUniqueRegardingPreviousRecord({
  currentRecord,
  cachedPoolsIndexedRecords,
  ctx,
}: {
  currentRecord: Omnipool;
  cachedPoolsIndexedRecords: Map<string, Omnipool[]>;
  ctx: ProcessorContext<Store>;
}) {
  let previousItem = (
    cachedPoolsIndexedRecords.get(currentRecord.poolAddress)! || []
  ).find((i) => i.paraBlockHeight < currentRecord.paraBlockHeight);

  if (!previousItem) {
    previousItem = await ctx.store.findOne(Omnipool, {
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
    previousItem.hubAssetTradability !== currentRecord.hubAssetTradability ||
    previousItem.hubAssetTradability.bits !==
      currentRecord.hubAssetTradability.bits
  ) {
    isEqual = false;
  }

  return !isEqual;
}

export async function isOmnipoolAssetHistoricalDataUniqueRegardingPreviousRecord({
  currentRecord,
  cachedPoolAssetsIndexedRecords,
  ctx,
}: {
  currentRecord: OmnipoolAssetData;
  cachedPoolAssetsIndexedRecords: Map<number, OmnipoolAssetData[]>;
  ctx: ProcessorContext<Store>;
}) {
  let previousItem = (
    cachedPoolAssetsIndexedRecords.get(currentRecord.assetId) || []
  ).find((i) => i.paraBlockHeight < currentRecord.paraBlockHeight);

  if (!previousItem) {
    previousItem = await ctx.store.findOne(OmnipoolAssetData, {
      where: {
        assetId: +currentRecord.assetId,
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
      previousItem.balances.d.join(',') !==
        currentRecord.balances.d.join(',')) ||
    !!previousItem.assetState !== !!currentRecord.assetState ||
    (!!previousItem.assetState &&
      !!currentRecord.assetState &&
      previousItem.assetState.d.join(',') !==
        currentRecord.assetState.d.join(','))
  ) {
    isEqual = false;
  }

  return !isEqual;
}

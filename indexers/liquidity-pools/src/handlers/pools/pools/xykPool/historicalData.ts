import pMap from 'p-map';
import { LessThan } from 'typeorm';

import { BlockHeader } from '@subsquid/substrate-processor';
import { Store } from '@subsquid/typeorm-store';

import { Xykpool, XykpoolHistoricalData } from '../../../../model';
import parsers from '../../../../parsers';
import { BatchBlocksParsedDataManager } from '../../../../parsers/batchBlocksParser';
import { SqdProcessorContext } from '../../../../processor';
import { splitIntoBatches } from '../../../../utils/helpers';
import { getOrCreateXykPool } from './xykPool';
import { LatestProcessedDataCacheManager } from '../../../../utils/latestProcessedDataCacheManager';
import { StorageResolver } from '../../../../parsers/storageResolver';
import { getOrCreateAsset } from '../../../assets/asset';
import { XykpoolHistoricalDataManager } from './historicalDataManager';

export async function handleXykPoolHistoricalData(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  const predefinedEntities: XykpoolHistoricalData[] = [];

  let allPoolAddresses: string[] = [];
  let allPoolAddressesWithNativeToken: string[] = [];

  const poolIdsSetToProcess =
    await XykpoolHistoricalDataManager.getInstance().getPoolIdsSetToProcessAndPrefillHistData(
      ctx.blocks[0].header.height,
      ctx
    );

  const poolsToProcess = Array.from(
    ctx.batchState.state.xykAllBatchPools.values()
  ).filter((pool) => poolIdsSetToProcess.has(pool.id));

  for (const pool of poolsToProcess) {
    if (pool.isDestroyed) continue;
    if (pool.assetAId === '0' || pool.assetBId === '0') {
      allPoolAddressesWithNativeToken.push(pool.id);
    }
    allPoolAddresses.push(pool.id);
  }

  await pMap(
    ctx.blocks,
    async ({ header: blockHeader }) => {
      const poolsWithStorageDictionaryData: Map<string, Xykpool> = new Map();

      for (const pool of poolsToProcess) {
        if (pool.isDestroyed) continue;

        const assetAEntity = await getOrCreateAsset({
          id: pool.assetAId,
          ctx,
          ensure: false,
        });
        const assetBEntity = await getOrCreateAsset({
          id: pool.assetBId,
          ctx,
          ensure: false,
        });

        if (
          !assetAEntity ||
          !assetAEntity.assetRegistryId ||
          !assetBEntity ||
          !assetBEntity.assetRegistryId
        )
          continue;

        const isStDictDataAvailableAssetA =
          StorageResolver.getInstance().storageDictionaryManager?.isXykPoolAssetInfoAvailable(
            {
              poolAddress: pool.id,
              block: blockHeader,
              assetId: +assetAEntity.assetRegistryId,
            }
          );
        const isStDictDataAvailableAssetB =
          StorageResolver.getInstance().storageDictionaryManager?.isXykPoolAssetInfoAvailable(
            {
              poolAddress: pool.id,
              block: blockHeader,
              assetId: +assetBEntity.assetRegistryId,
            }
          );

        if (isStDictDataAvailableAssetA && isStDictDataAvailableAssetB)
          poolsWithStorageDictionaryData.set(pool.id, pool);
      }

      allPoolAddressesWithNativeToken = allPoolAddressesWithNativeToken.filter(
        (id) => !poolsWithStorageDictionaryData.has(id)
      );

      allPoolAddresses = allPoolAddresses.filter(
        (id) => !poolsWithStorageDictionaryData.has(id)
      );

      const nativeTokenBalancesMap =
        allPoolAddressesWithNativeToken.length === 0
          ? new Map()
          : new Map(
              (
                await parsers.storage.system.getNativeTokenBalanceMany({
                  accountIds: allPoolAddressesWithNativeToken,
                  block: blockHeader,
                })
              )
                .filter((balance) => !!balance.data)
                .map((balance) => [balance.accountId, balance.data])
            );

      const otherTokenBalancesMap =
        allPoolAddresses.length === 0
          ? new Map()
          : new Map(
              (
                await parsers.storage.tokens.getTokenBalancesMany({
                  accountIds: allPoolAddresses,
                  block: blockHeader,
                })
              ).map((balance) => [
                balance.accountId,
                new Map(
                  balance.assetBalances.map((assetBal) => [
                    assetBal.assetId,
                    assetBal.data,
                  ])
                ),
              ])
            );

      for (const pool of poolsToProcess) {
        if (pool.isDestroyed) continue;

        const assetAEntity = await getOrCreateAsset({
          id: pool.assetAId,
          ctx,
          ensure: false,
        });
        const assetBEntity = await getOrCreateAsset({
          id: pool.assetBId,
          ctx,
          ensure: false,
        });

        if (
          !assetAEntity ||
          !assetAEntity.assetRegistryId ||
          !assetBEntity ||
          !assetBEntity.assetRegistryId
        )
          continue;

        let assetABalance: bigint | undefined;
        let assetBBalance: bigint | undefined;

        if (poolsWithStorageDictionaryData.has(pool.id)) {
          const [assetABalanceRaw, assetBBalanceRaw] = await Promise.all([
            parsers.storage.xyk.getPoolAssetInfo({
              assetId: +assetAEntity.assetRegistryId,
              block: blockHeader,
              poolAddress: pool.id,
              allowZeroBalance: true,
            }),
            parsers.storage.xyk.getPoolAssetInfo({
              assetId: +assetBEntity.assetRegistryId,
              block: blockHeader,
              poolAddress: pool.id,
              allowZeroBalance: true,
            }),
          ]);

          assetABalance = assetABalanceRaw?.free;
          assetBBalance = assetBBalanceRaw?.free;
        } else {
          assetABalance =
            pool.assetAId === '0'
              ? nativeTokenBalancesMap.get(pool.id)?.free
              : otherTokenBalancesMap
                  .get(pool.id)
                  ?.get(assetAEntity.assetRegistryId)?.free;

          assetBBalance =
            pool.assetBId === '0'
              ? nativeTokenBalancesMap.get(pool.id)?.free
              : otherTokenBalancesMap
                  .get(pool.id)
                  ?.get(assetBEntity.assetRegistryId)?.free;
        }

        const poolHistoricalDataEntity = new XykpoolHistoricalData({
          id: `${pool.id}-${blockHeader.height}`,
          pool,
          assetAId: pool.assetAId,
          assetBId: pool.assetBId,
          assetABalance: assetABalance ?? BigInt(0),
          assetBBalance: assetBBalance ?? BigInt(0),
          tvlInRefAssetNorm: '0',

          paraBlockHeight: blockHeader.height,
        });

        predefinedEntities.push(poolHistoricalDataEntity);
      }
    },
    {
      concurrency:
        ctx.appConfig.concurrency.ASYNC_OPERATIONS_CONCURRENCY_COMMON,
    }
  );

  for (const histDataItem of predefinedEntities) {
    ctx.batchState.state.xykPoolAllHistoricalData.set(
      histDataItem.id,
      histDataItem
    );
  }
}

export async function getXykpoolHistDataWithUniqueData(
  poolsData: Map<string, XykpoolHistoricalData>,
  ctx: SqdProcessorContext<Store>
) {
  const poolsResult: Map<string, XykpoolHistoricalData> = new Map();

  const poolsHistoricalDataIndexedByPoolId = new Map<
    string,
    XykpoolHistoricalData[]
  >();

  for (const i of (
    poolsData || ctx.batchState.state.xykPoolAllHistoricalData
  ).values()) {
    if (!poolsHistoricalDataIndexedByPoolId.has(i.pool.id)) {
      poolsHistoricalDataIndexedByPoolId.set(i.pool.id, []);
    }
    poolsHistoricalDataIndexedByPoolId.get(i.pool.id)!.push(i);
  }

  for (const [poolId, list] of poolsHistoricalDataIndexedByPoolId.entries()) {
    const listToSort = list;
    const latestCachedItem =
      LatestProcessedDataCacheManager.getInstance().getLastXykpoolHistoricalDataItem(
        poolId
      );
    if (latestCachedItem) listToSort.push(latestCachedItem);

    const orderedList = listToSort.sort(
      (a, b) => b.paraBlockHeight - a.paraBlockHeight
    );
    poolsHistoricalDataIndexedByPoolId.set(poolId, orderedList);
  }

  await pMap(
    Array.from(poolsData.values()),
    async (item) => {
      if (
        await isXykpoolHistoricalDataUniqueRegardingPreviousRecord({
          currentRecord: item,
          cachedIndexedRecords: poolsHistoricalDataIndexedByPoolId,
          ctx,
        })
      ) {
        poolsResult.set(item.id, item);
      }
    },
    {
      concurrency:
        ctx.appConfig.concurrency.ASYNC_OPERATIONS_CONCURRENCY_COMMON,
    }
  );

  return poolsResult;
}

export async function isXykpoolHistoricalDataUniqueRegardingPreviousRecord({
  currentRecord,
  cachedIndexedRecords,
  ctx,
}: {
  currentRecord: XykpoolHistoricalData;
  cachedIndexedRecords: Map<string, XykpoolHistoricalData[]>;
  ctx: SqdProcessorContext<Store>;
}) {
  let previousItem = (
    cachedIndexedRecords.get(currentRecord.pool.id) || []
  ).find((i) => i.paraBlockHeight < currentRecord.paraBlockHeight);

  if (!previousItem) {
    previousItem = await ctx.storeUtils.findOneWithLogs(
      XykpoolHistoricalData,
      {
        where: {
          pool: { id: currentRecord.pool.id },
          paraBlockHeight: LessThan(currentRecord.paraBlockHeight),
        },
        order: {
          paraBlockHeight: 'DESC',
        },
        relations: {
          pool: true,
        },
      },
      { className: 'XykpoolHistoricalData' }
    );

    if (previousItem)
      LatestProcessedDataCacheManager.getInstance().setLastXykpoolHistoricalDataItem(
        [previousItem]
      );
  }

  if (!previousItem) {
    return true;
  }

  let isEqual = true;

  if (
    previousItem.assetABalance !== currentRecord.assetABalance ||
    previousItem.assetBBalance !== currentRecord.assetBBalance
  ) {
    isEqual = false;
  }

  return !isEqual;
}

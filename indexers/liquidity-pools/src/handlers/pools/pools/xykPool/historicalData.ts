import pMap from 'p-map';
import { LessThan } from 'typeorm';
import { Store } from '@subsquid/typeorm-store';

import {
  Xykpool,
  XykpoolHistoricalData,
  XykpoolHistoricalDataLatest,
} from '../../../../model';
import parsers from '../../../../parsers';
import { BatchBlocksParsedDataManager } from '../../../../parsers/batchBlocksParser';
import { SqdProcessorContext } from '../../../../processor';
import { LatestProcessedDataCacheManager } from '../../../../utils/latestProcessedDataCacheManager';
import { StorageResolver } from '../../../../parsers/storageResolver';
import { getOrCreateAsset } from '../../../assets/asset';
import { XykpoolHistoricalDataManager } from './historicalDataManager';
import {
  AccountData,
  TokenAccountBalancesWithAccountId,
} from '../../../../parsers/types/storage';

export async function handleXykPoolHistoricalData(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  const predefinedEntities: XykpoolHistoricalData[] = [];

  let poolsToProcess = Array.from(
    ctx.batchState.state.xykAllBatchPools.values()
  );

  if (ctx.blocks.length === 1) {
    const poolIdsSetToProcess =
      await XykpoolHistoricalDataManager.getInstance().getPoolIdsSetToProcessAndPrefillHistData(
        ctx.blocks[0].header.height,
        ctx
      );

    poolsToProcess = poolsToProcess.filter((pool) =>
      poolIdsSetToProcess.has(pool.id)
    );
  }

  await pMap(
    ctx.blocks,
    async ({ header: blockHeader }) => {
      const poolsWithStorageDictionaryData: Map<string, Xykpool> = new Map();
      const allPoolAddresses: string[] = [];
      const allPoolAddressesWithNativeToken: string[] = [];

      for (const pool of poolsToProcess) {
        if (pool.isDestroyed) continue;
        if (pool.assetAId === '0' || pool.assetBId === '0') {
          allPoolAddressesWithNativeToken.push(pool.id);
        }
        allPoolAddresses.push(pool.id);
      }

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

      const poolAddressesWithNativeTokenToFetch =
        allPoolAddressesWithNativeToken.filter(
          (id) => !poolsWithStorageDictionaryData.has(id)
        );

      const poolAddressesToFetch = allPoolAddresses.filter(
        (id) => !poolsWithStorageDictionaryData.has(id)
      );

      const nativeTokenBalancesMap =
        poolAddressesWithNativeTokenToFetch.length === 0
          ? new Map()
          : new Map(
              (
                await parsers.storage.system.getNativeTokenBalanceMany({
                  accountIds: poolAddressesWithNativeTokenToFetch,
                  block: blockHeader,
                })
              )
                .filter((balance) => !!balance.data)
                .map((balance) => [balance.accountId, balance.data])
            );

      let tokenBalancesManyResponse: TokenAccountBalancesWithAccountId[] = [];

      /**
       * For small batches of accounts it's more efficient to make separate calls
       * getTokensAccountsAssetBalances than one getTokenBalancesMany;
       */
      if (poolAddressesToFetch.length > 5) {
        tokenBalancesManyResponse =
          await parsers.storage.tokens.getTokenBalancesMany({
            accountIds: poolAddressesToFetch,
            block: blockHeader,
          });
      } else {
        tokenBalancesManyResponse = (
          await pMap(
            poolAddressesToFetch,
            async (
              poolAddress
            ): Promise<TokenAccountBalancesWithAccountId | null> => {
              const pool =
                ctx.batchState.state.xykAllBatchPools.get(poolAddress);
              if (!pool) return null;
              const assetA = await getOrCreateAsset({
                id: pool.assetAId,
                ctx,
                ensure: false,
              });
              const assetB = await getOrCreateAsset({
                id: pool.assetBId,
                ctx,
                ensure: false,
              });
              if (
                !assetA ||
                assetA.assetRegistryId === null ||
                assetA.assetRegistryId === undefined ||
                !assetB ||
                assetB.assetRegistryId === null ||
                assetB.assetRegistryId === undefined
              )
                return null;

              const assetABalance =
                await parsers.storage.tokens.getTokensAccountsAssetBalances(
                  poolAddress,
                  +assetA.assetRegistryId,
                  blockHeader
                );
              const assetBBalance =
                await parsers.storage.tokens.getTokensAccountsAssetBalances(
                  poolAddress,
                  +assetB.assetRegistryId,
                  blockHeader
                );

              return {
                accountId: poolAddress,
                assetBalances: [
                  {
                    assetId: assetA.assetRegistryId,
                    data: assetABalance as AccountData,
                  },
                  {
                    assetId: assetB.assetRegistryId,
                    data: assetBBalance as AccountData,
                  },
                ],
              };
            },
            {
              concurrency:
                ctx.appConfig.concurrency.ASYNC_OPERATIONS_CONCURRENCY_COMMON,
            }
          )
        ).filter((item) => !!item);
      }

      const otherTokenBalancesMap =
        poolAddressesToFetch.length === 0
          ? new Map()
          : new Map(
              tokenBalancesManyResponse.map((balance) => [
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

export async function ensureXykpoolHisDataFromLatestPersistedData({
  poolId,
  ctx,
  blockNumber,
}: {
  poolId: string;
  blockNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  const latestHistData = await ctx.storeUtils.findOneWithLogs(
    XykpoolHistoricalDataLatest,
    { where: { id: poolId }, relations: { pool: true } }
  );

  if (!latestHistData) return;

  const newHistData = new XykpoolHistoricalData({
    id: `${poolId}-${blockNumber}`,
    pool: latestHistData.pool,
    assetAId: latestHistData.assetAId,
    assetBId: latestHistData.assetBId,
    assetABalance: latestHistData.assetABalance,
    assetBBalance: latestHistData.assetBBalance,
    tvlInRefAssetNorm: latestHistData.tvlInRefAssetNorm,
    paraBlockHeight: blockNumber,
  });

  return newHistData;
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

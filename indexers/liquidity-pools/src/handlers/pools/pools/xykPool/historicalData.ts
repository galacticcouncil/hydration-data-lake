import pMap from 'p-map';
import { LessThan } from 'typeorm';

import { BlockHeader } from '@subsquid/substrate-processor';
import { Store } from '@subsquid/typeorm-store';

import { XykpoolHistoricalData } from '../../../../model';
import parsers from '../../../../parsers';
import { BatchBlocksParsedDataManager } from '../../../../parsers/batchBlocksParser';
import { SqdProcessorContext } from '../../../../processor';
import { splitIntoBatches } from '../../../../utils/helpers';
import { getOrCreateXykPool } from './xykPool';
import { LatestProcessedDataCacheManager } from '../../../../utils/latestProcessedDataCacheManager';

export async function handleXykPoolHistoricalData(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  if (!ctx.appConfig.PROCESS_XYK_POOLS) return;

  const predefinedEntities: XykpoolHistoricalData[] = [];

  for (const blocksSubBatch of splitIntoBatches(
    ctx.blocks,
    ctx.appConfig.HISTORICAL_DATA_PROCESSING_SUB_BATCH_SIZE
  )) {
    const allPoolsPerBlock: Array<{
      blockHeader: BlockHeader;
      poolId: string;
    }> = [];

    await pMap(
      blocksSubBatch,
      async ({ header: blockHeader }) => {
        const poolShareTokenPairs =
          await parsers.storage.xyk.getPoolShareTokenPairsMany({
            block: blockHeader,
          });

        for (const item of poolShareTokenPairs) {
          allPoolsPerBlock.push({ blockHeader, poolId: item.poolId });
        }
      },
      {
        concurrency:
          ctx.appConfig.concurrency.ASYNC_OPERATIONS_CONCURRENCY_COMMON,
      }
    );

    await pMap(
      allPoolsPerBlock,
      async ({ poolId, blockHeader }) => {
        const pool = await getOrCreateXykPool({
          ctx,
          id: poolId,
          ensure: true,
          blockHeader,
        });

        // TODO after merge check
        if (!pool || !pool.assetAId || !pool.assetBId) return;

        const assetsData = new Map(
          (
            await Promise.all(
              // TODO assetRegistryId should be used instead
              [+pool.assetAId, +pool.assetBId].map(async (assetId) => ({
                assetId,
                data: await parsers.storage.xyk.getPoolAssetInfo({
                  assetId: assetId!,
                  block: blockHeader,
                  poolAddress: poolId,
                }),
              }))
            )
          )
            .filter((assetData) => !!assetData)
            .map((assetData) => [`${assetData.assetId}`, assetData.data])
        );

        const block = ctx.batchState.getParaBlockFromCacheByHeight(
          blockHeader.height
        );
        if (!block) {
          throw new Error(
            `Block not found in cache for height ${blockHeader.height}`
          );
        }

        const poolHistoricalDataEntity = new XykpoolHistoricalData({
          id: `${poolId}-${blockHeader.height}`,
          pool,
          assetAId: pool.assetAId,
          assetBId: pool.assetBId,
          assetABalance: assetsData.get(pool.assetAId)?.free ?? BigInt(0),
          assetBBalance: assetsData.get(pool.assetBId)?.free ?? BigInt(0),
          tvlInRefAssetNorm: '0',

          paraBlockHeight: blockHeader.height,
        });

        predefinedEntities.push(poolHistoricalDataEntity);
      },
      {
        concurrency:
          ctx.appConfig.concurrency.ASYNC_OPERATIONS_CONCURRENCY_COMMON,
      }
    );
  }

  ctx.batchState.state.xykPoolAllHistoricalData = new Map(
    predefinedEntities.map((item) => [item.id, item])
  );

  // await ctx.storeUtils.upsertWithBatches(predefinedEntities);
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

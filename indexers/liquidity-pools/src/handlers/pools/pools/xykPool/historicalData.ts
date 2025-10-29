import { SqdProcessorContext } from '../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../../../parsers/batchBlocksParser';
import parsers from '../../../../parsers';
import { XykpoolHistoricalData } from '../../../../model';
import { getOrCreateXykPool } from './xykPool';
import { splitIntoBatches } from '../../../../utils/helpers';
import { BlockHeader } from '@subsquid/substrate-processor';
import pMap from 'p-map';
import { LessThan } from 'typeorm';

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

        if (!pool || !pool.assetA || !pool.assetB) return;

        const assetsData = new Map(
          (
            await Promise.all(
              [+pool.assetA.id, +pool.assetB.id].map(async (assetId) => ({
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

        const poolHistoricalDataEntity = new XykpoolHistoricalData({
          id: `${poolId}-${blockHeader.height}`,
          pool,
          assetA: pool.assetA,
          assetB: pool.assetB,
          assetABalance: assetsData.get(pool.assetA.id)?.free ?? BigInt(0),
          assetBBalance: assetsData.get(pool.assetB.id)?.free ?? BigInt(0),
          tvlInRefAssetNorm: '0',

          relayBlockHeight:
            ctx.batchState.state.relayChainInfo.get(blockHeader.height)
              ?.relaychainBlockNumber ?? 0,
          paraBlockHeight: blockHeader.height,
          blockId: blockHeader.id,
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

  await ctx.storeUtils.upsertWithBatches(predefinedEntities);

  // if (!ctx.appConfig.PERSIST_HIST_DATA_ONLY_ON_CHANGE) {
  //   await ctx.store.save(
  //     Array.from(ctx.batchState.state.xykPoolAllHistoricalData.values())
  //   );
  //   return;
  // }
  //
  // const entitiesToSave = await getXykpoolHistDataWithUniqueData(
  //   ctx.batchState.state.xykPoolAllHistoricalData,
  //   ctx
  // );
  // await ctx.store.save(Array.from(entitiesToSave.values()));
}

export async function getXykpoolHistDataWithUniqueData(
  poolsData: Map<string, XykpoolHistoricalData>,
  ctx: SqdProcessorContext<Store>
) {
  const poolsResult: Map<string, XykpoolHistoricalData> = new Map();

  const poolsHistoryIndex = new Map<string, XykpoolHistoricalData[]>();

  for (const i of (
    poolsData || ctx.batchState.state.xykPoolAllHistoricalData
  ).values()) {
    if (!poolsHistoryIndex.has(i.pool.id)) {
      poolsHistoryIndex.set(i.pool.id, []);
    }
    poolsHistoryIndex.get(i.pool.id)!.push(i);
  }

  for (const [poolId, list] of poolsHistoryIndex.entries()) {
    poolsHistoryIndex.set(
      poolId,
      list.sort((a, b) => b.paraBlockHeight - a.paraBlockHeight)
    );
  }

  await pMap(
    Array.from(poolsData.values()),
    async (item) => {
      if (
        await isXykpoolHistoricalDataUniqueRegardingPreviousRecord({
          currentRecord: item,
          cachedIndexedRecords: poolsHistoryIndex,
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
    previousItem = await ctx.storeUtils.findOneWithLogs(XykpoolHistoricalData, {
      where: {
        pool: { id: currentRecord.pool.id },
        paraBlockHeight: LessThan(currentRecord.paraBlockHeight),
      },
      order: {
        paraBlockHeight: 'DESC',
      },
    }, { className: 'XykpoolHistoricalData' });
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

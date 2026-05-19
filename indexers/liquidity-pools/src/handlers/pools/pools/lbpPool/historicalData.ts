import pMap from 'p-map';
import { LessThan } from 'typeorm';

import { BlockHeader } from '@subsquid/substrate-processor';
import { Store } from '@subsquid/typeorm-store';

import {
  Lbppool,
  LbppoolHistoricalData,
} from '../../../../model';
import parsers from '../../../../parsers';
import {
  BatchBlocksParsedDataManager,
} from '../../../../parsers/batchBlocksParser';
import { SqdProcessorContext } from '../../../../processor';
import { splitIntoBatches } from '../../../../utils/helpers';
import { getOrCreateAccount } from '../../../accounts';
import { getOrCreateAsset } from '../../../assets/asset';
import { getOrCreateLbppool } from './lbpPool';

export async function handleLbppoolHistoricalData(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  if (!ctx.appConfig.PROCESS_LBP_POOLS) return;

  const predefinedEntities = [];

  for (const blocksSubBatch of splitIntoBatches(
    ctx.blocks,
    ctx.appConfig.HISTORICAL_DATA_PROCESSING_SUB_BATCH_SIZE
  )) {
    const allPoolsPerBlock: Array<{
      blockHeader: BlockHeader;
      pools: Lbppool[];
    }> = await Promise.all(
      blocksSubBatch.map(async ({ header: blockHeader }) => {
        const poolsStorageData = await parsers.storage.lbp.getAllPoolsData({
          block: blockHeader,
        });
        const poolEntitiesPromises = [];

        for (const poolStorageData of poolsStorageData) {
          poolEntitiesPromises.push(
             getOrCreateLbppool({
              ctx,
              assetIds: [poolStorageData.assetAId, poolStorageData.assetBId],
              ensure: true,
              blockHeader,
              poolStorageData,
            })
          );
        }
        const poolEntities = await Promise.all(poolEntitiesPromises);
        return {
          blockHeader,
          pools: poolEntities.filter((item) => !!item) as Lbppool[],
        };
      })
    );

    predefinedEntities.push(
      await Promise.all(
        allPoolsPerBlock
          .map(({ blockHeader, pools }) =>
            pools.map((pool) => ({
              blockHeader: blockHeader,
              pool,
            }))
          )
          .flat()
          .map(async ({ pool, blockHeader }) => {
            const poolStorageData = await parsers.storage.lbp.getPoolData({
              block: blockHeader,
              poolAddress: pool.accountId,
            });

            if (!poolStorageData) return null;

            const assetsData = new Map(
              (
                await Promise.all(
                  [pool.assetAId, pool.assetBId].map(async (assetId) => ({
                    assetId,
                    data: await parsers.storage.lbp.getPoolAssetInfo({
                      assetId: +assetId!,
                      block: blockHeader,
                      poolAddress: pool.accountId,
                    }),
                  }))
                )
              )
                .filter((assetData) => !!assetData)
                .map((assetData) => [assetData.assetId, assetData.data])
            );

            // Parallel asset fetching
            const [assetAEntity, assetBEntity] = await Promise.all([
              getOrCreateAsset({
                ctx,
                id: pool.assetAId,
                ensure: true,
                blockHeader,
              }),
              getOrCreateAsset({
                ctx,
                id: pool.assetBId,
                ensure: true,
                blockHeader,
              }),
            ]);

            if (
              !assetAEntity ||
              !assetAEntity.assetRegistryId ||
              !assetBEntity ||
              !assetBEntity.assetRegistryId
            )
              return null;

            const block = ctx.batchState.getParaBlockFromCacheByHeight(blockHeader.height);
            if (!block) {
              throw new Error(`Block not found in cache for height ${blockHeader.height}`);
            }

            // Parallel account fetching
            const [owner, feeCollector] = await Promise.all([
              getOrCreateAccount({
                ctx,
                id: poolStorageData.owner,
              }),
              poolStorageData.feeCollector
                ? getOrCreateAccount({
                    ctx,
                    id: poolStorageData.feeCollector,
                  })
                : Promise.resolve(null),
            ]);

            const poolHistoricalDataEntity = new LbppoolHistoricalData({
              id: `${pool.accountId}-${blockHeader.height}`,
              pool: pool,
              assetAId: assetAEntity.id,
              assetBId: assetBEntity.id,
              assetABalance:
                assetsData.get(assetAEntity.assetRegistryId)?.free ?? BigInt(0),
              assetBBalance:
                assetsData.get(assetBEntity.assetRegistryId)?.free ?? BigInt(0),
              tvlInRefAssetNorm: '0',
              ownerId: owner.id,
              startBlockNumber: poolStorageData.start,
              endBlockNumber: poolStorageData.end,
              initialWeight: poolStorageData.initialWeight,
              finalWeight: poolStorageData.finalWeight,
              weightCurve: poolStorageData.weightCurve.__kind,
              fee: poolStorageData.fee,
              feeCollectorId: feeCollector ? feeCollector.id : null,
              repayTarget: poolStorageData.repayTarget,

              paraBlockHeight: blockHeader.height,
            });

            return poolHistoricalDataEntity;
          })
      )
    );
  }
  ctx.batchState.state.lbpPoolAllHistoricalData = new Map(
    predefinedEntities
      .flat()
      .filter((item) => !!item)
      .map((item) => [item.id, item])
  );

  if (!ctx.appConfig.PERSIST_HIST_DATA_ONLY_ON_CHANGE) {
    await ctx.storeUtils.upsertWithBatches(
      Array.from(ctx.batchState.state.lbpPoolAllHistoricalData.values())
    );
    return;
  }
  const entitiesToSave = await getLbppoolHistDataWithUniqueData(
    ctx.batchState.state.lbpPoolAllHistoricalData,
    ctx
  );
  await ctx.storeUtils.upsertWithBatches(Array.from(entitiesToSave.values()));
}

export async function getLbppoolHistDataWithUniqueData(
  poolsData: Map<string, LbppoolHistoricalData>,
  ctx: SqdProcessorContext<Store>
) {
  const poolsResult: Map<string, LbppoolHistoricalData> = new Map();

  const poolsHistoryIndex = new Map<string, LbppoolHistoricalData[]>();

  for (const i of (
    poolsData || ctx.batchState.state.lbpPoolAllHistoricalData
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
        await isLbppoolHistoricalDataUniqueRegardingPreviousRecord({
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

export async function isLbppoolHistoricalDataUniqueRegardingPreviousRecord({
  currentRecord,
  cachedIndexedRecords,
  ctx,
}: {
  currentRecord: LbppoolHistoricalData;
  cachedIndexedRecords: Map<string, LbppoolHistoricalData[]>;
  ctx: SqdProcessorContext<Store>;
}) {
  let previousItem = (
    cachedIndexedRecords.get(currentRecord.pool.id) || []
  ).find((i) => i.paraBlockHeight < currentRecord.paraBlockHeight);

  if (!previousItem) {
    previousItem = await ctx.storeUtils.findOneWithLogs(LbppoolHistoricalData, {
      where: {
        pool: { id: currentRecord.pool.id },
        paraBlockHeight: LessThan(currentRecord.paraBlockHeight),
      },
      order: {
        paraBlockHeight: 'DESC',
      },
    }, {
      className: 'LbppoolHistoricalData',
      originCallFn: 'isLbppoolHistoricalDataUniqueRegardingPreviousRecord',
    });
  }

  if (!previousItem) {
    return true;
  }

  let isEqual = true;

  if (
    previousItem.assetABalance !== currentRecord.assetABalance ||
    previousItem.assetBBalance !== currentRecord.assetBBalance ||
    previousItem.ownerId !== currentRecord.ownerId ||
    previousItem.feeCollectorId !== currentRecord.feeCollectorId ||
    previousItem.startBlockNumber !== currentRecord.startBlockNumber ||
    previousItem.endBlockNumber !== currentRecord.endBlockNumber ||
    previousItem.initialWeight !== currentRecord.initialWeight ||
    previousItem.finalWeight !== currentRecord.finalWeight ||
    previousItem.repayTarget !== currentRecord.repayTarget ||
    previousItem.weightCurve !== currentRecord.weightCurve ||
    previousItem.fee.join(',') !== currentRecord.fee.join(',')
  ) {
    isEqual = false;
  }

  return !isEqual;
}

import pMap from 'p-map';
import { LessThan } from 'typeorm';

import { BlockHeader } from '@subsquid/substrate-processor';
import { Store } from '@subsquid/typeorm-store';

import {
  OmnipoolAssetHistoricalData,
  OmnipoolHistoricalData,
} from '../../../../model';
import parsers from '../../../../parsers';
import { BatchBlocksParsedDataManager } from '../../../../parsers/batchBlocksParser';
import { SqdProcessorContext } from '../../../../processor';
import { splitIntoBatches } from '../../../../utils/helpers';
import { getOrCreateAsset } from '../../../assets/asset';
import { getOrCreateOmnipoolAsset } from './omnipoolAssets';
import { OmnipoolAssetData } from '../../../../parsers/types/storage';

export async function handleOmnipoolHistoricalData(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  if (!ctx.appConfig.PROCESS_OMNIPOOLS) return;

  const predefinedEntities = [];

  for (const blocksSubBatch of splitIntoBatches(
    ctx.blocks,
    ctx.appConfig.HISTORICAL_DATA_PROCESSING_SUB_BATCH_SIZE
  )) {
    const allPoolAssetsPerBlock: Array<{
      blockHeader: BlockHeader;
      assetRegistryIds: number[];
      assetsData: Map<number, OmnipoolAssetData>;
    }> = await pMap(
      blocksSubBatch,
      async ({ header: blockHeader }) => {
        const assetRegistryIds =
          await parsers.storage.omnipool.getOmnipoolAllAssetIds({
            block: blockHeader,
          });
        const allAssetsDataPerBlock =
          (await parsers.storage.omnipool.getOmnipoolAllAssetsData({
            block: blockHeader,
          })) || [];

        /**
         * We need add H2O asset manually as it's not presented in storage
         */
        assetRegistryIds.push(1);
        const assetsDataMap: Map<number, OmnipoolAssetData> = new Map();

        assetsDataLoop: for (const assetData of allAssetsDataPerBlock) {
          if (!assetData.data) continue assetsDataLoop;
          assetsDataMap.set(assetData.assetId, assetData.data);
        }

        return {
          blockHeader,
          assetRegistryIds,
          assetsData: assetsDataMap,
        };
      },
      {
        concurrency:
          ctx.appConfig.concurrency.ASYNC_OPERATIONS_CONCURRENCY_COMMON,
      }
    );

    predefinedEntities.push(
      await pMap(
        allPoolAssetsPerBlock
          .map(({ blockHeader, assetRegistryIds, assetsData }) =>
            assetRegistryIds.map((arAssetId) => ({
              blockHeader: blockHeader,
              arAssetId,
              assetData: assetsData.get(arAssetId),
            }))
          )
          .flat(),
        async ({ arAssetId, assetData, blockHeader }) => {
          if (
            !ctx.batchState.state.omnipoolAllHistoricalData.has(
              `${ctx.appConfig.OMNIPOOL_ADDRESS}-${blockHeader.height}`
            )
          ) {
            const block = ctx.batchState.getParaBlockFromCacheByHeight(
              blockHeader.height
            );
            if (!block) {
              throw new Error(
                `Block not found in cache for height ${blockHeader.height}`
              );
            }

            ctx.batchState.state.omnipoolAllHistoricalData.set(
              `${ctx.appConfig.OMNIPOOL_ADDRESS}-${blockHeader.height}`,
              new OmnipoolHistoricalData({
                id: `${ctx.appConfig.OMNIPOOL_ADDRESS}-${blockHeader.height}`,
                pool: ctx.batchState.state.omnipoolEntity!,
                tvlTotalInRefAssetNorm: '0',

                paraBlockHeight: blockHeader.height,
              })
            );
          }

          const assetStateStorageData =
            assetData ??
            (await parsers.storage.omnipool.getOmnipoolAssetData({
              assetId: arAssetId,
              block: blockHeader,
            }));

          let hubAssetTradeability = null;

          if (arAssetId === 1) {
            hubAssetTradeability =
              await parsers.storage.omnipool.getOmnipoolHubAssetTradability({
                block: blockHeader,
              });
          }

          if (
            (arAssetId !== 1 && !assetStateStorageData) ||
            (arAssetId === 1 && !hubAssetTradeability)
          )
            return null;

          const assetsBalances =
            await parsers.storage.omnipool.getPoolAssetInfo({
              assetId: arAssetId,
              block: blockHeader,
              poolAddress: ctx.appConfig.OMNIPOOL_ADDRESS,
            });

          if (!assetsBalances) return null;

          if (!ctx.batchState.state.omnipoolEntity) return null;

          const asset = await getOrCreateAsset({
            ctx,
            assetRegistryId: arAssetId,
            ensure: true,
            blockHeader,
          });

          if (!asset) return null;

          const omnipoolAsset = await getOrCreateOmnipoolAsset({
            ctx,
            assetId: asset.id,
            ensure: true,
            blockHeader,
          });

          if (!omnipoolAsset) return null;

          const assetBlock = ctx.batchState.getParaBlockFromCacheByHeight(
            blockHeader.height
          );
          if (!assetBlock) {
            throw new Error(
              `Block not found in cache for height ${blockHeader.height}`
            );
          }

          const newEntity = new OmnipoolAssetHistoricalData({
            id: `${ctx.appConfig.OMNIPOOL_ADDRESS}-${asset.id}-${blockHeader.height}`,
            assetId: asset.id,
            omnipoolAsset,
            poolHistoricalData:
              ctx.batchState.state.omnipoolAllHistoricalData.get(
                `${ctx.appConfig.OMNIPOOL_ADDRESS}-${blockHeader.height}`
              )!,

            assetCap: assetStateStorageData?.cap ?? 0n,
            assetShares: assetStateStorageData?.shares ?? 0n,
            assetHubReserve: assetStateStorageData?.hubReserve ?? 0n,
            assetProtocolShares: assetStateStorageData?.protocolShares ?? 0n,
            tradable:
              arAssetId === 1
                ? hubAssetTradeability!.bits
                : assetStateStorageData!.tradable.bits,
            freeBalance: assetsBalances.free,
            tvlInRefAssetNorm: '0',

            paraBlockHeight: blockHeader.height,
          });

          return newEntity;
        },
        {
          concurrency:
            ctx.appConfig.concurrency.ASYNC_OPERATIONS_CONCURRENCY_COMMON,
        }
      )
    );
  }

  ctx.batchState.state.omnipoolAssetAllHistoricalData = new Map(
    predefinedEntities
      .flat()
      .filter((item) => !!item)
      .map((item) => [item.id, item])
  );

  // await ctx.storeUtils.upsertWithBatches(
  //   Array.from(ctx.batchState.state.omnipoolAllHistoricalData.values())
  // );
  // await ctx.storeUtils.upsertWithBatches(
  //   Array.from(ctx.batchState.state.omnipoolAssetAllHistoricalData.values())
  // );
}

export async function getOmnipoolHistDataWithUniqueData({
  ctx,
  poolsData,
  poolAssetsData,
}: {
  poolsData: Map<string, OmnipoolHistoricalData>;
  poolAssetsData: Map<string, OmnipoolAssetHistoricalData>;
  ctx: SqdProcessorContext<Store>;
}) {
  const poolsResult: Map<string, OmnipoolHistoricalData> = new Map();
  const poolAssetsResult: Map<string, OmnipoolAssetHistoricalData> = new Map();

  const poolAssetsHistoryIndex = new Map<
    string,
    OmnipoolAssetHistoricalData[]
  >();

  for (const i of (
    poolAssetsData || ctx.batchState.state.omnipoolAssetAllHistoricalData
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
    Array.from(poolAssetsData.values()).filter(
      (assetData) => !poolAssetsResult.has(assetData.id)
    ),
    async (item) => {
      if (
        await isOmnipoolAssetHistoricalDataUniqueRegardingPreviousRecord({
          currentRecord: item,
          cachedIndexedRecords: poolAssetsHistoryIndex,
          ctx,
        })
      ) {
        poolAssetsResult.set(item.id, item);
        const poolHistDataId = `${item.omnipoolAsset.pool.id}-${item.paraBlockHeight}`;
        poolsResult.set(poolHistDataId, poolsData.get(poolHistDataId)!);

        /**
         * We need to add all pool's assets data if at least one asset has
         * changed data to keep data in API consistent
         */
        innerLoop: for (const assetId of poolAssetsHistoryIndex.keys()) {
          if (assetId === item.assetId) continue innerLoop;

          const pairAssetRecordId = `${item.omnipoolAsset.pool.id}-${assetId}-${item.paraBlockHeight}`;
          poolAssetsResult.set(
            pairAssetRecordId,
            poolAssetsData.get(pairAssetRecordId)!
          );
        }
      }
    },
    {
      concurrency:
        ctx.appConfig.concurrency.ASYNC_OPERATIONS_CONCURRENCY_COMMON,
    }
  );

  return {
    pools: poolsResult,
    poolAssets: poolAssetsResult,
  };
}

export async function isOmnipoolAssetHistoricalDataUniqueRegardingPreviousRecord({
  currentRecord,
  cachedIndexedRecords,
  ctx,
}: {
  currentRecord: OmnipoolAssetHistoricalData;
  cachedIndexedRecords: Map<string, OmnipoolAssetHistoricalData[]>;
  ctx: SqdProcessorContext<Store>;
}) {
  let previousItem = (
    cachedIndexedRecords.get(currentRecord.assetId)! || []
  ).find((i) => i.paraBlockHeight < currentRecord.paraBlockHeight);

  if (!previousItem) {
    previousItem = await ctx.storeUtils.findOneWithLogs(
      OmnipoolAssetHistoricalData,
      {
        where: {
          assetId: currentRecord.assetId,
          paraBlockHeight: LessThan(currentRecord.paraBlockHeight),
        },
        order: {
          paraBlockHeight: 'DESC',
        },
      },
      { className: 'OmnipoolAssetHistoricalData' }
    );
  }

  if (!previousItem) {
    return true;
  }

  let isEqual = true;

  if (
    previousItem.assetCap !== currentRecord.assetCap ||
    previousItem.assetShares !== currentRecord.assetShares ||
    previousItem.assetHubReserve !== currentRecord.assetHubReserve ||
    previousItem.assetProtocolShares !== currentRecord.assetProtocolShares ||
    previousItem.freeBalance !== currentRecord.freeBalance ||
    previousItem.tradable !== currentRecord.tradable
  ) {
    isEqual = false;
  }

  return !isEqual;
}

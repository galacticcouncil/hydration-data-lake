import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import parsers from '../../parsers';
import { XykPoolHistoricalData } from '../../model';
import { getXykPool } from './xykPool';

export async function handleXykPoolHistoricalData(
  ctx: ProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  if (!ctx.appConfig.PROCESS_XYK_POOLS) return;

  const predefinedEntities = await Promise.all(
    [...ctx.batchState.state.xykPoolIdsForStoragePrefetch.entries()]
      .map(([blockNumber, { blockHeader, ids }]) =>
        [...ids.values()].map((poolId) => ({
          blockHeader: blockHeader,
          poolId,
        }))
      )

      .flat()
      .map(async ({ poolId, blockHeader }) => {
        const pool = await getXykPool({ ctx, id: poolId });

        if (!pool || !pool.assetA || !pool.assetB) return null;

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

        const poolHistoricalDataEntity = new XykPoolHistoricalData({
          id: `${poolId}-${blockHeader.height}`,
          pool,
          assetA: pool.assetA,
          assetB: pool.assetB,
          assetABalance: assetsData.get(pool.assetA.id)?.free ?? BigInt(0),
          assetBBalance: assetsData.get(pool.assetB.id)?.free ?? BigInt(0),
          relayChainBlockHeight:
            ctx.batchState.state.relayChainInfo.get(blockHeader.height)
              ?.relaychainBlockNumber ?? 0,
          paraChainBlockHeight: blockHeader.height,
        });

        return poolHistoricalDataEntity;
      })
  );

  const predefinedEntitiesWithoutDuplicates = new Map(
    predefinedEntities.filter((item) => !!item).map((item) => [item.id, item])
  );

  await ctx.store.save([...predefinedEntitiesWithoutDuplicates.values()]);
}

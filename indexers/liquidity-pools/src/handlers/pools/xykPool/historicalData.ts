import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../../parsers/batchBlocksParser';
import parsers from '../../../parsers';
import { XykpoolHistoricalData } from '../../../model';
import { getOrCreateXykPool } from './xykPool';
import { splitIntoBatches } from '../../../utils/helpers';
import { BlockHeader } from '@subsquid/substrate-processor';

export async function handleXykPoolHistoricalData(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  if (!ctx.appConfig.PROCESS_XYK_POOLS) return;

  const predefinedEntities = [];

  for (const blocksSubBatch of splitIntoBatches(
    ctx.blocks,
    ctx.appConfig.HISTORICAL_DATA_PROCESSING_SUB_BATCH_SIZE
  )) {
    const allPoolsPerBlock: Array<{ blockHeader: BlockHeader; ids: string[] }> =
      await Promise.all(
        blocksSubBatch.map(async ({ header: blockHeader }) => {
          const poolShareTokenPairs =
            await parsers.storage.xyk.getPoolShareTokenPairsMany({
              block: blockHeader,
            });
          return {
            blockHeader,
            ids: poolShareTokenPairs.map(({ poolId }) => poolId),
          };
        })
      );

    predefinedEntities.push(
      await Promise.all(
        allPoolsPerBlock
          .map(({ blockHeader, ids }) =>
            ids.map((poolId) => ({
              blockHeader: blockHeader,
              poolId,
            }))
          )
          .flat()
          .map(async ({ poolId, blockHeader }) => {
            const pool = await getOrCreateXykPool({
              ctx,
              id: poolId,
              ensure: true,
              blockHeader,
              parent: 'handleXykPoolHistoricalData',
            });

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

            const poolHistoricalDataEntity = new XykpoolHistoricalData({
              id: `${poolId}-${blockHeader.height}`,
              pool,
              assetA: pool.assetA,
              assetB: pool.assetB,
              assetABalance: assetsData.get(pool.assetA.id)?.free ?? BigInt(0),
              assetBBalance: assetsData.get(pool.assetB.id)?.free ?? BigInt(0),

              relayBlockHeight:
                ctx.batchState.state.relayChainInfo.get(blockHeader.height)
                  ?.relaychainBlockNumber ?? 0,
              paraBlockHeight: blockHeader.height,
              block: ctx.batchState.state.batchBlocks.get(blockHeader.id),
            });

            return poolHistoricalDataEntity;
          })
      )
    );
  }

  ctx.batchState.state.xykPoolAllHistoricalData = new Map(
    predefinedEntities
      .flat()
      .filter((item) => !!item)
      .map((item) => [item.id, item])
  );

  await ctx.store.save(
    Array.from(ctx.batchState.state.xykPoolAllHistoricalData.values())
  );
}

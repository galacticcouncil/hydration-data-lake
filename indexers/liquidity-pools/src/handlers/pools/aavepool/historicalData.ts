import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../../parsers/batchBlocksParser';
import parsers from '../../../parsers';
import { Aavepool, AavepoolHistoricalData } from '../../../model';
import { getOrCreateAavepool } from './aavepool';
import { splitIntoBatches } from '../../../utils/helpers';
import { BlockHeader } from '@subsquid/substrate-processor';
import {
  AaveTradeExecutorPoolData,
  AaveTradeExecutorPoolDataWithPoolId,
} from '../../../parsers/runtimeApiResolver/types';
import pMap from 'p-map';

export async function handleAavepoolHistoricalData(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  ctx.batchState.state.aavePools = new Map(
    (
      await ctx.store.find(Aavepool, {
        where: {},
        relations: { reserveAsset: true, aToken: true, historicalData: true },
      })
    ).map((p) => [p.id, p])
  );

  const predefinedEntities: AavepoolHistoricalData[] = [];

  for (const blocksSubBatch of splitIntoBatches(
    ctx.blocks,
    ctx.appConfig.HISTORICAL_DATA_PROCESSING_SUB_BATCH_SIZE
  )) {
    const allPoolsPerBlock: Array<{
      blockHeader: BlockHeader;
      poolData: AaveTradeExecutorPoolDataWithPoolId;
    }> = [];

    // console.time(`:: >>> handleAavepoolHistoricalData - getPools`);
    await pMap(
      blocksSubBatch,
      async ({ header: blockHeader }): Promise<void> => {
        const poolsData = await parsers.storage.aaveTradeExecutor.getPools({
          block: blockHeader,
        });
        if (!poolsData) return;

        for (const poolData of poolsData) {
          allPoolsPerBlock.push({
            blockHeader: blockHeader,
            poolData: poolData,
          });
        }
      },
      { concurrency: ctx.appConfig.ASYNC_OPERATIONS_CONCURRENCY_COMMON }
    );
    // console.timeEnd(`:: >>> handleAavepoolHistoricalData - getPools`);
    //
    // console.time(`:: >>> handleAavepoolHistoricalData - getOrCreateAavepool`);
    await pMap(
      allPoolsPerBlock,
      async ({ poolData, blockHeader }) => {
        const pool = await getOrCreateAavepool({
          ctx,
          reserveAssetId: `${poolData.data.reserve}`,
          aTokenId: `${poolData.data.aToken}`,
          ensure: true,
          blockHeader,
        });

        if (!pool) return;

        const poolHistoricalDataEntity = new AavepoolHistoricalData({
          id: `${pool.id}-${blockHeader.height}`,
          pool,

          liquidityIn: poolData.data.liquidityIn,
          liquidityOut: poolData.data.liquidityOut,

          relayBlockHeight:
            ctx.batchState.state.relayChainInfo.get(blockHeader.height)
              ?.relaychainBlockNumber ?? 0,
          paraBlockHeight: blockHeader.height,
          block: ctx.batchState.state.batchBlocks.get(blockHeader.id),
        });

        predefinedEntities.push(poolHistoricalDataEntity);
      },
      { concurrency: ctx.appConfig.ASYNC_OPERATIONS_CONCURRENCY_COMMON }
    );
    // console.timeEnd(
    //   `:: >>> handleAavepoolHistoricalData - getOrCreateAavepool`
    // );
  }

  ctx.batchState.state.aavePoolsHistoricalData = new Map(
    predefinedEntities.map((item) => [item.id, item])
  );

  await ctx.store.save(predefinedEntities);
}

//
// export async function handleAavepoolHistoricalData(
//   ctx: SqdProcessorContext<Store>,
//   parsedEvents: BatchBlocksParsedDataManager
// ) {
//   const predefinedEntities = [];
//
//   for (const blocksSubBatch of splitIntoBatches(
//     ctx.blocks,
//     ctx.appConfig.HISTORICAL_DATA_PROCESSING_SUB_BATCH_SIZE
//   )) {
//     for (const { header: blockHeader } of blocksSubBatch) {
//       const poolsData =
//         (await parsers.storage.aaveTradeExecutor.getPools({
//           block: blockHeader,
//         })) || [];
//
//       // Process all pools for this block in a single batch
//       const poolEntities = await Promise.all(
//         poolsData.map(async (poolData) => {
//           const pool = await getOrCreateAavepool({
//             ctx,
//             reserveAssetId: `${poolData.data.reserve}`,
//             aTokenId: `${poolData.data.aToken}`,
//             ensure: true,
//             blockHeader,
//           });
//
//           if (!pool) return null;
//
//           return new AavepoolHistoricalData({
//             id: `${pool.id}-${blockHeader.height}`,
//             pool,
//             liquidityIn: poolData.data.liquidityIn,
//             liquidityOut: poolData.data.liquidityOut,
//             relayBlockHeight:
//               ctx.batchState.state.relayChainInfo.get(blockHeader.height)
//                 ?.relaychainBlockNumber ?? 0,
//             paraBlockHeight: blockHeader.height,
//             block: ctx.batchState.state.batchBlocks.get(blockHeader.id),
//           });
//         })
//       );
//
//       predefinedEntities.push(...poolEntities.filter(Boolean));
//     }
//   }
//
//   ctx.batchState.state.aavePoolsHistoricalData = new Map(
//     predefinedEntities.map((item): [string, AavepoolHistoricalData] => [
//       item!.id,
//       item!,
//     ])
//   );
//
//   await ctx.store.save(
//     Array.from(ctx.batchState.state.aavePoolsHistoricalData.values())
//   );
// }
//
//
// export async function handleAavepoolHistoricalData(
//   ctx: SqdProcessorContext<Store>,
//   parsedEvents: BatchBlocksParsedDataManager
// ) {
//   const predefinedEntities = [];
//
//   for (const blocksSubBatch of splitIntoBatches(
//     ctx.blocks,
//     ctx.appConfig.HISTORICAL_DATA_PROCESSING_SUB_BATCH_SIZE
//   )) {
//     console.time(`::handleAavepoolHistoricalData - getPools`);
//     const allPoolsPerBlock: Array<{
//       blockHeader: BlockHeader;
//       poolsData: AaveTradeExecutorPoolDataWithPoolId[];
//     }> = await Promise.all(
//       blocksSubBatch.map(async ({ header: blockHeader }) => {
//         const poolsData = await parsers.storage.aaveTradeExecutor.getPools({
//           block: blockHeader,
//         });
//
//         return {
//           blockHeader,
//           poolsData: poolsData || [],
//         };
//       })
//     );
//     console.timeEnd(`::handleAavepoolHistoricalData - getPools`);
//
//     predefinedEntities.push(
//       await Promise.all(
//         allPoolsPerBlock
//           .map(({ blockHeader, poolsData }) =>
//             poolsData.map((poolData) => ({
//               blockHeader: blockHeader,
//               poolData,
//             }))
//           )
//           .flat()
//           .map(async ({ poolData, blockHeader }) => {
//             const pool = await getOrCreateAavepool({
//               ctx,
//               reserveAssetId: `${poolData.data.reserve}`,
//               aTokenId: `${poolData.data.aToken}`,
//               ensure: true,
//               blockHeader,
//             });
//
//             if (!pool) return null;
//
//             const poolHistoricalDataEntity = new AavepoolHistoricalData({
//               id: `${pool.id}-${blockHeader.height}`,
//               pool,
//
//               liquidityIn: poolData.data.liquidityIn,
//               liquidityOut: poolData.data.liquidityOut,
//
//               relayBlockHeight:
//                 ctx.batchState.state.relayChainInfo.get(blockHeader.height)
//                   ?.relaychainBlockNumber ?? 0,
//               paraBlockHeight: blockHeader.height,
//               block: ctx.batchState.state.batchBlocks.get(blockHeader.id),
//             });
//
//             return poolHistoricalDataEntity;
//           })
//       )
//     );
//   }
//
//   ctx.batchState.state.aavePoolsHistoricalData = new Map(
//     predefinedEntities
//       .flat()
//       .filter((item) => !!item)
//       .map((item) => [item.id, item])
//   );
//
//   await ctx.store.save(
//     Array.from(ctx.batchState.state.aavePoolsHistoricalData.values())
//   );
// }

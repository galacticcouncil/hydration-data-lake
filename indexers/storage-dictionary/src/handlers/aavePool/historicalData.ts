import { Block, ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { Aavepool, Lbppool } from '../../model';
import { getAllAavePools } from './index';
import { getOrCreateAsset } from '../asset/assetRegistry';
import { Between } from 'typeorm/find-options/operator/Between';

export async function handleAavePoolsStorage(
  ctx: ProcessorContext<Store>,
  blockHeader: Block
): Promise<void> {
  if (ctx.batchState.state.aavepoolsProcessedBlocks.has(blockHeader.height))
    return;

  const relayChainInfo = ctx.batchState.state.relayChainInfo;
  const poolsToSave: Aavepool[] = [];

  const allAavePools = await getAllAavePools({ block: blockHeader });

  if (allAavePools.length === 0) return;

  for (const { poolId, data } of allAavePools) {
    const aToken = await getOrCreateAsset({
      id: data.aToken,
      ctx,
      blockHeader,
      ensure: true,
    });
    if (!aToken) continue;
    const reserveAsset = await getOrCreateAsset({
      id: data.reserve,
      ctx,
      blockHeader,
      ensure: true,
    });
    if (!reserveAsset) continue;

    const newPoolEntity = new Aavepool({
      id: `${poolId}-${blockHeader.height}`,
      poolId,
      reserveAsset,
      aToken,
      liquidityIn: data.liquidityIn,
      liquidityOut: data.liquidityOut,

      paraBlockHeight: blockHeader.height,
      relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
        blockHeader.height
      ).height,
    });

    poolsToSave.push(newPoolEntity);

    ctx.batchState.state.aavepools.set(newPoolEntity.id, newPoolEntity);
  }

  await ctx.store.upsert(poolsToSave);
}

export async function prefetchAllAavepoolRecordsForBlocksRangeToEnsureMissedBlocks(
  ctx: ProcessorContext<Store>
) {
  if (
    !ctx.appConfig.PROCESS_ONLY_MISSED_BLOCKS ||
    !ctx.appConfig.PROCESS_GENERIC_HIST_DATA
  )
    return;

  const orderedNumbers = ctx.blocks
    .map((b) => b.header.height)
    .sort((a, b) => a - b);

  const records = await ctx.store.find(Aavepool, {
    where: {
      paraBlockHeight: Between(
        orderedNumbers[0],
        orderedNumbers[orderedNumbers.length - 1]
      ),
    },
    relations: {
      reserveAsset: true,
      aToken: true,
    },
  });

  ctx.batchState.state.aavepools = new Map(records.map((r) => [r.id, r]));
  ctx.batchState.state.aavepoolsProcessedBlocks = new Set(
    records.map((r) => r.paraBlockHeight)
  );
  console.log(
    `Aavepool :: Blocks range: ${orderedNumbers[0]}/${orderedNumbers[orderedNumbers.length - 1]}. 
    Number of missed blocks: ${orderedNumbers.filter((b) => !ctx.batchState.state.aavepoolsProcessedBlocks.has(b)).length}/${orderedNumbers.length}`
  );
}

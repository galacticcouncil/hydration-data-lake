import { Block, ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { Aavepool } from '../../model';
import { getAllAavePools } from './index';
import { getOrCreateAsset } from '../asset/assetRegistry';

export async function handleAavePoolsStorage(
  ctx: ProcessorContext<Store>,
  blockHeader: Block
): Promise<void> {
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

    poolsToSave.push(
      new Aavepool({
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
      })
    );
  }

  await ctx.store.upsert(poolsToSave);
}

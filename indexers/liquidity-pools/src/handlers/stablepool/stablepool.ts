import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { Asset, Stablepool, StablepoolAsset } from '../../model';
import { getAccount } from '../accounts';
import { StableswapPoolCreatedData } from '../../parsers/batchBlocksParser/types';

import { StableMath } from '@galacticcouncil/sdk';
import { blake2AsHex, encodeAddress } from '@polkadot/util-crypto';
import { isNotNullOrUndefined } from '../../utils/helpers';
import { getAsset } from '../assets/assetRegistry';
import { getAssetFreeBalance } from '../assets/balances';

export async function getStablepool(
  ctx: ProcessorContext<Store>,
  poolId: string | number
) {
  const batchState = ctx.batchState.state;

  let pool = batchState.stablepoolAllBatchPools.get(`${poolId}`);
  if (pool) return pool;

  pool = await ctx.store.findOne(Stablepool, {
    where: { id: `${poolId}` },
    relations: { assets: { asset: true }, account: true },
  });

  return pool ?? null;
}

export async function stablepoolCreated(
  ctx: ProcessorContext<Store>,
  eventCallData: StableswapPoolCreatedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const poolsToSave = ctx.batchState.state.stablepoolIdsToSave;
  const allBatchPools = ctx.batchState.state.stablepoolAllBatchPools;
  const allBatchAssets = ctx.batchState.state.stablepoolAssetsAllBatch;

  const newPool = new Stablepool({
    id: `${eventParams.poolId}`,
    account: await getAccount(
      ctx,
      blake2AsHex(StableMath.getPoolAddress(eventParams.poolId))
    ),
    createdAt: new Date(eventMetadata.blockHeader.timestamp ?? Date.now()),
    createdAtParaBlock: eventMetadata.blockHeader.height,
    isDestroyed: false,
  });

  const assetsListPromise = eventParams.assets.map(
    async (assetId) =>
      new StablepoolAsset({
        id: `${newPool.id}-${assetId}`,
        pool: newPool,
        amount: await getAssetFreeBalance(
          eventMetadata.blockHeader,
          assetId,
          newPool.account.id
        ),
        asset: (await getAsset({
          ctx,
          id: assetId,
          ensure: true,
          blockHeader: eventMetadata.blockHeader,
        }))!, // TODO fix types
      })
  );
  for (const asset of (await Promise.all(assetsListPromise)).filter(
    isNotNullOrUndefined
  )) {
    allBatchAssets.set(+asset.asset.id, asset);
  }

  poolsToSave.add(newPool.id);
  ctx.batchState.state = { stablepoolIdsToSave: poolsToSave };

  allBatchPools.set(newPool.id, newPool);
  ctx.batchState.state = {
    stablepoolAllBatchPools: allBatchPools,
  };

  ctx.batchState.state = {
    stablepoolAssetsAllBatch: allBatchAssets,
  };
}

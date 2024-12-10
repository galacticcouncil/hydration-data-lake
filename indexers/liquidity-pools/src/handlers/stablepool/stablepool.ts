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

  const state = ctx.batchState.state;

  for (const asset of (await Promise.all(assetsListPromise)).filter(
    isNotNullOrUndefined
  )) {
    state.stablepoolAssetsAllBatch.set(+asset.asset.id, asset);
  }

  state.stablepoolIdsToSave.add(newPool.id);

  state.stablepoolAllBatchPools.set(newPool.id, newPool);

  await ctx.store.save(newPool.account);
  state.accounts.set(newPool.account.id, newPool.account);

  ctx.batchState.state = {
    accounts: state.accounts,
    stablepoolAssetsAllBatch: state.stablepoolAssetsAllBatch,
    stablepoolAllBatchPools: state.stablepoolAllBatchPools,
    stablepoolIdsToSave: state.stablepoolIdsToSave,
  };
}

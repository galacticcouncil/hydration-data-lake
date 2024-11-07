import { Block, ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { XykPool } from '../../model';
import { getAccount } from '../accounts';
import { XykPoolCreatedData } from '../../parsers/batchBlocksParser/types';
import { getAssetFreeBalance } from '../assets/balances';
import { getAsset } from '../assets/assetRegistry';

export async function getXykPool({
  ctx,
  id,
  ensure = false,
  blockHeader,
}: {
  ctx: ProcessorContext<Store>;
  id: string | number;
  ensure?: boolean;
  blockHeader?: Block;
}): Promise<XykPool | null> {
  const batchState = ctx.batchState.state;

  let pool = batchState.xykAllBatchPools.get(`${id}`);
  if (pool) return pool;

  pool = await ctx.store.findOne(XykPool, {
    where: { id: `${id}` },
    relations: { assetA: true, assetB: true, account: true },
  });

  return pool ?? null;

  // TODO implement automatic creation of XykPool based on storage data if ensure === true
}

export async function xykPoolCreated(
  ctx: ProcessorContext<Store>,
  eventCallData: XykPoolCreatedData
) {
  //TODO add check for existing pool with the same ID

  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const newPoolsAssetBalances: {
    assetABalance: bigint | undefined;
    assetBBalance: bigint | undefined;
  } = {
    assetABalance: eventCallData.callData?.args?.amountA,
    assetBBalance: eventCallData.callData?.args?.amountB,
  };

  const assetAEntity = await getAsset({
    ctx,
    id: eventParams.assetA,
    ensure: true,
    blockHeader: eventMetadata.blockHeader,
  });
  const assetBEntity = await getAsset({
    ctx,
    id: eventParams.assetB,
    ensure: true,
    blockHeader: eventMetadata.blockHeader,
  });

  if (!assetAEntity || !assetBEntity) return null;

  if (
    !newPoolsAssetBalances.assetABalance &&
    !newPoolsAssetBalances.assetBBalance
  ) {
    newPoolsAssetBalances.assetABalance = await getAssetFreeBalance(
      eventMetadata.blockHeader,
      eventParams.assetA,
      eventParams.pool
    );
    newPoolsAssetBalances.assetBBalance = await getAssetFreeBalance(
      eventMetadata.blockHeader,
      eventParams.assetB,
      eventParams.pool
    );
  }

  const newPool = new XykPool({
    id: eventParams.pool,
    account: await getAccount(ctx, eventParams.pool),
    assetA: assetAEntity,
    assetB: assetBEntity,
    shareTokenId: eventParams.shareToken,
    assetABalance: newPoolsAssetBalances.assetABalance,
    assetBBalance: newPoolsAssetBalances.assetBBalance,
    initialSharesAmount: eventParams.initialSharesAmount ?? BigInt(0),
    createdAt: new Date(eventMetadata.blockHeader.timestamp ?? Date.now()),
    createdAtParaBlock: eventMetadata.blockHeader.height,
    isDestroyed: false,
  });

  const poolsToSave = ctx.batchState.state.xykPoolIdsToSave;
  poolsToSave.add(newPool.id);
  ctx.batchState.state = { xykPoolIdsToSave: poolsToSave };

  const xykAllBatchPools = ctx.batchState.state.xykAllBatchPools;
  xykAllBatchPools.set(newPool.id, newPool);
  ctx.batchState.state = {
    xykAllBatchPools,
  };
}

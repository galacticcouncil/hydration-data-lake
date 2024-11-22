import { Block, ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { LbpPool, XykPool } from '../../model';
import { getAccount } from '../accounts';
import { XykPoolCreatedData } from '../../parsers/batchBlocksParser/types';
import { getAssetFreeBalance } from '../assets/balances';
import { getAsset } from '../assets/assetRegistry';
import parsers from '../../parsers';

export async function createXykPool({
  ctx,
  blockHeader,
  poolData: {
    assetAId,
    assetBId,
    assetABalance,
    assetBBalance,
    poolAddress,
    initialSharesAmount,
    shareTokenId,
  },
}: {
  ctx: ProcessorContext<Store>;
  blockHeader: Block;
  poolData: {
    poolAddress: string;
    assetAId: string | number;
    assetBId: string | number;
    assetABalance?: bigint;
    assetBBalance?: bigint;
    initialSharesAmount?: bigint;
    shareTokenId?: number;
  };
}) {
  const newPoolsAssetBalances: {
    assetABalance: bigint | undefined;
    assetBBalance: bigint | undefined;
  } = {
    assetABalance: assetABalance,
    assetBBalance: assetBBalance,
  };

  const assetAEntity = await getAsset({
    ctx,
    id: assetAId,
    ensure: true,
    blockHeader: blockHeader,
  });
  const assetBEntity = await getAsset({
    ctx,
    id: assetBId,
    ensure: true,
    blockHeader: blockHeader,
  });

  if (!assetAEntity || !assetBEntity) return null;

  if (
    !newPoolsAssetBalances.assetABalance &&
    !newPoolsAssetBalances.assetBBalance
  ) {
    newPoolsAssetBalances.assetABalance = await getAssetFreeBalance(
      blockHeader,
      +assetAId,
      poolAddress
    );
    newPoolsAssetBalances.assetBBalance = await getAssetFreeBalance(
      blockHeader,
      +assetBId,
      poolAddress
    );
  }

  let shareTokenIdEnsured = shareTokenId ?? null;

  if (!shareTokenIdEnsured) {
    shareTokenIdEnsured = await parsers.storage.xyk.getShareToken({
      block: blockHeader,
      poolAddress,
    });
  }
  if (!shareTokenIdEnsured) return null;

  const newPool = new XykPool({
    id: poolAddress,
    account: await getAccount(ctx, poolAddress),
    assetA: assetAEntity,
    assetB: assetBEntity,
    shareTokenId: shareTokenIdEnsured,
    assetABalance: newPoolsAssetBalances.assetABalance,
    assetBBalance: newPoolsAssetBalances.assetBBalance,
    initialSharesAmount: initialSharesAmount ?? BigInt(0),
    createdAt: new Date(blockHeader.timestamp ?? Date.now()),
    createdAtParaBlock: blockHeader.height,
    isDestroyed: false,
  });

  return newPool;
}

export async function getXykPool({
  ctx,
  id,
  ensure = false,
  blockHeader,
}: {
  ctx: ProcessorContext<Store>;
  id: string;
  ensure?: boolean;
  blockHeader?: Block;
}): Promise<XykPool | null> {
  const batchState = ctx.batchState.state;

  let pool = batchState.xykAllBatchPools.get(id);
  if (pool) return pool;

  pool = await ctx.store.findOne(XykPool, {
    where: { id },
    relations: { assetA: true, assetB: true, account: true },
  });

  if (pool) return pool;

  if (!pool && !ensure) return null;

  /**
   * Following logic below is implemented and will be used only if indexer
   * has been started not from genesis block and some assets have not been
   * pre-created before indexing start point.
   */

  if (!blockHeader) return null;

  const xykPoolAssetsStorageData = await parsers.storage.xyk.getPoolAssets({
    block: blockHeader,
    poolAddress: id,
  });

  if (!xykPoolAssetsStorageData) return null;

  const newPool = await createXykPool({
    ctx,
    blockHeader: blockHeader,
    poolData: {
      assetAId: xykPoolAssetsStorageData.assetAId,
      assetBId: xykPoolAssetsStorageData.assetBId,
      poolAddress: id,
    },
  });

  if (!newPool) return null;

  await ctx.store.upsert(newPool);

  const xykAllBatchPools = ctx.batchState.state.xykAllBatchPools;
  xykAllBatchPools.set(newPool.id, newPool);
  ctx.batchState.state = {
    xykAllBatchPools,
  };

  return newPool;
}

export async function xykPoolCreated(
  ctx: ProcessorContext<Store>,
  eventCallData: XykPoolCreatedData
) {
  //TODO add check for existing pool with the same ID

  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const newPool = await createXykPool({
    ctx,
    blockHeader: eventMetadata.blockHeader,
    poolData: {
      assetAId: eventParams.assetA,
      assetBId: eventParams.assetB,
      assetABalance: eventCallData.callData?.args?.amountA,
      assetBBalance: eventCallData.callData?.args?.amountB,
      poolAddress: eventParams.pool,
      initialSharesAmount: eventParams.initialSharesAmount,
      shareTokenId: eventParams.shareToken,
    },
  });

  if (!newPool) return;

  const poolsToSave = ctx.batchState.state.xykPoolIdsToSave;
  poolsToSave.add(newPool.id);
  ctx.batchState.state = { xykPoolIdsToSave: poolsToSave };

  const xykAllBatchPools = ctx.batchState.state.xykAllBatchPools;
  xykAllBatchPools.set(newPool.id, newPool);
  ctx.batchState.state = {
    xykAllBatchPools,
  };
}

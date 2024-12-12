import { ProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { ProcessorStatusManager } from '../../../utils/processorStatusManager';
import { AssetType, LbpPool, Stablepool } from '../../../model';
import parsers from '../../../parsers';

export async function ensurePoolsDestroyedStatus(ctx: ProcessorContext<Store>) {
  const poolsDestroyedCheckPointAtBlock = (
    await ProcessorStatusManager.getInstance(ctx).getStatus()
  ).poolsDestroyedCheckPointAtBlock;

  if (ctx.blocks[0].header.height < poolsDestroyedCheckPointAtBlock + 3000)
    return;

  try {
    await handleLbpPoolsDestroyedStatus(ctx);
    await handleStableoolsDestroyedStatus(ctx);
  } catch (e) {
    console.log(e);
  }

  await ProcessorStatusManager.getInstance(ctx).updateProcessorStatus({
    poolsDestroyedCheckPointAtBlock: ctx.blocks[0].header.height,
  });
}

async function handleLbpPoolsDestroyedStatus(ctx: ProcessorContext<Store>) {
  const lbpPoolsToProcess = await ctx.store.find(LbpPool, {
    where: {
      isDestroyed: false,
    },
    relations: {
      account: true,
      assetA: true,
      assetB: true,
    },
  });

  if (lbpPoolsToProcess.length === 0) return;

  const poolSharedTokenBalances = await Promise.all(
    lbpPoolsToProcess
      .map((pool) => {
        const shareToken = [pool.assetA, pool.assetB].find(
          (token) => token.assetType !== AssetType.Token
        );
        if (!shareToken) return null;

        return {
          poolAddress: pool.account.id,
          assetId: shareToken.id,
        };
      })
      .filter((p) => !!p)
      .map(async ({ poolAddress, assetId }) => {
        return {
          balances: await parsers.storage.lbp.getPoolAssetInfo({
            poolAddress,
            assetId: +assetId,
            block: ctx.blocks[0].header,
          }),
          poolAddress,
        };
      })
  );

  const state = ctx.batchState.state;

  for (const poolData of poolSharedTokenBalances.filter((p) => !!p)) {
    if (poolData.balances && poolData.balances.free !== 0n) continue;

    const pool = lbpPoolsToProcess.find((p) => p.id === poolData.poolAddress);
    if (!pool) continue;

    pool.isDestroyed = true;
    pool.destroyedAtParaBlock = ctx.blocks[0].header.height;
    state.lbpPoolIdsToSave.add(pool.id);
    state.lbpAllBatchPools.set(pool.id, pool);
  }

  await ctx.store.save(
    [...ctx.batchState.state.lbpAllBatchPools.values()].filter((pool) =>
      ctx.batchState.state.lbpPoolIdsToSave.has(pool.id)
    )
  );
}

async function handleStableoolsDestroyedStatus(ctx: ProcessorContext<Store>) {
  const stablepoolsToProcess = await ctx.store.find(Stablepool, {
    where: {
      isDestroyed: false,
    },
    relations: {
      account: true,
    },
  });

  if (stablepoolsToProcess.length === 0) return;

  const poolSharedTokensTotalIssuance = await Promise.all(
    stablepoolsToProcess
      // This filter is required, because stablepools can have 0 total issuance just after creation but will get later.
      // TODO must be reimplemented by better way
      .filter(
        (p) => p.createdAtParaBlock > ctx.blocks[0].header.height + 10_000
      )
      .map(async ({ id, account }) => {
        return {
          totalIssuance: await parsers.storage.tokens.getTokenTotalIssuance({
            tokenId: +id,
            block: ctx.blocks[0].header,
          }),
          poolId: id,
        };
      })
  );

  const state = ctx.batchState.state;

  for (const poolData of poolSharedTokensTotalIssuance.filter((p) => !!p)) {
    if (poolData.totalIssuance && poolData.totalIssuance !== 0n) continue;

    const pool = stablepoolsToProcess.find((p) => p.id === poolData.poolId);
    if (!pool) continue;

    pool.isDestroyed = true;
    pool.destroyedAtParaBlock = ctx.blocks[0].header.height;
    state.stablepoolIdsToSave.add(pool.id);
    state.stablepoolAllBatchPools.set(pool.id, pool);
  }

  await ctx.store.save(
    [...ctx.batchState.state.stablepoolAllBatchPools.values()].filter((pool) =>
      ctx.batchState.state.stablepoolIdsToSave.has(pool.id)
    )
  );
}

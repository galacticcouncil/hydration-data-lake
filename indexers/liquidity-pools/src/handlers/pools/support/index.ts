import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { ProcessorStatusManager } from '../../../processorStatusManager';
import {
  AssetType,
  Lbppool,
  LbppoolDestroyedData,
  Stableswap,
  StableswapDestroyedData,
} from '../../../model';
import parsers from '../../../parsers';
import { addStableswapDestroyedLifeState } from '../stableswap/stablepool';
import { addLbppoolDestroyedLifeState } from '../lbpPool/lbpPool';

export async function ensurePoolsDestroyedStatus(
  ctx: SqdProcessorContext<Store>
) {
  const poolsDestroyedUpdatedAtBlock =
    (await ProcessorStatusManager.getInstance(ctx).getStatus())
      .poolsDestroyedUpdatedAtBlock ?? 0;

  if (ctx.blocks[0].header.height < poolsDestroyedUpdatedAtBlock + 3000) return;

  try {
    await handleLbppoolsDestroyedStatus(ctx);
    await handleStableoolsDestroyedStatus(ctx);
  } catch (e) {
    console.log(e);
  }

  await ProcessorStatusManager.getInstance(ctx).updateProcessorStatus({
    poolsDestroyedUpdatedAtBlock: ctx.blocks[0].header.height,
  });
}

async function handleLbppoolsDestroyedStatus(ctx: SqdProcessorContext<Store>) {
  const lbpPoolsToProcess = await ctx.store.find(Lbppool, {
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
    pool.lifeStates = addLbppoolDestroyedLifeState({
      existingStates: pool.lifeStates,
      destroyedState: new LbppoolDestroyedData({
        paraBlockHeight: ctx.blocks[0].header.height,
        relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
          ctx.blocks[0].header.height
        ).height,
      }),
    });

    state.lbpPoolIdsToSave.add(pool.id);
    state.lbpAllBatchPools.set(pool.id, pool);
  }

  await ctx.store.save(
    [...ctx.batchState.state.lbpAllBatchPools.values()].filter((pool) =>
      ctx.batchState.state.lbpPoolIdsToSave.has(pool.id)
    )
  );
}

async function handleStableoolsDestroyedStatus(
  ctx: SqdProcessorContext<Store>
) {
  const stableswapsToProcess = await ctx.store.find(Stableswap, {
    where: {
      isDestroyed: false,
    },
    relations: {
      account: true,
    },
  });

  if (stableswapsToProcess.length === 0) return;

  const poolSharedTokensTotalIssuance = await Promise.all(
    stableswapsToProcess
      // This filter is required, because stablepools can have 0 total issuance just after creation but will get later.
      // TODO must be reimplemented by better way
      .filter(
        (p) =>
          p.createdAtParaBlockHeight > ctx.blocks[0].header.height + 10_000
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

    const pool = stableswapsToProcess.find((p) => p.id === poolData.poolId);
    if (!pool) continue;

    pool.isDestroyed = true;

    pool.lifeStates = addStableswapDestroyedLifeState({
      existingStates: pool.lifeStates,
      destroyedState: new StableswapDestroyedData({
        paraBlockHeight: ctx.blocks[0].header.height,
        relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
          ctx.blocks[0].header.height
        ).height,
      }),
    });

    state.stableswapIdsToSave.add(pool.id);
    state.stableswapAllBatchPools.set(pool.id, pool);
  }

  await ctx.store.save(
    [...ctx.batchState.state.stableswapAllBatchPools.values()].filter((pool) =>
      ctx.batchState.state.stableswapIdsToSave.has(pool.id)
    )
  );
}

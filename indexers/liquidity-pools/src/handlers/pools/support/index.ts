import { Store } from '@subsquid/typeorm-store';

import {
  AssetType,
  Lbppool,
  LbppoolDestroyedData,
  Stableswap,
  StableswapDestroyedData,
} from '../../../model';
import parsers from '../../../parsers';
import { SqdProcessorContext } from '../../../processor';
import { ProcessorStatusManager } from '../../../processorStatusManager';
import { addLbppoolDestroyedLifeState } from '../pools/lbpPool/lbpPool';
import {
  addStableswapDestroyedLifeState,
} from '../pools/stableswap/stablepool';

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
  const lbpPoolsToProcess = await ctx.storeUtils.findWithLogs(Lbppool, {
    where: {
      isDestroyed: false,
    },
    relations: {},
  }, { className: 'Lbppool' });

  if (lbpPoolsToProcess.length === 0) return;

  const poolSharedTokenBalances = await Promise.all(
    lbpPoolsToProcess
      .map((pool) => {
        // Fetch assets from cache
        const assetA = ctx.batchState.state.assetsAll.get(pool.assetAId);
        const assetB = ctx.batchState.state.assetsAll.get(pool.assetBId);

        if (!assetA || !assetB) {
          console.warn(`Asset data not found for assets ${pool.assetAId} or ${pool.assetBId} while processing LBP pool destroyed status at para block height ${ctx.blocks[0].header.height}`);
          return null
        };

        const shareToken = [assetA, assetB].find(
          (token) => token?.assetType !== AssetType.Token
        );
        if (!shareToken) {
          console.warn(`Share token not found for LBP pool ${pool.id} while processing destroyed status at para block height ${ctx.blocks[0].header.height}`);
          return null
        };

        return {
          poolAddress: pool.accountId,
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
  const stableswapsToProcess = await ctx.storeUtils.findWithLogs(Stableswap, {
    where: {
      isDestroyed: false,
    },
    relations: {},
  }, { className: 'Stableswap' });

  if (stableswapsToProcess.length === 0) return;

  const poolSharedTokensTotalIssuance = await Promise.all(
    stableswapsToProcess
      // This filter is required, because stablepools can have 0 total issuance just after creation but will get later.
      // TODO must be reimplemented by better way
      .filter(
        (p) =>
          p.createdAtParaBlockHeight > ctx.blocks[0].header.height + 10_000
      )
      .map(async ({ id }) => {
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
      }),
    });

    state.stableswapIdsToSave.add(pool.id);
    state.stableswapPools.set(pool.id, pool);
  }

  await ctx.store.save(
    [...ctx.batchState.state.stableswapPools.values()].filter((pool) =>
      ctx.batchState.state.stableswapIdsToSave.has(pool.id)
    )
  );
}

import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { EventName } from '../../parsers/types/events';
import { getOrderedListByBlockNumber } from '../../utils/helpers';
import { lpbPoolCreated, lpbPoolUpdated } from './lbpPool';
import { LbpPool, XykPool } from '../../model';
import { xykPoolCreated } from './xykPool';

export async function handlePools(
  ctx: ProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  if (ctx.appConfig.PROCESS_LBP_POOLS) await handleLbpPools(ctx, parsedEvents);
  if (ctx.appConfig.PROCESS_XYK_POOLS) await handleXykPools(ctx, parsedEvents);
}

export async function handleLbpPools(
  ctx: ProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  ctx.batchState.state = {
    lbpAllBatchPools: new Map(
      (
        await ctx.store.find(LbpPool, {
          where: {},
          relations: { account: true, assetA: true, assetB: true },
        })
      ).map((p) => [p.id, p])
    ),
  };

  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents.getSectionByEventName(EventName.LBP_PoolCreated).values(),
  ])) {
    await lpbPoolCreated(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents.getSectionByEventName(EventName.LBP_PoolUpdated).values(),
  ])) {
    await lpbPoolUpdated(ctx, eventData);
  }

  await ctx.store.save(
    [...ctx.batchState.state.lbpAllBatchPools.values()].filter((pool) =>
      ctx.batchState.state.lbpPoolIdsToSave.has(pool.id)
    )
  );
  ctx.batchState.state = { lbpPoolIdsToSave: new Set() };
}

export async function handleXykPools(
  ctx: ProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  ctx.batchState.state = {
    xykAllBatchPools: new Map(
      (
        await ctx.store.find(XykPool, {
          where: {},
          relations: { assetA: true, assetB: true, account: true },
        })
      ).map((p) => [p.id, p])
    ),
  };

  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents.getSectionByEventName(EventName.XYK_PoolCreated).values(),
  ])) {
    await xykPoolCreated(ctx, eventData);
  }

  await ctx.store.save(
    [...ctx.batchState.state.xykAllBatchPools.values()].filter((pool) =>
      ctx.batchState.state.xykPoolIdsToSave.has(pool.id)
    )
  );

  ctx.batchState.state = { xykPoolIdsToSave: new Set() };
}

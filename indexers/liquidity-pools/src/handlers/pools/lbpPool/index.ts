import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../../parsers/batchBlocksParser';
import { EventName } from '../../../parsers/types/events';
import { getOrderedListByBlockNumber } from '../../../utils/helpers';
import { lpbpoolCreated, lpbpoolUpdated } from './lbpPool';
import { Lbppool } from '../../../model';

export async function handleLbpPools(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  if (!ctx.appConfig.PROCESS_LBP_POOLS) return;

  ctx.batchState.state.lbpAllBatchPools = new Map(
    (
      await ctx.store.find(Lbppool, {
        where: {},
        relations: { account: true, assetA: true, assetB: true },
      })
    ).map((p) => [p.id, p])
  );

  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents.getSectionByEventName(EventName.LBP_PoolCreated).values(),
  ])) {
    await lpbpoolCreated(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents.getSectionByEventName(EventName.LBP_PoolUpdated).values(),
  ])) {
    await lpbpoolUpdated(ctx, eventData);
  }

  await ctx.store.save(
    [...ctx.batchState.state.lbpAllBatchPools.values()].filter((pool) =>
      ctx.batchState.state.lbpPoolIdsToSave.has(pool.id)
    )
  );
  ctx.batchState.state.lbpPoolIdsToSave = new Set();
}

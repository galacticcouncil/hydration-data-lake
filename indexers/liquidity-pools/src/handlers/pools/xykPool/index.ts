import { ProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../../parsers/batchBlocksParser';
import { EventName } from '../../../parsers/types/events';
import { getOrderedListByBlockNumber } from '../../../utils/helpers';
import { Xykpool } from '../../../model';
import { xykPoolCreated, xykPoolDestroyed } from './xykPool';

export async function handleXykPools(
  ctx: ProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  if (!ctx.appConfig.PROCESS_XYK_POOLS) return;
  ctx.batchState.state.xykAllBatchPools = new Map(
    (
      await ctx.store.find(Xykpool, {
        where: {},
        relations: { assetA: true, assetB: true, account: true },
      })
    ).map((p) => [p.id, p])
  );

  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents.getSectionByEventName(EventName.XYK_PoolCreated).values(),
  ])) {
    await xykPoolCreated(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents.getSectionByEventName(EventName.XYK_PoolDestroyed).values(),
  ])) {
    await xykPoolDestroyed(ctx, eventData);
  }

  await ctx.store.save(
    [...ctx.batchState.state.xykAllBatchPools.values()].filter((pool) =>
      ctx.batchState.state.xykPoolIdsToSave.has(pool.id)
    )
  );

  ctx.batchState.state.xykPoolIdsToSave = new Set();
}

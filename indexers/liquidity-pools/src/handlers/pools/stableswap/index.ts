import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../../parsers/batchBlocksParser';
import { EventName } from '../../../parsers/types/events';
import { getOrderedListByBlockNumber } from '../../../utils/helpers';
import { stableswapCreated } from './stablepool';

export async function handleStablepools(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  if (!ctx.appConfig.PROCESS_STABLEPOOLS) return;

  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents
      .getSectionByEventName(EventName.Stableswap_PoolCreated)
      .values(),
  ])) {
    await stableswapCreated(ctx, eventData);
  }

  await ctx.store.save(
    [...ctx.batchState.state.stableswapAllBatchPools.values()].filter((pool) =>
      ctx.batchState.state.stableswapIdsToSave.has(pool.id)
    )
  );
  ctx.batchState.state.stableswapIdsToSave = new Set();

  await ctx.store.save([
    ...ctx.batchState.state.stableswapAssetsAllBatch.values(),
  ]);
}

import { SqdProcessorContext } from '../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../../../parsers/batchBlocksParser';
import { EventName } from '../../../../parsers/types/events';
import { getOrderedListByBlockNumber } from '../../../../utils/helpers';
import { stableswapCreated } from './stablepool';

export async function handleStablepools(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  let isStableswapRelatedEventsExists = false;
  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents
      .getSectionByEventName(EventName.Stableswap_PoolCreated)
      .values(),
  ])) {
    await stableswapCreated(ctx, eventData);
    isStableswapRelatedEventsExists = true;
  }

  if (!isStableswapRelatedEventsExists) return;

  await ctx.store.save(
    Array.from(ctx.batchState.state.stableswapPools.values())
  );
  await ctx.store.save(
    Array.from(ctx.batchState.state.stableswapAssets.values())
  );
}

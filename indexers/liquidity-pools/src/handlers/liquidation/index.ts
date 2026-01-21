import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { getOrderedListByBlockNumber } from '../../utils/helpers';
import { EventName } from '../../parsers/types/events';
import { handleLiquidationLiquidated } from './liquidationHandlers';

export async function handleLiquidationEvents(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents
      .getSectionByEventName(EventName.Liquidation_Liquidated)
      .values(),
  ])) {
    await handleLiquidationLiquidated(ctx, eventData);
  }

  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.liquidationLiquidatedEvents.values())
  );
}

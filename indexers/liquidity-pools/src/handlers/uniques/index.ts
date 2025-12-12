import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { getOrderedListByBlockNumber } from '../../utils/helpers';
import { EventName } from '../../parsers/types/events';
import { handleUniquesItemTransferred } from './uniquesHandlers';

// TODO Handler must be refactored to process uniques entities with on all
//  native events, e.g. Created, Burned, Transferred.

/**
 * This function must be executed after processing XYK LM Deposits and Omnipool
 * Liquidity Positions but before Account balances aggregation.
 * @param ctx
 * @param parsedEvents
 */
export async function handleUniquesEvents(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents
      .getSectionByEventName(EventName.Uniques_Transferred)
      .values(),
  ])) {
    await handleUniquesItemTransferred(ctx, eventData);
  }
}

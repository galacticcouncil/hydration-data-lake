import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { getOrderedListByBlockNumber } from '../../utils/helpers';
import { EventName } from '../../parsers/types/events';
import { handleEvmAccountsBoundEvent } from './handleBound';

export async function handleEvmAccounts(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents.getSectionByEventName(EventName.EVMAccounts_Bound).values(),
  ])) {
    await handleEvmAccountsBoundEvent(ctx, eventData);
  }
}

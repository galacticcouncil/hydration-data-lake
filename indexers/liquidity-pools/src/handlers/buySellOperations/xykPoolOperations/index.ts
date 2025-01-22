import { ProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../../parsers/batchBlocksParser';
import { EventName } from '../../../parsers/types/events';
import {
  getOrderedListByBlockNumber,
  isUnifiedEventsSupportSpecVersion,
} from '../../../utils/helpers';
import { xykBuyExecuted, xykSellExecuted } from './xykPoolOperation';
import {
  XykBuyExecutedData,
  XykSellExecutedData,
} from '../../../parsers/batchBlocksParser/types';

export async function handleXykPoolOperations(
  ctx: ProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  /**
   * BuyExecuted as SellExecuted events must be processed sequentially in the same
   * flow to avoid wrong calculations of accumulated volumes.
   */
  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents.getSectionByEventName(EventName.XYK_BuyExecuted).values(),
    ...parsedEvents.getSectionByEventName(EventName.XYK_SellExecuted).values(),
  ]).filter((event) =>
    isUnifiedEventsSupportSpecVersion(
      event.eventData.metadata.blockHeader.specVersion,
      ctx.appConfig.UNIFIED_EVENTS_GENESIS_SPEC_VERSION
    )
  )) {
    switch (eventData.eventData.name) {
      case EventName.XYK_BuyExecuted:
        await xykBuyExecuted(ctx, eventData as XykBuyExecutedData);
        break;
      case EventName.XYK_SellExecuted:
        await xykSellExecuted(ctx, eventData as XykSellExecutedData);
        break;
      default:
    }
  }
}

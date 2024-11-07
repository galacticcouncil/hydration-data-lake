import { ProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../../parsers/batchBlocksParser';
import { EventName } from '../../../parsers/types/events';
import { getOrderedListByBlockNumber } from '../../../utils/helpers';
import { lpbBuyExecuted, lpbSellExecuted } from './lbpPoolOperation';
import { xykBuyExecuted, xykSellExecuted } from './xykPoolOperation';
import {
  LbpBuyExecutedData,
  LbpSellExecutedData,
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
  ])) {
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

export async function handleLbpPoolOperations(
  ctx: ProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  /**
   * BuyExecuted as SellExecuted events must be processed sequentially in the same
   * flow to avoid wrong calculations of accumulated volumes.
   */
  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents.getSectionByEventName(EventName.LBP_BuyExecuted).values(),
    ...parsedEvents.getSectionByEventName(EventName.LBP_SellExecuted).values(),
  ])) {
    switch (eventData.eventData.name) {
      case EventName.LBP_BuyExecuted:
        await lpbBuyExecuted(ctx, eventData as LbpBuyExecutedData);
        break;
      case EventName.LBP_SellExecuted:
        await lpbSellExecuted(ctx, eventData as LbpSellExecutedData);
        break;
      default:
    }
  }
}

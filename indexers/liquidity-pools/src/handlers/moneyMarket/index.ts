import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { EventName } from '../../parsers/types/events';
import { getOrderedListByBlockNumber } from '../../utils/helpers';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { EvmLogData } from '../../parsers/batchBlocksParser/types/evm';
import mmEventHandlers from './mmEventHandlers';
import { EvmEventName } from '../../model';

export async function handleEvm(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents.getSectionByEventName(EventName.EVM_Log).values(),
  ])) {
    await handleEvmLog(ctx, eventData);
  }
}

export async function saveAllMoneyMarketEvents(
  ctx: SqdProcessorContext<Store>
) {
  await ctx.store.save([...ctx.batchState.state.moneyMarketEvents.values()]);
}

export async function handleEvmLog(
  ctx: SqdProcessorContext<Store>,
  eventCallData: EvmLogData
) {
  if (!eventCallData.eventData.params) return;

  switch (eventCallData.eventData.params?.eventName) {
    case EvmEventName.Transfer:
      await mmEventHandlers.handleMmTransferEvent(ctx, eventCallData);
      break;
    // case EvmEventName.Supply:
    //   mmEventHandlers.handleMmSupplyEvent(ctx, eventCallData);
    //   break;
    default:
  }
}

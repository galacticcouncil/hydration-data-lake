import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../../parsers/batchBlocksParser';
import {
  getOrderedListByBlockNumber,
  isUnifiedEventsSupportSpecVersion,
} from '../../../utils/helpers';
import { EventName } from '../../../parsers/types/events';
import { broadcastSwappedEventPostHook } from '../../../handlers/swap/helpers';

export async function handlePoolAndAssetMetricsOnBroadcastSwappedEvents(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents.getSectionByEventName(EventName.Broadcast_Swapped).values(),
    ...parsedEvents
      .getSectionByEventName(EventName.Broadcast_Swapped2)
      .values(),
    ...parsedEvents
      .getSectionByEventName(EventName.Broadcast_Swapped3)
      .values(),
  ]).filter((event) =>
    isUnifiedEventsSupportSpecVersion(
      event.eventData.metadata.blockHeader.specVersion,
      ctx.appConfig.UNIFIED_EVENTS_GENESIS_SPEC_VERSION
    )
  )) {
    const swap = ctx.batchState.state.swaps.get(
      eventData.eventData.metadata.id
    );

    if (!swap) continue;

    await broadcastSwappedEventPostHook({
      eventCallData: eventData,
      swap,
      ctx,
      forceExec: true,
    });
  }
}

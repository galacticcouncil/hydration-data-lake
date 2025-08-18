import { SqdProcessorContext } from '../../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../../../../parsers/batchBlocksParser';
import { getOrderedListByBlockNumber } from '../../../../../utils/helpers';
import { EventName } from '../../../../../parsers/types/events';
import { handleCollateralAddedEvent } from './collateralAdded';
import { handleCollateralRemovedEvent } from './collateralRemoved';
import { handleCollateralUpdatedEvent } from './collateralUpdated';

export async function handleHsmCollateralEvents(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  for (const eventCallData of getOrderedListByBlockNumber([
    ...parsedEvents
      .getSectionByEventName(EventName.HSM_CollateralAdded)
      .values(),
  ])) {
    await handleCollateralAddedEvent({ ctx, eventCallData });
  }

  for (const eventCallData of getOrderedListByBlockNumber([
    ...parsedEvents
      .getSectionByEventName(EventName.HSM_CollateralUpdated)
      .values(),
  ])) {
    await handleCollateralUpdatedEvent({ ctx, eventCallData });
  }

  for (const eventCallData of getOrderedListByBlockNumber([
    ...parsedEvents
      .getSectionByEventName(EventName.HSM_CollateralRemoved)
      .values(),
  ])) {
    await handleCollateralRemovedEvent({ ctx, eventCallData });
  }

  await ctx.store.upsert([
    ...ctx.batchState.state.hsmCollateralsConfigHistData.values(),
  ]);
}

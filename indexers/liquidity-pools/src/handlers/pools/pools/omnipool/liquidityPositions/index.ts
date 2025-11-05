import { SqdProcessorContext } from '../../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../../../../parsers/batchBlocksParser';
import { getOrderedListByBlockNumber } from '../../../../../utils/helpers';
import { EventName } from '../../../../../parsers/types/events';
import {
  handleOmnipoolLiquidityPositionCreated,
  handleOmnipoolLiquidityPositionDestroyed,
  handleOmnipoolLiquidityPositionUpdated,
} from './liquidityPositionHandlers';

export async function handleOmnipoolLiquidityPositions(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents
      .getSectionByEventName(EventName.Omnipool_PositionCreated)
      .values(),
  ])) {
    await handleOmnipoolLiquidityPositionCreated(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents
      .getSectionByEventName(EventName.Omnipool_PositionUpdated)
      .values(),
  ])) {
    await handleOmnipoolLiquidityPositionUpdated(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents
      .getSectionByEventName(EventName.Omnipool_PositionDestroyed)
      .values(),
  ])) {
    await handleOmnipoolLiquidityPositionDestroyed(ctx, eventData);
  }

  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.omnipoolLiquidityPositions.values())
  );

  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.omnipoolLiquidityPositionEvents.values())
  );
}

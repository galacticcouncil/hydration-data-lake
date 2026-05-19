import { In } from 'typeorm';

import { Store } from '@subsquid/typeorm-store';

import { OtcOrder } from '../../model';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { EventName } from '../../parsers/types/events';
import { SqdProcessorContext } from '../../processor';
import { getOrderedListByBlockNumber } from '../../utils/helpers';
import {
  handleOtcOrderCancelled,
  handleOtcOrderFilled,
  handleOtcOrderPartiallyFilled,
  handleOtcOrderPlaced,
} from './otcOrderEvents';

export async function handleOtcOrders(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  await prefetchEntities(ctx, parsedEvents);

  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents.getSectionByEventName(EventName.OTC_Placed).values(),
  ])) {
    await handleOtcOrderPlaced(ctx, eventData);
  }
  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents.getSectionByEventName(EventName.OTC_Cancelled).values(),
  ])) {
    await handleOtcOrderCancelled(ctx, eventData);
  }
  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents.getSectionByEventName(EventName.OTC_Filled).values(),
  ])) {
    await handleOtcOrderFilled(ctx, eventData);
  }
  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents
      .getSectionByEventName(EventName.OTC_PartiallyFilled)
      .values(),
  ])) {
    await handleOtcOrderPartiallyFilled(ctx, eventData);
  }

  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.otcOrders.values())
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.otcOrderEvents.values())
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.swaps.values())
  );
}

async function prefetchEntities(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  // Use Set directly for deduplication, avoid multiple spreads and maps
  const orderIdsSet = new Set<string>();

  // Single pass through each event type, directly adding to Set
  for (const event of parsedEvents
    .getSectionByEventName(EventName.OTC_Placed)
    .values()) {
    orderIdsSet.add(event.eventData.params.orderId.toString());
  }

  for (const event of parsedEvents
    .getSectionByEventName(EventName.OTC_Cancelled)
    .values()) {
    orderIdsSet.add(event.eventData.params.orderId.toString());
  }

  for (const event of parsedEvents
    .getSectionByEventName(EventName.OTC_Filled)
    .values()) {
    orderIdsSet.add(event.eventData.params.orderId.toString());
  }

  for (const event of parsedEvents
    .getSectionByEventName(EventName.OTC_PartiallyFilled)
    .values()) {
    orderIdsSet.add(event.eventData.params.orderId.toString());
  }

  // Convert Set to Array only once, right before the query
  const orderIds = Array.from(orderIdsSet);

  // Skip database query if there's nothing to fetch
  if (orderIds.length === 0) {
    return;
  }

  const prefetchedOrders = await ctx.storeUtils.findWithLogs(
    OtcOrder,
    {
      where: { id: In(orderIds) },
      relations: {
        events: {
          order: true,
          swap: true,
          event: true,
        },
      },
    },
    { className: 'OtcOrder', originCallFn: 'prefetchEntities' }
  );

  const state = ctx.batchState.state;

  if (prefetchedOrders.length > 0) {
    // Directly set each order without recreating the entire Map
    for (const order of prefetchedOrders) {
      state.otcOrders.set(order.id, order);

      // Process events while iterating
      if (order.events && order.events.length > 0) {
        for (const event of order.events) {
          state.otcOrderEvents.set(event.id, event);
        }
      }
    }
  }
}

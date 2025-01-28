import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { EventName } from '../../parsers/types/events';
import { getOrderedListByBlockNumber } from '../../utils/helpers';
import { handleOtcOrderCancelled, handleOtcOrderPlaced } from './otcOrder';
import {
  handleOtcOrderFilled,
  handleOtcOrderPartiallyFilled,
} from './otcOrderAction';
import { OtcOrder, OtcOrderEvent } from '../../model';
import { In } from 'typeorm';

export async function handleOtcOrders(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  if (!ctx.appConfig.PROCESS_OTC) return;

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

  await ctx.store.save([...ctx.batchState.state.otcOrders.values()]);
  await ctx.store.save([...ctx.batchState.state.otcOrderEvents.values()]);
  await ctx.store.save([...ctx.batchState.state.swaps.values()]);
}

async function prefetchEntities(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  const orderIds = [
    ...new Set([
      ...[
        ...parsedEvents.getSectionByEventName(EventName.OTC_Placed).values(),
      ].map((event) => event.eventData.params.orderId),
      ...[
        ...parsedEvents.getSectionByEventName(EventName.OTC_Cancelled).values(),
      ].map((event) => event.eventData.params.orderId),
      ...[
        ...parsedEvents.getSectionByEventName(EventName.OTC_Filled).values(),
      ].map((event) => event.eventData.params.orderId),
      ...[
        ...parsedEvents
          .getSectionByEventName(EventName.OTC_PartiallyFilled)
          .values(),
      ].map((event) => event.eventData.params.orderId),
    ]).values(),
  ];

  const prefetchedOrders = await ctx.store.find(OtcOrder, {
    where: { id: In(orderIds) },
    relations: {
      owner: true,
      assetIn: true,
      assetOut: true,
      events: true,
    },
  });

  const state = ctx.batchState.state;

  let prefetchedOrderActions: OtcOrderEvent[] = [];

  if (prefetchedOrders.length > 0) {
    state.otcOrders = new Map(
      [...state.otcOrders.values(), ...prefetchedOrders].map((item) => [
        item.id,
        item,
      ])
    );

    prefetchedOrderActions = prefetchedOrders
      .map((order) => order.events)
      .flat();
  }

  if (prefetchedOrderActions.length > 0)
    state.otcOrderEvents = new Map(
      [...state.otcOrderEvents.values(), ...prefetchedOrderActions].map(
        (item) => [item.id, item]
      )
    );
}

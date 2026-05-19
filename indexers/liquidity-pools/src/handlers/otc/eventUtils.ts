import { FindOptionsRelations } from 'typeorm';

import { Store } from '@subsquid/typeorm-store';

import { ChainActivityTraceManager } from '../../chainActivityTracingManagers';
import {
  Account,
  ChainActivityTraceRelation,
  Event,
  OtcOrder,
  OtcOrderEvent,
  OtcOrderStatus,
  Swap,
} from '../../model';
import { SqdProcessorContext } from '../../processor';

export function getNewOrderEvent({
  operationId = null,
  traceIds = [],
  order,
  eventName,
  paraBlockHeight,
  relayBlockHeight,
  filler,
  swap = null,
  fee = null,
  amountOut = null,
  amountIn = null,
  event,
}: {
  operationId?: string | null;
  traceIds: string[];
  eventName: OtcOrderStatus;
  order: OtcOrder;
  amountIn?: bigint | null;
  amountOut?: bigint | null;
  fee?: bigint | null;
  filler?: Account | null;
  swap?: Swap | null;
  relayBlockHeight: number;
  paraBlockHeight: number;
  event: Event;
}) {
  return new OtcOrderEvent({
    id: `${order.id}-${event.indexInBlock}`,
    operationId,
    traceIds,
    eventName,
    paraBlockHeight,
    swap,
    fee,
    fillerId: filler ? filler.id : null,
    amountIn,
    amountOut,
    order,
    event,
  });
}

export async function getOtcOrderEvents({
  id,
  orderId,
  eventName,
  fetchFromDb = true,
  ctx,
  relations = {},
}: {
  id?: string;
  orderId?: string;
  eventName?: OtcOrderStatus;
  fetchFromDb?: boolean;
  ctx: SqdProcessorContext<Store>;
  relations?: FindOptionsRelations<OtcOrderEvent>;
}) {
  if (!id && !orderId && !eventName) return null;

  const batchState = ctx.batchState.state;

  let events: OtcOrderEvent[] = [];

  if (id) {
    events = [...batchState.otcOrderEvents.values()].filter(
      (act) => act.id === id
    );
  } else if (orderId && eventName) {
    events = [...batchState.otcOrderEvents.values()].filter(
      (event) => event.order.id === orderId && event.eventName === eventName
    );
  }
  if (events.length > 0 || (events.length === 0 && !fetchFromDb)) return events;

  events = await ctx.storeUtils.findWithLogs(OtcOrderEvent, {
    where: {
      ...(id ? { id } : {}),
      ...(orderId ? { order: { id: orderId } } : {}),
      ...(eventName ? { eventName } : {}),
    },
    relations,
  }, { className: 'OtcOrderEvent', originCallFn: 'getOtcOrderEvents' });

  if (events && events.length > 0) {
    for (const action of events) {
      ctx.batchState.state.otcOrderEvents.set(action.id, action);
    }
    return events;
  }

  return [];
}

export async function processChainActivityTracesRelationshipsOnOtcOrderEvent({
  otcOrderEvent,
  ctx,
}: {
  otcOrderEvent: OtcOrderEvent;
  ctx: SqdProcessorContext<Store>;
}) {
  if (otcOrderEvent.eventName === OtcOrderStatus.Created) return;

  const eventTraceActivityEntity =
    await ChainActivityTraceManager.getChainActivityTraceByTraceIdsBatch({
      ids: otcOrderEvent.traceIds!,
      ctx,
    });

  const createOrderEvent = (
    (await getOtcOrderEvents({
      orderId: otcOrderEvent.order.id,
      eventName: OtcOrderStatus.Created,
      fetchFromDb: true,
      ctx,
      relations: {
        order: true,
        swap: true,
        event: true,
      },
    })) || []
  ).find((event) => event.eventName === OtcOrderStatus.Created);

  if (!createOrderEvent || !createOrderEvent.traceIds) return;

  const rootChainActivityTrace =
    await ChainActivityTraceManager.getChainActivityTraceByTraceIdsBatch({
      ids: createOrderEvent.traceIds,
      ctx,
    });

  if (
    !rootChainActivityTrace ||
    !eventTraceActivityEntity ||
    rootChainActivityTrace.id === eventTraceActivityEntity.id
  )
    return;

  const newChainActivityTraceRelation = new ChainActivityTraceRelation({
    id: `${rootChainActivityTrace.id}-${eventTraceActivityEntity.id}`,
    childTrace: eventTraceActivityEntity,
    parentTrace: rootChainActivityTrace,
    paraBlockHeight: otcOrderEvent.paraBlockHeight,
    block: otcOrderEvent.event.block,
  });

  ctx.batchState.state.chainActivityTraceRelations.set(
    newChainActivityTraceRelation.id,
    newChainActivityTraceRelation
  );
}

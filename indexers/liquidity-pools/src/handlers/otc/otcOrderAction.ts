import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  OtcOrderFilledData,
  OtcOrderPartiallyFilledData,
} from '../../parsers/batchBlocksParser/types';
import {
  Account,
  OtcOrder,
  OtcOrderEvent,
  OtcOrderEventName,
  OtcOrderStatus,
  Swap,
} from '../../model';
import { getOtcOrder } from './otcOrder';
import { ChainActivityTraceManager } from '../../chainActivityTracingManagers';
import { getAccount } from '../accounts';
import { FindOptionsRelations } from 'typeorm';

export function getNewOrderEvent({
  operationId = null,
  traceIds = [],
  order,
  eventName,
  paraBlockHeight,
  relayBlockHeight,
  eventIndex,
  filler,
  swap = null,
  fee = null,
  amountOut = null,
  amountIn = null,
}: {
  operationId?: string | null;
  traceIds: string[];
  eventName: OtcOrderEventName;
  order: OtcOrder;
  amountIn?: bigint | null;
  amountOut?: bigint | null;
  fee?: bigint | null;
  filler?: Account | null;
  eventIndex: number;
  swap?: Swap | null;
  relayBlockHeight: number;
  paraBlockHeight: number;
}) {
  return new OtcOrderEvent({
    id: `${order.id}-${eventIndex}`,
    operationId,
    traceIds,
    eventName,
    eventIndex,
    relayBlockHeight,
    paraBlockHeight,
    swap,
    fee,
    filler,
    amountIn,
    amountOut,
    order,
  });
}

export async function getOtcOrderActions({
  id,
  orderId,
  eventName,
  fetchFromDb = true,
  ctx,
  relations = {},
}: {
  id?: string;
  orderId?: string;
  eventName?: OtcOrderEventName;
  fetchFromDb?: boolean;
  ctx: SqdProcessorContext<Store>;
  relations?: FindOptionsRelations<OtcOrderEvent>;
}) {
  if (!id && !orderId && !eventName) return null;

  const batchState = ctx.batchState.state;

  let actions: OtcOrderEvent[] = [];

  if (id) {
    actions = [...batchState.otcOrderEvents.values()].filter(
      (act) => act.id === id
    );
  } else if (orderId && eventName) {
    actions = [...batchState.otcOrderEvents.values()].filter(
      (act) => act.order.id === orderId && act.eventName === eventName
    );
  }
  if (actions.length > 0 || (actions.length === 0 && !fetchFromDb))
    return actions;

  actions = await ctx.store.find(OtcOrderEvent, {
    where: {
      ...(id ? { id } : {}),
      ...(orderId ? { order: { id: orderId } } : {}),
      ...(eventName ? { eventName } : {}),
    },
    relations,
  });

  if (actions && actions.length > 0) {
    for (const action of actions) {
      ctx.batchState.state.otcOrderEvents.set(action.id, action);
    }
    return actions;
  }

  return [];
}

export async function handleOtcOrderFilled(
  ctx: SqdProcessorContext<Store>,
  eventCallData: OtcOrderFilledData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData: { traceId: callTraceId },
  } = eventCallData;

  const otcOrder = await getOtcOrder({
    ctx,
    id: eventParams.orderId.toString(),
  });

  if (!otcOrder) return;

  const relatedSwap = [...ctx.batchState.state.swaps.values()].find(
    (swap) =>
      swap.paraBlockHeight === eventMetadata.blockHeader.height &&
      ctx.batchState.state.swapFillerContexts.has(swap.id) &&
      ctx.batchState.state.swapFillerContexts.get(swap.id)?.otcOrderId ===
        `${eventParams.orderId}` &&
      swap.swapper.id === eventParams.who
  );

  const newOrderEvent = getNewOrderEvent({
    traceIds: [...(callTraceId ? [callTraceId] : []), eventMetadata.traceId],
    order: otcOrder,
    eventName: OtcOrderEventName.Filled,
    amountIn: eventParams.amountIn,
    amountOut: eventParams.amountOut,
    fee: eventParams.fee,
    filler: await getAccount({ ctx, id: eventParams.who }),
    paraBlockHeight: eventMetadata.blockHeader.height,
    relayBlockHeight:
      ctx.batchState.state.relayChainInfo.get(eventMetadata.blockHeader.height)
        ?.relaychainBlockNumber ?? 0,
    eventIndex: eventMetadata.indexInBlock,
    swap: relatedSwap ?? null,
  });

  otcOrder.status = OtcOrderStatus.Filled;
  otcOrder.events = [...(otcOrder.events || []), newOrderEvent];

  otcOrder.totalFilledAmountIn =
    (otcOrder.totalFilledAmountIn || 0n) + eventParams.amountIn;
  otcOrder.totalFilledAmountOut =
    (otcOrder.totalFilledAmountOut || 0n) + eventParams.amountOut;

  const state = ctx.batchState.state;

  state.otcOrders.set(otcOrder.id, otcOrder);
  state.otcOrderEvents.set(newOrderEvent.id, newOrderEvent);

  if (relatedSwap) {
    relatedSwap.otcOrderFulfillment = newOrderEvent;
    state.swaps.set(relatedSwap.id, relatedSwap);
  }

  await ChainActivityTraceManager.addParticipantsToActivityTracesBulk({
    traceIds: newOrderEvent.traceIds,
    participants: [newOrderEvent.filler!],
    ctx,
  });
}

export async function handleOtcOrderPartiallyFilled(
  ctx: SqdProcessorContext<Store>,
  eventCallData: OtcOrderPartiallyFilledData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData: { traceId: callTraceId },
  } = eventCallData;

  const otcOrder = await getOtcOrder({
    ctx,
    id: eventParams.orderId.toString(),
  });

  if (!otcOrder) return;

  const relatedSwap = [...ctx.batchState.state.swaps.values()].find(
    (swap) =>
      swap.paraBlockHeight === eventMetadata.blockHeader.height &&
      ctx.batchState.state.swapFillerContexts.has(swap.id) &&
      ctx.batchState.state.swapFillerContexts.get(swap.id)?.otcOrderId ===
        `${eventParams.orderId}` &&
      swap.swapper.id === eventParams.who
  );

  const newOrderEvent = getNewOrderEvent({
    traceIds: [...(callTraceId ? [callTraceId] : []), eventMetadata.traceId],
    order: otcOrder,
    eventName: OtcOrderEventName.PartiallyFilled,
    amountIn: eventParams.amountIn,
    amountOut: eventParams.amountOut,
    fee: eventParams.fee,
    filler: await getAccount({ ctx, id: eventParams.who }),
    paraBlockHeight: eventMetadata.blockHeader.height,
    relayBlockHeight:
      ctx.batchState.state.relayChainInfo.get(eventMetadata.blockHeader.height)
        ?.relaychainBlockNumber ?? 0,
    eventIndex: eventMetadata.indexInBlock,
    swap: relatedSwap ?? null,
  });

  otcOrder.status = OtcOrderStatus.PartiallyFilled;
  otcOrder.events = [...(otcOrder.events || []), newOrderEvent];

  otcOrder.totalFilledAmountIn =
    (otcOrder.totalFilledAmountIn || 0n) + eventParams.amountIn;
  otcOrder.totalFilledAmountOut =
    (otcOrder.totalFilledAmountOut || 0n) + eventParams.amountOut;

  const state = ctx.batchState.state;

  state.otcOrders.set(otcOrder.id, otcOrder);
  state.otcOrderEvents.set(newOrderEvent.id, newOrderEvent);
  if (relatedSwap) {
    relatedSwap.otcOrderFulfillment = newOrderEvent;
    state.swaps.set(relatedSwap.id, relatedSwap);
  }

  await ChainActivityTraceManager.addParticipantsToActivityTracesBulk({
    traceIds: newOrderEvent.traceIds,
    participants: [newOrderEvent.filler!],
    ctx,
  });
}

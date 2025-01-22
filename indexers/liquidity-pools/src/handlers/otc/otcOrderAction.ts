import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  OtcOrderFilledData,
  OtcOrderPartiallyFilledData,
} from '../../parsers/batchBlocksParser/types';
import {
  Account,
  OtcOrder,
  OtcOrderAction,
  OtcOrderActionKind,
  OtcOrderStatus,
  Swap,
} from '../../model';
import { getOtcOrder } from './otcOrder';
import { ChainActivityTraceManager } from '../../chainActivityTracingManagers';
import { getAccount } from '../accounts';
import { FindOptionsRelations } from 'typeorm';

export function getNewOrderAction({
  operationId = null,
  traceIds = [],
  order,
  kind,
  paraChainBlockHeight,
  relayChainBlockHeight,
  eventIndex,
  filler,
  swap = null,
  fee = null,
  amountOut = null,
  amountIn = null,
}: {
  operationId?: string | null;
  traceIds: string[];
  kind: OtcOrderActionKind;
  order: OtcOrder;
  amountIn?: bigint | null;
  amountOut?: bigint | null;
  fee?: bigint | null;
  filler?: Account | null;
  eventIndex: number;
  swap?: Swap | null;
  relayChainBlockHeight: number;
  paraChainBlockHeight: number;
}) {
  return new OtcOrderAction({
    id: `${order.id}-${eventIndex}`,
    operationId,
    traceIds,
    kind,
    eventIndex,
    relayChainBlockHeight,
    paraChainBlockHeight,
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
  kind,
  fetchFromDb = true,
  ctx,
  relations = {},
}: {
  id?: string;
  orderId?: string;
  kind?: OtcOrderActionKind;
  fetchFromDb?: boolean;
  ctx: ProcessorContext<Store>;
  relations?: FindOptionsRelations<OtcOrderAction>;
}) {
  if (!id && !orderId && !kind) return null;

  const batchState = ctx.batchState.state;

  let actions: OtcOrderAction[] = [];

  if (id) {
    actions = [...batchState.otcOrderActions.values()].filter(
      (act) => act.id === id
    );
  } else if (orderId && kind) {
    actions = [...batchState.otcOrderActions.values()].filter(
      (act) => act.order.id === orderId && act.kind === kind
    );
  }
  if (actions.length > 0 || (actions.length === 0 && !fetchFromDb))
    return actions;

  actions = await ctx.store.find(OtcOrderAction, {
    where: {
      ...(id ? { id } : {}),
      ...(orderId ? { order: { id: orderId } } : {}),
      ...(kind ? { kind } : {}),
    },
    relations,
  });

  if (actions && actions.length > 0) {
    for (const action of actions) {
      ctx.batchState.state.otcOrderActions.set(action.id, action);
    }
    return actions;
  }

  return [];
}

export async function handleOtcOrderFilled(
  ctx: ProcessorContext<Store>,
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
      swap.paraChainBlockHeight === eventMetadata.blockHeader.height &&
      ctx.batchState.state.swapFillerContexts.has(swap.id) &&
      ctx.batchState.state.swapFillerContexts.get(swap.id)?.otcOrderId ===
        `${eventParams.orderId}` &&
      swap.swapper.id === eventParams.who
  );

  const newOrderAction = getNewOrderAction({
    traceIds: [...(callTraceId ? [callTraceId] : []), eventMetadata.traceId],
    order: otcOrder,
    kind: OtcOrderActionKind.FILLED,
    amountIn: eventParams.amountIn,
    amountOut: eventParams.amountOut,
    fee: eventParams.fee,
    filler: await getAccount({ ctx, id: eventParams.who }),
    paraChainBlockHeight: eventMetadata.blockHeader.height,
    relayChainBlockHeight:
      ctx.batchState.state.relayChainInfo.get(eventMetadata.blockHeader.height)
        ?.relaychainBlockNumber ?? 0,
    eventIndex: eventMetadata.indexInBlock,
    swap: relatedSwap ?? null,
  });

  otcOrder.status = OtcOrderStatus.FILLED;
  otcOrder.actions = [...(otcOrder.actions || []), newOrderAction];

  otcOrder.totalFilledAmountIn =
    (otcOrder.totalFilledAmountIn || 0n) + eventParams.amountIn;
  otcOrder.totalFilledAmountOut =
    (otcOrder.totalFilledAmountOut || 0n) + eventParams.amountOut;

  const state = ctx.batchState.state;

  state.otcOrders.set(otcOrder.id, otcOrder);
  state.otcOrderActions.set(newOrderAction.id, newOrderAction);

  if (relatedSwap) {
    relatedSwap.otcOrderFulfilment = newOrderAction;
    state.swaps.set(relatedSwap.id, relatedSwap);
  }

  await ChainActivityTraceManager.addParticipantsToActivityTracesBulk({
    traceIds: newOrderAction.traceIds,
    participants: [newOrderAction.filler!],
    ctx,
  });
}

export async function handleOtcOrderPartiallyFilled(
  ctx: ProcessorContext<Store>,
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
      swap.paraChainBlockHeight === eventMetadata.blockHeader.height &&
      ctx.batchState.state.swapFillerContexts.has(swap.id) &&
      ctx.batchState.state.swapFillerContexts.get(swap.id)?.otcOrderId ===
        `${eventParams.orderId}` &&
      swap.swapper.id === eventParams.who
  );

  const newOrderAction = getNewOrderAction({
    traceIds: [...(callTraceId ? [callTraceId] : []), eventMetadata.traceId],
    order: otcOrder,
    kind: OtcOrderActionKind.PARTIALLY_FILLED,
    amountIn: eventParams.amountIn,
    amountOut: eventParams.amountOut,
    fee: eventParams.fee,
    filler: await getAccount({ ctx, id: eventParams.who }),
    paraChainBlockHeight: eventMetadata.blockHeader.height,
    relayChainBlockHeight:
      ctx.batchState.state.relayChainInfo.get(eventMetadata.blockHeader.height)
        ?.relaychainBlockNumber ?? 0,
    eventIndex: eventMetadata.indexInBlock,
    swap: relatedSwap ?? null,
  });

  otcOrder.status = OtcOrderStatus.PARTIALLY_FILLED;
  otcOrder.actions = [...(otcOrder.actions || []), newOrderAction];

  otcOrder.totalFilledAmountIn =
    (otcOrder.totalFilledAmountIn || 0n) + eventParams.amountIn;
  otcOrder.totalFilledAmountOut =
    (otcOrder.totalFilledAmountOut || 0n) + eventParams.amountOut;

  const state = ctx.batchState.state;

  state.otcOrders.set(otcOrder.id, otcOrder);
  state.otcOrderActions.set(newOrderAction.id, newOrderAction);
  if (relatedSwap) {
    relatedSwap.otcOrderFulfilment = newOrderAction;
    state.swaps.set(relatedSwap.id, relatedSwap);
  }

  await ChainActivityTraceManager.addParticipantsToActivityTracesBulk({
    traceIds: newOrderAction.traceIds,
    participants: [newOrderAction.filler!],
    ctx,
  });
}

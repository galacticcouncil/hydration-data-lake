import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  DcaExecutionPlannedData,
  DcaTradeExecutedData,
  DcaTradeFailedData,
  OtcOrderFilledData,
  OtcOrderPartiallyFilledData,
} from '../../parsers/batchBlocksParser/types';
import {
  Account,
  DcaScheduleExecution,
  DcaScheduleExecutionAction,
  DcaScheduleExecutionStatus,
  DispatchError,
  DispatchErrorValue,
  OtcOrder,
  OtcOrderAction,
  OtcOrderActionKind,
  OtcScheduleStatus,
  Swap,
} from '../../model';
import { getOtcOrder } from './otcOrder';
import { FindOptionsRelations } from 'typeorm';
import { ChainActivityTraceManager } from '../../chainActivityTraceManager';
import { getAccount } from '../accounts';

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
  });
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

  const newOrderAction = getNewOrderAction({
    traceIds: [...(callTraceId ? [callTraceId] : []), eventMetadata.traceId],
    order: otcOrder,
    kind: OtcOrderActionKind.FILLED,
    amountIn: eventParams.amountIn,
    amountOut: eventParams.amountOut,
    fee: eventParams.fee,
    filler: await getAccount(ctx, eventParams.who),
    paraChainBlockHeight: eventMetadata.blockHeader.height,
    relayChainBlockHeight:
      ctx.batchState.state.relayChainInfo.get(eventMetadata.blockHeader.height)
        ?.relaychainBlockNumber ?? 0,
    eventIndex: eventMetadata.indexInBlock,
  });

  otcOrder.status = OtcScheduleStatus.FILLED;
  otcOrder.actions = [...(otcOrder.actions || []), newOrderAction];

  const state = ctx.batchState.state;

  state.otcOrders.set(otcOrder.id, otcOrder);
  state.otcOrderActions.set(newOrderAction.id, newOrderAction);

  ctx.batchState.state = {
    otcOrders: state.otcOrders,
    otcOrderActions: state.otcOrderActions,
  };

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

  const newOrderAction = getNewOrderAction({
    traceIds: [...(callTraceId ? [callTraceId] : []), eventMetadata.traceId],
    order: otcOrder,
    kind: OtcOrderActionKind.PARTIALLY_FILLED,
    amountIn: eventParams.amountIn,
    amountOut: eventParams.amountOut,
    fee: eventParams.fee,
    filler: await getAccount(ctx, eventParams.who),
    paraChainBlockHeight: eventMetadata.blockHeader.height,
    relayChainBlockHeight:
      ctx.batchState.state.relayChainInfo.get(eventMetadata.blockHeader.height)
        ?.relaychainBlockNumber ?? 0,
    eventIndex: eventMetadata.indexInBlock,
  });

  otcOrder.status = OtcScheduleStatus.PARTIALLY_FILLED;
  otcOrder.actions = [...(otcOrder.actions || []), newOrderAction];

  const state = ctx.batchState.state;

  state.otcOrders.set(otcOrder.id, otcOrder);
  state.otcOrderActions.set(newOrderAction.id, newOrderAction);

  ctx.batchState.state = {
    otcOrders: state.otcOrders,
    otcOrderActions: state.otcOrderActions,
  };

  await ChainActivityTraceManager.addParticipantsToActivityTracesBulk({
    traceIds: newOrderAction.traceIds,
    participants: [newOrderAction.filler!],
    ctx,
  });
}

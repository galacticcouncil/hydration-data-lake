import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { OtcOrderCancelledData } from '../../../parsers/batchBlocksParser/types';
import { OtcOrderStatus } from '../../../model';
import { ChainActivityTraceManager } from '../../../chainActivityTracingManagers';
import {
  getNewOrderEvent,
  processChainActivityTracesRelationshipsOnOtcOrderEvent,
} from '../eventUtils';
import { getOtcOrder } from '../orderUtils';

export async function handleOtcOrderCancelled(
  ctx: SqdProcessorContext<Store>,
  eventCallData: OtcOrderCancelledData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData: { traceId: callTraceId },
  } = eventCallData;

  const orderEntity = await getOtcOrder({
    ctx,
    id: eventParams.orderId.toString(),
  });

  if (!orderEntity) return;

  orderEntity.status = OtcOrderStatus.Cancelled;

  const newOrderEvent = getNewOrderEvent({
    traceIds: [...(callTraceId ? [callTraceId] : []), eventMetadata.traceId],
    order: orderEntity,
    eventName: OtcOrderStatus.Cancelled,
    paraBlockHeight: eventMetadata.blockHeader.height,
    relayBlockHeight:
      ctx.batchState.state.relayChainInfo.get(eventMetadata.blockHeader.height)
        ?.relaychainBlockNumber ?? 0,
    event: ctx.batchState.state.batchEvents.get(eventMetadata.id)!,
  });

  orderEntity.events = [...(orderEntity.events || []), newOrderEvent];

  const state = ctx.batchState.state;

  state.otcOrders.set(orderEntity.id, orderEntity);
  state.otcOrderEvents.set(newOrderEvent.id, newOrderEvent);

  await processChainActivityTracesRelationshipsOnOtcOrderEvent({
    otcOrderEvent: newOrderEvent,
    ctx,
  });

  await ChainActivityTraceManager.addParticipantsToActivityTracesBulk({
    traceIds: newOrderEvent.traceIds,
    participants: [orderEntity.owner],
    ctx,
  });
}

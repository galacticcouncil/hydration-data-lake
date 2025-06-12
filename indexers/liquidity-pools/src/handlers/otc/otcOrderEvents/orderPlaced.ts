import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { OtcOrderPlacedData } from '../../../parsers/batchBlocksParser/types';
import parsers from '../../../parsers';
import { OtcOrderStatus } from '../../../model';
import { ChainActivityTraceManager } from '../../../chainActivityTracingManagers';
import { createOtcOrder } from '../orderUtils';
import { getNewOrderEvent } from '../eventUtils';

export async function handleOtcOrderPlaced(
  ctx: SqdProcessorContext<Store>,
  eventCallData: OtcOrderPlacedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData: { traceId: callTraceId },
  } = eventCallData;

  const storageData = await parsers.storage.otc.getOtcOrder({
    orderId: eventParams.orderId,
    block: eventMetadata.blockHeader,
  });

  if (!storageData) return;

  const newOrder = await createOtcOrder({
    ctx,
    blockHeader: eventMetadata.blockHeader,
    orderDetails: {
      ...eventParams,
      ownerAddress: storageData.owner,
    },
  });

  if (!newOrder) return;

  const newOrderEvent = getNewOrderEvent({
    traceIds: [...(callTraceId ? [callTraceId] : []), eventMetadata.traceId],
    order: newOrder,
    eventName: OtcOrderStatus.Created,
    paraBlockHeight: eventMetadata.blockHeader.height,
    relayBlockHeight:
      ctx.batchState.state.relayChainInfo.get(eventMetadata.blockHeader.height)
        ?.relaychainBlockNumber ?? 0,
    event: ctx.batchState.state.batchEvents.get(eventMetadata.id)!,
  });

  newOrder.events = [...(newOrder.events || []), newOrderEvent];

  newOrder.owner.otcOrders = [...(newOrder.owner.otcOrders || []), newOrder];

  const state = ctx.batchState.state;

  state.accounts.set(newOrder.owner.id, newOrder.owner);
  state.otcOrders.set(newOrder.id, newOrder);
  state.otcOrderEvents.set(newOrderEvent.id, newOrderEvent);

  await ChainActivityTraceManager.addParticipantsToActivityTracesBulk({
    traceIds: newOrderEvent.traceIds,
    participants: [newOrder.owner],
    ctx,
  });
}

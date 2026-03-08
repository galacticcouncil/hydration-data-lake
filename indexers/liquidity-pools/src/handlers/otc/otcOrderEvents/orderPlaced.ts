import { Store } from '@subsquid/typeorm-store';

import { ChainActivityTraceManager } from '../../../chainActivityTracingManagers';
import { OtcOrderStatus } from '../../../model';
import parsers from '../../../parsers';
import { OtcOrderPlacedData } from '../../../parsers/batchBlocksParser/types';
import { SqdProcessorContext } from '../../../processor';
import { getOrCreateAccount } from '../../accounts';
import { getNewOrderEvent } from '../eventUtils';
import { createOtcOrder } from '../orderUtils';

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

  const ownerAccount = await getOrCreateAccount({ ctx, id: newOrder.ownerId });

  const state = ctx.batchState.state;

  state.accounts.set(ownerAccount.id, ownerAccount);
  state.otcOrders.set(newOrder.id, newOrder);
  state.otcOrderEvents.set(newOrderEvent.id, newOrderEvent);

  await ChainActivityTraceManager.addParticipantsToActivityTracesBulk({
    traceIds: newOrderEvent.traceIds,
    participants: [ownerAccount],
    ctx,
  });
}

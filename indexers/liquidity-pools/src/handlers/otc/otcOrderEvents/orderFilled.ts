import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { OtcOrderFilledData } from '../../../parsers/batchBlocksParser/types';
import { getOtcOrder } from '../orderUtils';
import { OtcOrderStatus } from '../../../model';
import { getOrCreateAccount } from '../../accounts';
import { ChainActivityTraceManager } from '../../../chainActivityTracingManagers';
import {
  getNewOrderEvent,
  processChainActivityTracesRelationshipsOnOtcOrderEvent,
} from '../eventUtils';

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
      swap.event.indexInBlock === eventMetadata.indexInBlock + 1 &&
      ctx.batchState.state.swapFillerContexts.has(swap.id) &&
      ctx.batchState.state.swapFillerContexts.get(swap.id)?.otcOrderId ===
        `${eventParams.orderId}`
  );

  const newOrderEvent = getNewOrderEvent({
    traceIds: [...(callTraceId ? [callTraceId] : []), eventMetadata.traceId],
    order: otcOrder,
    eventName: OtcOrderStatus.Filled,
    amountIn: eventParams.amountIn,
    amountOut: eventParams.amountOut,
    fee: eventParams.fee,
    filler: await getOrCreateAccount({ ctx, id: eventParams.who }),
    paraBlockHeight: eventMetadata.blockHeader.height,
    relayBlockHeight:
      ctx.batchState.state.relayChainInfo.get(eventMetadata.blockHeader.height)
        ?.relaychainBlockNumber ?? 0,
    swap: relatedSwap ?? null,
    event: ctx.batchState.state.batchEvents.get(eventMetadata.id)!,
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

  await processChainActivityTracesRelationshipsOnOtcOrderEvent({
    otcOrderEvent: newOrderEvent,
    ctx,
  });

  // Get Account object for activity trace (already fetched at line 45)
  const fillerAccount = await getOrCreateAccount({ ctx, id: newOrderEvent.fillerId! });

  await ChainActivityTraceManager.addParticipantsToActivityTracesBulk({
    traceIds: newOrderEvent.traceIds,
    participants: [fillerAccount],
    ctx,
  });
}

import { SqdBlock, SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { getAsset } from '../assets/assetRegistry';
import { OtcOrder, OtcOrderEventName, OtcOrderStatus } from '../../model';
import { getAccount } from '../accounts';
import {
  OtcOrderCancelledData,
  OtcOrderPlacedData,
} from '../../parsers/batchBlocksParser/types';
import { OtcOrderPlacedEventParams } from '../../parsers/types/events';
import { FindOptionsRelations } from 'typeorm';
import parsers from '../../parsers';
import { ChainActivityTraceManager } from '../../chainActivityTracingManagers';
import { getNewOrderEvent } from './otcOrderAction';

export async function createOtcOrder({
  ctx,
  blockHeader,
  orderDetails,
}: {
  ctx: SqdProcessorContext<Store>;
  blockHeader: SqdBlock;
  orderDetails: OtcOrderPlacedEventParams & { ownerAddress: string };
}) {
  const {
    ownerAddress,
    orderId,
    assetIn: assetInId,
    assetOut: assetOutId,
    amountIn,
    amountOut,
    partiallyFillable,
  } = orderDetails;

  const assetIn = await getAsset({
    ctx,
    id: assetInId,
    ensure: true,
    blockHeader: blockHeader,
  });
  const assetOut = await getAsset({
    ctx,
    id: assetOutId,
    ensure: true,
    blockHeader: blockHeader,
  });

  if (!assetIn || !assetOut)
    throw Error(
      `Asset ${!assetIn ? assetInId : assetOutId} has not been found and created.`
    );

  const newOrder = new OtcOrder({
    id: orderId.toString(),
    owner: await getAccount({ ctx, id: ownerAddress }),
    assetIn,
    assetOut,
    amountIn: amountIn,
    amountOut: amountOut,
    partiallyFillable,
    status: OtcOrderStatus.Open,
    paraBlockHeight: blockHeader.height,
    relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
      blockHeader.height
    ).height,
  });

  return newOrder;
}

export async function getOtcOrder({
  ctx,
  id,
  relations = {
    owner: true,
    assetIn: true,
    assetOut: true,
    events: true,
  },
  fetchFromDb = true,
}: {
  ctx: SqdProcessorContext<Store>;
  id: string;
  fetchFromDb?: boolean;
  relations?: FindOptionsRelations<OtcOrder>;
}) {
  const batchState = ctx.batchState.state;

  let order = batchState.otcOrders.get(id);
  if (order || (!order && !fetchFromDb)) return order ?? null;

  order = await ctx.store.findOne(OtcOrder, {
    where: { id },
    relations,
  });

  if (order) {
    ctx.batchState.state.otcOrders.set(order.id, order);
    return order;
  }

  return null;
}

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
    eventName: OtcOrderEventName.Created,
    paraBlockHeight: eventMetadata.blockHeader.height,
    relayBlockHeight:
      ctx.batchState.state.relayChainInfo.get(eventMetadata.blockHeader.height)
        ?.relaychainBlockNumber ?? 0,
    eventIndex: eventMetadata.indexInBlock,
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

  orderEntity.status = OtcOrderStatus.Canceled;

  const newOrderEvent = getNewOrderEvent({
    traceIds: [...(callTraceId ? [callTraceId] : []), eventMetadata.traceId],
    order: orderEntity,
    eventName: OtcOrderEventName.Canceled,
    paraBlockHeight: eventMetadata.blockHeader.height,
    relayBlockHeight:
      ctx.batchState.state.relayChainInfo.get(eventMetadata.blockHeader.height)
        ?.relaychainBlockNumber ?? 0,
    eventIndex: eventMetadata.indexInBlock,
  });

  orderEntity.events = [...(orderEntity.events || []), newOrderEvent];

  const state = ctx.batchState.state;

  state.otcOrders.set(orderEntity.id, orderEntity);
  state.otcOrderEvents.set(newOrderEvent.id, newOrderEvent);

  await ChainActivityTraceManager.addParticipantsToActivityTracesBulk({
    traceIds: newOrderEvent.traceIds,
    participants: [orderEntity.owner],
    ctx,
  });
}

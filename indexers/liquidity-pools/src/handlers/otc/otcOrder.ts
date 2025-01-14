import { Block, ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { getAsset } from '../assets/assetRegistry';
import { OtcOrder, OtcOrderActionKind, OtcOrderStatus } from '../../model';
import { getAccount } from '../accounts';
import {
  OtcOrderCancelledData,
  OtcOrderPlacedData,
} from '../../parsers/batchBlocksParser/types';
import { OtcOrderPlacedEventParams } from '../../parsers/types/events';
import { FindOptionsRelations } from 'typeorm';
import parsers from '../../parsers';
import { ChainActivityTraceManager } from '../../chainActivityTraceManager';
import { getNewOrderAction } from './otcOrderAction';

export async function createOtcOrder({
  ctx,
  blockHeader,
  orderDetails,
}: {
  ctx: ProcessorContext<Store>;
  blockHeader: Block;
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
    owner: await getAccount(ctx, ownerAddress),
    assetIn,
    assetOut,
    amountIn: amountIn,
    amountOut: amountOut,
    partiallyFillable,
    status: OtcOrderStatus.OPEN,
    createdAtParaBlockHeight: blockHeader.height,
    createdAtRelayBlockHeight:
      ctx.batchState.state.relayChainInfo.get(blockHeader.height)
        ?.relaychainBlockNumber ?? 0,
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
    actions: true,
  },
  fetchFromDb = true,
}: {
  ctx: ProcessorContext<Store>;
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
  ctx: ProcessorContext<Store>,
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

  const newOrderAction = getNewOrderAction({
    traceIds: [...(callTraceId ? [callTraceId] : []), eventMetadata.traceId],
    order: newOrder,
    kind: OtcOrderActionKind.CREATED,
    paraChainBlockHeight: eventMetadata.blockHeader.height,
    relayChainBlockHeight:
      ctx.batchState.state.relayChainInfo.get(eventMetadata.blockHeader.height)
        ?.relaychainBlockNumber ?? 0,
    eventIndex: eventMetadata.indexInBlock,
  });

  newOrder.actions = [...(newOrder.actions || []), newOrderAction];

  newOrder.owner.otcOrders = [...(newOrder.owner.otcOrders || []), newOrder];

  const state = ctx.batchState.state;

  state.accounts.set(newOrder.owner.id, newOrder.owner);
  state.otcOrders.set(newOrder.id, newOrder);
  state.otcOrderActions.set(newOrderAction.id, newOrderAction);

  ctx.batchState.state = {
    accounts: state.accounts,
    otcOrders: state.otcOrders,
    otcOrderActions: state.otcOrderActions,
  };

  await ChainActivityTraceManager.addParticipantsToActivityTracesBulk({
    traceIds: newOrderAction.traceIds,
    participants: [newOrder.owner],
    ctx,
  });
}

export async function handleOtcOrderCancelled(
  ctx: ProcessorContext<Store>,
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

  orderEntity.status = OtcOrderStatus.CANCELED;

  const newOrderAction = getNewOrderAction({
    traceIds: [...(callTraceId ? [callTraceId] : []), eventMetadata.traceId],
    order: orderEntity,
    kind: OtcOrderActionKind.CANCELED,
    paraChainBlockHeight: eventMetadata.blockHeader.height,
    relayChainBlockHeight:
      ctx.batchState.state.relayChainInfo.get(eventMetadata.blockHeader.height)
        ?.relaychainBlockNumber ?? 0,
    eventIndex: eventMetadata.indexInBlock,
  });

  orderEntity.actions = [...(orderEntity.actions || []), newOrderAction];

  const state = ctx.batchState.state;

  state.otcOrders.set(orderEntity.id, orderEntity);
  state.otcOrderActions.set(newOrderAction.id, newOrderAction);

  ctx.batchState.state = {
    otcOrders: state.otcOrders,
    otcOrderActions: state.otcOrderActions,
  };

  await ChainActivityTraceManager.addParticipantsToActivityTracesBulk({
    traceIds: newOrderAction.traceIds,
    participants: [orderEntity.owner],
    ctx,
  });
}

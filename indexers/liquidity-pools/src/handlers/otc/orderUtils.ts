import { FindOptionsRelations } from 'typeorm';

import { Store } from '@subsquid/typeorm-store';

import {
  OtcOrder,
  OtcOrderStatus,
} from '../../model';
import { OtcOrderPlacedEventParams } from '../../parsers/types/events';
import {
  SqdBlock,
  SqdProcessorContext,
} from '../../processor';
import { getOrCreateAsset } from '../assets/asset';

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

  const assetIn = await getOrCreateAsset({
    ctx,
    assetRegistryId: assetInId,
    ensure: true,
    blockHeader: blockHeader,
  });
  const assetOut = await getOrCreateAsset({
    ctx,
    assetRegistryId: assetOutId,
    ensure: true,
    blockHeader: blockHeader,
  });

  if (!assetIn || !assetOut)
    throw Error(
      `Asset ${!assetIn ? assetInId : assetOutId} has not been found and created.`
    );

  const block = ctx.batchState.getParaBlockFromCacheByHeight(blockHeader.height);
  if (!block) {
    throw new Error(`Block not found in cache for height ${blockHeader.height}`);
  }

  const newOrder = new OtcOrder({
    id: orderId.toString(),
    ownerId: ownerAddress,
    assetInId: assetIn.id,
    assetOutId: assetOut.id,
    amountIn: amountIn,
    amountOut: amountOut,
    partiallyFillable,
    status: OtcOrderStatus.Created,
    paraBlockHeight: blockHeader.height,
    relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
      blockHeader.height
    ).height,
    blockId: block.id,
  });

  return newOrder;
}

export async function getOtcOrder({
  ctx,
  id,
  relations = {
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

  order = await ctx.storeUtils.findOneWithLogs(OtcOrder, {
    where: { id },
    relations,
  }, { className: 'OtcOrder' });

  if (order) {
    ctx.batchState.state.otcOrders.set(order.id, order);
    return order;
  }

  return null;
}

import { SqdBlock, SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { getOrCreateAsset } from '../assets/asset';
import { OtcOrder, OtcOrderStatus } from '../../model';
import { getOrCreateAccount } from '../accounts';
import { OtcOrderPlacedEventParams } from '../../parsers/types/events';
import { FindOptionsRelations } from 'typeorm';

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
    id: assetInId,
    ensure: true,
    blockHeader: blockHeader,
  });
  const assetOut = await getOrCreateAsset({
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
    owner: await getOrCreateAccount({ ctx, id: ownerAddress }),
    assetIn,
    assetOut,
    amountIn: amountIn,
    amountOut: amountOut,
    partiallyFillable,
    status: OtcOrderStatus.Created,
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

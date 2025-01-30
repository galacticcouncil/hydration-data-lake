import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  RouteTrade,
  RouteTradeAssetBalance,
  Swap,
  SwapAssetBalanceType,
} from '../../model';
import { OperationStackManager } from '../../chainActivityTracingManagers';
import { SwappedExecutionTypeKind } from '../../utils/types';

export function getRouteTradeFromCache({
  ctx,
  id,
  routeId,
}: {
  ctx: SqdProcessorContext<Store>;
  id?: string;
  routeId?: string;
}) {
  const batchState = ctx.batchState.state;
  let trade = null;
  if (id) {
    trade = batchState.routeTrades.get(id);
  } else if (routeId !== undefined && routeId !== null) {
    trade = [...batchState.routeTrades.values()].find(
      (cachedTrade) => cachedTrade.routeId === routeId
    );
  }
  return trade;
}

export function processRouteTradeHop({
  ctx,
  swap,
  customRouteId,
}: {
  ctx: SqdProcessorContext<Store>;
  swap: Swap;
  customRouteId?: string;
}) {
  let routeTradeEntity = null;
  let routeId = customRouteId ?? null;

  if (
    swap.operationId &&
    OperationStackManager.containsExecutionType(
      swap.operationId,
      SwappedExecutionTypeKind.Router
    )
  ) {
    routeId = OperationStackManager.getRouterIncrementalIdFromOperationId(
      swap.operationId
    );

    if (routeId)
      routeTradeEntity = getRouteTradeFromCache({
        ctx,
        routeId,
      });
  }

  if (!routeTradeEntity && customRouteId) {
    routeTradeEntity = getRouteTradeFromCache({
      ctx,
      routeId: customRouteId,
    });
  }

  if (routeTradeEntity) {
    routeTradeEntity.swaps = [...(routeTradeEntity.swaps || []), swap];
    routeTradeEntity.allInvolvedAssetIds = [
      ...new Set([
        ...(routeTradeEntity.allInvolvedAssetIds || []),
        ...swap.allInvolvedAssetIds,
      ]).values(),
    ];
    routeTradeEntity.participantFillers = [
      ...new Set([
        ...(routeTradeEntity.participantFillers || []),
        swap.filler.id,
      ]).values(),
    ];
    routeTradeEntity.participantSwappers = [
      ...new Set([
        ...(routeTradeEntity.participantSwappers || []),
        swap.swapper.id,
      ]).values(),
    ];
    routeTradeEntity.feeRecipients = [
      ...new Set([
        ...(routeTradeEntity.feeRecipients || []),
        ...swap.fees
          .map((swapFee) => swapFee.recipient?.id)
          .filter((recipientId) => !!recipientId),
      ]).values(),
    ] as string[];

    for (const assetOut of routeTradeEntity.outputs) {
      ctx.batchState.state.routeTradesOutputs.delete(assetOut.id);
    }

    routeTradeEntity.outputs = [];

    for (const swapOutput of swap.outputs) {
      const tradeOutput = new RouteTradeAssetBalance({
        id: `${routeTradeEntity.id}-${swapOutput.asset.id}-${SwapAssetBalanceType.Output}`,
        routeTrade: routeTradeEntity,
        assetBalanceType: SwapAssetBalanceType.Output,
        asset: swapOutput.asset,
        amount: swapOutput.amount,
      });
      ctx.batchState.state.routeTradesOutputs.set(tradeOutput.id, tradeOutput);
      routeTradeEntity.outputs.push(tradeOutput);
    }

    ctx.batchState.state.routeTrades.set(routeTradeEntity.id, routeTradeEntity);

    return routeTradeEntity;
  }

  const newRouteTradeEntityId = `${swap.paraBlockHeight}-${routeId ?? swap.id}`;

  routeTradeEntity = new RouteTrade({
    id: newRouteTradeEntityId,
    routeId,
    swaps: [swap],
    participantSwappers: [swap.swapper.id],
    participantFillers: [swap.filler.id],
    feeRecipients: swap.fees
      .map((swapFee) => swapFee.recipient?.id)
      .filter((recipientId) => !!recipientId) as string[],
    allInvolvedAssetIds: swap.allInvolvedAssetIds,
    paraBlockHeight: swap.paraBlockHeight,
    relayBlockHeight: swap.relayBlockHeight,
    block: swap.event.block,
  });

  routeTradeEntity.inputs = swap.inputs.map((swapInput) => {
    const tradeInput = new RouteTradeAssetBalance({
      id: `${newRouteTradeEntityId}-${swapInput.asset.id}-${SwapAssetBalanceType.Input}`,
      routeTrade: routeTradeEntity,
      assetBalanceType: SwapAssetBalanceType.Input,
      asset: swapInput.asset,
      amount: swapInput.amount,
    });
    ctx.batchState.state.routeTradesInputs.set(tradeInput.id, tradeInput);
    return tradeInput;
  });

  routeTradeEntity.outputs = swap.outputs.map((swapOutput) => {
    const tradeOutput = new RouteTradeAssetBalance({
      id: `${newRouteTradeEntityId}-${swapOutput.asset.id}-${SwapAssetBalanceType.Output}`,
      routeTrade: routeTradeEntity,
      assetBalanceType: SwapAssetBalanceType.Output,
      asset: swapOutput.asset,
      amount: swapOutput.amount,
    });
    ctx.batchState.state.routeTradesOutputs.set(tradeOutput.id, tradeOutput);
    return tradeOutput;
  });

  ctx.batchState.state.routeTrades.set(routeTradeEntity.id, routeTradeEntity);

  return routeTradeEntity;
}

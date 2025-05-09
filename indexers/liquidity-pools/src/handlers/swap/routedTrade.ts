import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  ResourceType,
  RoutedTrade,
  RoutedTradeAssetBalance,
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
    (OperationStackManager.containsExecutionType(
      swap.operationId,
      SwappedExecutionTypeKind.Router
    ) ||
      OperationStackManager.containsExecutionType(
        swap.operationId,
        SwappedExecutionTypeKind.Omnipool
      ))
  ) {
    routeId =
      OperationStackManager.getRouterIncrementalIdFromOperationId(
        swap.operationId
      ) ||
      OperationStackManager.getOminpoolIncrementalIdFromOperationId(
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
    routeTradeEntity.allInvolvedAssetRegistryIds = [
      ...new Set([
        ...(routeTradeEntity.allInvolvedAssetRegistryIds || []),
        ...swap.allInvolvedAssetRegistryIds,
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
      const tradeOutput = new RoutedTradeAssetBalance({
        id: `${routeTradeEntity.id}-${swapOutput.asset.id}-${SwapAssetBalanceType.Output}`,
        routedTrade: routeTradeEntity,
        assetBalanceType: SwapAssetBalanceType.Output,
        asset: swapOutput.asset,
        amount: swapOutput.amount,
      });
      ctx.batchState.state.routeTradesOutputs.set(tradeOutput.id, tradeOutput);
      routeTradeEntity.outputs.push(tradeOutput);
    }

    const {
      inputAssetIds,
      inputAssetRegistryIds,
      outputAssetIds,
      outputAssetRegistryIds,
    } = getRouterTradeInputOutputPoints(routeTradeEntity);

    routeTradeEntity.inputAssetIds = inputAssetIds;
    routeTradeEntity.inputAssetRegistryIds = inputAssetRegistryIds;
    routeTradeEntity.outputAssetIds = outputAssetIds;
    routeTradeEntity.outputAssetRegistryIds = outputAssetRegistryIds;

    ctx.batchState.state.routeTrades.set(routeTradeEntity.id, routeTradeEntity);

    return routeTradeEntity;
  }

  const newRouteTradeEntityId = `${swap.paraBlockHeight}-${routeId ?? swap.id}`;

  routeTradeEntity = new RoutedTrade({
    id: newRouteTradeEntityId,
    routeId,
    swaps: [swap],
    participantSwappers: [swap.swapper.id],
    participantFillers: [swap.filler.id],
    feeRecipients: swap.fees
      .map((swapFee) => swapFee.recipient?.id)
      .filter((recipientId) => !!recipientId) as string[],
    allInvolvedAssetIds: swap.allInvolvedAssetIds,
    allInvolvedAssetRegistryIds: swap.allInvolvedAssetRegistryIds,
    paraBlockHeight: swap.paraBlockHeight,
    relayBlockHeight: swap.relayBlockHeight,
    block: swap.event.block,
  });

  routeTradeEntity.inputs = swap.inputs.map((swapInput) => {
    const tradeInput = new RoutedTradeAssetBalance({
      id: `${newRouteTradeEntityId}-${swapInput.asset.id}-${SwapAssetBalanceType.Input}`,
      routedTrade: routeTradeEntity,
      assetBalanceType: SwapAssetBalanceType.Input,
      asset: swapInput.asset,
      amount: swapInput.amount,
    });
    ctx.batchState.state.routeTradesInputs.set(tradeInput.id, tradeInput);
    return tradeInput;
  });

  routeTradeEntity.outputs = swap.outputs.map((swapOutput) => {
    const tradeOutput = new RoutedTradeAssetBalance({
      id: `${newRouteTradeEntityId}-${swapOutput.asset.id}-${SwapAssetBalanceType.Output}`,
      routedTrade: routeTradeEntity,
      assetBalanceType: SwapAssetBalanceType.Output,
      asset: swapOutput.asset,
      amount: swapOutput.amount,
    });
    ctx.batchState.state.routeTradesOutputs.set(tradeOutput.id, tradeOutput);
    return tradeOutput;
  });

  const {
    inputAssetIds,
    inputAssetRegistryIds,
    outputAssetIds,
    outputAssetRegistryIds,
  } = getRouterTradeInputOutputPoints(routeTradeEntity);

  routeTradeEntity.inputAssetIds = inputAssetIds;
  routeTradeEntity.inputAssetRegistryIds = inputAssetRegistryIds;
  routeTradeEntity.outputAssetIds = outputAssetIds;
  routeTradeEntity.outputAssetRegistryIds = outputAssetRegistryIds;

  ctx.batchState.state.routeTrades.set(routeTradeEntity.id, routeTradeEntity);

  return routeTradeEntity;
}

export function getRouterTradeInputOutputPoints(
  routedTrade: RoutedTrade
): Pick<
  RoutedTrade,
  | 'inputAssetIds'
  | 'inputAssetRegistryIds'
  | 'outputAssetIds'
  | 'outputAssetRegistryIds'
> {
  const res: Pick<
    RoutedTrade,
    | 'inputAssetIds'
    | 'inputAssetRegistryIds'
    | 'outputAssetIds'
    | 'outputAssetRegistryIds'
  > = {
    inputAssetIds: [],
    inputAssetRegistryIds: [],
    outputAssetIds: [],
    outputAssetRegistryIds: [],
  };

  const orderedSwaps = routedTrade.swaps.sort(
    (a, b) => a.event.indexInBlock - b.event.indexInBlock
  );
  for (const inputAsset of orderedSwaps[0].inputs) {
    res.inputAssetIds.push(inputAsset.asset.id);
    if (inputAsset.asset.assetRegistryId)
      res.inputAssetRegistryIds.push(inputAsset.asset.assetRegistryId);
  }
  for (const outputAsset of orderedSwaps[orderedSwaps.length - 1].outputs) {
    res.outputAssetIds.push(outputAsset.asset.id);
    if (outputAsset.asset.assetRegistryId)
      res.outputAssetRegistryIds.push(outputAsset.asset.assetRegistryId);
  }

  return res;
}

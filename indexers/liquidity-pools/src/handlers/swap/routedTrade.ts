import { Store } from '@subsquid/typeorm-store';

import { OperationStackManager } from '../../chainActivityTracingManagers';
import {
  RoutedTrade,
  RoutedTradeAssetBalance,
  Swap,
  SwapAssetBalanceType,
} from '../../model';
import { SqdProcessorContext } from '../../processor';
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
        swap.fillerId,
      ]).values(),
    ];
    routeTradeEntity.participantSwappers = [
      ...new Set([
        ...(routeTradeEntity.participantSwappers || []),
        swap.swapperId,
      ]).values(),
    ];
    routeTradeEntity.feeRecipients = [
      ...new Set([
        ...(routeTradeEntity.feeRecipients || []),
        ...swap.fees
          .map((swapFee) => swapFee.recipientId)
          .filter((recipientId) => !!recipientId),
      ]).values(),
    ] as string[];

    for (const assetOut of routeTradeEntity.outputs) {
      ctx.batchState.state.routeTradesOutputs.delete(assetOut.id);
    }

    routeTradeEntity.outputs = [];

    for (const swapOutput of swap.outputs) {
      const tradeOutput = new RoutedTradeAssetBalance({
        id: `${routeTradeEntity.id}-${swapOutput.assetId}-${SwapAssetBalanceType.Output}`,
        routedTrade: routeTradeEntity,
        assetBalanceType: SwapAssetBalanceType.Output,
        assetId: swapOutput.assetId,
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
    } = getRouterTradeInputOutputPoints(routeTradeEntity, ctx);

    routeTradeEntity.inputAssetIds = inputAssetIds;
    routeTradeEntity.inputAssetRegistryIds = inputAssetRegistryIds;
    routeTradeEntity.outputAssetIds = outputAssetIds;
    routeTradeEntity.outputAssetRegistryIds = outputAssetRegistryIds;

    ctx.batchState.state.routeTrades.set(routeTradeEntity.id, routeTradeEntity);

    return routeTradeEntity;
  }

  const newRouteTradeEntityId = `${swap.paraBlockHeight}-${routeId ?? swap.id}`;

  const block = ctx.batchState.getParaBlockFromCacheByHeight(swap.paraBlockHeight);
  if (!block) {
    throw new Error(`Block not found in cache for height ${swap.paraBlockHeight}`);
  }

  routeTradeEntity = new RoutedTrade({
    id: newRouteTradeEntityId,
    routeId,
    swaps: [swap],
    participantSwappers: [swap.swapperId],
    participantFillers: [swap.fillerId],
    feeRecipients: swap.fees
      .map((swapFee) => swapFee.recipientId)
      .filter((recipientId) => !!recipientId) as string[],
    allInvolvedAssetIds: swap.allInvolvedAssetIds,
    allInvolvedAssetRegistryIds: swap.allInvolvedAssetRegistryIds,
    paraBlockHeight: swap.paraBlockHeight,
  });

  routeTradeEntity.inputs = swap.inputs.map((swapInput) => {
    const tradeInput = new RoutedTradeAssetBalance({
      id: `${newRouteTradeEntityId}-${swapInput.assetId}-${SwapAssetBalanceType.Input}`,
      routedTrade: routeTradeEntity,
      assetBalanceType: SwapAssetBalanceType.Input,
      assetId: swapInput.assetId,
      amount: swapInput.amount,
    });
    ctx.batchState.state.routeTradesInputs.set(tradeInput.id, tradeInput);
    return tradeInput;
  });

  routeTradeEntity.outputs = swap.outputs.map((swapOutput) => {
    const tradeOutput = new RoutedTradeAssetBalance({
      id: `${newRouteTradeEntityId}-${swapOutput.assetId}-${SwapAssetBalanceType.Output}`,
      routedTrade: routeTradeEntity,
      assetBalanceType: SwapAssetBalanceType.Output,
      assetId: swapOutput.assetId,
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
  } = getRouterTradeInputOutputPoints(routeTradeEntity, ctx);

  routeTradeEntity.inputAssetIds = inputAssetIds;
  routeTradeEntity.inputAssetRegistryIds = inputAssetRegistryIds;
  routeTradeEntity.outputAssetIds = outputAssetIds;
  routeTradeEntity.outputAssetRegistryIds = outputAssetRegistryIds;

  ctx.batchState.state.routeTrades.set(routeTradeEntity.id, routeTradeEntity);

  return routeTradeEntity;
}

export function getRouterTradeInputOutputPoints(
  routedTrade: RoutedTrade,
  ctx: SqdProcessorContext<Store>
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

  // Use global assetsAll cache (already prefetched at batch start)
  const assetsAll = ctx.batchState.state.assetsAll;

  const orderedSwaps = routedTrade.swaps.sort(
    (a, b) => a.event.indexInBlock - b.event.indexInBlock
  );

  // Process inputs from first swap
  for (const inputAsset of orderedSwaps[0].inputs) {
    const asset = assetsAll.get(inputAsset.assetId);
    res.inputAssetIds.push(inputAsset.assetId);
    if (asset?.assetRegistryId) {
      res.inputAssetRegistryIds.push(asset.assetRegistryId);
    }
  }

  // Process outputs from last swap
  for (const outputAsset of orderedSwaps[orderedSwaps.length - 1].outputs) {
    const asset = assetsAll.get(outputAsset.assetId);
    res.outputAssetIds.push(outputAsset.assetId);  // Fixed: was assetInfo.id
    if (asset?.assetRegistryId) {
      res.outputAssetRegistryIds.push(asset.assetRegistryId);
    }
  }

  return res;
}

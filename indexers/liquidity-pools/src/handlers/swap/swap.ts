import {
  FindOptionsRelations,
  In,
} from 'typeorm';

import { BlockHeader } from '@subsquid/substrate-processor';
import { Store } from '@subsquid/typeorm-store';

import { ChainActivityTraceManager } from '../../chainActivityTracingManagers';
import {
  OperationStackManager,
} from '../../chainActivityTracingManagers/operationStackManager';
import {
  RoutedTrade,
  Swap,
  SwapAssetBalance,
  SwapAssetBalanceType,
  SwapFee,
  SwapFeeDestinationType,
  SwapFillerType,
  TradeOperationType,
} from '../../model';
import { BroadcastSwappedData } from '../../parsers/batchBlocksParser/types';
import {
  BroadcastSwappedAssetAmount,
  BroadcastSwappedFee,
  EventName,
} from '../../parsers/types/events';
import { SqdProcessorContext } from '../../processor';
import { isUnifiedEventsSupportSpecVersion } from '../../utils/helpers';
import { GetNewSwapResponse } from '../../utils/types';
import { getOrCreateAccount } from '../accounts';
import { batchGetOrCreateAssets } from '../assets/asset';
import {
  broadcastSwappedEventPostHook,
  broadcastSwappedEventPreHook,
  getFillerContextData,
  handleSwapFeeHistoricalData,
} from './helpers';
import { processRouteTradeHop } from './routedTrade';

export async function getSwap({
  ctx,
  id,
  eventTraceId,
  relations = {
    fees: true,
    inputs: true,
    outputs: true,
  },
  fetchFromDb = false,
}: {
  ctx: SqdProcessorContext<Store>;
  id?: string;
  eventTraceId?: string;
  fetchFromDb?: boolean;
  relations?: FindOptionsRelations<Swap>;
}) {
  const batchState = ctx.batchState.state;
  let swap = null;
  if (id) {
    swap = batchState.swaps.get(id);
  } else if (eventTraceId) {
    swap = [...batchState.swaps.values()].find((cachedSwap) =>
      cachedSwap.traceIds?.includes(eventTraceId)
    );
  }
  if (swap || (!swap && !fetchFromDb)) return swap ?? null;

  swap = await ctx.storeUtils.findOneWithLogs(Swap, {
    where: {
      ...(id ? { id } : {}),
      ...(eventTraceId ? { traceIds: In([eventTraceId]) } : {}),
    },
    relations,
  }, { className: 'Swap' });

  if (!swap) return null;
  ctx.batchState.state.swaps.set(swap.id, swap);
  return swap;
}

export async function getNewSwap({
  ctx,
  blockHeader,
  data: {
    swapId,
    traceIds,
    operationId,
    swapIndex,
    swapperId,
    fillerId,
    fillerType,
    operationType,
    fees,
    inputs,
    outputs,
    eventId,
    paraBlockHeight,
    paraTimestamp,
  },
}: {
  ctx: SqdProcessorContext<Store>;
  blockHeader: BlockHeader;
  data: {
    swapId?: string;
    traceIds: string[];
    operationId?: string;
    swapIndex: number;
    swapperId: string;
    fillerId: string;
    fillerType: SwapFillerType;
    operationType: TradeOperationType;
    fees: BroadcastSwappedFee[];
    inputs: BroadcastSwappedAssetAmount[];
    outputs: BroadcastSwappedAssetAmount[];
    eventId: string;
    paraBlockHeight: number;
    paraTimestamp: Date;
  };
}): Promise<GetNewSwapResponse> {
  const swap = new Swap({
    id: swapId ?? eventId,
    traceIds,
    operationId,
    swapIndex,
    swapperId: swapperId,
    fillerId: fillerId,
    allInvolvedAssetIds: [],
    allInvolvedAssetRegistryIds: [],
    // allInvolvedAssetIds: [
    //   ...new Set([
    //     ...inputs.map((input) => input.assetId),
    //     ...outputs.map((output) => output.assetId),
    //     ...fees.map((fee) => fee.assetId),
    //   ]).values(),
    // ].map((id) => `${id}`),
    fillerType,
    operationType,
    paraBlockHeight,
    paraTimestamp,
    relayBlockHeight:
      ctx.batchState.getRelayChainBlockDataFromCache(paraBlockHeight).height,
    event: ctx.batchState.state.batchEvents.get(eventId),
  });

  const feeEntities: SwapFee[] = [];
  const inputsEntities: SwapAssetBalance[] = [];
  const outputEntities: SwapAssetBalance[] = [];

  // Batch fetch ALL assets in SINGLE database query (10-100x faster!)
  const allAssetRegistryIds = [
    ...fees.map((f) => f.assetId),
    ...inputs.map((i) => i.assetId),
    ...outputs.map((o) => o.assetId),
  ];

  const assetCache = await batchGetOrCreateAssets({
    ctx,
    assetRegistryIds: allAssetRegistryIds,
    ensure: true,
    blockHeader,
  });

  // Helper to find asset by registry ID from cache
  const findAssetByRegistryId = (registryId: number | string) => {
    return [...assetCache.values()].find(
      (a) => a.assetRegistryId === `${registryId}`
    );
  };

  // Process fees using cached assets
  for (const fee of fees) {
    const asset = findAssetByRegistryId(fee.assetId);
    if (!asset) throw Error(`Asset ${fee.assetId} is not existing.`);

    const recipient =
      fee.destinationType === SwapFeeDestinationType.Account
        ? await getOrCreateAccount({ ctx, id: fee.recipientId! })
        : null;

    feeEntities.push(
      new SwapFee({
        id: `${swap.id}-${asset.id}${recipient ? `-${recipient.id}` : `-${fee.destinationType}`}`,
        amount: fee.amount,
        destinationType: fee.destinationType,
        swap,
        assetId: asset.id,
        recipientId: recipient ? recipient.id : null,
      })
    );
    swap.allInvolvedAssetIds.push(asset.id);
    if (asset.assetRegistryId)
      swap.allInvolvedAssetRegistryIds.push(asset.assetRegistryId);
  }

  // Process inputs using cached assets
  for (const input of inputs) {
    const asset = findAssetByRegistryId(input.assetId);
    if (!asset) throw Error(`Asset ${input.assetId} is not existing.`);

    inputsEntities.push(
      new SwapAssetBalance({
        id: `${swap.id}-${asset.id}-${SwapAssetBalanceType.Input}`,
        assetBalanceType: SwapAssetBalanceType.Input,
        amount: input.amount,
        swap,
        assetId: asset.id,
      })
    );
    swap.allInvolvedAssetIds.push(asset.id);
    if (asset.assetRegistryId)
      swap.allInvolvedAssetRegistryIds.push(asset.assetRegistryId);
  }

  // Process outputs using cached assets
  for (const output of outputs) {
    const asset = findAssetByRegistryId(output.assetId);
    if (!asset) throw Error(`Asset ${output.assetId} is not existing.`);

    outputEntities.push(
      new SwapAssetBalance({
        id: `${swap.id}-${asset.id}-${SwapAssetBalanceType.Output}`,
        assetBalanceType: SwapAssetBalanceType.Output,
        amount: output.amount,
        swap,
        assetId: asset.id,
      })
    );
    swap.allInvolvedAssetIds.push(asset.id);
    if (asset.assetRegistryId)
      swap.allInvolvedAssetRegistryIds.push(asset.assetRegistryId);
  }

  swap.fees = feeEntities;
  swap.outputs = outputEntities;
  swap.inputs = inputsEntities;
  swap.allInvolvedAssetIds = [...new Set(swap.allInvolvedAssetIds)];
  swap.allInvolvedAssetRegistryIds = [
    ...new Set(swap.allInvolvedAssetRegistryIds),
  ];

  return {
    swap,
    swapFees: feeEntities,
    swapInputs: inputsEntities,
    swapOutputs: outputEntities,
  };
}

export async function handleSwap({
  ctx,
  blockHeader,
  data: {
    swapId,
    traceIds,
    operationId,
    // customRouteId,
    eventId,
    swapIndex,
    swapperAccountId,
    fillerAccountId,
    fillerType,
    inputs,
    outputs,
    fees,
    operationType,
    paraBlockHeight,
    timestamp,
  },
}: {
  ctx: SqdProcessorContext<Store>;
  blockHeader: BlockHeader;
  data: {
    swapId?: string;
    traceIds: string[];
    operationId?: string;
    // customRouteId?: string;
    eventId: string;
    swapIndex?: number;
    swapperAccountId: string;
    fillerAccountId: string;
    fillerType: SwapFillerType;
    fees: BroadcastSwappedFee[];
    inputs: BroadcastSwappedAssetAmount[];
    outputs: BroadcastSwappedAssetAmount[];
    operationType: TradeOperationType;
    paraBlockHeight: number;
    timestamp: number;
  };
}): Promise<GetNewSwapResponse> {
  const swapData = await getNewSwap({
    ctx,
    blockHeader,
    data: {
      swapId,
      traceIds,
      operationId,
      swapIndex: swapIndex ?? 0,
      swapperId: swapperAccountId,
      fillerId: fillerAccountId,
      fillerType,
      operationType,
      eventId,
      paraBlockHeight,
      paraTimestamp: new Date(timestamp),
      fees,
      inputs,
      outputs,
    },
  });

  const { swap, swapFees, swapOutputs, swapInputs } = swapData;

  let routedTrade: RoutedTrade | null = null;

  if (
    isUnifiedEventsSupportSpecVersion(
      blockHeader.specVersion,
      ctx.appConfig.UNIFIED_EVENTS_GENESIS_SPEC_VERSION
    )
  )
    routedTrade = processRouteTradeHop({
      swap,
      ctx,
      // customRouteId,
    });

  swap.routedTrade = routedTrade;
  swap.swapIndex =
    swapIndex ?? (routedTrade ? routedTrade.swaps.length - 1 : 0);

  // Get Account objects for fee recipients
  const feeRecipientAccounts = await Promise.all(
    swapFees
      .filter((fee) => !!fee.recipientId)
      .map(async (fee) => ({
        fee,
        account: await getOrCreateAccount({ ctx, id: fee.recipientId! }),
      }))
  );

  for (const { fee, account } of feeRecipientAccounts) {
    await handleSwapFeeHistoricalData({
      ctx,
      feeAmount: fee.amount,
      assetId: fee.assetId,
      account,
      block: swap.event.block,
    });
  }

  const state = ctx.batchState.state;

  state.swaps.set(swap.id, swap);
  for (const fee of swapFees) state.swapFees.set(fee.id, fee);
  for (const swapInput of swapInputs)
    state.swapInputs.set(swapInput.id, swapInput);
  for (const swapOutput of swapOutputs)
    state.swapOutputs.set(swapOutput.id, swapOutput);

  // Get Account objects for activity trace
  const [swapperAccount, fillerAccount] = await Promise.all([
    getOrCreateAccount({ ctx, id: swap.swapperId }),
    getOrCreateAccount({ ctx, id: swap.fillerId }),
  ]);

  await ChainActivityTraceManager.addParticipantsToActivityTracesBulk({
    participants: [
      swapperAccount,
      fillerAccount,
      ...feeRecipientAccounts.map(({ account }) => account),
    ],
    traceIds,
    ctx,
  });

  return swapData;
}

export async function handleBroadcastSwappedEvent(
  ctx: SqdProcessorContext<Store>,
  eventCallData: BroadcastSwappedData
) {
  await broadcastSwappedEventPreHook(eventCallData);
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData: { traceId: callTraceId },
  } = eventCallData;

  // const newOperationStackEntity = OperationStackManager.getNewOperationStack({
  //   stack: eventParams.operationStack,
  // });

  const newOperationStackId =
    eventParams.operationStack && eventParams.operationStack.length > 0
      ? OperationStackManager.operationStackToString(eventParams.operationStack)
      : undefined;
  const chainActivityTraceId = ChainActivityTraceManager.getTraceIdRoot(
    callTraceId ?? eventMetadata.traceId
  );

  let chainActivityTrace = null;

  if (chainActivityTraceId) {
    chainActivityTrace = await ChainActivityTraceManager.getChainActivityTrace({
      id: chainActivityTraceId,
      ctx,
      fetchFromDb: true,
    });
  }

  if (newOperationStackId) {
    await ChainActivityTraceManager.addOperationIdToActivityTrace({
      traceId: callTraceId ?? eventMetadata.traceId,
      operationId: newOperationStackId,
      ctx,
    });
  }

  const { inputs: inputsDecorated, outputs: outputsDecorated } =
    getInputOutputDecorated({
      inputs: eventParams.inputs,
      outputs: eventParams.outputs,
      fillerType: eventParams.fillerType.kind,
      operationType: eventParams.operation,
      eventName: eventMetadata.name,
    });

  const newSwapDetails = await handleSwap({
    ctx,
    blockHeader: eventMetadata.blockHeader,
    data: {
      traceIds: [...(callTraceId ? [callTraceId] : []), eventMetadata.traceId],
      operationId: newOperationStackId,
      eventId: eventMetadata.id,
      swapperAccountId: eventParams.swapper,
      fillerAccountId: eventParams.filler,
      fillerType: eventParams.fillerType.kind,
      inputs: inputsDecorated,
      outputs: outputsDecorated,
      fees: eventParams.fees,
      operationType: eventParams.operation,
      paraBlockHeight: eventMetadata.blockHeader.height,
      timestamp: eventMetadata.blockHeader.timestamp ?? Date.now(),
    },
  });

  const state = ctx.batchState.state;

  const fillerContextData = await getFillerContextData(ctx, eventCallData);

  if (fillerContextData)
    state.swapFillerContexts.set(newSwapDetails.swap.id, fillerContextData);

  // if (newOperationStackEntity)
  //   state.operationStacks.set(
  //     newOperationStackEntity.id,
  //     newOperationStackEntity
  //   );

  if (chainActivityTrace)
    state.chainActivityTraces.set(chainActivityTrace.id, chainActivityTrace);

  await broadcastSwappedEventPostHook({
    swap: newSwapDetails.swap,
    ctx,
    eventCallData,
    chainActivityTrace,
  });
}

/**
 *
 * IMPORTANT!!!
 * Actual ONLY for Broadcast.Swapped event
 *
 * Decorates swap amounts by switching input and output values for specific pool types
 * during a transitional period after the Broadcast.Swapped event release.
 *
 * @remarks
 * This decoration handles a temporary issue affecting XYK and LBP pools where
 * input and output amounts need to be swapped to maintain correct data representation.
 */
function getInputOutputDecorated({
  inputs,
  outputs,
  fillerType,
  operationType,
  eventName,
}: {
  operationType: TradeOperationType;
  fillerType: SwapFillerType;
  inputs: BroadcastSwappedAssetAmount[];
  outputs: BroadcastSwappedAssetAmount[];
  eventName: string;
}) {
  if (
    eventName !== EventName.Broadcast_Swapped ||
    operationType === TradeOperationType.ExactIn ||
    operationType !== TradeOperationType.ExactOut ||
    (fillerType !== SwapFillerType.XYK && fillerType !== SwapFillerType.LBP)
  )
    return { inputs, outputs };

  return {
    inputs: [
      {
        assetId: inputs[0].assetId,
        amount: outputs[0].amount,
      },
    ],
    outputs: [
      {
        assetId: outputs[0].assetId,
        amount: inputs[0].amount,
      },
    ],
  };
}

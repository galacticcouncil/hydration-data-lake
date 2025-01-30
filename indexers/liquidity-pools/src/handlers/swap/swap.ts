import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BlockHeader } from '@subsquid/substrate-processor';
import {
  Swap,
  SwapFee,
  SwapFillerType,
  SwapAssetBalance,
  TradeOperationType,
  SwapAssetBalanceType,
  SwapFeeDestinationType,
} from '../../model';
import { getAccount } from '../accounts';
import { getAsset } from '../assets/assetRegistry';
import { GetNewSwapResponse } from '../../utils/types';
import { ChainActivityTraceManager } from '../../chainActivityTracingManagers';
import { BroadcastSwappedData } from '../../parsers/batchBlocksParser/types';
import { OperationStackManager } from '../../chainActivityTracingManagers/operationStackManager';
import { FindOptionsRelations, In } from 'typeorm';
import {
  BroadcastSwappedAssetAmount,
  BroadcastSwappedFee,
} from '../../parsers/types/events';
import {
  getFillerContextData,
  supportSwappedEventPostHook,
  supportSwapperEventPreHook,
} from './helpers';
import { processRouteTradeHop } from './routeTrade';

export async function getSwap({
  ctx,
  id,
  eventTraceId,
  relations = {
    swapper: true,
    filler: true,
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

  swap = await ctx.store.findOne(Swap, {
    where: {
      ...(id ? { id } : {}),
      ...(eventTraceId ? { traceIds: In([eventTraceId]) } : {}),
    },
    relations,
  });

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
    swapper: await getAccount({ ctx, id: swapperId }),
    filler: await getAccount({ ctx, id: fillerId }),
    allInvolvedAssetIds: [
      ...new Set([
        ...inputs.map((input) => input.assetId),
        ...outputs.map((output) => output.assetId),
        ...fees.map((fee) => fee.assetId),
      ]).values(),
    ].map((id) => `${id}`),
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

  for (const fee of fees) {
    const asset = await getAsset({
      ctx,
      id: fee.assetId,
      ensure: true,
      blockHeader,
    });
    if (!asset) throw Error(`Asset ${fee.assetId} is not existing.`);

    const recipient =
      fee.destinationType === SwapFeeDestinationType.Account
        ? await getAccount({ ctx, id: fee.recipientId! })
        : null;

    feeEntities.push(
      new SwapFee({
        id: `${swap.id}-${asset.id}${recipient ? `-${recipient.id}` : `-${fee.destinationType}`}`,
        amount: fee.amount,
        destinationType: fee.destinationType,
        swap,
        asset,
        recipient,
      })
    );
  }
  for (const input of inputs) {
    const asset = await getAsset({
      ctx,
      id: input.assetId,
      ensure: true,
      blockHeader,
    });
    if (!asset) throw Error(`Asset ${input.assetId} is not existing.`);

    inputsEntities.push(
      new SwapAssetBalance({
        id: `${swap.id}-${asset.id}-${SwapAssetBalanceType.Input}`,
        assetBalanceType: SwapAssetBalanceType.Input,
        amount: input.amount,
        swap,
        asset,
      })
    );
  }
  for (const output of outputs) {
    const asset = await getAsset({
      ctx,
      id: output.assetId,
      ensure: true,
      blockHeader,
    });
    if (!asset) throw Error(`Asset ${output.assetId} is not existing.`);

    outputEntities.push(
      new SwapAssetBalance({
        id: `${swap.id}-${asset.id}-${SwapAssetBalanceType.Output}`,
        assetBalanceType: SwapAssetBalanceType.Output,
        amount: output.amount,
        swap,
        asset,
      })
    );
  }

  swap.fees = feeEntities;
  swap.outputs = outputEntities;
  swap.inputs = inputsEntities;

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
    customRouteId,
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
    customRouteId?: string;
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

  const routeTrade = processRouteTradeHop({
    swap,
    ctx,
    customRouteId,
  });

  swap.routeTrade = routeTrade;
  swap.swapIndex = swapIndex ?? routeTrade.swaps.length - 1;

  const state = ctx.batchState.state;

  state.swaps.set(swap.id, swap);
  for (const fee of swapFees) state.swapFees.set(fee.id, fee);
  for (const swapInput of swapInputs)
    state.swapInputs.set(swapInput.id, swapInput);
  for (const swapOutput of swapOutputs)
    state.swapOutputs.set(swapOutput.id, swapOutput);

  await ChainActivityTraceManager.addParticipantsToActivityTracesBulk({
    participants: [
      swap.swapper,
      swap.filler,
      ...swapFees.map((fee) => fee.recipient ?? null).filter((i) => !!i),
    ],
    traceIds,
    ctx,
  });

  return swapData;
}

export async function handleSupportSwapperEvent(
  ctx: SqdProcessorContext<Store>,
  eventCallData: BroadcastSwappedData
) {
  await supportSwapperEventPreHook(eventCallData);
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

  if (chainActivityTraceId)
    chainActivityTrace = await ChainActivityTraceManager.getChainActivityTrace({
      id: chainActivityTraceId,
      ctx,
      fetchFromDb: true,
    });

  if (newOperationStackId)
    await ChainActivityTraceManager.addOperationIdToActivityTrace({
      traceId: callTraceId ?? eventMetadata.traceId,
      operationId: newOperationStackId,
      ctx,
    });

  const newSwapDetails = await handleSwap({
    ctx,
    blockHeader: eventMetadata.blockHeader,
    data: {
      traceIds: [...(callTraceId ? [callTraceId] : []), eventMetadata.traceId],
      operationId: newOperationStackId,
      eventId: eventMetadata.id,
      // extrinsicHash: eventMetadata.extrinsic?.hash || '',
      // eventIndex: eventMetadata.indexInBlock,
      swapperAccountId: eventParams.swapper,
      fillerAccountId: eventParams.filler,
      fillerType: eventParams.fillerType.kind,
      inputs: eventParams.inputs,
      outputs: eventParams.outputs,
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

  await supportSwappedEventPostHook({
    swap: newSwapDetails.swap,
    ctx,
    eventCallData,
    chainActivityTrace,
  });
}

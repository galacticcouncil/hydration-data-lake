import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BlockHeader } from '@subsquid/substrate-processor';
import {
  Swap,
  SwapFee,
  SwapFillerType,
  SwapInputAssetBalance,
  SwapOutputAssetBalance,
  TradeOperationType,
} from '../../model';
import { getAccount } from '../accounts';
import { getAsset } from '../assets/assetRegistry';
import { GetNewSwapResponse } from '../../utils/types';
import { ChainActivityTraceManager } from '../../chainActivityTraceManager';
import { AmmSupportSwappedData } from '../../parsers/batchBlocksParser/types';
import { OperationStackManager } from '../../chainActivityTraceManager/operationStackManager';
import { FindOptionsRelations, In } from 'typeorm';
import {
  AmmSupportSwappedAssetAmount,
  AmmSupportSwappedFee,
} from '../../parsers/types/events';
import {
  getFillerContextData,
  supportSwappedEventPostHook,
  supportSwapperEventPreHook,
} from './helpers';

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
  ctx: ProcessorContext<Store>;
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
    eventIndex,
    extrinsicHash,
    relayChainBlockHeight,
    paraChainBlockHeight,
    paraChainTimestamp,
  },
}: {
  ctx: ProcessorContext<Store>;
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
    fees: { assetId: number; amount: bigint; recipientId: string }[];
    inputs: { assetId: number; amount: bigint }[];
    outputs: { assetId: number; amount: bigint }[];
    eventId: string;
    eventIndex: number;
    extrinsicHash: string;
    relayChainBlockHeight: number;
    paraChainBlockHeight: number;
    paraChainTimestamp: Date;
  };
}): Promise<GetNewSwapResponse> {
  const swap = new Swap({
    id: swapId ?? eventId,
    traceIds,
    operationId,
    swapIndex,
    swapper: await getAccount(ctx, swapperId),
    filler: await getAccount(ctx, fillerId),
    fillerType,
    operationType,
    eventIndex,
    relayChainBlockHeight,
    paraChainBlockHeight,
    paraChainTimestamp,
    extrinsicHash,
  });

  const feeEntities: SwapFee[] = [];
  const inputsEntities: SwapInputAssetBalance[] = [];
  const outputEntities: SwapOutputAssetBalance[] = [];

  for (const fee of fees) {
    const asset = await getAsset({
      ctx,
      id: fee.assetId,
      ensure: true,
      blockHeader,
    });
    if (!asset) throw Error(`Asset ${fee.assetId} is not existing.`);

    const recipient = await getAccount(ctx, fee.recipientId);
    if (!recipient) throw Error(`Account ${fee.recipientId} is not existing.`);

    feeEntities.push(
      new SwapFee({
        id: `${swap.id}-${asset.id}`,
        swap,
        asset,
        recipient,
        amount: fee.amount,
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
      new SwapInputAssetBalance({
        id: `${swap.id}-${asset.id}-input`,
        swap,
        asset,
        amount: input.amount,
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
      new SwapOutputAssetBalance({
        id: `${swap.id}-${asset.id}-output`,
        swap,
        asset,
        amount: output.amount,
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
    eventId,
    extrinsicHash,
    eventIndex,
    swapperAccountId,
    fillerAccountId,
    fillerType,
    inputs,
    outputs,
    fees,
    operationType,
    relayChainBlockHeight,
    paraChainBlockHeight,
    timestamp,
  },
}: {
  ctx: ProcessorContext<Store>;
  blockHeader: BlockHeader;
  data: {
    swapId?: string;
    traceIds: string[];
    operationId?: string;
    eventId: string;
    extrinsicHash: string;
    eventIndex: number;
    swapperAccountId: string;
    fillerAccountId: string;
    fillerType: SwapFillerType;
    fees: AmmSupportSwappedFee[];
    inputs: AmmSupportSwappedAssetAmount[];
    outputs: AmmSupportSwappedAssetAmount[];
    operationType: TradeOperationType;
    relayChainBlockHeight: number;
    paraChainBlockHeight: number;
    timestamp: number;
  };
}): Promise<GetNewSwapResponse> {
  const eventTraceId = traceIds.find((tId) =>
    ChainActivityTraceManager.isEventTraceId(tId)
  );

  if (!eventTraceId)
    throw Error(`Swap with eventId ${eventId} does not contain eventTraceId`);

  const existingSwap = await getSwap({
    eventTraceId,
    ctx,
    relations: {
      swapper: true,
      filler: true,
      fees: { asset: true, recipient: true },
      inputs: { asset: true },
      outputs: { asset: true },
    },
  });

  if (existingSwap) {
    return {
      swap: existingSwap,
      swapFees: existingSwap.fees,
      swapOutputs: existingSwap.outputs,
      swapInputs: existingSwap.inputs,
    };
  }

  const swapData = await getNewSwap({
    ctx,
    blockHeader,
    data: {
      swapId,
      traceIds,
      operationId,
      swapIndex: 0,
      swapperId: swapperAccountId,
      fillerId: fillerAccountId,
      fillerType,
      operationType,
      eventId,
      eventIndex,
      relayChainBlockHeight,
      paraChainBlockHeight,
      extrinsicHash,
      paraChainTimestamp: new Date(timestamp),
      fees,
      inputs,
      outputs,
    },
  });

  const { swap, swapFees, swapOutputs, swapInputs } = swapData;

  const state = ctx.batchState.state;

  state.swaps.set(swap.id, swap);
  for (const fee of swapFees) state.swapFees.set(fee.id, fee);
  for (const swapInput of swapInputs)
    state.swapInputs.set(swapInput.id, swapInput);
  for (const swapOutput of swapOutputs)
    state.swapOutputs.set(swapOutput.id, swapOutput);

  ctx.batchState.state = {
    swaps: state.swaps,
    swapFees: state.swapFees,
    swapInputs: state.swapInputs,
    swapOutputs: state.swapOutputs,
  };

  await ChainActivityTraceManager.addParticipantsToActivityTracesBulk({
    participants: [swap.swapper, swap.filler],
    traceIds,
    ctx,
  });

  return swapData;
}

export async function handleSupportSwapperEvent(
  ctx: ProcessorContext<Store>,
  eventCallData: AmmSupportSwappedData
) {
  await supportSwapperEventPreHook(eventCallData);

  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData: { traceId: callTraceId },
  } = eventCallData;

  const newOperationStackEntity = OperationStackManager.getNewOperationStack({
    stack: eventParams.operationStack,
  });

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

  if (newOperationStackEntity)
    await ChainActivityTraceManager.addOperationIdToActivityTrace({
      traceId: callTraceId ?? eventMetadata.traceId,
      operationId: newOperationStackEntity.id,
      ctx,
    });

  const newSwapDetails = await handleSwap({
    ctx,
    blockHeader: eventMetadata.blockHeader,
    data: {
      traceIds: [...(callTraceId ? [callTraceId] : []), eventMetadata.traceId],
      operationId: newOperationStackEntity?.id,
      eventId: eventMetadata.id,
      extrinsicHash: eventMetadata.extrinsic?.hash || '',
      eventIndex: eventMetadata.indexInBlock,
      swapperAccountId: eventParams.swapper,
      fillerAccountId: eventParams.filler,
      fillerType: eventParams.fillerType.kind,
      inputs: eventParams.inputs,
      outputs: eventParams.outputs,
      fees: eventParams.fees,
      operationType: eventParams.operation,
      relayChainBlockHeight: eventCallData.relayChainInfo.relaychainBlockNumber,
      paraChainBlockHeight: eventMetadata.blockHeader.height,
      timestamp: eventMetadata.blockHeader.timestamp ?? Date.now(),
    },
  });

  const state = ctx.batchState.state;

  const fillerContextData = await getFillerContextData(ctx, eventCallData);

  if (fillerContextData)
    state.swapFillerContexts.set(newSwapDetails.swap.id, fillerContextData);

  if (newOperationStackEntity)
    state.operationStacks.set(
      newOperationStackEntity.id,
      newOperationStackEntity
    );

  if (chainActivityTrace)
    state.chainActivityTraces.set(chainActivityTrace.id, chainActivityTrace);

  ctx.batchState.state = {
    operationStacks: state.operationStacks,
    chainActivityTraces: state.chainActivityTraces,
    swapFillerContexts: state.swapFillerContexts,
  };

  await supportSwappedEventPostHook({
    swap: newSwapDetails.swap,
    ctx,
    eventCallData,
    chainActivityTrace,
  });
}

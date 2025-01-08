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
import { getOrCreateLbpPool } from '../pools/lbpPool/lbpPool';
import { getOrCreateXykPool } from '../pools/xykPool/xykPool';
import { getStablepool } from '../pools/stablepool/stablepool';
import {
  handleLbpPoolVolumeUpdates,
  handleOmnipoolAssetVolumeUpdates,
  handleXykPoolVolumeUpdates,
} from '../volumes';
import { handleAssetVolumeUpdates } from '../assets/volume';
import { handleStablepoolVolumeUpdates } from '../volumes/stablepoolVolume';

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

  return swap ?? null;
}

export async function getNewSwap({
  ctx,
  blockHeader,
  data: {
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
    hubAmountIn,
    hubAmountOut,
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
    hubAmountIn?: bigint;
    hubAmountOut?: bigint;
    eventId: string;
    eventIndex: number;
    extrinsicHash: string;
    relayChainBlockHeight: number;
    paraChainBlockHeight: number;
    paraChainTimestamp: Date;
  };
}): Promise<GetNewSwapResponse> {
  const swap = new Swap({
    id: eventId,
    traceIds,
    operationId,
    swapIndex,
    swapper: await getAccount(ctx, swapperId),
    filler: await getAccount(ctx, fillerId),
    fillerType,
    operationType,
    hubAmountIn: hubAmountIn ?? null,
    hubAmountOut: hubAmountOut ?? null,
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
    traceIds,
    operationId,
    eventId,
    extrinsicHash,
    eventIndex,
    swapperAccountId,
    fillerAccountId,
    swapFillerType,
    inputs,
    outputs,
    hubAmountIn,
    hubAmountOut,
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
    traceIds: string[];
    operationId?: string;
    eventId: string;
    extrinsicHash: string;
    eventIndex: number;
    swapperAccountId: string;
    fillerAccountId: string;
    swapFillerType: SwapFillerType;
    fees: AmmSupportSwappedFee[];
    inputs: AmmSupportSwappedAssetAmount[];
    outputs: AmmSupportSwappedAssetAmount[];
    hubAmountIn?: bigint;
    hubAmountOut?: bigint;
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
      traceIds,
      operationId,
      swapIndex: 0,
      swapperId: swapperAccountId,
      fillerId: fillerAccountId,
      fillerType: swapFillerType,
      operationType,
      eventId,
      eventIndex,
      relayChainBlockHeight,
      paraChainBlockHeight,
      extrinsicHash,
      paraChainTimestamp: new Date(timestamp),
      fees,
      hubAmountIn,
      hubAmountOut,
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
  await supportSwapperEventPreHook(ctx, eventCallData);

  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData: { traceId: callTraceId },
  } = eventCallData;

  const newOperationStackEntity = OperationStackManager.getNewOperationStack({
    stack: eventParams.operationStack,
  });

  const chainActivityTrace =
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
      operationId: newOperationStackEntity.id,
      eventId: eventMetadata.id,
      extrinsicHash: eventMetadata.extrinsic?.hash || '',
      eventIndex: eventMetadata.indexInBlock,
      swapperAccountId: eventParams.swapper,
      fillerAccountId: eventParams.filler,
      swapFillerType: eventParams.fillerType.kind,
      inputs: eventParams.inputs,
      outputs: eventParams.outputs,
      fees: eventParams.fees,
      operationType: eventParams.operation,
      relayChainBlockHeight: eventCallData.relayChainInfo.relaychainBlockNumber,
      paraChainBlockHeight: eventMetadata.blockHeader.height,
      timestamp: eventMetadata.blockHeader.timestamp ?? Date.now(),
      ...getOmnipoolHubAmountOnSwap({
        fillerType: eventParams.fillerType.kind,
        swapInputs: eventParams.inputs,
        swapOutputs: eventParams.outputs,
        ctx,
      }),
    },
  });

  const state = ctx.batchState.state;

  state.operationStacks.set(
    newOperationStackEntity.id,
    newOperationStackEntity
  );
  if (chainActivityTrace)
    state.chainActivityTraces.set(chainActivityTrace.id, chainActivityTrace);

  ctx.batchState.state = {
    operationStacks: state.operationStacks,
    chainActivityTraces: state.chainActivityTraces,
  };

  await supportSwapperEventPostHook(newSwapDetails.swap, ctx, eventCallData);
}

function getOmnipoolHubAmountOnSwap({
  fillerType,
  swapInputs,
  swapOutputs,
  ctx,
}: {
  fillerType: SwapFillerType;
  swapInputs: AmmSupportSwappedAssetAmount[];
  swapOutputs: AmmSupportSwappedAssetAmount[];
  ctx: ProcessorContext<Store>;
}): {
  hubAmountIn: bigint | undefined;
  hubAmountOut: bigint | undefined;
} {
  const result: {
    hubAmountIn: bigint | undefined;
    hubAmountOut: bigint | undefined;
  } = {
    hubAmountIn: undefined,
    hubAmountOut: undefined,
  };

  if (fillerType !== SwapFillerType.Omnipool) return result;
  const hubAssetSwapDetails: {
    amount: bigint;
    position: 'input' | 'output' | 'none';
  } = {
    amount: 0n,
    position: 'none',
  };

  for (const input of swapInputs) {
    if (input.assetId !== +ctx.appConfig.OMNIPOOL_PROTOCOL_ASSET_ID) continue;
    hubAssetSwapDetails.amount = input.amount;
    hubAssetSwapDetails.position = 'input';
  }
  for (const output of swapOutputs) {
    if (output.assetId !== +ctx.appConfig.OMNIPOOL_PROTOCOL_ASSET_ID) continue;
    hubAssetSwapDetails.amount = output.amount;
    hubAssetSwapDetails.position = 'output';
  }

  switch (hubAssetSwapDetails.position) {
    case 'output':
      result.hubAmountIn = hubAssetSwapDetails.amount;
      break;
    case 'input':
      result.hubAmountOut = hubAssetSwapDetails.amount;
      break;
  }

  return result;
}

export async function supportSwapperEventPreHook(
  ctx: ProcessorContext<Store>,
  eventCallData: AmmSupportSwappedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  switch (eventParams.fillerType.kind) {
    case SwapFillerType.LBP: {
      break;
    }
    case SwapFillerType.XYK: {
      break;
    }
    case SwapFillerType.Stableswap: {
      break;
    }
  }
}

export async function supportSwapperEventPostHook(
  swap: Swap,
  ctx: ProcessorContext<Store>,
  eventCallData: AmmSupportSwappedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  switch (eventParams.fillerType.kind) {
    case SwapFillerType.LBP: {
      const pool = await getOrCreateLbpPool({
        ctx,
        assetIds: [
          eventParams.inputs[0].assetId,
          eventParams.outputs[0].assetId,
        ],
        ensure: true,
        blockHeader: eventCallData.eventData.metadata.blockHeader,
      });

      if (!pool) {
        console.log(
          `No pool found for event: ${eventMetadata.name} ${eventMetadata.id}`
        );
        return;
      }
      ctx.batchState.state.lbpAllBatchPools.set(pool.id, pool);

      await handleLbpPoolVolumeUpdates({
        ctx,
        swap,
        pool,
      });

      await handleAssetVolumeUpdates(ctx, {
        paraChainBlockHeight: swap.paraChainBlockHeight,
        relayChainBlockHeight: swap.relayChainBlockHeight,
        assetIn: swap.inputs[0].asset,
        assetInAmount: swap.inputs[0].amount,
        assetOut: swap.outputs[0].asset,
        assetOutAmount: swap.outputs[0].amount,
      });
      break;
    }
    case SwapFillerType.XYK: {
      const pool = await getOrCreateXykPool({
        ctx,
        id: eventParams.filler,
        ensure: true,
        blockHeader: eventCallData.eventData.metadata.blockHeader,
      });

      if (!pool) {
        console.log(
          `No XYK pool found for event: ${eventMetadata.name} ${eventMetadata.id}`
        );
        return;
      }
      ctx.batchState.state.xykAllBatchPools.set(pool.id, pool);

      await handleXykPoolVolumeUpdates({
        ctx,
        swap,
        pool,
      });

      await handleAssetVolumeUpdates(ctx, {
        paraChainBlockHeight: swap.paraChainBlockHeight,
        relayChainBlockHeight: swap.relayChainBlockHeight,
        assetIn: swap.inputs[0].asset,
        assetInAmount: swap.inputs[0].amount,
        assetOut: swap.outputs[0].asset,
        assetOutAmount: swap.outputs[0].amount,
      });

      break;
    }
    case SwapFillerType.Omnipool:
      await handleOmnipoolAssetVolumeUpdates({
        ctx,
        swap,
      });
      break;
    case SwapFillerType.Stableswap: {
      const pool = await getStablepool(ctx, eventParams.filler);

      if (!pool) {
        console.log(
          `Stablepool with ID ${eventParams.filler} has not been found`
        );
        return;
      }
      ctx.batchState.state.stablepoolAllBatchPools.set(pool.id, pool);

      await handleStablepoolVolumeUpdates({
        ctx,
        swap,
        pool,
      });
      break;
    }
  }
}

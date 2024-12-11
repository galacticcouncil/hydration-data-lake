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

export async function getNewSwap({
  ctx,
  blockHeader,
  data: {
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
    swapIndex: number;
    swapperId: string;
    fillerId: string;
    fillerType: SwapFillerType;
    operationType: TradeOperationType;
    fees: { assetId: string; amount: bigint; recipientId: string }[];
    inputs: { assetId: string; amount: bigint }[];
    outputs: { assetId: string; amount: bigint }[];
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

export async function handleSellBuyAsSwap({
  ctx,
  blockHeader,
  data: {
    eventId,
    extrinsicHash,
    eventIndex,
    swapperAccountId,
    poolAccountId,
    poolType,
    assetInId,
    assetOutId,
    amountIn,
    amountOut,
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
    eventId: string;
    extrinsicHash: string;
    eventIndex: number;
    swapperAccountId: string;
    poolAccountId: string;
    poolType: SwapFillerType;
    assetInId: string;
    assetOutId: string;
    amountIn: bigint;
    amountOut: bigint;
    hubAmountIn?: bigint;
    hubAmountOut?: bigint;
    fees: {
      assetId: string;
      amount: bigint;
      recipientId: string;
    }[];
    operationType: TradeOperationType;
    relayChainBlockHeight: number;
    paraChainBlockHeight: number;
    timestamp: number;
  };
}): Promise<GetNewSwapResponse> {
  const swapData = await getNewSwap({
    ctx,
    blockHeader,
    data: {
      swapIndex: 0,
      swapperId: swapperAccountId,
      fillerId: poolAccountId,
      fillerType: poolType,
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
      inputs: [
        {
          amount: amountIn,
          assetId: assetInId,
        },
      ],
      outputs: [
        {
          amount: amountOut,
          assetId: assetOutId,
        },
      ],
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

  return swapData;
}

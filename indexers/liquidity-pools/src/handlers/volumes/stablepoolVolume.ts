import {
  Asset,
  LiquidityActionType,
  Stablepool,
  StablepoolAssetHistoricalVolume,
  StablepoolAssetLiquidityAmount,
  StablepoolHistoricalVolume,
  StablepoolLiquidityAction,
  Swap,
} from '../../model';
import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  getOldStablepoolAssetVolume,
  getPoolAssetLastVolumeFromCache,
} from './index';
import { getAssetsByStablepool } from '../pools/stablepool/assets';

// TODO improve conditional usage with poolOperation and liquidityAction
export async function handleStablepoolVolumeUpdates({
  ctx,
  pool,
  swap,
  liquidityAction,
}: {
  ctx: ProcessorContext<Store>;
  pool: Stablepool;
  swap?: Swap;
  liquidityAction?: StablepoolLiquidityAction;
}) {
  if (!swap && !liquidityAction) return;

  const paraChainBlockHeight = swap
    ? swap.paraChainBlockHeight
    : liquidityAction!.paraChainBlockHeight;

  const relayChainBlockHeight = swap
    ? swap.relayChainBlockHeight
    : liquidityAction!.relayChainBlockHeight;

  let allAssetsToProcess: Asset[] = await getAssetsByStablepool(ctx, pool.id);

  const stablepoolVolumeCollections =
    ctx.batchState.state.stablepoolVolumeCollections;
  const stablepoolAssetVolumes = ctx.batchState.state.stablepoolAssetVolumes;
  const stablepoolAssetVolumeIdsToSave =
    ctx.batchState.state.stablepoolAssetVolumeIdsToSave;

  let volumesCollection = stablepoolVolumeCollections.get(
    pool.id + '-' + paraChainBlockHeight
  );

  if (!volumesCollection) {
    volumesCollection = new StablepoolHistoricalVolume({
      id: `${pool.id}-${paraChainBlockHeight}`,
      pool,
      relayChainBlockHeight,
      paraChainBlockHeight,
    });
    stablepoolVolumeCollections.set(volumesCollection.id, volumesCollection);
  }

  for (const asset of allAssetsToProcess) {
    const currentAssetVolume = stablepoolAssetVolumes.get(
      `${pool.id}-${asset.id}-${paraChainBlockHeight}`
    );

    const oldVolume =
      currentAssetVolume ||
      (getPoolAssetLastVolumeFromCache(
        stablepoolAssetVolumes,
        `${pool.id}-${asset.id}`
      ) as StablepoolAssetHistoricalVolume | undefined) ||
      (await getOldStablepoolAssetVolume(ctx, asset.id, pool.id));

    const newVolume = initStablepoolAssetVolume({
      ...(!!swap ? { swap } : {}),
      ...(!!liquidityAction
        ? {
            liquidityActionData: {
              actionData: liquidityAction,
              assetData: liquidityAction.assetAmounts.find(
                (a) => a.asset.id === asset.id
              )!, // TODO fix types
            },
          }
        : {}),
      currentVolume: currentAssetVolume,
      oldVolume,
      asset,
      pool,
      volumesCollection,
      ctx,
    });

    if (!newVolume) continue;

    stablepoolAssetVolumes.set(newVolume.id, newVolume);
    if (liquidityAction) stablepoolAssetVolumeIdsToSave.add(newVolume.id);
  }
}

// TODO improve conditional usage with swap and liquidityAction
export function initStablepoolAssetVolume({
  swap,
  liquidityActionData,
  currentVolume,
  oldVolume,
  asset,
  pool,
  volumesCollection,
  ctx,
}: {
  swap?: Swap;
  liquidityActionData?: {
    actionData: StablepoolLiquidityAction;
    assetData?: StablepoolAssetLiquidityAmount;
  };
  asset: Asset;
  pool: Stablepool;
  volumesCollection: StablepoolHistoricalVolume;
  currentVolume?: StablepoolAssetHistoricalVolume | undefined;
  oldVolume?: StablepoolAssetHistoricalVolume | undefined;
  ctx: ProcessorContext<Store>;
}) {
  if (!swap && !liquidityActionData) return;

  const poolId = pool.id;
  const paraChainBlockHeight = swap
    ? swap.paraChainBlockHeight
    : liquidityActionData!.actionData.paraChainBlockHeight;

  const newVolume = new StablepoolAssetHistoricalVolume({
    id: `${poolId}-${asset.id}-${paraChainBlockHeight}`,
    asset,
    volumesCollection,
    swapFee: currentVolume?.swapFee || BigInt(0),
    swapTotalFees:
      currentVolume?.swapTotalFees || oldVolume?.swapTotalFees || BigInt(0),
    liqFee: currentVolume?.liqFee || BigInt(0),
    liqTotalFees:
      currentVolume?.liqTotalFees || oldVolume?.liqTotalFees || BigInt(0),
    routedLiqFee: currentVolume?.routedLiqFee || BigInt(0),
    routedLiqTotalFees:
      currentVolume?.routedLiqTotalFees ||
      oldVolume?.routedLiqTotalFees ||
      BigInt(0),

    swapVolumeIn: currentVolume?.swapVolumeIn || BigInt(0),
    swapVolumeOut: currentVolume?.swapVolumeOut || BigInt(0),
    swapTotalVolumeIn:
      currentVolume?.swapTotalVolumeIn ||
      oldVolume?.swapTotalVolumeIn ||
      BigInt(0),
    swapTotalVolumeOut:
      currentVolume?.swapTotalVolumeOut ||
      oldVolume?.swapTotalVolumeOut ||
      BigInt(0),

    liqAddedAmount: currentVolume?.liqAddedAmount || BigInt(0),
    liqRemovedAmount: currentVolume?.liqRemovedAmount || BigInt(0),
    liqAddedTotalAmount:
      currentVolume?.liqAddedTotalAmount ||
      oldVolume?.liqAddedTotalAmount ||
      BigInt(0),
    liqRemovedTotalAmount:
      currentVolume?.liqRemovedTotalAmount ||
      oldVolume?.liqRemovedTotalAmount ||
      BigInt(0),

    routedLiqAddedAmount: currentVolume?.routedLiqAddedAmount || BigInt(0),
    routedLiqRemovedAmount: currentVolume?.routedLiqRemovedAmount || BigInt(0),
    routedLiqAddedTotalAmount:
      currentVolume?.routedLiqAddedTotalAmount ||
      oldVolume?.routedLiqAddedTotalAmount ||
      BigInt(0),
    routedLiqRemovedTotalAmount:
      currentVolume?.routedLiqRemovedTotalAmount ||
      oldVolume?.routedLiqRemovedTotalAmount ||
      BigInt(0),

    paraChainBlockHeight,
  });

  let swapVolumeIn = BigInt(0);
  let swapVolumeOut = BigInt(0);
  let liqAddedAmount = BigInt(0);
  let liqRemovedAmount = BigInt(0);
  let routedLiqAddedAmount = BigInt(0);
  let routedLiqRemovedAmount = BigInt(0);
  let swapFee = BigInt(0);
  let liqFee = BigInt(0);
  let routedLiqFee = BigInt(0);

  if (swap) {
    const inputsMap = new Map(
      swap.inputs.map((inputAssetData) => [
        inputAssetData.asset.id,
        inputAssetData,
      ])
    );
    const outputsMap = new Map(
      swap.outputs.map((outputAssetData) => [
        outputAssetData.asset.id,
        outputAssetData,
      ])
    );
    const feesMap = new Map(
      swap.fees.map((feeAssetData) => [feeAssetData.asset.id, feeAssetData])
    );
    swapVolumeIn = inputsMap.has(newVolume.asset.id)
      ? inputsMap.get(newVolume.asset.id)!.amount
      : BigInt(0);
    swapVolumeOut = outputsMap.has(newVolume.asset.id)
      ? outputsMap.get(newVolume.asset.id)!.amount
      : BigInt(0);
    swapFee = feesMap.has(newVolume.asset.id)
      ? feesMap.get(newVolume.asset.id)!.amount
      : BigInt(0);
  }

  if (liquidityActionData) {
    liqAddedAmount =
      liquidityActionData.actionData.actionType === LiquidityActionType.ADD &&
      liquidityActionData.assetData
        ? liquidityActionData.assetData.amount
        : BigInt(0);
    liqRemovedAmount =
      liquidityActionData.actionData.actionType ===
        LiquidityActionType.REMOVE && liquidityActionData.assetData
        ? liquidityActionData.assetData.amount
        : BigInt(0);
    liqFee =
      liquidityActionData.actionData.actionType === LiquidityActionType.REMOVE
        ? liquidityActionData.actionData.feeAmount
        : BigInt(0);
    routedLiqAddedAmount =
      liquidityActionData.actionData.actionType === LiquidityActionType.ADD &&
      isRoutedStablepoolLiquidityAction({
        liquidityAction: liquidityActionData.actionData,
        ctx,
      }) &&
      liquidityActionData.assetData
        ? liquidityActionData.assetData.amount
        : BigInt(0);
    routedLiqRemovedAmount =
      liquidityActionData.actionData.actionType ===
        LiquidityActionType.REMOVE &&
      isRoutedStablepoolLiquidityAction({
        liquidityAction: liquidityActionData.actionData,
        ctx,
      }) &&
      liquidityActionData.assetData
        ? liquidityActionData.assetData.amount
        : BigInt(0);
  }

  // Block volumes
  newVolume.swapVolumeIn += swapVolumeIn;
  newVolume.swapVolumeOut += swapVolumeOut;
  newVolume.liqAddedAmount += liqAddedAmount;
  newVolume.liqRemovedAmount += liqRemovedAmount;
  newVolume.routedLiqAddedAmount += routedLiqAddedAmount;
  newVolume.routedLiqRemovedAmount += routedLiqRemovedAmount;
  newVolume.swapFee += swapFee;
  newVolume.liqFee += liqFee;
  newVolume.routedLiqFee += routedLiqFee;

  // Total volumes
  newVolume.swapTotalVolumeIn += swapVolumeIn;
  newVolume.swapTotalVolumeOut += swapVolumeOut;
  newVolume.liqAddedTotalAmount += liqAddedAmount;
  newVolume.liqRemovedTotalAmount += liqRemovedAmount;
  newVolume.routedLiqAddedTotalAmount += routedLiqAddedAmount;
  newVolume.routedLiqRemovedTotalAmount += routedLiqRemovedAmount;
  newVolume.swapTotalFees += swapFee;
  newVolume.liqTotalFees += liqFee;
  newVolume.routedLiqTotalFees += routedLiqFee;

  return newVolume;
}

export function isRoutedStablepoolLiquidityAction({
  liquidityAction,
  ctx,
}: {
  liquidityAction: StablepoolLiquidityAction;
  ctx: ProcessorContext<Store>;
}) {
  if (liquidityAction.actionType !== LiquidityActionType.REMOVE) return false;

  return !![...ctx.batchState.state.swaps.values()].find((swap) => {
    const swapOutputsMap = new Map(
      swap.outputs.map((output) => [output.asset.id, output])
    );

    return (
      swap.paraChainBlockHeight === liquidityAction.paraChainBlockHeight &&
      swapOutputsMap.has(liquidityAction.pool.id) &&
      swapOutputsMap.get(liquidityAction.pool.id)!.amount ===
        liquidityAction.sharesAmount
    );
  });
}

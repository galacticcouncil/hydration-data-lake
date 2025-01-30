import {
  Asset,
  LiquidityActionEvent,
  Stableswap,
  StableswapAssetHistoricalVolume,
  StableswapAssetLiquidityAmount,
  StableswapHistoricalVolume,
  StableswapLiquidityEvent,
  Swap,
} from '../../model';
import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  getOldStablepoolAssetVolume,
  getPoolAssetLastVolumeFromCache,
} from './index';
import { getAssetsByStablepool } from '../pools/stableswap/assets';

// TODO improve conditional usage with poolOperation and liquidityAction
export async function handleStablepoolVolumeUpdates({
  ctx,
  pool,
  swap,
  liquidityAction,
}: {
  ctx: SqdProcessorContext<Store>;
  pool: Stableswap;
  swap?: Swap;
  liquidityAction?: StableswapLiquidityEvent;
}) {
  if (!swap && !liquidityAction) return;

  const paraBlockHeight = swap
    ? swap.paraBlockHeight
    : liquidityAction!.paraBlockHeight;

  const relayBlockHeight = swap
    ? swap.relayBlockHeight
    : liquidityAction!.relayBlockHeight;

  let allAssetsToProcess: Asset[] = await getAssetsByStablepool(ctx, pool.id);

  const stablepoolVolumeCollections =
    ctx.batchState.state.stablepoolVolumeCollections;
  const stablepoolAssetVolumes = ctx.batchState.state.stablepoolAssetVolumes;
  const stablepoolAssetVolumeIdsToSave =
    ctx.batchState.state.stablepoolAssetVolumeIdsToSave;

  let volumesCollection = stablepoolVolumeCollections.get(
    pool.id + '-' + paraBlockHeight
  );

  if (!volumesCollection) {
    volumesCollection = new StableswapHistoricalVolume({
      id: `${pool.id}-${paraBlockHeight}`,
      pool,
      relayBlockHeight,
      paraBlockHeight,
    });
    stablepoolVolumeCollections.set(volumesCollection.id, volumesCollection);
  }

  for (const asset of allAssetsToProcess) {
    const currentAssetVolume = stablepoolAssetVolumes.get(
      `${pool.id}-${asset.id}-${paraBlockHeight}`
    );

    const oldVolume =
      currentAssetVolume ||
      (getPoolAssetLastVolumeFromCache(
        stablepoolAssetVolumes,
        `${pool.id}-${asset.id}`
      ) as StableswapAssetHistoricalVolume | undefined) ||
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
    actionData: StableswapLiquidityEvent;
    assetData?: StableswapAssetLiquidityAmount;
  };
  asset: Asset;
  pool: Stableswap;
  volumesCollection: StableswapHistoricalVolume;
  currentVolume?: StableswapAssetHistoricalVolume | undefined;
  oldVolume?: StableswapAssetHistoricalVolume | undefined;
  ctx: SqdProcessorContext<Store>;
}) {
  if (!swap && !liquidityActionData) return;

  const poolId = pool.id;
  const paraBlockHeight = swap
    ? swap.paraBlockHeight
    : liquidityActionData!.actionData.paraBlockHeight;

  const block = swap
    ? swap.event.block
    : liquidityActionData?.actionData.event.block;

  const newVolume = new StableswapAssetHistoricalVolume({
    id: `${poolId}-${asset.id}-${paraBlockHeight}`,
    asset,
    volumesCollection,
    swapFee: currentVolume?.swapFee || BigInt(0),
    swapTotalFees:
      currentVolume?.swapTotalFees || oldVolume?.swapTotalFees || BigInt(0),
    // liquidityFee: currentVolume?.liquidityFee || BigInt(0),
    // liquidityTotalFees:
    //   currentVolume?.liquidityTotalFees || oldVolume?.liquidityTotalFees || BigInt(0),
    // routedLiqFee: currentVolume?.routedLiqFee || BigInt(0),
    // routedLiqTotalFees:
    //   currentVolume?.routedLiqTotalFees ||
    //   oldVolume?.routedLiqTotalFees ||
    //   BigInt(0),

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

    // liqAddedAmount: currentVolume?.liqAddedAmount || BigInt(0),
    // liqRemovedAmount: currentVolume?.liqRemovedAmount || BigInt(0),
    // liqAddedTotalAmount:
    //   currentVolume?.liqAddedTotalAmount ||
    //   oldVolume?.liqAddedTotalAmount ||
    //   BigInt(0),
    // liqRemovedTotalAmount:
    //   currentVolume?.liqRemovedTotalAmount ||
    //   oldVolume?.liqRemovedTotalAmount ||
    //   BigInt(0),
    //
    // routedLiqAddedAmount: currentVolume?.routedLiqAddedAmount || BigInt(0),
    // routedLiqRemovedAmount: currentVolume?.routedLiqRemovedAmount || BigInt(0),
    // routedLiqAddedTotalAmount:
    //   currentVolume?.routedLiqAddedTotalAmount ||
    //   oldVolume?.routedLiqAddedTotalAmount ||
    //   BigInt(0),
    // routedLiqRemovedTotalAmount:
    //   currentVolume?.routedLiqRemovedTotalAmount ||
    //   oldVolume?.routedLiqRemovedTotalAmount ||
    //   BigInt(0),
    relayBlockHeight:
      ctx.batchState.getRelayChainBlockDataFromCache(paraBlockHeight)
        .height,
    paraBlockHeight,
    block,
  });

  let swapVolumeIn = BigInt(0);
  let swapVolumeOut = BigInt(0);
  // let liqAddedAmount = BigInt(0);
  // let liqRemovedAmount = BigInt(0);
  let routedLiqAddedAmount = BigInt(0);
  let routedLiqRemovedAmount = BigInt(0);
  let swapFee = BigInt(0);
  // let liqFee = BigInt(0);
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

    // Block volumes
    newVolume.swapVolumeIn += swapVolumeIn;
    newVolume.swapVolumeOut += swapVolumeOut;
    newVolume.swapFee += swapFee;

    // Total/accumulated volumes
    newVolume.swapTotalVolumeIn += swapVolumeIn;
    newVolume.swapTotalVolumeOut += swapVolumeOut;
    newVolume.swapTotalFees += swapFee;
  }

  if (liquidityActionData) {
    const isRoutedLiqAction = isRoutedStablepoolLiquidityAction({
      liquidityAction: liquidityActionData.actionData,
      ctx,
    });
    // liqAddedAmount =
    //   liquidityActionData.actionData.actionType === LiquidityActionEvent.Add &&
    //   liquidityActionData.assetData
    //     ? liquidityActionData.assetData.amount
    //     : BigInt(0);
    // liqRemovedAmount =
    //   liquidityActionData.actionData.actionType ===
    //     LiquidityActionEvent.Remove && liquidityActionData.assetData
    //     ? liquidityActionData.assetData.amount
    //     : BigInt(0);
    // liqFee =
    //   liquidityActionData.actionData.actionType === LiquidityActionEvent.Remove
    //     ? liquidityActionData.actionData.feeAmount
    //     : BigInt(0);

    routedLiqFee =
      isRoutedLiqAction &&
      liquidityActionData.actionData.actionType === LiquidityActionEvent.Remove
        ? liquidityActionData.actionData.feeAmount
        : BigInt(0);

    routedLiqAddedAmount =
      liquidityActionData.actionData.actionType === LiquidityActionEvent.Add &&
      isRoutedLiqAction &&
      liquidityActionData.assetData
        ? liquidityActionData.assetData.amount
        : BigInt(0);
    routedLiqRemovedAmount =
      liquidityActionData.actionData.actionType ===
        LiquidityActionEvent.Remove &&
      isRoutedLiqAction &&
      liquidityActionData.assetData
        ? liquidityActionData.assetData.amount
        : BigInt(0);

    // Block volumes
    newVolume.swapVolumeIn += routedLiqAddedAmount;
    newVolume.swapVolumeOut += routedLiqRemovedAmount;
    newVolume.swapFee += routedLiqFee;

    // Total/accumulated volumes
    newVolume.swapTotalVolumeIn += routedLiqAddedAmount;
    newVolume.swapTotalVolumeOut += routedLiqRemovedAmount;
    newVolume.swapTotalFees += routedLiqFee;
  }

  // Block volumes
  // newVolume.swapVolumeIn += swapVolumeIn;
  // newVolume.swapVolumeOut += swapVolumeOut;
  // newVolume.liqAddedAmount += liqAddedAmount;
  // newVolume.liqRemovedAmount += liqRemovedAmount;
  // newVolume.routedLiqAddedAmount += routedLiqAddedAmount;
  // newVolume.routedLiqRemovedAmount += routedLiqRemovedAmount;
  // newVolume.swapFee += swapFee;
  // newVolume.liqFee += liqFee;
  // newVolume.routedLiqFee += routedLiqFee;

  // Total volumes
  // newVolume.swapTotalVolumeIn += swapVolumeIn;
  // newVolume.swapTotalVolumeOut += swapVolumeOut;
  // newVolume.liqAddedTotalAmount += liqAddedAmount;
  // newVolume.liqRemovedTotalAmount += liqRemovedAmount;
  // newVolume.routedLiqAddedTotalAmount += routedLiqAddedAmount;
  // newVolume.routedLiqRemovedTotalAmount += routedLiqRemovedAmount;
  // newVolume.swapTotalFees += swapFee;
  // newVolume.liqTotalFees += liqFee;
  // newVolume.routedLiqTotalFees += routedLiqFee;

  return newVolume;
}

export function isRoutedStablepoolLiquidityAction({
  liquidityAction,
  ctx,
}: {
  liquidityAction: StableswapLiquidityEvent;
  ctx: SqdProcessorContext<Store>;
}) {
  // if (liquidityAction.actionType !== LiquidityActionEvent.REMOVE) return false; // TODO check this

  return !![...ctx.batchState.state.swaps.values()].find((swap) => {
    const swapOutputsMap = new Map(
      swap.outputs.map((output) => [output.asset.id, output])
    );

    return (
      swap.paraBlockHeight === liquidityAction.paraBlockHeight &&
      swapOutputsMap.has(liquidityAction.pool.id) &&
      swapOutputsMap.get(liquidityAction.pool.id)!.amount ===
        liquidityAction.sharesAmount
    );
  });
}

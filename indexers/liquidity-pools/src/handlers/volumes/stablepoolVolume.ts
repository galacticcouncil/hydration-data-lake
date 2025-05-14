import {
  Asset,
  LiquidityActionEvent,
  Stableswap,
  StableswapAssetVolumeHistoricalData,
  StableswapAssetLiquidityAmount,
  StableswapVolumeHistoricalData,
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

  // let allAssetsToProcess: Asset[] = await getAssetsByStablepool(ctx, pool.id);
  const allAssetsToProcess: Asset[] = pool.assets.map(
    (stableswapAsset) => stableswapAsset.asset
  );

  const stablepoolVolumeCollections =
    ctx.batchState.state.stablepoolVolumeCollections;
  const stablepoolAssetVolumes = ctx.batchState.state.stablepoolAssetVolumes;
  const stablepoolAssetVolumeIdsToSave =
    ctx.batchState.state.stablepoolAssetVolumeIdsToSave;

  let volumesCollection = stablepoolVolumeCollections.get(
    pool.id + '-' + paraBlockHeight
  );

  if (!volumesCollection) {
    volumesCollection = new StableswapVolumeHistoricalData({
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
      ) as StableswapAssetVolumeHistoricalData | undefined) ||
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
  volumesCollection: StableswapVolumeHistoricalData;
  currentVolume?: StableswapAssetVolumeHistoricalData | undefined;
  oldVolume?: StableswapAssetVolumeHistoricalData | undefined;
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

  const newVolume = new StableswapAssetVolumeHistoricalData({
    id: `${poolId}-${asset.id}-${paraBlockHeight}`,
    asset,
    volumesCollection,
    assetFeeVol: currentVolume?.assetFeeVol || BigInt(0),
    assetFeesTotalVol:
      currentVolume?.assetFeesTotalVol ||
      oldVolume?.assetFeesTotalVol ||
      BigInt(0),
    assetVolIn: currentVolume?.assetVolIn || BigInt(0),
    assetVolOut: currentVolume?.assetVolOut || BigInt(0),
    assetTotalVolIn:
      currentVolume?.assetTotalVolIn || oldVolume?.assetTotalVolIn || BigInt(0),
    assetTotalVolOut:
      currentVolume?.assetTotalVolOut ||
      oldVolume?.assetTotalVolOut ||
      BigInt(0),

    assetTotalVolInNorm: currentVolume?.assetTotalVolInNorm || '0',
    assetTotalVolOutNorm: currentVolume?.assetTotalVolOutNorm || '0',
    assetTotalFeesVolNorm: currentVolume?.assetTotalFeesVolNorm || '0',

    relayBlockHeight:
      ctx.batchState.getRelayChainBlockDataFromCache(paraBlockHeight).height,
    paraBlockHeight,
    block,
  });

  let assetVolIn = BigInt(0);
  let assetVolOut = BigInt(0);
  let routedLiqAddedAmount = BigInt(0);
  let routedLiqRemovedAmount = BigInt(0);
  let assetFeeVol = BigInt(0);
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
    assetVolIn = inputsMap.has(newVolume.asset.id)
      ? inputsMap.get(newVolume.asset.id)!.amount
      : BigInt(0);
    assetVolOut = outputsMap.has(newVolume.asset.id)
      ? outputsMap.get(newVolume.asset.id)!.amount
      : BigInt(0);
    assetFeeVol = feesMap.has(newVolume.asset.id)
      ? feesMap.get(newVolume.asset.id)!.amount
      : BigInt(0);

    // Block volumes
    newVolume.assetVolIn += assetVolIn;
    newVolume.assetVolOut += assetVolOut;
    newVolume.assetFeeVol += assetFeeVol;

    // Total/accumulated volumes
    newVolume.assetTotalVolIn += assetVolIn;
    newVolume.assetTotalVolOut += assetVolOut;
    newVolume.assetFeesTotalVol += assetFeeVol;
  }

  if (liquidityActionData) {
    const isRoutedLiqAction = isRoutedStablepoolLiquidityAction({
      liquidityAction: liquidityActionData.actionData,
      ctx,
    });

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
    newVolume.assetVolIn += routedLiqAddedAmount;
    newVolume.assetVolOut += routedLiqRemovedAmount;
    newVolume.assetFeeVol += routedLiqFee;

    // Total/accumulated volumes
    newVolume.assetTotalVolIn += routedLiqAddedAmount;
    newVolume.assetTotalVolOut += routedLiqRemovedAmount;
    newVolume.assetFeesTotalVol += routedLiqFee;
  }

  return newVolume;
}

export function isRoutedStablepoolLiquidityAction({
  liquidityAction,
  ctx,
}: {
  liquidityAction: StableswapLiquidityEvent;
  ctx: SqdProcessorContext<Store>;
}) {
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

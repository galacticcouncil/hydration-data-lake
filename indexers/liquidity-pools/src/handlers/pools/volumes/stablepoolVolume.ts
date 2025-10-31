import { Store } from '@subsquid/typeorm-store';

import {
  Asset,
  LiquidityActionEvent,
  Stableswap,
  StableswapAssetLiquidityAmount,
  StableswapAssetVolumeHistoricalData,
  StableswapLiquidityEvent,
  StableswapVolumeHistoricalData,
  Swap,
} from '../../../model';
import { SqdProcessorContext } from '../../../processor';
import {
  getOldStablepoolAssetVolume,
  getOldStablepoolVolume,
  getPoolAssetLastVolumeFromCache,
  getPoolPreviousVolumeFromCache,
} from './index';

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

  const stablepoolAssetVolumes = ctx.batchState.state.stablepoolAssetVolumes;
  const stablepoolAssetVolumeIdsToSave =
    ctx.batchState.state.stablepoolAssetVolumeIdsToSave;

  let currentVolumesCollection =
    ctx.batchState.state.stablepoolVolumeCollections.get(
      pool.id + '-' + paraBlockHeight
    );

  if (!currentVolumesCollection) {
    const oldVolumesCollection =
      currentVolumesCollection ||
      (getPoolPreviousVolumeFromCache(
        ctx.batchState.state.stablepoolVolumeCollections,
        `${pool.id}`,
        paraBlockHeight
      ) as StableswapVolumeHistoricalData | undefined) ||
      (await getOldStablepoolVolume({
        ctx,
        poolId: pool.id,
        // currentBlockHeight: paraBlockHeight,
      }));

    const block = ctx.batchState.getParaBlockFromCacheByHeight(paraBlockHeight);
    if (!block) {
      throw new Error(`Block not found in cache for height ${paraBlockHeight}`);
    }

    currentVolumesCollection = new StableswapVolumeHistoricalData({
      id: `${pool.id}-${paraBlockHeight}`,
      pool,

      poolVolInNorm: oldVolumesCollection?.poolVolInNorm || '0',
      poolVolOutNorm: oldVolumesCollection?.poolVolOutNorm || '0',
      poolFeesVolNorm: oldVolumesCollection?.poolFeesVolNorm || '0',
      poolTotalVolInNorm: oldVolumesCollection?.poolTotalVolInNorm || '0',
      poolTotalVolOutNorm: oldVolumesCollection?.poolTotalVolOutNorm || '0',
      poolTotalFeesVolNorm: oldVolumesCollection?.poolTotalFeesVolNorm || '0',

      relayBlockHeight,
      paraBlockHeight,
      blockId: block.id,
    });
    ctx.batchState.state.stablepoolVolumeCollections.set(
      currentVolumesCollection.id,
      currentVolumesCollection
    );
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
      (await getOldStablepoolAssetVolume({
        ctx,
        assetId: asset.id,
        poolId: pool.id,
      }));

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
      volumesCollection: currentVolumesCollection,
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
    assetTotalFeesVol:
      currentVolume?.assetTotalFeesVol ||
      oldVolume?.assetTotalFeesVol ||
      BigInt(0),
    assetVolIn: currentVolume?.assetVolIn || BigInt(0),
    assetVolOut: currentVolume?.assetVolOut || BigInt(0),
    assetTotalVolIn:
      currentVolume?.assetTotalVolIn || oldVolume?.assetTotalVolIn || BigInt(0),
    assetTotalVolOut:
      currentVolume?.assetTotalVolOut ||
      oldVolume?.assetTotalVolOut ||
      BigInt(0),

    assetVolInNorm: currentVolume?.assetVolInNorm || '0',
    assetVolOutNorm: currentVolume?.assetVolOutNorm || '0',
    assetFeeVolNorm: currentVolume?.assetFeeVolNorm || '0',

    assetTotalVolInNorm:
      currentVolume?.assetTotalVolInNorm ||
      oldVolume?.assetTotalVolInNorm ||
      '0',
    assetTotalVolOutNorm:
      currentVolume?.assetTotalVolOutNorm ||
      oldVolume?.assetTotalVolOutNorm ||
      '0',
    assetTotalFeesVolNorm:
      currentVolume?.assetTotalFeesVolNorm ||
      oldVolume?.assetTotalFeesVolNorm ||
      '0',

    // assetVolInNorm: '0',
    // assetVolOutNorm: '0',
    // assetFeeVolNorm: '0',
    //
    // assetTotalVolInNorm: '0',
    // assetTotalVolOutNorm: '0',
    // assetTotalFeesVolNorm: '0',

    relayBlockHeight:
      ctx.batchState.getRelayChainBlockDataFromCache(paraBlockHeight).height,
    paraBlockHeight,
    blockId: block!.id,
  });

  let routedLiqAddedAmount = BigInt(0);
  let routedLiqRemovedAmount = BigInt(0);
  let routedLiqFee = BigInt(0);

  if (swap) {
    const assetVolIn =
      swap.inputs.find((input) => input.asset.id === newVolume.asset.id)
        ?.amount || BigInt(0);

    const assetVolOut =
      swap.outputs.find((output) => output.asset.id === newVolume.asset.id)
        ?.amount || BigInt(0);

    const assetFeeVol = swap.fees.reduce((acc, feeData) => {
      if (feeData.asset.id !== newVolume.asset.id || !feeData.recipient)
        return acc;
      return acc + feeData.amount;
    }, 0n);

    // Block volumes
    newVolume.assetVolIn += assetVolIn;
    newVolume.assetVolOut += assetVolOut;
    newVolume.assetFeeVol += assetFeeVol;

    // Total/accumulated volumes
    newVolume.assetTotalVolIn += assetVolIn;
    newVolume.assetTotalVolOut += assetVolOut;
    newVolume.assetTotalFeesVol += assetFeeVol;
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
    newVolume.assetTotalFeesVol += routedLiqFee;
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

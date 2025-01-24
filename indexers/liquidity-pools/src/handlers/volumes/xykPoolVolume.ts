import { Swap, Xykpool, XykpoolHistoricalVolume } from '../../model';
import { calculateAveragePrice } from '../prices/utils';
import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { getLastVolumeFromCache, getOldXykVolume } from './index';

export function initXykPoolVolume(
  swap: Swap,
  pool: Xykpool,
  currentVolume: XykpoolHistoricalVolume | undefined,
  oldVolume: XykpoolHistoricalVolume | undefined
) {
  const newVolume = new XykpoolHistoricalVolume({
    id: swap.filler.id + '-' + swap.paraChainBlockHeight,
    pool: pool,
    assetA: pool.assetA,
    assetB: pool.assetB,
    averagePrice: 0,
    assetAVolumeIn: currentVolume?.assetAVolumeIn || BigInt(0),
    assetAVolumeOut: currentVolume?.assetAVolumeOut || BigInt(0),
    assetAFee: currentVolume?.assetAFee || BigInt(0),
    assetATotalFees:
      currentVolume?.assetATotalFees || oldVolume?.assetATotalFees || BigInt(0),
    assetATotalVolumeIn:
      currentVolume?.assetATotalVolumeIn ||
      oldVolume?.assetATotalVolumeIn ||
      BigInt(0),
    assetATotalVolumeOut:
      currentVolume?.assetATotalVolumeOut ||
      oldVolume?.assetATotalVolumeOut ||
      BigInt(0),
    assetBVolumeIn: currentVolume?.assetBVolumeIn || BigInt(0),
    assetBVolumeOut: currentVolume?.assetBVolumeOut || BigInt(0),
    assetBFee: currentVolume?.assetBFee || BigInt(0),
    assetBTotalFees:
      currentVolume?.assetBTotalFees || oldVolume?.assetBTotalFees || BigInt(0),
    assetBTotalVolumeIn:
      currentVolume?.assetBTotalVolumeIn ||
      oldVolume?.assetBTotalVolumeIn ||
      BigInt(0),
    assetBTotalVolumeOut:
      currentVolume?.assetBTotalVolumeOut ||
      oldVolume?.assetBTotalVolumeOut ||
      BigInt(0),
    relayChainBlockHeight: swap.relayChainBlockHeight,
    paraChainBlockHeight: swap.paraChainBlockHeight,
  });

  const swapAssetInData = swap.inputs[0];
  const swapAssetOutData = swap.outputs[0];
  const swapAssetFeeData = swap.fees[0];

  const assetAVolumeIn =
    swapAssetInData.asset.id === newVolume.assetA.id
      ? swapAssetInData.amount
      : BigInt(0);
  const assetBVolumeIn =
    swapAssetInData.asset.id === newVolume.assetB.id
      ? swapAssetInData.amount
      : BigInt(0);

  const assetAVolumeOut =
    swapAssetOutData.asset.id === newVolume.assetA.id
      ? swapAssetOutData.amount
      : BigInt(0);
  const assetBVolumeOut =
    swapAssetOutData.asset.id === newVolume.assetB.id
      ? swapAssetOutData.amount
      : BigInt(0);

  const assetAFee =
    swapAssetFeeData.asset.id === newVolume.assetA.id
      ? swapAssetFeeData.amount
      : BigInt(0);
  const assetBFee =
    swapAssetFeeData.asset.id === newVolume.assetB.id
      ? swapAssetFeeData.amount
      : BigInt(0);

  // Block volumes
  newVolume.assetAVolumeIn += assetAVolumeIn;
  newVolume.assetAVolumeOut += assetAVolumeOut;
  newVolume.assetAFee += assetAFee;

  newVolume.assetBVolumeIn += assetBVolumeIn;
  newVolume.assetBVolumeOut += assetBVolumeOut;
  newVolume.assetBFee += assetBFee;

  // Total volumes
  newVolume.assetATotalVolumeIn += assetAVolumeIn;
  newVolume.assetATotalVolumeOut += assetAVolumeOut;
  newVolume.assetATotalFees += assetAFee;

  newVolume.assetBTotalVolumeIn += assetBVolumeIn;
  newVolume.assetBTotalVolumeOut += assetBVolumeOut;
  newVolume.assetBTotalFees += assetBFee;

  newVolume.averagePrice = calculateAveragePrice({
    swap,
    pool,
    newVolume,
    currentVolume,
    oldVolume,
  });

  return newVolume;
}

export async function handleXykPoolVolumeUpdates({
  ctx,
  pool,
  swap,
}: {
  ctx: ProcessorContext<Store>;
  pool: Xykpool;
  swap: Swap;
}) {
  const xykPoolVolumes = ctx.batchState.state.xykPoolVolumes;
  const currentVolume = xykPoolVolumes.get(
    swap.filler.id + '-' + swap.paraChainBlockHeight
  );

  const oldVolume =
    currentVolume ||
    (getLastVolumeFromCache(
      ctx.batchState.state.xykPoolVolumes,
      swap.filler.id
    ) as XykpoolHistoricalVolume | undefined) ||
    (await getOldXykVolume(ctx, swap.filler.id));

  const newVolume = initXykPoolVolume(swap, pool, currentVolume, oldVolume);

  xykPoolVolumes.set(newVolume.id, newVolume);
}

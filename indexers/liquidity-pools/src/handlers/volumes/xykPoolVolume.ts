import { Swap, Xykpool, XykpoolVolumeHistoricalData } from '../../model';
import { calculateAveragePrice } from '../prices/utils';
import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { getLastVolumeFromCache, getOldXykVolume } from './index';

export function initXykPoolVolume(
  swap: Swap,
  pool: Xykpool,
  currentVolume: XykpoolVolumeHistoricalData | undefined,
  oldVolume: XykpoolVolumeHistoricalData | undefined
) {
  const newVolume = new XykpoolVolumeHistoricalData({
    id: swap.filler.id + '-' + swap.paraBlockHeight,
    pool: pool,
    assetA: pool.assetA,
    assetB: pool.assetB,
    averagePrice: 0,
    assetAVolIn: currentVolume?.assetAVolIn || BigInt(0),
    assetAVolOut: currentVolume?.assetAVolOut || BigInt(0),
    assetAFeeVol: currentVolume?.assetAFeeVol || BigInt(0),
    assetAFeesTotalVol:
      currentVolume?.assetAFeesTotalVol ||
      oldVolume?.assetAFeesTotalVol ||
      BigInt(0),
    assetATotalVolIn:
      currentVolume?.assetATotalVolIn ||
      oldVolume?.assetATotalVolIn ||
      BigInt(0),
    assetATotalVolOut:
      currentVolume?.assetATotalVolOut ||
      oldVolume?.assetATotalVolOut ||
      BigInt(0),
    assetBVolIn: currentVolume?.assetBVolIn || BigInt(0),
    assetBVolOut: currentVolume?.assetBVolOut || BigInt(0),
    assetBFeeVol: currentVolume?.assetBFeeVol || BigInt(0),
    assetBFeesTotalVol:
      currentVolume?.assetBFeesTotalVol ||
      oldVolume?.assetBFeesTotalVol ||
      BigInt(0),
    assetBTotalVolIn:
      currentVolume?.assetBTotalVolIn ||
      oldVolume?.assetBTotalVolIn ||
      BigInt(0),
    assetBTotalVolOut:
      currentVolume?.assetBTotalVolOut ||
      oldVolume?.assetBTotalVolOut ||
      BigInt(0),

    assetAVolInNorm: currentVolume?.assetAVolInNorm || '0',
    assetAVolOutNorm: currentVolume?.assetAVolOutNorm || '0',
    assetBVolInNorm: currentVolume?.assetBVolInNorm || '0',
    assetBVolOutNorm: currentVolume?.assetBVolOutNorm || '0',
    assetAFeeVolNorm: currentVolume?.assetAFeeVolNorm || '0',
    assetBFeeVolNorm: currentVolume?.assetBFeeVolNorm || '0',

    assetATotalVolInNorm: currentVolume?.assetATotalVolInNorm || '0',
    assetATotalVolOutNorm: currentVolume?.assetATotalVolOutNorm || '0',
    assetBTotalVolInNorm: currentVolume?.assetBTotalVolInNorm || '0',
    assetBTotalVolOutNorm: currentVolume?.assetBTotalVolOutNorm || '0',
    assetAFeesTotalVolNorm: currentVolume?.assetAFeesTotalVolNorm || '0',
    assetBFeesTotalVolNorm: currentVolume?.assetBFeesTotalVolNorm || '0',

    relayBlockHeight: swap.relayBlockHeight,
    paraBlockHeight: swap.paraBlockHeight,
    block: swap.event.block,
  });

  const swapAssetInData = swap.inputs[0];
  const swapAssetOutData = swap.outputs[0];
  const swapAssetFeeData = swap.fees[0];

  const assetAVolIn =
    swapAssetInData.asset.id === newVolume.assetA.id
      ? swapAssetInData.amount
      : BigInt(0);
  const assetBVolIn =
    swapAssetInData.asset.id === newVolume.assetB.id
      ? swapAssetInData.amount
      : BigInt(0);

  const assetAVolOut =
    swapAssetOutData.asset.id === newVolume.assetA.id
      ? swapAssetOutData.amount
      : BigInt(0);
  const assetBVolOut =
    swapAssetOutData.asset.id === newVolume.assetB.id
      ? swapAssetOutData.amount
      : BigInt(0);

  const assetAFeeVol =
    swapAssetFeeData.asset.id === newVolume.assetA.id
      ? swapAssetFeeData.amount
      : BigInt(0);
  const assetBFeeVol =
    swapAssetFeeData.asset.id === newVolume.assetB.id
      ? swapAssetFeeData.amount
      : BigInt(0);

  // Block volumes
  newVolume.assetAVolIn += assetAVolIn;
  newVolume.assetAVolOut += assetAVolOut;
  newVolume.assetAFeeVol += assetAFeeVol;

  newVolume.assetBVolIn += assetBVolIn;
  newVolume.assetBVolOut += assetBVolOut;
  newVolume.assetBFeeVol += assetBFeeVol;

  // Total volumes
  newVolume.assetATotalVolIn += assetAVolIn;
  newVolume.assetATotalVolOut += assetAVolOut;
  newVolume.assetAFeesTotalVol += assetAFeeVol;

  newVolume.assetBTotalVolIn += assetBVolIn;
  newVolume.assetBTotalVolOut += assetBVolOut;
  newVolume.assetBFeesTotalVol += assetBFeeVol;

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
  ctx: SqdProcessorContext<Store>;
  pool: Xykpool;
  swap: Swap;
}) {
  const xykPoolVolumes = ctx.batchState.state.xykPoolVolumes;
  const currentVolume = xykPoolVolumes.get(
    swap.filler.id + '-' + swap.paraBlockHeight
  );

  const oldVolume =
    currentVolume ||
    (getLastVolumeFromCache(
      ctx.batchState.state.xykPoolVolumes,
      swap.filler.id
    ) as XykpoolVolumeHistoricalData | undefined) ||
    (await getOldXykVolume(ctx, swap.filler.id));

  const newVolume = initXykPoolVolume(swap, pool, currentVolume, oldVolume);

  xykPoolVolumes.set(newVolume.id, newVolume);
}

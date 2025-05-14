import { Lbppool, LbppoolVolumeHistoricalData, Swap } from '../../model';
import { calculateAveragePrice } from '../prices/utils';
import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { getLastVolumeFromCache, getOldLbpVolume } from './index';

export function initLbppoolVolume(
  swap: Swap,
  pool: Lbppool,
  currentVolume: LbppoolVolumeHistoricalData | undefined,
  oldVolume: LbppoolVolumeHistoricalData | undefined
) {
  const newVolume = new LbppoolVolumeHistoricalData({
    id: pool.id + '-' + swap.paraBlockHeight,
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

  // const swapAssetInData = swap.inputs[0];
  // const swapAssetOutData = swap.outputs[0];
  // const swapAssetFeeData = swap.fees[0];
  //
  // const assetAVolIn =
  //   swapAssetInData.asset.id === newVolume.assetA.id
  //     ? swapAssetInData.amount
  //     : BigInt(0);
  // const assetBVolIn =
  //   swapAssetInData.asset.id === newVolume.assetB.id
  //     ? swapAssetInData.amount
  //     : BigInt(0);
  //
  // const assetAVolOut =
  //   swapAssetOutData.asset.id === newVolume.assetA.id
  //     ? swapAssetOutData.amount
  //     : BigInt(0);
  // const assetBVolOut =
  //   swapAssetOutData.asset.id === newVolume.assetB.id
  //     ? swapAssetOutData.amount
  //     : BigInt(0);
  //
  // const assetAFeeVol =
  //   swapAssetFeeData.asset.id === newVolume.assetA.id
  //     ? swapAssetFeeData.amount
  //     : BigInt(0);
  // const assetBFeeVol =
  //   swapAssetFeeData.asset.id === newVolume.assetB.id
  //     ? swapAssetFeeData.amount
  //     : BigInt(0);

  const assetAVolIn =
    swap.inputs.find((input) => input.asset.id === newVolume.assetA.id)
      ?.amount || BigInt(0);

  const assetAVolOut =
    swap.outputs.find((output) => output.asset.id === newVolume.assetA.id)
      ?.amount || BigInt(0);

  const assetAFeeVol = swap.fees.reduce((acc, feeData) => {
    if (feeData.asset.id !== newVolume.assetA.id || !feeData.recipient)
      return acc;
    return acc + feeData.amount;
  }, 0n);

  const assetBVolIn =
    swap.inputs.find((input) => input.asset.id === newVolume.assetB.id)
      ?.amount || BigInt(0);

  const assetBVolOut =
    swap.outputs.find((output) => output.asset.id === newVolume.assetB.id)
      ?.amount || BigInt(0);

  const assetBFeeVol = swap.fees.reduce((acc, feeData) => {
    if (feeData.asset.id !== newVolume.assetB.id || !feeData.recipient)
      return acc;
    return acc + feeData.amount;
  }, 0n);

  newVolume.assetAVolIn += assetAVolIn;
  newVolume.assetAVolOut += assetAVolOut;
  newVolume.assetAFeeVol += assetAFeeVol;

  newVolume.assetATotalVolIn += assetAVolIn;
  newVolume.assetATotalVolOut += assetAVolOut;
  newVolume.assetAFeesTotalVol += assetAFeeVol;

  newVolume.assetBVolIn += assetBVolIn;
  newVolume.assetBVolOut += assetBVolOut;
  newVolume.assetBFeeVol += assetBFeeVol;

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

export async function handleLbppoolVolumeUpdates({
  ctx,
  pool,
  swap,
}: {
  ctx: SqdProcessorContext<Store>;
  pool: Lbppool;
  swap: Swap;
}) {
  const lbpPoolVolumes = ctx.batchState.state.lbpPoolVolumes;
  const currentVolume = lbpPoolVolumes.get(
    swap.filler.id + '-' + swap.paraBlockHeight
  );

  const oldVolume =
    currentVolume ||
    (getLastVolumeFromCache(
      ctx.batchState.state.lbpPoolVolumes,
      swap.filler.id
    ) as LbppoolVolumeHistoricalData | undefined) ||
    (await getOldLbpVolume(ctx, swap.filler.id));

  const newVolume = initLbppoolVolume(swap, pool, currentVolume, oldVolume);

  lbpPoolVolumes.set(newVolume.id, newVolume);
}

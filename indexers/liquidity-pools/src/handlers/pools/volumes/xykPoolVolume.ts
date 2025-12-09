import { Store } from '@subsquid/typeorm-store';

import {
  Swap,
  Xykpool,
  XykpoolVolumeHistoricalData,
} from '../../../model';
import { SqdProcessorContext } from '../../../processor';
import { calculateAveragePrice } from '../../prices/utils';
import {
  getLastVolumeFromCache,
  getOldXykVolume,
} from './index';

export function initXykPoolVolume(
  swap: Swap,
  pool: Xykpool,
  currentVolume: XykpoolVolumeHistoricalData | undefined,
  oldVolume: XykpoolVolumeHistoricalData | undefined
) {
  const newVolume = new XykpoolVolumeHistoricalData({
    id: swap.fillerId + '-' + swap.paraBlockHeight,
    pool: pool,
    assetAId: pool.assetAId,
    assetBId: pool.assetBId,
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

    assetATotalVolInNorm:
      currentVolume?.assetATotalVolInNorm ||
      oldVolume?.assetATotalVolInNorm ||
      '0',
    assetATotalVolOutNorm:
      currentVolume?.assetATotalVolOutNorm ||
      oldVolume?.assetATotalVolOutNorm ||
      '0',
    assetBTotalVolInNorm:
      currentVolume?.assetBTotalVolInNorm ||
      oldVolume?.assetBTotalVolInNorm ||
      '0',
    assetBTotalVolOutNorm:
      currentVolume?.assetBTotalVolOutNorm ||
      oldVolume?.assetBTotalVolOutNorm ||
      '0',
    assetAFeesTotalVolNorm:
      currentVolume?.assetAFeesTotalVolNorm ||
      oldVolume?.assetAFeesTotalVolNorm ||
      '0',
    assetBFeesTotalVolNorm:
      currentVolume?.assetBFeesTotalVolNorm ||
      oldVolume?.assetBFeesTotalVolNorm ||
      '0',

    // assetAVolInNorm: '0',
    // assetAVolOutNorm: '0',
    // assetBVolInNorm: '0',
    // assetBVolOutNorm: '0',
    // assetAFeeVolNorm: '0',
    // assetBFeeVolNorm: '0',
    //
    // assetATotalVolInNorm: '0',
    // assetATotalVolOutNorm: '0',
    // assetBTotalVolInNorm: '0',
    // assetBTotalVolOutNorm: '0',
    // assetAFeesTotalVolNorm: '0',
    // assetBFeesTotalVolNorm: '0',

    relayBlockHeight: swap.relayBlockHeight,
    paraBlockHeight: swap.paraBlockHeight,
    blockId: swap.event.block.id,
  });

  const assetAVolIn =
    swap.inputs.find((input) => input.assetId === newVolume.assetAId)
      ?.amount || BigInt(0);

  const assetAVolOut =
    swap.outputs.find((output) => output.assetId === newVolume.assetAId)
      ?.amount || BigInt(0);

  const assetAFeeVol = swap.fees.reduce((acc, feeData) => {
    if (feeData.assetId !== newVolume.assetAId || !feeData.recipientId)
      return acc;
    return acc + feeData.amount;
  }, 0n);

  const assetBVolIn =
    swap.inputs.find((input) => input.assetId === newVolume.assetBId)
      ?.amount || BigInt(0);

  const assetBVolOut =
    swap.outputs.find((output) => output.assetId === newVolume.assetBId)
      ?.amount || BigInt(0);

  const assetBFeeVol = swap.fees.reduce((acc, feeData) => {
    if (feeData.assetId !== newVolume.assetBId || !feeData.recipientId)
      return acc;
    return acc + feeData.amount;
  }, 0n);

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
    swap.fillerId + '-' + swap.paraBlockHeight
  );

  const oldVolume =
    currentVolume ||
    (getLastVolumeFromCache(
      ctx.batchState.state.xykPoolVolumes,
      swap.fillerId
    ) as XykpoolVolumeHistoricalData | undefined) ||
    (await getOldXykVolume({
      ctx,
      poolId: swap.fillerId,
    }));

  const newVolume = initXykPoolVolume(swap, pool, currentVolume, oldVolume);

  xykPoolVolumes.set(newVolume.id, newVolume);
}

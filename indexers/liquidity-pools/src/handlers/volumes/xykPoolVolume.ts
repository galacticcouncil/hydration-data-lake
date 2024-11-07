import { XykPoolHistoricalVolume, XykPoolOperation } from '../../model';
import { calculateAveragePrice } from '../prices/utils';
import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { getLastVolumeFromCache, getOldXykVolume } from './index';

export function initXykPoolVolume(
  swap: XykPoolOperation,
  currentVolume: XykPoolHistoricalVolume | undefined,
  oldVolume: XykPoolHistoricalVolume | undefined
) {
  const newVolume = new XykPoolHistoricalVolume({
    id: swap.pool.id + '-' + swap.paraChainBlockHeight,
    pool: swap.pool,
    assetA: swap.pool.assetA,
    assetB: swap.pool.assetB,
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

  const assetAVolumeIn =
    swap.assetIn.id === newVolume.assetA.id ? swap.assetInAmount : BigInt(0);
  const assetBVolumeIn =
    swap.assetIn.id === newVolume.assetB.id ? swap.assetInAmount : BigInt(0);

  const assetAVolumeOut =
    swap.assetOut.id === newVolume.assetA.id ? swap.assetOutAmount : BigInt(0);
  const assetBVolumeOut =
    swap.assetOut.id === newVolume.assetB.id ? swap.assetOutAmount : BigInt(0);

  const assetAFee =
    swap.assetIn.id === newVolume.assetA.id
      ? swap.assetInFee
      : swap.assetOutFee;
  const assetBFee =
    swap.assetIn.id === newVolume.assetB.id
      ? swap.assetInFee
      : swap.assetOutFee;

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

  newVolume.averagePrice = calculateAveragePrice(
    swap,
    newVolume,
    currentVolume,
    oldVolume
  );

  return newVolume;
}

export async function handleXykPoolVolumeUpdates({
  ctx,
  poolOperation,
}: {
  ctx: ProcessorContext<Store>;
  poolOperation: XykPoolOperation;
}) {
  const xykPoolVolumes = ctx.batchState.state.xykPoolVolumes;
  const currentVolume = xykPoolVolumes.get(
    poolOperation.pool.id + '-' + poolOperation.paraChainBlockHeight
  );

  const oldVolume =
    currentVolume ||
    (getLastVolumeFromCache(
      ctx.batchState.state.xykPoolVolumes,
      poolOperation.pool.id
    ) as XykPoolHistoricalVolume | undefined) ||
    (await getOldXykVolume(ctx, poolOperation.pool.id));

  const newVolume = initXykPoolVolume(poolOperation, currentVolume, oldVolume);

  xykPoolVolumes.set(newVolume.id, newVolume);
  ctx.batchState.state = { xykPoolVolumes };
}

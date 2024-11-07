import { LbpPoolHistoricalVolume, LbpPoolOperation } from '../../model';
import { calculateAveragePrice } from '../prices/utils';
import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { getLastVolumeFromCache, getOldLbpVolume } from './index';

export function initLbpPoolVolume(
  swap: LbpPoolOperation,
  currentVolume: LbpPoolHistoricalVolume | undefined,
  oldVolume: LbpPoolHistoricalVolume | undefined
) {
  const newVolume = new LbpPoolHistoricalVolume({
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

  newVolume.assetAVolumeIn += assetAVolumeIn;
  newVolume.assetAVolumeOut += assetAVolumeOut;
  newVolume.assetAFee += assetAFee;

  newVolume.assetATotalVolumeIn += assetAVolumeIn;
  newVolume.assetATotalVolumeOut += assetAVolumeOut;
  newVolume.assetATotalFees += assetAFee;

  newVolume.assetBVolumeIn += assetBVolumeIn;
  newVolume.assetBVolumeOut += assetBVolumeOut;
  newVolume.assetBFee += assetBFee;

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

export async function handleLbpPoolVolumeUpdates({
  ctx,
  poolOperation,
}: {
  ctx: ProcessorContext<Store>;
  poolOperation: LbpPoolOperation;
}) {
  const lbpPoolVolumes = ctx.batchState.state.lbpPoolVolumes;
  const currentVolume = lbpPoolVolumes.get(
    poolOperation.pool.id + '-' + poolOperation.paraChainBlockHeight
  );

  const oldVolume =
    currentVolume ||
    (getLastVolumeFromCache(
      ctx.batchState.state.lbpPoolVolumes,
      poolOperation.pool.id
    ) as LbpPoolHistoricalVolume | undefined) ||
    (await getOldLbpVolume(ctx, poolOperation.pool.id));

  const newVolume = initLbpPoolVolume(poolOperation, currentVolume, oldVolume);

  lbpPoolVolumes.set(newVolume.id, newVolume);
  ctx.batchState.state = { lbpPoolVolumes };
}

import {
  Lbppool,
  LbppoolHistoricalVolume,
  Swap,
  Xykpool,
  XykpoolHistoricalVolume,
} from '../../model';
import { BigNumber } from 'bignumber.js';

export function calculateAveragePrice({
  swap,
  pool,
  newVolume,
  currentVolume,
  oldVolume,
}: {
  swap: Swap;
  pool: Xykpool | Lbppool;
  newVolume: LbppoolHistoricalVolume | XykpoolHistoricalVolume;
  currentVolume?: LbppoolHistoricalVolume | XykpoolHistoricalVolume;
  oldVolume?: LbppoolHistoricalVolume | XykpoolHistoricalVolume;
}) {
  const totalVolume = oldVolume
    ? oldVolume.assetATotalVolumeIn + oldVolume.assetATotalVolumeOut
    : currentVolume
      ? currentVolume.assetATotalVolumeIn + currentVolume.assetATotalVolumeOut
      : BigInt(0);

  const volume = newVolume.assetAVolumeIn + newVolume.assetAVolumeOut;

  const swapPrice = new BigNumber(swap.inputs[0].amount.toString())
    .div(swap.outputs[0].amount.toString())
    .toNumber();

  const price =
    swap.inputs[0].asset.id === pool.assetA.id ? swapPrice : 1 / swapPrice;

  const oldPrice = currentVolume?.averagePrice || oldVolume?.averagePrice || 0;

  return oldPrice
    ? new BigNumber(totalVolume.toString())
        .multipliedBy(oldPrice)
        .plus(new BigNumber(volume.toString()).multipliedBy(price))
        .dividedBy(
          new BigNumber(totalVolume.toString()).plus(volume.toString())
        )
        .toNumber()
    : price;
}

import { BigNumber } from '../../utils/bignumber';

import {
  Lbppool,
  LbppoolVolumeHistoricalData,
  Swap,
  Xykpool,
  XykpoolVolumeHistoricalData,
} from '../../model';

export function calculateAveragePrice({
  swap,
  pool,
  newVolume,
  currentVolume,
  oldVolume,
}: {
  swap: Swap;
  pool: Xykpool | Lbppool;
  newVolume: LbppoolVolumeHistoricalData | XykpoolVolumeHistoricalData;
  currentVolume?: LbppoolVolumeHistoricalData | XykpoolVolumeHistoricalData;
  oldVolume?: LbppoolVolumeHistoricalData | XykpoolVolumeHistoricalData;
}) {
  const totalVolume = oldVolume
    ? oldVolume.assetATotalVolIn + oldVolume.assetATotalVolOut
    : currentVolume
      ? currentVolume.assetATotalVolIn + currentVolume.assetATotalVolOut
      : BigInt(0);

  const volume = newVolume.assetAVolIn + newVolume.assetAVolOut;

  const swapPrice = new BigNumber(swap.inputs[0].amount.toString())
    .div(swap.outputs[0].amount.toString())
    .toNumber();

  const price =
    swap.inputs[0].assetId === pool.assetAId ? swapPrice : 1 / swapPrice;

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

import {
  LbpPoolHistoricalVolume,
  LbpPoolOperation,
  XykPoolHistoricalVolume,
  XykPoolOperation,
} from '../../model';
import { BigNumber } from 'bignumber.js';

export function calculateAveragePrice(
  swap: LbpPoolOperation | XykPoolOperation,
  newVolume: LbpPoolHistoricalVolume | XykPoolHistoricalVolume,
  currentVolume?: LbpPoolHistoricalVolume | XykPoolHistoricalVolume,
  oldVolume?: LbpPoolHistoricalVolume | XykPoolHistoricalVolume
) {
  const totalVolume = oldVolume
    ? oldVolume.assetATotalVolumeIn + oldVolume.assetATotalVolumeOut
    : currentVolume
      ? currentVolume.assetATotalVolumeIn + currentVolume.assetATotalVolumeOut
      : BigInt(0);

  const volume = newVolume.assetAVolumeIn + newVolume.assetAVolumeOut;

  const price =
    swap.assetIn.id === swap.pool.assetA.id
      ? swap.swapPrice
      : 1 / swap.swapPrice;

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

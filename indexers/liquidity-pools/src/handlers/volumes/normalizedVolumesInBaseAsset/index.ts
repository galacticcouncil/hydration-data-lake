import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { processXykPoolsNormalizedVolumes } from './xykPoolVolumesNormalized';
import { processLbpPoolsNormalizedVolumes } from './lbpPoolVolumesNormalized';
import { fromExponentialToDecimalNotation } from '../../../utils/helpers';
import { processStableswapAssetNormalizedVolumes } from './stableswapAssetVolumesNormalized';
import { processOmnipoolAssetNormalizedVolumes } from './omnipoolAssetVolumesNormalized';

export function processPoolsNormalizedVolumes(ctx: SqdProcessorContext<Store>) {
  processXykPoolsNormalizedVolumes(ctx);
  processLbpPoolsNormalizedVolumes(ctx);
  processStableswapAssetNormalizedVolumes(ctx);
  processOmnipoolAssetNormalizedVolumes(ctx);
}

export function calcVolumeNormalized({
  volume,
  assetDecimals,
  spotPrice,
}: {
  volume: bigint;
  spotPrice: string;
  assetDecimals: number;
}): string {
  return fromExponentialToDecimalNotation(volume.toString(), assetDecimals)
    .multipliedBy(spotPrice)
    .toFixed();
}

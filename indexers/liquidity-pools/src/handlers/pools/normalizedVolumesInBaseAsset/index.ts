import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { processXykPoolsNormalizedVolumes } from './xykPoolVolumesNormalized';
import { processLbpPoolsNormalizedVolumes } from './lbpPoolVolumesNormalized';
import { processStableswapAssetNormalizedVolumes } from './stableswapAssetVolumesNormalized';
import { processOmnipoolAssetNormalizedVolumes } from './omnipoolAssetVolumesNormalized';
import { processHsmpoolAssetNormalizedVolumes } from './hsmpoolAssetVolumesNormalized';
import { PoolVolumesCacheManager } from '../volumes/poolVolumesCacheManager';

export async function processPoolsNormalizedVolumes({
  blockNumbersToProcess,
  ctx,
}: {
  blockNumbersToProcess?: number[];
  ctx: SqdProcessorContext<Store>;
}) {
  await Promise.all([
    processXykPoolsNormalizedVolumes({ ctx, blockNumbersToProcess }),
    processLbpPoolsNormalizedVolumes({ ctx, blockNumbersToProcess }),
    processStableswapAssetNormalizedVolumes({ ctx, blockNumbersToProcess }),
    processOmnipoolAssetNormalizedVolumes({ ctx, blockNumbersToProcess }),
    processHsmpoolAssetNormalizedVolumes({ ctx, blockNumbersToProcess }),
  ]);
}

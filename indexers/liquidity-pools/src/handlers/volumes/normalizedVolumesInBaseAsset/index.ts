import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { processXykPoolsNormalizedVolumes } from './xykPoolVolumesNormalized';
import { processLbpPoolsNormalizedVolumes } from './lbpPoolVolumesNormalized';
import { processStableswapAssetNormalizedVolumes } from './stableswapAssetVolumesNormalized';
import { processOmnipoolAssetNormalizedVolumes } from './omnipoolAssetVolumesNormalized';

export function processPoolsNormalizedVolumes({
  blockNumbersToProcess,
  ctx,
}: {
  blockNumbersToProcess?: number[];
  ctx: SqdProcessorContext<Store>;
}) {
  processXykPoolsNormalizedVolumes({ ctx, blockNumbersToProcess });
  processLbpPoolsNormalizedVolumes({ ctx, blockNumbersToProcess });
  processStableswapAssetNormalizedVolumes({ ctx, blockNumbersToProcess });
  processOmnipoolAssetNormalizedVolumes({ ctx, blockNumbersToProcess });
}

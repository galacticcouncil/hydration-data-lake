import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { processXykPoolsNormalizedVolumes } from './xykPoolVolumesNormalized';
import { processLbpPoolsNormalizedVolumes } from './lbpPoolVolumesNormalized';
import { processStableswapAssetNormalizedVolumes } from './stableswapAssetVolumesNormalized';
import { processOmnipoolAssetNormalizedVolumes } from './omnipoolAssetVolumesNormalized';

export async function processPoolsNormalizedVolumes({
  blockNumbersToProcess,
  ctx,
}: {
  blockNumbersToProcess?: number[];
  ctx: SqdProcessorContext<Store>;
}) {
  await processXykPoolsNormalizedVolumes({ ctx, blockNumbersToProcess });
  await processLbpPoolsNormalizedVolumes({ ctx, blockNumbersToProcess });
  await processStableswapAssetNormalizedVolumes({ ctx, blockNumbersToProcess });
  await processOmnipoolAssetNormalizedVolumes({ ctx, blockNumbersToProcess });
}

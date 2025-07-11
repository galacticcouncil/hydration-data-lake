import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { processXykPoolsNormalizedTvl } from './xykPoolTvlNormalized';
import { processLbppoolsNormalizedTvl } from './lbpPoolTvlNormalized';
import { processStableswapNormalizedTvl } from './stableswapAssetTvlNormalized';
import { processOmnipoolNormalizedTvl } from './omnipoolAssetTvlNormalized';
import { processAavepoolsNormalizedTvl } from './aavepoolTvlNormalized';

export function processPoolsTvlNormalized({
  blockNumbersToProcess,
  ctx,
}: {
  blockNumbersToProcess?: number[];
  ctx: SqdProcessorContext<Store>;
}) {
  processXykPoolsNormalizedTvl({ ctx, blockNumbersToProcess });
  processLbppoolsNormalizedTvl({ ctx, blockNumbersToProcess });
  processStableswapNormalizedTvl({ ctx, blockNumbersToProcess });
  processOmnipoolNormalizedTvl({ ctx, blockNumbersToProcess });
  processAavepoolsNormalizedTvl({ ctx, blockNumbersToProcess });
}

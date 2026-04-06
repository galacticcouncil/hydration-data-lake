import { Store } from '@subsquid/typeorm-store';

import { SqdProcessorContext } from '../../../processor';
import { processAavepoolsNormalizedTvl } from './aavepoolTvlNormalized';
import { processLbppoolsNormalizedTvl } from './lbpPoolTvlNormalized';
import { processOmnipoolNormalizedTvl } from './omnipoolAssetTvlNormalized';
import { processStableswapNormalizedTvl } from './stableswapAssetTvlNormalized';
import { processXykPoolsNormalizedTvl } from './xykPoolTvlNormalized';

export async function processPoolsTvlNormalized({
  blockNumbersToProcess,
  ctx,
}: {
  blockNumbersToProcess?: number[];
  ctx: SqdProcessorContext<Store>;
}) {
  await Promise.all([
    processXykPoolsNormalizedTvl({ ctx, blockNumbersToProcess }),
    processLbppoolsNormalizedTvl({ ctx, blockNumbersToProcess }),
    processStableswapNormalizedTvl({ ctx, blockNumbersToProcess }),
    processOmnipoolNormalizedTvl({ ctx, blockNumbersToProcess }),
    processAavepoolsNormalizedTvl({ ctx, blockNumbersToProcess }),
  ]);
}

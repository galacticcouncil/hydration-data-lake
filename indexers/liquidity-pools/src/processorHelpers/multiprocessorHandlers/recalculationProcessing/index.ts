import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { recalculatePoolsNormalizedVolumes } from './poolsNormalizedVolumesRecalcProc';

export async function handleReaggregationProcessing(
  ctx: SqdProcessorContext<Store>
) {
  if (!ctx.appConfig.REAGGREGATION_PROCESSING_MODE) return;

  if (ctx.blocks[0].header.height >= 8694974) {
    console.log(
      'Indexing is paused due to reaching required top height. Waiting...'
    );
    while (true) {}
  }

  await recalculatePoolsNormalizedVolumes(ctx);
}

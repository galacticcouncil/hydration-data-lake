import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { recalculatePoolsNormalizedVolumes } from './poolsNormalizedVolumesRecalcProc';

export async function handleReaggregationProcessing(
  ctx: SqdProcessorContext<Store>
) {
  if (!ctx.appConfig.REAGGREGATION_PROCESSING_MODE) return;

  await recalculatePoolsNormalizedVolumes(ctx);
}

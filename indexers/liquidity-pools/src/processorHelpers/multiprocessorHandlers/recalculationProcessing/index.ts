import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { aggregateHsmRelatedDataOnPostAggregationMode } from './hsmPostaggregationRecalcProc';

export async function handleReaggregationProcessing(
  ctx: SqdProcessorContext<Store>
) {
  if (!ctx.appConfig.REAGGREGATION_PROCESSING_MODE) return;

  await aggregateHsmRelatedDataOnPostAggregationMode(ctx);
}

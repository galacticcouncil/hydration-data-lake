import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { handleAccountBalancesReaggregation } from './accountBalancesReaggregation';

export async function handleReaggregationProcessing(
  ctx: SqdProcessorContext<Store>
) {
  if (!ctx.appConfig.processingMode.REAGGREGATION_PROCESSING_MODE) return;

  await handleAccountBalancesReaggregation(ctx);
}

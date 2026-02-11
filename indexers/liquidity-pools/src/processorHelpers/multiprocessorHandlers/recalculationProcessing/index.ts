import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { handleAccountBalancesReaggregation } from './accountBalancesReaggregation';
import { handleHarvesterPostMergeReaggregation } from './harvesterPostMergeReaggregation';

export async function handleReaggregationProcessing(
  ctx: SqdProcessorContext<Store>
) {
  if (!ctx.appConfig.processingMode.REAGGREGATION_PROCESSING_MODE) return;

  if (!ctx.appConfig.processingMode.REAGGREGATION_PROCESSING_FLOW_NAME)
    throw new Error('No reaggregation flow name specified.');

  switch (ctx.appConfig.processingMode.REAGGREGATION_PROCESSING_FLOW_NAME) {
    case 'ACCOUNT_BALANCES_REAGGREGATION': {
      await handleAccountBalancesReaggregation(ctx);
      break;
    }
    case 'HARVESTER_POST_MERGE_REAGGREGATION': {
      await handleHarvesterPostMergeReaggregation(ctx);
      break;
    }
    default:
      throw new Error('Unknown reaggregation flow name specified.');
  }
}

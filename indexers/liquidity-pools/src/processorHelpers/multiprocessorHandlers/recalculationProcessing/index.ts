import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { handleAccountBalancesReaggregation } from './accountBalancesReaggregation';
import { handleHarvesterPostMergeReaggregation } from './harvesterPostMergeReaggregation';
import { whitelistedAccountBalancesTrackingProcessor } from './whitelistedAccountBalancesTracking';
import { handleStableSwapVolumesReaggregation } from './stableswapVolumesReaggregation';

export async function handleReaggregationProcessing(
  ctx: SqdProcessorContext<Store>
) {
  if (!ctx.appConfig.processingMode.REAGGREGATION_PROCESSING_MODE) return;

  if (!ctx.appConfig.processingMode.REAGGREGATION_PROCESSING_FLOW_NAME)
    throw new Error('No reaggregation flow name specified.');

  console.log(
    '[ REAGGREGATION_PROCESSING_FLOW_NAME ] - ',
    ctx.appConfig.processingMode.REAGGREGATION_PROCESSING_FLOW_NAME
  );

  switch (ctx.appConfig.processingMode.REAGGREGATION_PROCESSING_FLOW_NAME) {
    case 'ACCOUNT_BALANCES_REAGGREGATION': {
      await handleAccountBalancesReaggregation(ctx);
      break;
    }
    case 'HARVESTER_POST_MERGE_REAGGREGATION': {
      await handleHarvesterPostMergeReaggregation(ctx);
      break;
    }
    case 'WHITELISTED_ACCOUNT_BALANCES_AGGREGATION': {
      await whitelistedAccountBalancesTrackingProcessor(ctx);
      break;
    }
    case 'STABLESWAP_VOLUMES_REAGGREGATION': {
      await handleStableSwapVolumesReaggregation(ctx);
      break;
    }
    default:
      throw new Error('Unknown reaggregation flow name specified.');
  }
}

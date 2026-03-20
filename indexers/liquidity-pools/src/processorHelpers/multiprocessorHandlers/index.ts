import { handleAccountBalancesReaggregation } from '../recalculationProcessing/accountBalancesReaggregation';
import { handleHarvesterPostMergeReaggregation } from '../recalculationProcessing/harvesterPostMergeReaggregation';
import { whitelistedAccountBalancesTrackingProcessor } from '../recalculationProcessing/whitelistedAccountBalancesTracking';
import { handleStableSwapVolumesReaggregation } from '../recalculationProcessing/stableswapVolumesReaggregation';
import { handleAccountNormalisedBalancesReaggregation } from '../recalculationProcessing/accountNormalisedBalancesReaggregation';
import { handleCommitHistoricalDataToRedis } from '../recalculationProcessing/commitHistoricalDataToRedisHandler';
import { handleOmnipoolPositionPriceReaggregation } from '../recalculationProcessing/omnipoolPositionPriceReaggregation';
import { handleDcaSchedulesAndOtcOrders } from '../recalculationProcessing/dcaSchedulesAndOtcOrdersReaggregation';
import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { PgBossQueueName } from '../../utils/multiProcPoolManager';
import { coreProcessorHandler } from './coreProcessor';
import { spotPriceProcessorHandler } from './spotPriceProcessor';
import { balancesProcessorHandler } from './balacesProcessor';
import { poolAndAssetMetricsProcessorHandler } from './poolAndAssetMetricsProcessor';

export async function handleAllInOneMultiprocessorMode(
  ctx: SqdProcessorContext<Store>
) {
  if (!ctx.appConfig.processingMode.MULTI_FLOW_PROCESSOR_TOPIC)
    throw new Error('No reaggregation flow name specified.');

  console.log(
    '[ MULTI_FLOW_PROCESSOR_TOPIC ] - ',
    ctx.appConfig.processingMode.MULTI_FLOW_PROCESSOR_TOPIC
  );

  switch (ctx.appConfig.processingMode.MULTI_FLOW_PROCESSOR_TOPIC) {
    case PgBossQueueName.CORE_PROCESSOR: {
      await coreProcessorHandler(ctx);
      break;
    }
    case PgBossQueueName.SPOT_PRICES_PROCESSOR: {
      await spotPriceProcessorHandler(ctx);
      break;
    }
    case PgBossQueueName.BALANCES_PROCESSOR: {
      await balancesProcessorHandler(ctx);
      break;
    }
    case PgBossQueueName.POOL_AND_ASSET_METRICS_PROCESSOR: {
      await poolAndAssetMetricsProcessorHandler(ctx);
      break;
    }

    default:
      throw new Error('Unknown reaggregation flow name specified.');
  }
}

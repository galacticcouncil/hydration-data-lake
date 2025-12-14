import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { assetVolumeHistDataRecalcProc } from './assetVolumeHistDataRecalcProc';
import { accountBalancesAndLiquidityPositionsReaggregation } from './accountBalancesAndLiquidityPositionsReaggregation';

export async function handleReaggregationProcessing(
  ctx: SqdProcessorContext<Store>
) {
  if (!ctx.appConfig.processingMode.REAGGREGATION_PROCESSING_MODE) return;

  await accountBalancesAndLiquidityPositionsReaggregation(ctx);
}

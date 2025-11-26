import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { assetVolumeHistDataRecalcProc } from './assetVolumeHistDataRecalcProc';

export async function handleReaggregationProcessing(
  ctx: SqdProcessorContext<Store>
) {
  if (!ctx.appConfig.processingMode.REAGGREGATION_PROCESSING_MODE) return;

  await assetVolumeHistDataRecalcProc(ctx);
}

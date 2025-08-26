import { SqdProcessorContext } from '../processor';
import { Store } from '@subsquid/typeorm-store';

export enum ProcessingMode {
  REAGGREGATION_SINGLE_PROCESSOR = 'REAGGREGATION_SINGLE_PROCESSOR',
  SINGLE_PROCESSOR = 'SINGLE_PROCESSOR',
  MULTI_PROCESSOR_CORE_PROCESSOR = 'MULTI_PROCESSOR_CORE_PROCESSOR',
  MULTI_PROCESSOR_SPOT_PRICES_PROCESSOR = 'MULTI_PROCESSOR_SPOT_PRICES_PROCESSOR',
}

export function getProcessingMode(
  ctx: SqdProcessorContext<Store>
): ProcessingMode {
  if (
    ctx.appConfig.REAGGREGATION_PROCESSING_MODE &&
    ctx.appConfig.ALL_IN_ONE_PROCESSOR_MODE
  ) {
    return ProcessingMode.REAGGREGATION_SINGLE_PROCESSOR;
  }

  if (
    !ctx.appConfig.REAGGREGATION_PROCESSING_MODE &&
    ctx.appConfig.ALL_IN_ONE_PROCESSOR_MODE
  ) {
    return ProcessingMode.SINGLE_PROCESSOR;
  }

  if (
    !ctx.appConfig.REAGGREGATION_PROCESSING_MODE &&
    !ctx.appConfig.ALL_IN_ONE_PROCESSOR_MODE &&
    !ctx.appConfig.IS_SPOT_PRICES_PROCESSOR &&
    ctx.appConfig.IS_CORE_PROCESSOR
  ) {
    return ProcessingMode.MULTI_PROCESSOR_CORE_PROCESSOR;
  }

  if (
    !ctx.appConfig.REAGGREGATION_PROCESSING_MODE &&
    !ctx.appConfig.ALL_IN_ONE_PROCESSOR_MODE &&
    !ctx.appConfig.IS_CORE_PROCESSOR &&
    ctx.appConfig.IS_SPOT_PRICES_PROCESSOR
  ) {
    return ProcessingMode.MULTI_PROCESSOR_SPOT_PRICES_PROCESSOR;
  }

  throw new Error('Unknown processing mode. Possible misconfiguration.');
}

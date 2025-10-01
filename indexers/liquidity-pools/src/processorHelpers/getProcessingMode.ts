import { SqdProcessorContext } from '../processor';
import { Store } from '@subsquid/typeorm-store';

export enum ProcessingMode {
  REAGGREGATION_SINGLE_PROCESSOR = 'REAGGREGATION_SINGLE_PROCESSOR',
  ALL_IN_ONE_SINGLE_FLOW_PROCESSOR = 'ALL_IN_ONE_SINGLE_FLOW_PROCESSOR',
  ALL_IN_ONE_SIMPLIFIED_PROCESSOR = 'ALL_IN_ONE_SIMPLIFIED_PROCESSOR',
  ALL_IN_ONE_MULTI_FLOW_PROCESSOR = 'ALL_IN_ONE_MULTI_FLOW_PROCESSOR',
  MULTI_PROCESSOR_CORE_PROCESSOR = 'MULTI_PROCESSOR_CORE_PROCESSOR',
  MULTI_PROCESSOR_SPOT_PRICES_PROCESSOR = 'MULTI_PROCESSOR_SPOT_PRICES_PROCESSOR',
}

export function getProcessingMode(
  ctx: SqdProcessorContext<Store>
): ProcessingMode {
  if (
    ctx.appConfig.processingMode.REAGGREGATION_PROCESSING_MODE &&
    ctx.appConfig.processingMode.ALL_IN_ONE_PROCESSOR_MODE
  ) {
    return ProcessingMode.REAGGREGATION_SINGLE_PROCESSOR;
  }

  if (
    !ctx.appConfig.processingMode.REAGGREGATION_PROCESSING_MODE &&
    !ctx.appConfig.processingMode.ALL_IN_ONE_MULTI_FLOW_PROCESSOR_MODE &&
    ctx.appConfig.processingMode.ALL_IN_ONE_PROCESSOR_MODE
  ) {
    return ProcessingMode.ALL_IN_ONE_SINGLE_FLOW_PROCESSOR;
  }

  if (
    !ctx.appConfig.processingMode.REAGGREGATION_PROCESSING_MODE &&
    ctx.appConfig.processingMode.ALL_IN_ONE_MULTI_FLOW_PROCESSOR_MODE &&
    ctx.appConfig.processingMode.ALL_IN_ONE_PROCESSOR_MODE
  ) {
    return ProcessingMode.ALL_IN_ONE_MULTI_FLOW_PROCESSOR;
  }

  if (
    !ctx.appConfig.processingMode.REAGGREGATION_PROCESSING_MODE &&
    !ctx.appConfig.processingMode.ALL_IN_ONE_PROCESSOR_MODE &&
    !ctx.appConfig.processingMode.IS_SPOT_PRICES_PROCESSOR &&
    ctx.appConfig.processingMode.IS_CORE_PROCESSOR
  ) {
    return ProcessingMode.MULTI_PROCESSOR_CORE_PROCESSOR;
  }

  if (
    !ctx.appConfig.processingMode.REAGGREGATION_PROCESSING_MODE &&
    !ctx.appConfig.processingMode.ALL_IN_ONE_PROCESSOR_MODE &&
    !ctx.appConfig.processingMode.IS_CORE_PROCESSOR &&
    ctx.appConfig.processingMode.IS_SPOT_PRICES_PROCESSOR
  ) {
    return ProcessingMode.MULTI_PROCESSOR_SPOT_PRICES_PROCESSOR;
  }

  throw new Error('Unknown processing mode. Possible misconfiguration.');
}

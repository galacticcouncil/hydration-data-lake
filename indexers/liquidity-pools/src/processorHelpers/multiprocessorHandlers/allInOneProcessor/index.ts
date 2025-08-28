import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { singleFlowAllInOneProcessor } from './singleFlowAllInOneProcessor';
import { getProcessingMode, ProcessingMode } from '../../getProcessingMode';
import { multiFlowAllInOneProcessor } from './multiFlowAllInOneProcessor';

export async function execAllInOneProcessorHandlers(
  ctx: SqdProcessorContext<Store>
) {
  if (!ctx.appConfig.processingMode.ALL_IN_ONE_PROCESSOR_MODE) return;

  switch (getProcessingMode(ctx)) {
    case ProcessingMode.ALL_IN_ONE_SINGLE_FLOW_PROCESSOR:
      await singleFlowAllInOneProcessor(ctx);
      break;
    case ProcessingMode.ALL_IN_ONE_MULTI_FLOW_PROCESSOR:
      await multiFlowAllInOneProcessor(ctx);
      break;
  }
}

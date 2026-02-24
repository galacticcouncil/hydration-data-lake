import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { handleOmnioolOperations } from './omnipoolOperations';
import { handleStablepoolOperations } from './stablepoolOperations';
import { handleLbpPoolOperations } from './lbpPoolOperations';
import { handleXykPoolOperations } from './xykPoolOperations';

export async function handleBuySellOperations(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  if (ctx.appConfig.PROCESS_LBP_POOLS)
    await handleLbpPoolOperations(ctx, parsedEvents);

  if (ctx.appConfig.PROCESS_XYK_POOLS)
    await handleXykPoolOperations(ctx, parsedEvents);

  if (ctx.appConfig.PROCESS_OMNIPOOLS)
    await handleOmnioolOperations(ctx, parsedEvents);

  if (ctx.appConfig.PROCESS_STABLEPOOLS)
    await handleStablepoolOperations(ctx, parsedEvents);
}

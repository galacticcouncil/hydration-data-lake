import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import {
  handleLbpPoolOperations,
  handleXykPoolOperations,
} from './isolatedPoolsOperations';
import { handleOmnioolOperations } from './omnipoolOperations';
import { handleStablepoolOperations } from './stablepoolOperations';

export async function handleOperations(
  ctx: ProcessorContext<Store>,
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

  await ctx.store.save([...ctx.batchState.state.xykPoolOperations.values()]);
  await ctx.store.save([...ctx.batchState.state.lbpPoolOperations.values()]);
  await ctx.store.save([
    ...ctx.batchState.state.omnipoolAssetOperations.values(),
  ]);
  await ctx.store.save([...ctx.batchState.state.stablepoolOperations.values()]);

  await ctx.store.save([...ctx.batchState.state.assetVolumes.values()]);
  await ctx.store.save([...ctx.batchState.state.lbpPoolVolumes.values()]);
  await ctx.store.save([...ctx.batchState.state.xykPoolVolumes.values()]);
  await ctx.store.save([...ctx.batchState.state.omnipoolAssetVolumes.values()]);

  await ctx.store.save([
    ...ctx.batchState.state.stablepoolVolumeCollections.values(),
  ]);
  await ctx.store.save([
    ...ctx.batchState.state.stablepoolAssetVolumes.values(),
  ]);
}

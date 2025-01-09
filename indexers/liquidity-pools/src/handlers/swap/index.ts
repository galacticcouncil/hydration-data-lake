import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { EventName } from '../../parsers/types/events';
import { getOrderedListByBlockNumber } from '../../utils/helpers';
import { handleSupportSwapperEvent } from './swap';
import { OperationStackManager } from '../../chainActivityTraceManager/operationStackManager';

export async function handleSupportSwappedEvents(
  ctx: ProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents
      .getSectionByEventName(EventName.AmmSupport_Swapped)
      .values(),
  ]).filter(
    (event) => event.eventData.metadata.blockHeader.specVersion >= 276
  )) {
    await handleSupportSwapperEvent(ctx, eventData);
  }

  await OperationStackManager.saveOperationStackEntities(ctx);

  await ctx.store.save(
    [...ctx.batchState.state.swaps.values()].map((swap) => {
      swap.fillerContext = null;
      return swap;
    })
  );
  await ctx.store.save([...ctx.batchState.state.swapFees.values()]);
  await ctx.store.save([...ctx.batchState.state.swapInputs.values()]);
  await ctx.store.save([...ctx.batchState.state.swapOutputs.values()]);
  await ctx.store.save([...ctx.batchState.state.swapFillerContexts.values()]);
  await ctx.store.save(
    [...ctx.batchState.state.swapFillerContexts.values()].map((fillerCtx) => {
      const swap = fillerCtx.swap;
      swap.fillerContext = fillerCtx;
      return swap;
    })
  );

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

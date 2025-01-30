import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { EventName } from '../../parsers/types/events';
import {
  getOrderedListByBlockNumber,
  isUnifiedEventsSupportSpecVersion,
} from '../../utils/helpers';
import { handleSupportSwapperEvent } from './swap';

export async function handleSupportSwappedEvents(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents.getSectionByEventName(EventName.Broadcast_Swapped).values(),
  ]).filter((event) =>
    isUnifiedEventsSupportSpecVersion(
      event.eventData.metadata.blockHeader.specVersion,
      ctx.appConfig.UNIFIED_EVENTS_GENESIS_SPEC_VERSION
    )
  )) {
    await handleSupportSwapperEvent(ctx, eventData);
  }

  // await OperationStackManager.saveOperationStackEntities(ctx);

  await ctx.store.save([...ctx.batchState.state.routeTrades.values()]);
  await ctx.store.save([
    ...ctx.batchState.state.routeTradesInputs.values(),
    ...ctx.batchState.state.routeTradesOutputs.values(),
  ]);

  await ctx.store.save([...ctx.batchState.state.swaps.values()]);
  await ctx.store.save([...ctx.batchState.state.swapFees.values()]);
  await ctx.store.save([
    ...ctx.batchState.state.swapInputs.values(),
    ...ctx.batchState.state.swapOutputs.values(),
  ]);

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

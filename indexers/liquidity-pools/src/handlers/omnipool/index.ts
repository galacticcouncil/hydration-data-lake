import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { EventName } from '../../parsers/types/events';
import { getOrderedListByBlockNumber } from '../../utils/helpers';
import { omnipoolTokenAdded, omnipoolTokenRemoved } from './omnipoolAssets';

export async function handleOmnipoolAssets(
  ctx: ProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  if (!ctx.appConfig.PROCESS_OMNIPOOLS) return;

  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents
      .getSectionByEventName(EventName.Omnipool_TokenAdded)
      .values(),
  ])) {
    await omnipoolTokenAdded(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents
      .getSectionByEventName(EventName.Omnipool_TokenRemoved)
      .values(),
  ])) {
    await omnipoolTokenRemoved(ctx, eventData);
  }

  await ctx.store.save(
    [...ctx.batchState.state.omnipoolAssets.values()].filter((asset) =>
      ctx.batchState.state.omnipoolAssetIdsToSave.has(asset.id)
    )
  );
  ctx.batchState.state = { omnipoolAssetIdsToSave: new Set() };
}

export async function handleOmnipoolOperations(
  ctx: ProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  if (!ctx.appConfig.PROCESS_OMNIPOOLS) return;

  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents
      .getSectionByEventName(EventName.Omnipool_TokenAdded)
      .values(),
  ])) {
    await omnipoolTokenAdded(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents
      .getSectionByEventName(EventName.Omnipool_TokenRemoved)
      .values(),
  ])) {
    await omnipoolTokenRemoved(ctx, eventData);
  }

  await ctx.store.save(
    [...ctx.batchState.state.omnipoolAssets.values()].filter((asset) =>
      ctx.batchState.state.omnipoolAssetIdsToSave.has(asset.id)
    )
  );
  ctx.batchState.state = { omnipoolAssetIdsToSave: new Set() };
}

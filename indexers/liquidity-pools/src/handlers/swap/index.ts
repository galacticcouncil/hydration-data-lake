import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { EventName } from '../../parsers/types/events';
import {
  getOrderedListByBlockNumber,
  isUnifiedEventsSupportSpecVersion,
} from '../../utils/helpers';
import { handleBroadcastSwappedEvent } from './swap';
import { BroadcastSwappedData } from '../../parsers/batchBlocksParser/types';
import { ChainActivityTraceManager } from '../../chainActivityTracingManagers';
import { ChainActivityTrace } from '../../model';
import { In } from 'typeorm';

export async function handleBroadcastSwappedEvents(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  const eventsToProcess: BroadcastSwappedData[] = [];
  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents.getSectionByEventName(EventName.Broadcast_Swapped).values(),
    ...parsedEvents
      .getSectionByEventName(EventName.Broadcast_Swapped2)
      .values(),
    ...parsedEvents
      .getSectionByEventName(EventName.Broadcast_Swapped3)
      .values(),
  ]).filter((event) =>
    isUnifiedEventsSupportSpecVersion(
      event.eventData.metadata.blockHeader.specVersion,
      ctx.appConfig.UNIFIED_EVENTS_GENESIS_SPEC_VERSION
    )
  )) {
    eventsToProcess.push(eventData);
  }

  await prefetchChainActivityTracesForSwaps(ctx, eventsToProcess);

  for (const eventData of eventsToProcess) {
    await handleBroadcastSwappedEvent(ctx, eventData);
  }

  //
  // await ctx.storeUtils.upsertWithBatches(
  //   Array.from(ctx.batchState.state.routeTrades.values())
  // );
  // await ctx.storeUtils.upsertWithBatches(
  //   Array.from(ctx.batchState.state.routeTradesInputs.values())
  // );
  // await ctx.storeUtils.upsertWithBatches(
  //   Array.from(ctx.batchState.state.routeTradesOutputs.values())
  // );
  // await ctx.storeUtils.upsertWithBatches(
  //   Array.from(ctx.batchState.state.swaps.values())
  // );
  // await ctx.storeUtils.upsertWithBatches(
  //   Array.from(ctx.batchState.state.swapFees.values())
  // );
  // await ctx.storeUtils.upsertWithBatches(
  //   Array.from(ctx.batchState.state.swapInputs.values())
  // );
  // await ctx.storeUtils.upsertWithBatches(
  //   Array.from(ctx.batchState.state.swapOutputs.values())
  // );
  // await ctx.storeUtils.upsertWithBatches(
  //   Array.from(ctx.batchState.state.assetVolumes.values())
  // );
  // await ctx.storeUtils.upsertWithBatches(
  //   Array.from(ctx.batchState.state.lbpPoolVolumes.values())
  // );
  // await ctx.storeUtils.upsertWithBatches(
  //   Array.from(ctx.batchState.state.xykPoolVolumes.values())
  // );
  // await ctx.storeUtils.upsertWithBatches(
  //   Array.from(ctx.batchState.state.omnipoolAssetVolumes.values())
  // );
  // await ctx.storeUtils.upsertWithBatches(
  //   Array.from(ctx.batchState.state.stablepoolVolumeCollections.values())
  // );
  // await ctx.storeUtils.upsertWithBatches(
  //   Array.from(ctx.batchState.state.stablepoolAssetVolumes.values())
  // );
}

async function prefetchChainActivityTracesForSwaps(
  ctx: SqdProcessorContext<Store>,
  eventCallDataList: BroadcastSwappedData[]
) {
  const idsToPrefetchSet = new Set<string>();
  for (const event of eventCallDataList) {
    const {
      eventData: { metadata: eventMetadata },
      callData: { traceId: callTraceId },
    } = event;

    const chainActivityTraceId = ChainActivityTraceManager.getTraceIdRoot(
      callTraceId ?? eventMetadata.traceId
    );
    if (
      chainActivityTraceId &&
      !ctx.batchState.state.chainActivityTraces.has(chainActivityTraceId)
    )
      idsToPrefetchSet.add(chainActivityTraceId);
  }

  const entities = await ctx.storeUtils.findWithLogs(
    ChainActivityTrace,
    {
      where: { id: In(Array.from(idsToPrefetchSet)) },
      // relations: {
      //   childTraces: true,
      //   parentTraces: true,
      // },
    },
    { className: 'ChainActivityTrace' }
  );

  for (const entity of entities) {
    ctx.batchState.state.chainActivityTraces.set(entity.id, entity);
  }
}

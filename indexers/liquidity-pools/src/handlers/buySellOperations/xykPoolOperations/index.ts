import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../../parsers/batchBlocksParser';
import { EventName } from '../../../parsers/types/events';
import {
  getOrderedListByBlockNumber,
  isUnifiedEventsSupportSpecVersion,
} from '../../../utils/helpers';
import { xykBuyExecuted, xykSellExecuted } from './xykPoolOperation';
import {
  XykBuyExecutedData,
  XykSellExecutedData,
} from '../../../parsers/batchBlocksParser/types';
import { OmnipoolAsset, Xykpool } from '../../../model';
import { In } from 'typeorm';

export async function handleXykPoolOperations(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  await prefetchEntities(ctx, parsedEvents);
  /**
   * BuyExecuted as SellExecuted events must be processed sequentially in the same
   * flow to avoid wrong calculations of accumulated volumes.
   */
  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents.getSectionByEventName(EventName.XYK_BuyExecuted).values(),
    ...parsedEvents.getSectionByEventName(EventName.XYK_SellExecuted).values(),
  ]).filter(
    (event) =>
      !isUnifiedEventsSupportSpecVersion(
        event.eventData.metadata.blockHeader.specVersion,
        ctx.appConfig.UNIFIED_EVENTS_GENESIS_SPEC_VERSION
      )
  )) {
    // console.log(
    //   'handleXykPoolOperations - ',
    //   eventData.eventData.metadata.blockHeader.specVersion,
    //   eventData.eventData.metadata.blockHeader.height
    // );
    switch (eventData.eventData.name) {
      case EventName.XYK_BuyExecuted:
        await xykBuyExecuted(ctx, eventData as XykBuyExecutedData);
        break;
      case EventName.XYK_SellExecuted:
        await xykSellExecuted(ctx, eventData as XykSellExecutedData);
        break;
      default:
    }
  }
}

async function prefetchEntities(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  const poolsToPrefetch = [
    ...new Set(
      [
        ...[
          ...parsedEvents
            .getSectionByEventName(EventName.XYK_BuyExecuted)
            .values(),
        ].map((event) => [event.eventData.params.pool]),
        ...[
          ...parsedEvents
            .getSectionByEventName(EventName.XYK_SellExecuted)
            .values(),
        ].map((event) => [event.eventData.params.pool]),
      ].flat()
    ).values(),
  ];

  const state = ctx.batchState.state;

  const prefetchedPools = await ctx.store.find(Xykpool, {
    where: { id: In(poolsToPrefetch) },
    relations: {
      account: true,
      assetA: true,
      assetB: true,
      shareToken: true,
      createdAtBlock: true,
    },
  });

  if (prefetchedPools.length > 0)
    state.xykAllBatchPools = new Map(
      [...state.xykAllBatchPools.values(), ...prefetchedPools].map((item) => [
        item.id,
        item,
      ])
    );
}

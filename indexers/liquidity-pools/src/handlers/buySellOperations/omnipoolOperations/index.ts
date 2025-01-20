import { ProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../../parsers/batchBlocksParser';
import { EventName } from '../../../parsers/types/events';
import {
  getOrderedListByBlockNumber,
  isUnifiedEventsSupportSpecVersion,
} from '../../../utils/helpers';
import {
  OmnipoolBuyExecutedData,
  OmnipoolSellExecutedData,
} from '../../../parsers/batchBlocksParser/types';
import {
  OmnipoolAsset,
  SwapFillerType,
  TradeOperationType,
} from '../../../model';
import { handleOmnipoolAssetVolumeUpdates } from '../../volumes';
import { handleSwap } from '../../swap/swap';
import { In } from 'typeorm';

// TODO improve performance of the function
export async function handleOmnioolOperations(
  ctx: ProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  await prefetchEntities(ctx, parsedEvents);
  /**
   * BuyExecuted as SellExecuted events must be processed sequentially in the same
   * flow to avoid wrong calculations of accumulated volumes.
   */
  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents
      .getSectionByEventName(EventName.Omnipool_BuyExecuted)
      .values(),
    ...parsedEvents
      .getSectionByEventName(EventName.Omnipool_SellExecuted)
      .values(),
  ]).filter((event) =>
    isUnifiedEventsSupportSpecVersion(
      event.eventData.metadata.blockHeader.specVersion,
      ctx.appConfig.UNIFIED_EVENTS_GENESIS_SPEC_VERSION
    )
  )) {
    await omnipoolBuySellExecuted(ctx, eventData);
  }
}

export async function omnipoolBuySellExecuted(
  ctx: ProcessorContext<Store>,
  eventCallData: OmnipoolBuyExecutedData | OmnipoolSellExecutedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData,
  } = eventCallData;

  const swapInHubId = `${eventMetadata.id}-01`;
  const swapOutHubId = `${eventMetadata.id}-02`;

  const { swap: swapInHub } = await handleSwap({
    ctx,
    blockHeader: eventMetadata.blockHeader,
    data: {
      swapId: swapInHubId,
      traceIds: [
        ...(callData.traceId ? [callData.traceId] : []),
        eventMetadata.traceId,
      ],
      eventId: eventMetadata.id,
      extrinsicHash: eventMetadata.extrinsic?.hash || '',
      eventIndex: eventMetadata.indexInBlock,
      swapperAccountId: eventParams.who,
      fillerAccountId: ctx.appConfig.OMNIPOOL_ADDRESS,
      fillerType: SwapFillerType.Omnipool,

      inputs: [
        {
          amount: eventParams.amountIn,
          assetId: eventParams.assetIn,
        },
      ],
      outputs: [
        {
          amount: eventParams.hubAmountIn,
          assetId: 1,
        },
      ],
      fees: [
        {
          amount: eventParams.protocolFeeAmount,
          assetId: +ctx.appConfig.OMNIPOOL_PROTOCOL_ASSET_ID,
          recipientId: ctx.appConfig.OMNIPOOL_ADDRESS,
        },
      ],
      operationType:
        eventMetadata.name === EventName.Omnipool_BuyExecuted
          ? TradeOperationType.ExactOut
          : TradeOperationType.ExactIn,
      relayChainBlockHeight: eventCallData.relayChainInfo.relaychainBlockNumber,
      paraChainBlockHeight: eventMetadata.blockHeader.height,
      timestamp: eventMetadata.blockHeader.timestamp ?? Date.now(),
    },
  });
  const { swap: swapOutHub } = await handleSwap({
    ctx,
    blockHeader: eventMetadata.blockHeader,
    data: {
      swapId: swapOutHubId,
      traceIds: [
        ...(callData.traceId ? [callData.traceId] : []),
        eventMetadata.traceId,
      ],
      eventId: eventMetadata.id,
      extrinsicHash: eventMetadata.extrinsic?.hash || '',
      eventIndex: eventMetadata.indexInBlock,
      swapperAccountId: eventParams.who,
      fillerAccountId: ctx.appConfig.OMNIPOOL_ADDRESS,
      fillerType: SwapFillerType.Omnipool,

      inputs: [
        {
          amount: eventParams.hubAmountOut,
          assetId: 1,
        },
      ],
      outputs: [
        {
          amount: eventParams.amountOut,
          assetId: eventParams.assetOut,
        },
      ],
      fees: [
        {
          amount: eventParams.assetFeeAmount,
          assetId: eventParams.assetOut,
          recipientId: ctx.appConfig.OMNIPOOL_ADDRESS,
        },
      ],
      operationType:
        eventMetadata.name === EventName.Omnipool_BuyExecuted
          ? TradeOperationType.ExactOut
          : TradeOperationType.ExactIn,
      relayChainBlockHeight: eventCallData.relayChainInfo.relaychainBlockNumber,
      paraChainBlockHeight: eventMetadata.blockHeader.height,
      timestamp: eventMetadata.blockHeader.timestamp ?? Date.now(),
    },
  });

  await handleOmnipoolAssetVolumeUpdates({
    ctx,
    swap: swapInHub,
    blockHeader: eventMetadata.blockHeader,
  });
  await handleOmnipoolAssetVolumeUpdates({
    ctx,
    swap: swapOutHub,
    blockHeader: eventMetadata.blockHeader,
  });
}

async function prefetchEntities(
  ctx: ProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  const omnipoolAssetsToPrefetch = [
    ...new Set(
      [
        ...[
          ...parsedEvents
            .getSectionByEventName(EventName.Omnipool_BuyExecuted)
            .values(),
        ].map((event) => [
          `${ctx.appConfig.OMNIPOOL_ADDRESS}-${event.eventData.params.assetIn}`,
          `${ctx.appConfig.OMNIPOOL_ADDRESS}-${event.eventData.params.assetOut}`,
        ]),
        ...[
          ...parsedEvents
            .getSectionByEventName(EventName.Omnipool_SellExecuted)
            .values(),
        ].map((event) => [
          `${ctx.appConfig.OMNIPOOL_ADDRESS}-${event.eventData.params.assetIn}`,
          `${ctx.appConfig.OMNIPOOL_ADDRESS}-${event.eventData.params.assetOut}`,
        ]),
      ].flat()
    ).values(),
  ];

  const state = ctx.batchState.state;

  const prefetchedOmnipoolAssets = await ctx.store.find(OmnipoolAsset, {
    where: { id: In(omnipoolAssetsToPrefetch) },
    relations: { asset: true, pool: true },
  });

  if (omnipoolAssetsToPrefetch.length > 0)
    state.omnipoolAssets = new Map(
      [...state.omnipoolAssets.values(), ...prefetchedOmnipoolAssets].map(
        (item) => [item.id, item]
      )
    );

  ctx.batchState.state = {
    omnipoolAssets: state.omnipoolAssets,
  };
}

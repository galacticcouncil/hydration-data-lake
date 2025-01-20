import { ProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../../parsers/batchBlocksParser';
import { EventName } from '../../../parsers/types/events';
import {
  getOrderedListByBlockNumber,
  isUnifiedEventsSupportSpecVersion,
} from '../../../utils/helpers';
import {
  StableswapBuyExecutedData,
  StableswapLiquidityAddedData,
  StableswapLiquidityRemovedData,
  StableswapSellExecutedData,
} from '../../../parsers/batchBlocksParser/types';
import { SwapFillerType, TradeOperationType } from '../../../model';
import { handleStablepoolVolumeUpdates } from '../../volumes/stablepoolVolume';
import { getOrCreateStablepool } from '../../pools/stablepool/stablepool';
import { stablepoolLiquidityAddedRemoved } from '../../pools/stablepool/liquidity';
import { handleSwap } from '../../swap/swap';

export async function handleStablepoolOperations(
  ctx: ProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  /**
   * BuyExecuted as SellExecuted events must be processed sequentially in the same
   * flow to avoid wrong calculations of accumulated volumes.
   */
  for (const eventData of getOrderedListByBlockNumber([
    ...[
      ...parsedEvents
        .getSectionByEventName(EventName.Stableswap_BuyExecuted)
        .values(),
    ].filter((event) =>
      isUnifiedEventsSupportSpecVersion(
        event.eventData.metadata.blockHeader.specVersion,
        ctx.appConfig.UNIFIED_EVENTS_GENESIS_SPEC_VERSION
      )
    ),
    ...[
      ...parsedEvents
        .getSectionByEventName(EventName.Stableswap_SellExecuted)
        .values(),
    ].filter((event) =>
      isUnifiedEventsSupportSpecVersion(
        event.eventData.metadata.blockHeader.specVersion,
        ctx.appConfig.UNIFIED_EVENTS_GENESIS_SPEC_VERSION
      )
    ),
    ...parsedEvents
      .getSectionByEventName(EventName.Stableswap_LiquidityAdded)
      .values(),
    ...parsedEvents
      .getSectionByEventName(EventName.Stableswap_LiquidityRemoved)
      .values(),
  ])) {
    switch (eventData.eventData.name) {
      case EventName.Stableswap_LiquidityAdded:
      case EventName.Stableswap_LiquidityRemoved:
        await stablepoolLiquidityAddedRemoved(
          ctx,
          eventData as
            | StableswapLiquidityAddedData
            | StableswapLiquidityRemovedData
        );
        break;
      case EventName.Stableswap_BuyExecuted:
      case EventName.Stableswap_SellExecuted:
        await stablepoolBuySellExecuted(
          ctx,
          eventData as StableswapBuyExecutedData | StableswapSellExecutedData
        );
        break;
    }
  }

  await ctx.store.save([
    ...ctx.batchState.state.stablepoolBatchLiquidityActions.values(),
  ]);
  await ctx.store.save([
    ...ctx.batchState.state.stablepoolAssetBatchLiquidityAmounts.values(),
  ]);
}

export async function stablepoolBuySellExecuted(
  ctx: ProcessorContext<Store>,
  eventCallData: StableswapBuyExecutedData | StableswapSellExecutedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData,
  } = eventCallData;

  // let assetInEntity = await getAsset({ ctx, id: eventParams.assetIn });
  // let assetOutEntity = await getAsset({ ctx, id: eventParams.assetOut });
  const pool = await getOrCreateStablepool({
    ctx,
    poolId: eventParams.poolId,
    ensure: true,
    blockHeader: eventMetadata.blockHeader,
  });

  if (!pool) {
    console.log(`Stablepool with ID ${eventParams.poolId} has not been found`);
    return;
  }

  const { swap } = await handleSwap({
    ctx,
    blockHeader: eventMetadata.blockHeader,
    data: {
      traceIds: [
        ...(callData.traceId ? [callData.traceId] : []),
        eventMetadata.traceId,
      ],
      eventId: eventMetadata.id,
      extrinsicHash: eventMetadata.extrinsic?.hash || '',
      eventIndex: eventMetadata.indexInBlock,
      swapperAccountId: eventParams.who,
      fillerAccountId: pool.account.id,
      fillerType: SwapFillerType.Stableswap,
      inputs: [
        {
          amount: eventParams.amountIn,
          assetId: eventParams.assetIn,
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
          amount: eventParams.fee,
          assetId: eventParams.assetOut,
          recipientId: pool.account.id,
        },
      ],
      operationType:
        eventMetadata.name === EventName.Stableswap_BuyExecuted
          ? TradeOperationType.ExactOut
          : TradeOperationType.ExactIn,
      relayChainBlockHeight: eventCallData.relayChainInfo.relaychainBlockNumber,
      paraChainBlockHeight: eventMetadata.blockHeader.height,
      timestamp: eventMetadata.blockHeader.timestamp ?? Date.now(),
    },
  });

  const stablepoolAllBatchPools = ctx.batchState.state.stablepoolAllBatchPools;
  stablepoolAllBatchPools.set(pool.id, pool);

  await handleStablepoolVolumeUpdates({
    ctx,
    swap,
    pool,
  });
}

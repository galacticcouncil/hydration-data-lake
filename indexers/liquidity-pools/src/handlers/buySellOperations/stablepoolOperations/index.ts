import { SqdProcessorContext } from '../../../processor';
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
import {
  SwapFeeDestinationType,
  SwapFillerType,
  TradeOperationType,
} from '../../../model';
import { handleStablepoolVolumeUpdates } from '../../volumes/stablepoolVolume';
import { getOrCreateStableswap } from '../../pools/stableswap/stablepool';
import { stablepoolLiquidityAddedRemoved } from '../../pools/stableswap/liquidity';
import { handleSwap } from '../../swap/swap';

export async function handleStablepoolOperations(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  /**
   * BuyExecuted as SellExecuted events must be processed sequentially in the same
   * flow to avoid wrong calculations of accumulated volumes.
   */
  for (const eventData of getOrderedListByBlockNumber(
    [
      ...parsedEvents
        .getSectionByEventName(EventName.Stableswap_BuyExecuted)
        .values(),
      ...parsedEvents
        .getSectionByEventName(EventName.Stableswap_SellExecuted)
        .values(),
      ...parsedEvents
        .getSectionByEventName(EventName.Stableswap_LiquidityAdded)
        .values(),
      ...parsedEvents
        .getSectionByEventName(EventName.Stableswap_LiquidityRemoved)
        .values(),
    ].filter(
      (event) =>
        !isUnifiedEventsSupportSpecVersion(
          event.eventData.metadata.blockHeader.specVersion,
          ctx.appConfig.UNIFIED_EVENTS_GENESIS_SPEC_VERSION
        )
    )
  )) {
    // console.log(
    //   'handleStablepoolOperations - ',
    //   eventData.eventData.metadata.blockHeader.specVersion,
    //   eventData.eventData.metadata.blockHeader.height
    // );
    switch (eventData.eventData.name) {
      case EventName.Stableswap_LiquidityAdded:
      case EventName.Stableswap_LiquidityRemoved:
        /**
         * We need process Stablepool liquidity events together with sell/buy
         * events, because before release of Broadcast.Swapped event, add/remove
         * liquidity can be a part of omnipool trades. To avoid wrong volume
         * calculations and total value aggregation, buy/sell and
         * add/remove liquidity should be processed in the same sequence.
         * After release of Broadcast.Swapped liquidity event are processing
         * separately.
         */
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
  ctx: SqdProcessorContext<Store>,
  eventCallData: StableswapBuyExecutedData | StableswapSellExecutedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData,
  } = eventCallData;

  // let assetInEntity = await getAsset({ ctx, id: eventParams.assetIn });
  // let assetOutEntity = await getAsset({ ctx, id: eventParams.assetOut });
  const pool = await getOrCreateStableswap({
    ctx,
    poolId: eventParams.poolId,
    ensure: true,
    blockHeader: eventMetadata.blockHeader,
  });

  if (!pool) {
    console.log(`Stableswap with ID ${eventParams.poolId} has not been found`);
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
          destinationType: SwapFeeDestinationType.Account,
          recipientId: pool.account.id,
        },
      ],
      operationType:
        eventMetadata.name === EventName.Stableswap_BuyExecuted
          ? TradeOperationType.ExactOut
          : TradeOperationType.ExactIn,
      paraBlockHeight: eventMetadata.blockHeader.height,
      timestamp: eventMetadata.blockHeader.timestamp ?? Date.now(),
    },
  });

  const stableswapAllBatchPools = ctx.batchState.state.stableswapAllBatchPools;
  stableswapAllBatchPools.set(pool.id, pool);

  await handleStablepoolVolumeUpdates({
    ctx,
    swap,
    pool,
  });
}

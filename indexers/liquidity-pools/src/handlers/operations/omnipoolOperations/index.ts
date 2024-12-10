import { ProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../../parsers/batchBlocksParser';
import { EventName } from '../../../parsers/types/events';
import { getOrderedListByBlockNumber } from '../../../utils/helpers';
import {
  OmnipoolBuyExecutedData,
  OmnipoolSellExecutedData,
} from '../../../parsers/batchBlocksParser/types';
import { SwapFillerType, TradeOperationType } from '../../../model';
import { handleOmnipoolAssetVolumeUpdates } from '../../volumes';
import { handleSellBuyAsSwap } from '../../trade/swap';

export async function handleOmnioolOperations(
  ctx: ProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
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
  ])) {
    await omnipoolBuySellExecuted(ctx, eventData);
  }
}

export async function omnipoolBuySellExecuted(
  ctx: ProcessorContext<Store>,
  eventCallData: OmnipoolBuyExecutedData | OmnipoolSellExecutedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const { swap } = await handleSellBuyAsSwap({
    ctx,
    blockHeader: eventMetadata.blockHeader,
    data: {
      eventId: eventMetadata.id,
      extrinsicHash: eventMetadata.extrinsic?.hash || '',
      eventIndex: eventMetadata.indexInBlock,
      swapperAccountId: eventParams.who,
      poolAccountId: ctx.appConfig.OMNIPOOL_ADDRESS,
      poolType: SwapFillerType.Omnipool,
      assetInId: `${eventParams.assetIn}`,
      assetOutId: `${eventParams.assetOut}`,
      amountIn: eventParams.amountIn,
      amountOut: eventParams.amountOut,
      hubAmountIn: eventParams.hubAmountIn,
      hubAmountOut: eventParams.hubAmountOut,
      fees: [
        {
          amount: eventParams.assetFeeAmount,
          assetId: `${eventParams.assetOut}`,
          recipientId: ctx.appConfig.OMNIPOOL_ADDRESS,
        },
        {
          amount: eventParams.assetFeeAmount,
          assetId: ctx.appConfig.OMNIPOOL_PROTOCOL_ASSET_ID,
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
    swap,
  });
}

import { ProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../../parsers/batchBlocksParser';
import { EventName } from '../../../parsers/types/events';
import { getOrderedListByBlockNumber } from '../../../utils/helpers';
import {
  OmnipoolBuyExecutedData,
  OmnipoolSellExecutedData,
} from '../../../parsers/batchBlocksParser/types';
import { getAccount } from '../../accounts';
import {
  OmnipoolAssetOperation,
  PoolOperationType,
} from '../../../model';
import { handleOmnipoolAssetVolumeUpdates } from '../../volumes';
import { getOmnipoolAsset } from '../../omnipool/omnipoolAssets';

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

  let assetInEntity = await getOmnipoolAsset(ctx, eventParams.assetIn);

  let assetOutEntity = await getOmnipoolAsset(ctx, eventParams.assetOut);

  if (!assetInEntity || !assetOutEntity) {
    console.log(
      `Omnipool asset with assetId: ${!assetInEntity ? eventParams.assetIn : eventParams.assetOut} has not been found`
    );
    return;
  }

  const operationInstance = new OmnipoolAssetOperation({
    id: eventMetadata.id,
    account: await getAccount(ctx, eventParams.who),
    assetIn: assetInEntity,
    assetOut: assetOutEntity,
    assetInAmount: eventParams.amountIn,
    assetOutAmount: eventParams.amountOut,
    assetFeeAmount: eventParams.assetFeeAmount,
    protocolFeeAmount: eventParams.protocolFeeAmount,
    hubAmountIn: eventParams.hubAmountIn,
    hubAmountOut: eventParams.hubAmountOut,
    type:
      eventMetadata.name === EventName.Omnipool_BuyExecuted
        ? PoolOperationType.BUY
        : PoolOperationType.SELL,
    extrinsicHash: eventMetadata.extrinsic?.hash,
    indexInBlock: eventMetadata.indexInBlock,
    relayChainBlockHeight: eventCallData.relayChainInfo.relaychainBlockNumber,
    paraChainBlockHeight: eventMetadata.blockHeader.height,
  });

  ctx.batchState.state = {
    omnipoolAssetOperations: [
      ...ctx.batchState.state.omnipoolAssetOperations,
      operationInstance,
    ],
  };

  await handleOmnipoolAssetVolumeUpdates({
    ctx,
    assetOperation: operationInstance,
  });
  //
  // await handleAssetVolumeUpdates(ctx, operationInstance);
}

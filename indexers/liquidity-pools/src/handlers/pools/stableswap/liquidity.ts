import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  StableswapLiquidityAddedData,
  StableswapLiquidityRemovedData,
} from '../../../parsers/batchBlocksParser/types';
import {
  LiquidityActionEvent,
  StableswapAssetLiquidityAmount,
  StableswapLiquidityEvent,
} from '../../../model';
import { getOrCreateStableswap } from './stablepool';
import { EventName } from '../../../parsers/types/events';
import { getAsset } from '../../assets/assetRegistry';
import { handleStablepoolVolumeUpdates } from '../../volumes/stablepoolVolume';
import {
  getOrderedListByBlockNumber,
  isUnifiedEventsSupportSpecVersion,
} from '../../../utils/helpers';
import { BatchBlocksParsedDataManager } from '../../../parsers/batchBlocksParser';

export async function handleStablepoolLiquidityEvents(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  if (!ctx.appConfig.PROCESS_STABLEPOOLS) return;

  for (const eventData of getOrderedListByBlockNumber(
    [
      ...parsedEvents
        .getSectionByEventName(EventName.Stableswap_LiquidityAdded)
        .values(),
      ...parsedEvents
        .getSectionByEventName(EventName.Stableswap_LiquidityRemoved)
        .values(),
    ].filter((event) =>
      isUnifiedEventsSupportSpecVersion(
        event.eventData.metadata.blockHeader.specVersion,
        ctx.appConfig.UNIFIED_EVENTS_GENESIS_SPEC_VERSION
      )
    )
  )) {
    // console.log(
    //   'handleStablepoolLiquidityEvents - ',
    //   eventData.eventData.metadata.blockHeader.specVersion,
    //   eventData.eventData.metadata.blockHeader.height
    // );
    await stablepoolLiquidityAddedRemoved(
      ctx,
      eventData as StableswapLiquidityAddedData | StableswapLiquidityRemovedData
    );
  }

  await ctx.store.save(
    [...ctx.batchState.state.stableswapAllBatchPools.values()].filter((pool) =>
      ctx.batchState.state.stableswapIdsToSave.has(pool.id)
    )
  );
  ctx.batchState.state.stableswapIdsToSave = new Set();

  await ctx.store.save([
    ...ctx.batchState.state.stableswapAssetsAllBatch.values(),
  ]);
}

export async function stablepoolLiquidityAddedRemoved(
  ctx: SqdProcessorContext<Store>,
  eventCallData: StableswapLiquidityAddedData | StableswapLiquidityRemovedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData,
    relayChainInfo,
  } = eventCallData;
  const batchAssetLiquidityActionAmounts =
    ctx.batchState.state.stablepoolAssetBatchLiquidityAmounts;
  const batchAssetLiquidityActions =
    ctx.batchState.state.stablepoolBatchLiquidityActions;
  const pool = await getOrCreateStableswap({
    ctx,
    poolId: eventParams.poolId,
    ensure: true,
    blockHeader: eventMetadata.blockHeader,
  });

  if (!pool) return;

  let fee = BigInt(0);
  let assetAmounts = [];

  const actionType =
    eventMetadata.name === EventName.Stableswap_LiquidityAdded
      ? LiquidityActionEvent.Add
      : LiquidityActionEvent.Remove;

  if (eventMetadata.name === EventName.Stableswap_LiquidityAdded) {
    assetAmounts = (eventCallData as StableswapLiquidityAddedData).eventData
      .params.assets;
  } else {
    assetAmounts = (eventCallData as StableswapLiquidityRemovedData).eventData
      .params.amounts;
  }

  const newAction = new StableswapLiquidityEvent({
    id: `${eventParams.poolId}-${eventMetadata.id}`,
    traceIds: [
      ...(callData.traceId ? [callData.traceId] : []),
      eventMetadata.traceId,
    ],
    pool,
    actionType,
    sharesAmount: eventParams.shares,
    feeAmount: fee,
    indexInBlock: eventMetadata.indexInBlock,
    relayBlockHeight: relayChainInfo.relaychainBlockNumber,
    paraBlockHeight: relayChainInfo.parachainBlockNumber,
    event: ctx.batchState.state.batchEvents.get(eventMetadata.id),
  });

  const newAmountsList = [];

  for (const assetAmount of assetAmounts) {
    const amountEntityId = `${newAction.id}-${assetAmount.assetId}`;
    const asset = await getAsset({
      ctx,
      id: assetAmount.assetId,
      blockHeader: eventMetadata.blockHeader,
      ensure: true,
    });

    if (!asset) continue; // TODO add error handling

    newAmountsList.push(
      new StableswapAssetLiquidityAmount({
        id: amountEntityId,
        liquidityAction: newAction,
        amount: assetAmount.amount,
        asset,
      })
    );
  }

  if (!newAmountsList || newAmountsList.length === 0) return; // TODO add error handling in case asset has not been fetched

  newAmountsList.forEach((newAmount) =>
    batchAssetLiquidityActionAmounts.set(newAmount.id, newAmount)
  );

  batchAssetLiquidityActions.set(newAction.id, newAction);

  if (
    !isUnifiedEventsSupportSpecVersion(
      eventMetadata.blockHeader.specVersion,
      ctx.appConfig.UNIFIED_EVENTS_GENESIS_SPEC_VERSION
    )
  )
    await handleStablepoolVolumeUpdates({
      ctx,
      pool,
      liquidityAction: { ...newAction, assetAmounts: newAmountsList },
    });
}

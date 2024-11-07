import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  StableswapLiquidityAddedData,
  StableswapLiquidityRemovedData,
} from '../../parsers/batchBlocksParser/types';
import {
  LiquidityActionType,
  StablepoolAssetLiquidityAmount,
  StablepoolLiquidityAction,
} from '../../model';
import { getStablepool } from './stablepool';
import { EventName } from '../../parsers/types/events';
import { getAsset } from '../assets/assetRegistry';
import { handleStablepoolVolumeUpdates } from '../volumes/stablepoolVolume';

export async function stablepoolLiquidityAddedRemoved(
  ctx: ProcessorContext<Store>,
  eventCallData: StableswapLiquidityAddedData | StableswapLiquidityRemovedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    relayChainInfo,
  } = eventCallData;
  const batchAssetLiquidityActionAmounts =
    ctx.batchState.state.stablepoolAssetBatchLiquidityAmounts;
  const batchAssetLiquidityActions =
    ctx.batchState.state.stablepoolBatchLiquidityActions;
  const pool = await getStablepool(ctx, eventParams.poolId);

  if (!pool) return;

  let fee = BigInt(0);
  let assetAmounts = [];

  const actionType =
    eventMetadata.name === EventName.Stableswap_LiquidityAdded
      ? LiquidityActionType.ADD
      : LiquidityActionType.REMOVE;

  if (eventMetadata.name === EventName.Stableswap_LiquidityAdded) {
    assetAmounts = (eventCallData as StableswapLiquidityAddedData).eventData
      .params.assets;
  } else {
    assetAmounts = (eventCallData as StableswapLiquidityRemovedData).eventData
      .params.amounts;
  }

  const newAction = new StablepoolLiquidityAction({
    id: `${eventParams.poolId}-${eventMetadata.blockHeader.height}-${eventMetadata.indexInBlock}`,
    pool,
    actionType,
    sharesAmount: eventParams.shares,
    feeAmount: fee,
    indexInBlock: eventMetadata.indexInBlock,
    relayChainBlockHeight: relayChainInfo.relaychainBlockNumber,
    paraChainBlockHeight: relayChainInfo.parachainBlockNumber,
  });

  const newAmountsList = [];

  for (const assetAmount of assetAmounts) {
    const amountEntityId = `${eventParams.poolId}-${assetAmount.assetId}-${eventMetadata.blockHeader.height}-${eventMetadata.indexInBlock}`;
    const asset = await getAsset({
      ctx,
      id: assetAmount.assetId,
      blockHeader: eventMetadata.blockHeader,
      ensure: true,
    });

    if (!asset) continue; // TODO add error handling

    newAmountsList.push(
      new StablepoolAssetLiquidityAmount({
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

  await handleStablepoolVolumeUpdates({
    ctx,
    liquidityAction: { ...newAction, assetAmounts: newAmountsList },
  });
}

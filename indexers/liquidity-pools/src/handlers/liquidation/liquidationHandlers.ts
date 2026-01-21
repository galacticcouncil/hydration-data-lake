import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { LiquidationLiquidatedData } from '../../parsers/batchBlocksParser/types';
import { LiquidationLiquidatedEvent } from '../../model';
import { getOrCreateAsset } from '../assets/asset';
import {
  getOrCreateAccount,
  getOrCreateAccountByBoundEvmAddress,
} from '../accounts';
import { ChainActivityTraceManager } from '../../chainActivityTracingManagers';

export async function handleLiquidationLiquidated(
  ctx: SqdProcessorContext<Store>,
  eventCallData: LiquidationLiquidatedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData,
  } = eventCallData;

  const collateralAsset = await getOrCreateAsset({
    assetRegistryId: eventParams.collateralAssetRegistryId,
    ctx,
    ensure: true,
    blockHeader: eventMetadata.blockHeader,
  });

  if (!collateralAsset) {
    throw new Error(
      `Could not find collateral asset ${eventParams.collateralAssetRegistryId}`
    );
  }

  const debtAsset = await getOrCreateAsset({
    assetRegistryId: eventParams.debtAssetRegistryId,
    ctx,
    ensure: true,
    blockHeader: eventMetadata.blockHeader,
  });

  if (!debtAsset) {
    throw new Error(
      `Could not find debt asset ${eventParams.debtAssetRegistryId}`
    );
  }

  const account = await getOrCreateAccountByBoundEvmAddress({
    evmAddress: eventParams.userEvmAddress,
    blockHeader: eventMetadata.blockHeader,
    ctx,
  });

  const newEventEntity = new LiquidationLiquidatedEvent({
    id: eventMetadata.id,

    traceIds: [
      ...(callData.traceId ? [callData.traceId] : []),
      eventMetadata.traceId,
    ],

    accountId: account.id,
    collateralAssetId: collateralAsset.id,
    debtAssetId: debtAsset.id,
    profit: eventParams.profit ?? 0n,

    paraBlockHeight: eventMetadata.blockHeader.height,
    event: ctx.batchState.state.batchEvents.get(eventMetadata.id),
  });

  ctx.batchState.state.liquidationLiquidatedEvents.set(
    newEventEntity.id,
    newEventEntity
  );

  await ChainActivityTraceManager.addParticipantsToActivityTracesBulk({
    participants: [account],
    traceIds: newEventEntity.traceIds,
    ctx,
  });
}

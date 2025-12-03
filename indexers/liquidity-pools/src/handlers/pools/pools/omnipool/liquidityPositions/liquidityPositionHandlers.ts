import { SqdProcessorContext } from '../../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  OmnipoolLiquidityAddedData,
  OmnipoolLiquidityRemovedData,
  OmnipoolPositionCreatedData,
  OmnipoolPositionDestroyedData,
  OmnipoolPositionUpdatedData,
} from '../../../../../parsers/batchBlocksParser/types';
import {
  getNewOmnipoolLiquidityPosition,
  getNewOmnipoolLiquidityPositionEvent,
  getOrCreateOmnipoolLiquidityPosition,
} from './liquidityPositionUtils';
import { getOrCreateAsset } from '../../../../assets/asset';
import { OmnipoolLiquidityPositionStatus } from '../../../../../model';

export async function handleOmnipoolLiquidityPositionCreated(
  ctx: SqdProcessorContext<Store>,
  eventCallData: OmnipoolPositionCreatedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const { positionId, owner, asset, amount, shares, price } = eventParams;

  const assetEntity = await getOrCreateAsset({
    assetRegistryId: asset,
    ctx,
    blockHeader: eventMetadata.blockHeader,
    ensure: true,
  });

  if (!assetEntity) {
    throw Error(
      `handleOmnipoolLiquidityPositionCreated :: asset with id ${assetEntity} cannot be found;`
    );
  }

  const positionEntity = await getNewOmnipoolLiquidityPosition({
    positionId: positionId.toString(),
    ownerAccountId: owner,
    assetId: assetEntity.id,
    amount,
    initialAmount: amount,
    sharesAmount: shares,
    price,
    ctx,
    blockHeader: eventMetadata.blockHeader,
  });

  if (!positionEntity) throw Error(`Position ${positionId} cannot be created`);

  const eventEntity = await getNewOmnipoolLiquidityPositionEvent({
    eventName: OmnipoolLiquidityPositionStatus.PositionCreated,
    position: positionEntity,
    assetId: positionEntity.assetId,
    ownerAccountId: owner,
    amount,
    sharesAmount: shares,
    price,
    ctx,
    eventId: eventMetadata.id,
    paraBlockHeight: eventMetadata.blockHeader.height,
  });

  ctx.batchState.state.omnipoolLiquidityPositions.set(
    positionEntity.id,
    positionEntity
  );

  ctx.batchState.state.omnipoolLiquidityPositionEvents.set(
    eventEntity.id,
    eventEntity
  );
}

export async function handleOmnipoolLiquidityPositionUpdated(
  ctx: SqdProcessorContext<Store>,
  eventCallData: OmnipoolPositionUpdatedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const { positionId, owner, asset, amount, shares, price } = eventParams;

  const position = await getOrCreateOmnipoolLiquidityPosition({
    positionId: positionId.toString(),
    ctx,
    ensure: true,
    blockHeader: eventMetadata.blockHeader,
  });

  if (!position) throw Error(`Position ${positionId} not found`);

  const eventEntity = await getNewOmnipoolLiquidityPositionEvent({
    eventName: OmnipoolLiquidityPositionStatus.PositionUpdated,
    position,
    assetId: position.assetId,
    ownerAccountId: owner,
    amount,
    sharesAmount: shares,
    price,
    ctx,
    eventId: eventMetadata.id,
    paraBlockHeight: eventMetadata.blockHeader.height,
  });

  position.amount = amount;
  position.sharesAmount = shares;
  position.price = price;

  ctx.batchState.state.omnipoolLiquidityPositionEvents.set(
    eventEntity.id,
    eventEntity
  );

  ctx.batchState.state.omnipoolLiquidityPositions.set(position.id, position);
}

export async function handleOmnipoolLiquidityPositionDestroyed(
  ctx: SqdProcessorContext<Store>,
  eventCallData: OmnipoolPositionDestroyedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const { positionId, owner } = eventParams;

  const position = await getOrCreateOmnipoolLiquidityPosition({
    positionId: positionId.toString(),
    ctx,
    ensure: true,
    blockHeader: eventMetadata.blockHeader,
    noPanic: true,
  });

  if (!position) return;

  const eventEntity = await getNewOmnipoolLiquidityPositionEvent({
    eventName: OmnipoolLiquidityPositionStatus.PositionDestroyed,
    position,
    assetId: position.assetId,
    ownerAccountId: owner,
    ctx,
    eventId: eventMetadata.id,
    paraBlockHeight: eventMetadata.blockHeader.height,
  });

  position.status = OmnipoolLiquidityPositionStatus.PositionDestroyed;
  position.destroyedAtParaBlockHeight = eventMetadata.blockHeader.height;

  ctx.batchState.state.omnipoolLiquidityPositionEvents.set(
    eventEntity.id,
    eventEntity
  );

  ctx.batchState.state.omnipoolLiquidityPositions.set(position.id, position);
}

export async function handleOmnipoolLiquidityAdded(
  ctx: SqdProcessorContext<Store>,
  eventCallData: OmnipoolLiquidityAddedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;
}

export async function handleOmnipoolLiquidityRemoved(
  ctx: SqdProcessorContext<Store>,
  eventCallData: OmnipoolLiquidityRemovedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;
}

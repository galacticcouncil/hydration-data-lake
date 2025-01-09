import { Block, ProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { OmnipoolAsset } from '../../../model';
import {
  OmnipoolTokenAddedData,
  OmnipoolTokenRemovedData,
} from '../../../parsers/batchBlocksParser/types';
import { getAsset } from '../../assets/assetRegistry';

export async function getOrCreateOmnipoolAsset({
  ctx,
  assetId,
  ensure = false,
  blockHeader,
}: {
  ctx: ProcessorContext<Store>;
  assetId: number | string;
  ensure?: boolean;
  blockHeader?: Block;
}) {
  const batchState = ctx.batchState.state;

  let omnipoolAsset = batchState.omnipoolAssets.get(
    `${ctx.appConfig.OMNIPOOL_ADDRESS}-${assetId}`
  );
  if (omnipoolAsset) return omnipoolAsset;

  omnipoolAsset = await ctx.store.findOne(OmnipoolAsset, {
    where: { asset: { id: `${assetId}` } },
    relations: { asset: true, pool: true },
  });

  if (omnipoolAsset || (!omnipoolAsset && !ensure))
    return omnipoolAsset ?? null;

  if (!blockHeader) return null;

  const assetEntity = await getAsset({
    ctx,
    id: assetId,
    ensure: true,
    blockHeader: blockHeader,
  });

  if (!assetEntity) throw new Error(`Asset ${assetId} not found`);

  omnipoolAsset = new OmnipoolAsset({
    id: `${ctx.batchState.state.omnipoolEntity!.id}-${assetId}`,
    asset: assetEntity,
    pool: ctx.batchState.state.omnipoolEntity!,
    createdAt: new Date(blockHeader.timestamp ?? Date.now()),
    createdAtParaBlock: blockHeader.height,
    isRemoved: false,
  });

  await ctx.store.upsert(omnipoolAsset);

  batchState.omnipoolAssets.set(omnipoolAsset.id, omnipoolAsset);

  ctx.batchState.state = {
    omnipoolAssets: batchState.omnipoolAssets,
  };

  return omnipoolAsset;
}

export async function omnipoolTokenAdded(
  ctx: ProcessorContext<Store>,
  eventCallData: OmnipoolTokenAddedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  let omnipoolAssetEntity = await getOrCreateOmnipoolAsset({
    ctx,
    assetId: eventParams.assetId,
    ensure: true,
    blockHeader: eventMetadata.blockHeader,
  });

  if (omnipoolAssetEntity) return;

  const assetEntity = await getAsset({
    ctx,
    id: eventParams.assetId,
    ensure: true,
    blockHeader: eventMetadata.blockHeader,
  });

  if (!assetEntity) return;

  omnipoolAssetEntity = new OmnipoolAsset({
    id: `${ctx.batchState.state.omnipoolEntity!.id}-${eventParams.assetId}`,
    asset: assetEntity,
    initialAmount: eventParams.initialAmount,
    initialPrice: eventParams.initialPrice,
    pool: ctx.batchState.state.omnipoolEntity!,
    createdAt: new Date(),
    createdAtParaBlock: eventMetadata.blockHeader.height,
    isRemoved: false,
  });

  const state = ctx.batchState.state;

  state.omnipoolAssetIdsToSave.add(omnipoolAssetEntity.id);
  state.omnipoolAssets.set(omnipoolAssetEntity.id, omnipoolAssetEntity);

  ctx.batchState.state = {
    omnipoolAssetIdsToSave: state.omnipoolAssetIdsToSave,
    omnipoolAssets: state.omnipoolAssets,
  };
}

export async function omnipoolTokenRemoved(
  ctx: ProcessorContext<Store>,
  eventCallData: OmnipoolTokenRemovedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const omnipoolAssetEntity = await getOrCreateOmnipoolAsset({
    ctx,
    assetId: eventParams.assetId,
    ensure: true,
    blockHeader: eventMetadata.blockHeader,
  });

  if (!omnipoolAssetEntity) return;

  omnipoolAssetEntity.isRemoved = true;
  omnipoolAssetEntity.removedAtParaBlock = eventMetadata.blockHeader.height;
  omnipoolAssetEntity.removedAmount = eventParams.amount;
  omnipoolAssetEntity.hubWithdrawn = eventParams.hubWithdrawn;

  const assetIdsToSave = ctx.batchState.state.omnipoolAssetIdsToSave;
  const allAssets = ctx.batchState.state.omnipoolAssets;

  assetIdsToSave.add(omnipoolAssetEntity.id);
  allAssets.set(omnipoolAssetEntity.id, omnipoolAssetEntity);

  ctx.batchState.state = { omnipoolAssetIdsToSave: assetIdsToSave };
  ctx.batchState.state = { omnipoolAssets: allAssets };
}

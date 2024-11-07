import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { OmnipoolAsset } from '../../model';
import {
  OmnipoolTokenAddedData,
  OmnipoolTokenRemovedData,
} from '../../parsers/batchBlocksParser/types';
import { getAsset } from '../assets/assetRegistry';

export async function getOmnipoolAsset(
  ctx: ProcessorContext<Store>,
  assetId: number | string
) {
  return (
    ctx.batchState.state.omnipoolAssets.get(
      `${ctx.appConfig.OMNIPOOL_ADDRESS}-${assetId}`
    ) ||
    (await ctx.store.findOne(OmnipoolAsset, {
      where: { asset: { id: `${assetId}` } },
      relations: { asset: true, pool: true },
    }))
  );
}

export async function omnipoolTokenAdded(
  ctx: ProcessorContext<Store>,
  eventCallData: OmnipoolTokenAddedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  let omnipoolAssetEntity = await getOmnipoolAsset(ctx, eventParams.assetId);

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

  const assetIdsToSave = ctx.batchState.state.omnipoolAssetIdsToSave;
  const allAssets = ctx.batchState.state.omnipoolAssets;
  assetIdsToSave.add(omnipoolAssetEntity.id);
  allAssets.set(omnipoolAssetEntity.id, omnipoolAssetEntity);

  ctx.batchState.state = { omnipoolAssetIdsToSave: assetIdsToSave };
  ctx.batchState.state = { omnipoolAssets: allAssets };
}

export async function omnipoolTokenRemoved(
  ctx: ProcessorContext<Store>,
  eventCallData: OmnipoolTokenRemovedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  let omnipoolAssetEntity = await getOmnipoolAsset(ctx, eventParams.assetId);

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

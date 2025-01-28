import { SqdBlock, SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  OmnipoolAsset,
  OmnipoolAssetAddedData,
  OmnipoolAssetLifeState,
  OmnipoolAssetRemovedData,
} from '../../../model';
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
  ctx: SqdProcessorContext<Store>;
  assetId: number | string;
  ensure?: boolean;
  blockHeader?: SqdBlock;
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

    addedAtParaChainBlockHeight: blockHeader.height,
    addedAtRelayChainBlockHeight:
      ctx.batchState.getRelayChainBlockDataFromCache(blockHeader.height).height,
    addedAtBlock: ctx.batchState.state.batchBlocks.get(blockHeader.id),
    isRemoved: false,
    lifeStates: addOmnipoolAssetAddedLifeState({
      assetAddedState: new OmnipoolAssetAddedData({
        initialAmount: '0', // TODO fix values
        initialPrice: '0',
        paraChainBlockHeight: blockHeader.height,
        relayChainBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
          blockHeader.height
        ).height,
      }),
    }),
  });

  await ctx.store.upsert(omnipoolAsset);

  batchState.omnipoolAssets.set(omnipoolAsset.id, omnipoolAsset);

  return omnipoolAsset;
}

export async function omnipoolTokenAdded(
  ctx: SqdProcessorContext<Store>,
  eventCallData: OmnipoolTokenAddedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  let omnipoolAssetEntity = await getOrCreateOmnipoolAsset({
    ctx,
    assetId: eventParams.assetId,
    // ensure: true,
    // blockHeader: eventMetadata.blockHeader,
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
    pool: ctx.batchState.state.omnipoolEntity!,

    addedAtParaChainBlockHeight: eventMetadata.blockHeader.height,
    addedAtRelayChainBlockHeight:
      ctx.batchState.getRelayChainBlockDataFromCache(
        eventMetadata.blockHeader.height
      ).height,
    addedAtBlock: ctx.batchState.state.batchBlocks.get(
      eventMetadata.blockHeader.id
    ),
    isRemoved: false,
    lifeStates: addOmnipoolAssetAddedLifeState({
      assetAddedState: new OmnipoolAssetAddedData({
        initialAmount: eventParams.initialAmount.toString(),
        initialPrice: eventParams.initialPrice.toString(),
        paraChainBlockHeight: eventMetadata.blockHeader.height,
        relayChainBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
          eventMetadata.blockHeader.height
        ).height,
      }),
    }),
  });

  const state = ctx.batchState.state;

  state.omnipoolAssetIdsToSave.add(omnipoolAssetEntity.id);
  state.omnipoolAssets.set(omnipoolAssetEntity.id, omnipoolAssetEntity);
}

export async function omnipoolTokenRemoved(
  ctx: SqdProcessorContext<Store>,
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
  omnipoolAssetEntity.lifeStates = addOmnipoolAssetRemovedLifeState({
    existingStates: omnipoolAssetEntity.lifeStates,
    assetRemovedState: new OmnipoolAssetRemovedData({
      removedAmount: eventParams.amount.toString(),
      hubWithdrawn: eventParams.hubWithdrawn.toString(),
      paraChainBlockHeight: eventMetadata.blockHeader.height,
      relayChainBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
        eventMetadata.blockHeader.height
      ).height,
    }),
  });

  ctx.batchState.state.omnipoolAssetIdsToSave.add(omnipoolAssetEntity.id);
  ctx.batchState.state.omnipoolAssets.set(
    omnipoolAssetEntity.id,
    omnipoolAssetEntity
  );
}

export function addOmnipoolAssetAddedLifeState({
  existingStates = [],
  assetAddedState,
}: {
  existingStates?: OmnipoolAssetLifeState[];
  assetAddedState: OmnipoolAssetAddedData;
}): OmnipoolAssetLifeState[] {
  const existingState = existingStates.find(
    (state) =>
      state.added.paraChainBlockHeight === assetAddedState.paraChainBlockHeight
  );

  if (existingState) return existingStates;

  return [
    ...existingStates,
    new OmnipoolAssetLifeState({
      added: assetAddedState,
      removed: null,
    }),
  ];
}

export function addOmnipoolAssetRemovedLifeState({
  existingStates = [],
  assetRemovedState,
}: {
  existingStates?: OmnipoolAssetLifeState[];
  assetRemovedState: OmnipoolAssetRemovedData;
}): OmnipoolAssetLifeState[] {
  const latestOpenState = existingStates.find((state) => !state.removed);

  if (!latestOpenState) return existingStates;

  return [
    ...existingStates.filter(
      (state) =>
        state.added.paraChainBlockHeight !==
        latestOpenState.added.paraChainBlockHeight
    ),
    new OmnipoolAssetLifeState({
      added: latestOpenState.added,
      removed: assetRemovedState,
    }),
  ];
}

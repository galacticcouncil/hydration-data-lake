import { Store } from '@subsquid/typeorm-store';

import {
  OmnipoolAsset,
  OmnipoolAssetAddedData,
  OmnipoolAssetLifeState,
  OmnipoolAssetRemovedData,
} from '../../../../model';
import {
  OmnipoolTokenAddedData,
  OmnipoolTokenRemovedData,
} from '../../../../parsers/batchBlocksParser/types';
import {
  SqdBlock,
  SqdProcessorContext,
} from '../../../../processor';
import { getOrCreateAsset } from '../../../assets/asset';

export async function getOrCreateOmnipoolAsset({
  ctx,
  assetId,
  assetRegistryAssetId,
  ensure = false,
  blockHeader,
}: {
  ctx: SqdProcessorContext<Store>;
  assetId?: string;
  assetRegistryAssetId?: number | string;
  ensure?: boolean;
  blockHeader?: SqdBlock;
}) {
  if (!assetId && !assetRegistryAssetId) return null;

  const assetEntity = await getOrCreateAsset({
    ctx,
    id: assetId,
    assetRegistryId: assetRegistryAssetId,
    ensure: true,
    blockHeader: blockHeader,
  });

  if (!assetEntity) throw new Error(`Asset ${assetId} not found`);

  const batchState = ctx.batchState.state;

  let omnipoolAsset = batchState.omnipoolAssets.get(
    `${ctx.appConfig.OMNIPOOL_ADDRESS}-${assetEntity.id}`
  );
  if (omnipoolAsset) return omnipoolAsset;

  omnipoolAsset = await ctx.storeUtils.findOneWithLogs(OmnipoolAsset, {
    where: { asset: { id: `${assetEntity.id}` } },
    relations: { asset: true, pool: true },
  }, { className: 'OmnipoolAsset' });

  if (omnipoolAsset) {
    batchState.omnipoolAssets.set(omnipoolAsset.id, omnipoolAsset);
    return omnipoolAsset;
  }

  if (!omnipoolAsset && !ensure) return omnipoolAsset ?? null;

  if (!blockHeader) return null;

  const addedAtBlock = ctx.batchState.getParaBlockFromCacheByHeight(blockHeader.height);
  if (!addedAtBlock) {
    throw new Error(`Block not found in cache for height ${blockHeader.height}`);
  }

  omnipoolAsset = new OmnipoolAsset({
    id: `${ctx.batchState.state.omnipoolEntity!.id}-${assetEntity.id}`,
    asset: assetEntity,
    pool: ctx.batchState.state.omnipoolEntity!,

    addedAtParaBlockHeight: blockHeader.height,
    addedAtRelayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
      blockHeader.height
    ).height,
    addedAtBlockId: addedAtBlock.id,
    isRemoved: false,
    lifeStates: addOmnipoolAssetAddedLifeState({
      assetAddedState: new OmnipoolAssetAddedData({
        initialAmount: '0', // TODO fix values
        initialPrice: '0',
        paraBlockHeight: blockHeader.height,
        relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
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
    assetRegistryAssetId: eventParams.assetId,
    // ensure: true,
    // blockHeader: eventMetadata.blockHeader,
  });

  if (omnipoolAssetEntity && omnipoolAssetEntity.isRemoved) {
    omnipoolAssetEntity.isRemoved = false;
    omnipoolAssetEntity.lifeStates = addOmnipoolAssetAddedLifeState({
      existingStates: omnipoolAssetEntity.lifeStates || [],
      assetAddedState: new OmnipoolAssetAddedData({
        initialAmount: '0', // TODO fix values
        initialPrice: '0',
        paraBlockHeight: eventMetadata.blockHeader.height,
        relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
          eventMetadata.blockHeader.height
        ).height,
      }),
    });
    omnipoolAssetEntity.addedAtParaBlockHeight =
      eventMetadata.blockHeader.height;
    omnipoolAssetEntity.addedAtRelayBlockHeight =
      ctx.batchState.getRelayChainBlockDataFromCache(
        eventMetadata.blockHeader.height
      ).height;

    ctx.batchState.state.omnipoolAssets.set(
      omnipoolAssetEntity.id,
      omnipoolAssetEntity
    );
    ctx.batchState.state.omnipoolAssetIdsToSave.add(omnipoolAssetEntity.id);
  }

  if (omnipoolAssetEntity) return;

  const assetEntity = await getOrCreateAsset({
    ctx,
    assetRegistryId: eventParams.assetId,
    ensure: true,
    blockHeader: eventMetadata.blockHeader,
  });

  if (!assetEntity) return;

  const addedAtBlock = ctx.batchState.getParaBlockFromCacheByHeight(eventMetadata.blockHeader.height);
  if (!addedAtBlock) {
    throw new Error(`Block not found in cache for height ${eventMetadata.blockHeader.height}`);
  }

  omnipoolAssetEntity = new OmnipoolAsset({
    id: `${ctx.batchState.state.omnipoolEntity!.id}-${assetEntity.id}`,
    asset: assetEntity,
    pool: ctx.batchState.state.omnipoolEntity!,

    addedAtParaBlockHeight: eventMetadata.blockHeader.height,
    addedAtRelayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
      eventMetadata.blockHeader.height
    ).height,
    addedAtBlockId: addedAtBlock.id,

    isRemoved: false,
    lifeStates: addOmnipoolAssetAddedLifeState({
      assetAddedState: new OmnipoolAssetAddedData({
        initialAmount: eventParams.initialAmount.toString(),
        initialPrice: eventParams.initialPrice.toString(),
        paraBlockHeight: eventMetadata.blockHeader.height,
        relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
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
    assetRegistryAssetId: eventParams.assetId,
    ensure: true,
    blockHeader: eventMetadata.blockHeader,
  });

  if (!omnipoolAssetEntity) return;

  omnipoolAssetEntity.isRemoved = true;
  omnipoolAssetEntity.lifeStates = addOmnipoolAssetRemovedLifeState({
    existingStates: omnipoolAssetEntity.lifeStates || [],
    assetRemovedState: new OmnipoolAssetRemovedData({
      removedAmount: eventParams.amount.toString(),
      hubWithdrawn: eventParams.hubWithdrawn.toString(),
      paraBlockHeight: eventMetadata.blockHeader.height,
      relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
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
    (state) => state.added.paraBlockHeight === assetAddedState.paraBlockHeight
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
        state.added.paraBlockHeight !== latestOpenState.added.paraBlockHeight
    ),
    new OmnipoolAssetLifeState({
      added: latestOpenState.added,
      removed: assetRemovedState,
    }),
  ];
}

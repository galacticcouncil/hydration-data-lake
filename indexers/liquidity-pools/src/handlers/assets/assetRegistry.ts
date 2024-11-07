import { Block, ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  AssetRegistryRegisteredData,
  AssetRegistryUpdatedData,
} from '../../parsers/batchBlocksParser/types';
import { Asset, AssetType } from '../../model';
import parsers from '../../parsers';
import { ProcessorStatusManager } from '../../utils/processorStatusManager';

export async function getAsset({
  ctx,
  id,
  ensure = false,
  blockHeader,
}: {
  ctx: ProcessorContext<Store>;
  id: string | number;
  ensure?: boolean;
  blockHeader?: Block;
}): Promise<Asset | null> {
  const assetsAllBatch = ctx.batchState.state.assetsAllBatch;

  let asset = assetsAllBatch.get(`${id}`);
  if (asset) return asset;

  asset = await ctx.store.findOne(Asset, { where: { id: `${id}` } });

  if (asset) return asset;

  if (!asset && !ensure) return null;

  /**
   * Following logic below is implemented and will be used only if indexer
   * has been started not from genesis block and some assets have not been
   * pre-created before indexing start point.
   */

  if (!blockHeader) return null;
  const storageData = await parsers.storage.assetRegistry.getAsset(
    +id,
    blockHeader
  );

  if (!storageData) return null;

  const newAsset = new Asset({
    id: `${id}`,
    name: storageData.name,
    assetType: storageData.assetType,
    existentialDeposit: storageData.existentialDeposit,
    symbol: storageData.symbol ?? null,
    decimals: storageData.decimals ?? null,
    xcmRateLimit: storageData.xcmRateLimit ?? null,
    isSufficient: storageData.isSufficient ?? true,
  });

  await ctx.store.save(newAsset);

  assetsAllBatch.set(newAsset.id, newAsset);
  ctx.batchState.state = {
    assetsAllBatch,
  };

  return newAsset;
}

export async function prefetchAllAssets(ctx: ProcessorContext<Store>) {
  ctx.batchState.state = {
    assetsAllBatch: new Map(
      (await ctx.store.find(Asset, { where: {} })).map((asset) => [
        asset.id,
        asset,
      ])
    ),
  };
}

export async function ensureNativeToken(ctx: ProcessorContext<Store>) {
  let nativeToken = await getAsset({ ctx, id: 0 });
  if (nativeToken) return;

  nativeToken = new Asset({
    id: '0',
    name: 'Hydration',
    assetType: AssetType.Token,
    decimals: 12,
    existentialDeposit: BigInt('1000000000000'),
    symbol: 'HDX',
    xcmRateLimit: null,
    isSufficient: true,
  });

  await ctx.store.upsert(nativeToken);
  const assetsAllBatch = ctx.batchState.state.assetsAllBatch;
  assetsAllBatch.set(nativeToken.id, nativeToken);
  ctx.batchState.state = {
    assetsAllBatch,
  };
}

export async function assetRegistered(
  ctx: ProcessorContext<Store>,
  eventCallData: AssetRegistryRegisteredData
) {
  const {
    eventData: {
      params: {
        assetId,
        assetType,
        assetName,
        existentialDeposit,
        symbol,
        decimals,
        xcmRateLimit,
        isSufficient,
      },
      metadata: eventMetadata,
    },
  } = eventCallData;

  const newAsset = new Asset({
    id: `${assetId}`,
    name: assetName,
    assetType,
    existentialDeposit,
    symbol,
    decimals,
    xcmRateLimit,
    isSufficient,
  });

  const state = ctx.batchState.state;
  state.assetsAllBatch.set(newAsset.id, newAsset);
  state.assetIdsToSave.add(newAsset.id);
  ctx.batchState.state = {
    assetsAllBatch: state.assetsAllBatch,
    assetIdsToSave: state.assetIdsToSave,
  };
}

export async function assetUpdated(
  ctx: ProcessorContext<Store>,
  eventCallData: AssetRegistryUpdatedData
) {
  const {
    eventData: {
      params: {
        assetId,
        assetType,
        assetName,
        existentialDeposit,
        symbol,
        decimals,
        xcmRateLimit,
        isSufficient,
      },
      metadata: eventMetadata,
    },
  } = eventCallData;

  const asset = await getAsset({
    ctx,
    id: assetId,
    ensure: true,
    blockHeader: eventMetadata.blockHeader,
  });

  if (!asset) return;

  if (assetName) asset.name = assetName;
  if (assetType) asset.assetType = assetType;
  if (existentialDeposit) asset.existentialDeposit = existentialDeposit;
  if (symbol) asset.symbol = symbol;
  if (decimals) asset.decimals = decimals;
  if (xcmRateLimit) asset.xcmRateLimit = xcmRateLimit;
  if (isSufficient) asset.isSufficient = isSufficient;

  const state = ctx.batchState.state;
  state.assetsAllBatch.set(asset.id, asset);
  state.assetIdsToSave.add(asset.id);
  ctx.batchState.state = {
    assetsAllBatch: state.assetsAllBatch,
    assetIdsToSave: state.assetIdsToSave,
  };
}

export async function actualiseAssets(ctx: ProcessorContext<Store>) {
  if (!ctx.isHead) return;

  const latestActualisationPoint = (
    await ProcessorStatusManager.getInstance(ctx).getStatus()
  ).assetsActualisedAtBlock;

  if (ctx.blocks[0].header.height < latestActualisationPoint + 3000) return;

  const allExistingAssets = new Map(
    (await ctx.store.find(Asset)).map((asset) => [asset.id, asset])
  );

  if (allExistingAssets.size === 0) return;

  const storageData = await parsers.storage.assetRegistry.getAssetMany(
    [...allExistingAssets.keys()],
    ctx.blocks[0].header
  );
  const assetsToUpdate: Asset[] = [];

  for (const assetStorageData of storageData) {
    if (!assetStorageData.data) continue;
    const assetEntity = allExistingAssets.get(`${assetStorageData.assetId}`);
    if (!assetEntity) continue;
    const {
      name,
      assetType,
      existentialDeposit,
      symbol,
      decimals,
      xcmRateLimit,
      isSufficient,
    } = assetStorageData.data;

    if (name) assetEntity.name = name;
    if (assetType) assetEntity.assetType = assetType;
    if (existentialDeposit) assetEntity.existentialDeposit = existentialDeposit;
    if (symbol) assetEntity.symbol = symbol;
    if (decimals) assetEntity.decimals = decimals;
    if (xcmRateLimit) assetEntity.xcmRateLimit = xcmRateLimit;
    if (isSufficient) assetEntity.isSufficient = isSufficient;
    assetsToUpdate.push(assetEntity);
    allExistingAssets.set(assetEntity.id, assetEntity);
  }

  await ctx.store.upsert(assetsToUpdate);

  ctx.batchState.state = {
    assetsAllBatch: allExistingAssets,
  };

  await ProcessorStatusManager.getInstance(ctx).updateProcessorStatus({
    assetsActualisedAtBlock: ctx.blocks[0].header.height,
  });
}

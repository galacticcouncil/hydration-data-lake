import { SqdBlock, SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  AssetRegistryRegisteredData,
  AssetRegistryUpdatedData,
} from '../../parsers/batchBlocksParser/types';
import { Asset, AssetType } from '../../model';
import parsers from '../../parsers';
import { ProcessorStatusManager } from '../../processorStatusManager';
import { AssetDetailsWithId } from '../../parsers/types/storage';

export async function getAsset({
  ctx,
  id,
  evmAddress,
  ensure = false,
  blockHeader,
}: {
  ctx: SqdProcessorContext<Store>;
  id?: string | number;
  evmAddress?: string;
  ensure?: boolean;
  blockHeader?: SqdBlock;
}): Promise<Asset | null> {
  if (id === undefined && !evmAddress) return null;

  const assetsAllBatch = ctx.batchState.state.assetsAllBatch;

  let asset = null;

  if (id !== undefined) {
    asset = assetsAllBatch.get(`${id}`);
  } else if (evmAddress) {
    asset = [...assetsAllBatch.values()].find(
      (a) => a.evmAddress === evmAddress
    );
  }

  if (asset) return asset;

  asset = await ctx.store.findOne(Asset, {
    where: {
      ...(id ? { id: `${id}` } : {}),
      ...(evmAddress ? { evmAddress: evmAddress } : {}),
    },
  });

  if (asset) {
    assetsAllBatch.set(asset.id, asset);
    return asset;
  }

  if (!asset && !ensure) return null;

  /**
   * Following logic below is implemented and will be used only if indexer
   * has been started not from genesis block and some assets have not been
   * pre-created before indexing start point.
   */

  if (!blockHeader) return null;
  if (id === undefined) return null; //TODO fix this

  const storageData = await parsers.storage.assetRegistry.getAsset(
    +id,
    blockHeader
  );

  if (!storageData) return null;

  const erc20AssetContractDetails =
    storageData.assetType === AssetType.Erc20
      ? await parsers.storage.assetRegistry.getErc20AssetContractAddress(
          +id,
          blockHeader
        )
      : null;

  const newAsset = new Asset({
    id: `${id}`,
    name: storageData.name,
    assetType: storageData.assetType,
    existentialDeposit: storageData.existentialDeposit,
    symbol: storageData.symbol ?? null,
    decimals: storageData.decimals ?? null,
    xcmRateLimit: storageData.xcmRateLimit ?? null,
    isSufficient: storageData.isSufficient ?? true,
    evmAddress: erc20AssetContractDetails?.address ?? null,
  });

  await ctx.store.save(newAsset);

  assetsAllBatch.set(newAsset.id, newAsset);

  return newAsset;
}

export async function prefetchAllAssets(ctx: SqdProcessorContext<Store>) {
  ctx.batchState.state.assetsAllBatch = new Map(
    (await ctx.store.find(Asset, { where: {} })).map((asset) => [
      asset.id,
      asset,
    ])
  );
}

export async function ensureNativeToken(ctx: SqdProcessorContext<Store>) {
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
}

export async function assetRegistered(
  ctx: SqdProcessorContext<Store>,
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

  const erc20AssetContractDetails =
    assetType === AssetType.Erc20
      ? await parsers.storage.assetRegistry.getErc20AssetContractAddress(
          +assetId,
          eventMetadata.blockHeader
        )
      : null;

  const newAsset = new Asset({
    id: `${assetId}`,
    name: assetName,
    evmAddress: erc20AssetContractDetails?.address ?? null,
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
}

export async function assetUpdated(
  ctx: SqdProcessorContext<Store>,
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
}

export async function actualiseAssets(ctx: SqdProcessorContext<Store>) {
  if (!ctx.isHead) return;

  const latestActualisationPoint = (
    await ProcessorStatusManager.getInstance(ctx).getStatus()
  ).assetsLastUpdatedAtBlock;

  if (
    latestActualisationPoint > 0 &&
    ctx.blocks[0].header.height <
      latestActualisationPoint +
        ctx.appConfig.ASSETS_ACTUALISATION_BLOCKS_PERIOD
  )
    return;

  let storageData: AssetDetailsWithId[] = [];

  const allExistingAssets = new Map(
    (await ctx.store.find(Asset)).map((asset) => [asset.id, asset])
  );

  const assetsToSave: Asset[] = [];

  if (latestActualisationPoint < 0) {
    /**
     * This case can happen only once in indexer life on first run and make sense
     * if indexing is starting not from genesis block. Main goal - ensure that
     * on launch time indexer contains all existing assets on start block.
     */
    storageData = await parsers.storage.assetRegistry.getAssetAll(
      ctx.blocks[0].header
    );

    for (const { assetId, data } of storageData) {
      if (!data) continue;

      const erc20AssetContractDetails =
        data.assetType === AssetType.Erc20
          ? await parsers.storage.assetRegistry.getErc20AssetContractAddress(
              +assetId,
              ctx.blocks[0].header
            )
          : null;

      const newAsset = new Asset({
        id: `${assetId}`,
        name: data.name,
        assetType: data.assetType,
        existentialDeposit: data.existentialDeposit,
        symbol: data.symbol ?? null,
        decimals: data.decimals ?? null,
        xcmRateLimit: data.xcmRateLimit ?? null,
        isSufficient: data.isSufficient ?? true,
        evmAddress: erc20AssetContractDetails?.address ?? null,
      });

      assetsToSave.push(newAsset);
    }

    ctx.batchState.state.assetsAllBatch = new Map(
      assetsToSave.map((asset) => [asset.id, asset])
    );
  } else {
    if (allExistingAssets.size === 0) return;
    storageData = await parsers.storage.assetRegistry.getAssetMany(
      [...allExistingAssets.keys()],
      ctx.blocks[0].header
    );

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
      if (existentialDeposit)
        assetEntity.existentialDeposit = existentialDeposit;
      if (symbol) assetEntity.symbol = symbol;
      if (decimals) assetEntity.decimals = decimals;
      if (xcmRateLimit) assetEntity.xcmRateLimit = xcmRateLimit;
      if (isSufficient) assetEntity.isSufficient = isSufficient;
      assetsToSave.push(assetEntity);
      allExistingAssets.set(assetEntity.id, assetEntity);
      ctx.batchState.state.assetsAllBatch.set(assetEntity.id, assetEntity);
    }
  }

  await ctx.store.upsert(assetsToSave);

  await ProcessorStatusManager.getInstance(ctx).updateProcessorStatus({
    assetsLastUpdatedAtBlock: ctx.blocks[0].header.height,
  });
}

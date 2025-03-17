import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  AssetRegistryLocationSetData,
  AssetRegistryRegisteredData,
  AssetRegistryUpdatedData,
} from '../../parsers/batchBlocksParser/types';
import { getAssetEvmAddressByType } from './utils';
import { Asset, AssetType, ResourceType } from '../../model';
import { getOrCreateAsset } from './asset';
import { getErc20AssetContractFromLocation } from '../../parsers/chains/hydration/utils';

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

  const erc20AssetContractAddress = await getAssetEvmAddressByType({
    assetId,
    assetType: assetType,
    ctx,
  });

  const newAsset = new Asset({
    id: `${assetId}`,
    name: assetName,
    synthetic: false,
    active: true,
    evmAddress: erc20AssetContractAddress,
    resourceType: ResourceType.Underlying,
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

  const asset = await getOrCreateAsset({
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

export async function assetLocationSet(
  ctx: SqdProcessorContext<Store>,
  eventCallData: AssetRegistryLocationSetData
) {
  const {
    eventData: {
      params: { assetId, location },
      metadata: eventMetadata,
    },
  } = eventCallData;

  const asset = await getOrCreateAsset({
    ctx,
    id: assetId,
    ensure: true,
    blockHeader: eventMetadata.blockHeader,
  });

  if (!asset) return;

  if (asset.assetType !== AssetType.Erc20) return;

  asset.evmAddress = getErc20AssetContractFromLocation(location)?.address;

  const state = ctx.batchState.state;
  state.assetsAllBatch.set(asset.id, asset);
  state.assetIdsToSave.add(asset.id);
}

import { SqdBlock, SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  AssetRegistryRegisteredData,
  AssetRegistryUpdatedData,
} from '../../parsers/batchBlocksParser/types';
import { Asset, AssetType, ResourceType } from '../../model';
import parsers from '../../parsers';
import { ProcessorStatusManager } from '../../processorStatusManager';
import { AssetDetailsWithId } from '../../parsers/types/storage';
import { EvmUtils } from '../../utils/evm';
import { getAssetEvmAddressByType, getAssetIdFromEvmAddress } from './utils';
import { MoneyMarketContractsManager } from '../../utils/evmTools/moneyMarketContractsManager';

export async function getOrCreateAsset({
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
      (a) => a.evmAddress === evmAddress && a.active
    );
  }

  if (asset) return asset;

  asset = await ctx.store.findOne(Asset, {
    where: {
      ...(id ? { id: `${id}` } : {}),
      ...(evmAddress ? { evmAddress: evmAddress, active: true } : {}),
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

  const erc20AssetContractAddress = await getAssetEvmAddressByType({
    assetId: +id,
    assetType: storageData.assetType,
    ctx,
  });

  const newAsset = new Asset({
    id: `${id}`,
    synthetic: false,
    active: true,
    name: storageData.name,
    assetType: storageData.assetType,
    resourceType: ResourceType.Underlying,
    existentialDeposit: storageData.existentialDeposit,
    symbol: storageData.symbol ?? null,
    decimals: storageData.decimals ?? null,
    xcmRateLimit: storageData.xcmRateLimit ?? null,
    isSufficient: storageData.isSufficient ?? true,
    evmAddress: erc20AssetContractAddress,
  });

  await ctx.store.save(newAsset);

  assetsAllBatch.set(newAsset.id, newAsset);

  return newAsset;
}

export async function getOrCreateMoneyMarketAsset({
  ctx,
  id,
  evmAddress,
  ensure = false,
  resourceType = ResourceType.Underlying,
}: {
  ctx: SqdProcessorContext<Store>;
  id?: string | number;
  evmAddress?: string;
  ensure?: boolean;
  resourceType?: ResourceType;
}): Promise<Asset | null> {
  if (id === undefined && !evmAddress) return null;

  const assetsAllBatch = ctx.batchState.state.assetsAllBatch;

  let asset = null;

  if (id !== undefined) {
    asset = assetsAllBatch.get(`${id}`);
  } else if (evmAddress) {
    asset = [...assetsAllBatch.values()].find(
      (a) => a.evmAddress === evmAddress && a.active
    );
  }

  if (asset) return asset;

  asset = await ctx.store.findOne(Asset, {
    where: {
      ...(id ? { id: `${id}` } : {}),
      ...(evmAddress ? { evmAddress: evmAddress, active: true } : {}),
    },
  });

  if (asset) {
    ctx.batchState.state.assetsAllBatch.set(asset.id, asset);
    return asset;
  }

  if (!asset && !ensure) return null;

  /**
   * Following logic below is implemented and will be used only if indexer
   * has been started not from genesis block and some assets have not been
   * pre-created before indexing start point.
   */

  if (!evmAddress) return null; //TODO fix this

  const contractData =
    await MoneyMarketContractsManager.getInstance().getTokenDetails(evmAddress);

  console.log(contractData);

  if (!contractData) return null;

  const mmAssetSyntheticId = getAssetIdFromEvmAddress(evmAddress);

  const newAsset = new Asset({
    id: `${mmAssetSyntheticId}`,
    synthetic: true,
    active: true,
    name: contractData.name,
    assetType: AssetType.Erc20,
    resourceType,
    existentialDeposit: 0n,
    symbol: contractData.symbol ?? null,
    decimals: contractData.decimals ?? null,
    xcmRateLimit: null,
    isSufficient: true,
    evmAddress: contractData.address,
  });

  await ctx.store.save(newAsset);

  assetsAllBatch.set(newAsset.id, newAsset);

  return newAsset;
}

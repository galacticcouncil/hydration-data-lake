import { SqdBlock, SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { Asset, AssetType, ResourceType } from '../../model';
import parsers from '../../parsers';
import {
  getAssetEvmAddressByType,
  getAssetIdFromMultiLocation,
  getNewAssetMultiLocation,
} from './utils';
import { MoneyMarketContractsManager } from '../../utils/evmTools/moneyMarketContractsManager';

export async function getOrCreateAsset({
  id,
  assetRegistryId,
  evmAddress,
  ensure = false,
  blockHeader,
  ctx,
}: {
  id?: string;
  assetRegistryId?: number | string;
  evmAddress?: string;
  ensure?: boolean;
  blockHeader?: SqdBlock;
  ctx: SqdProcessorContext<Store>;
}): Promise<Asset | null> {
  if (id === undefined && !evmAddress && assetRegistryId === undefined)
    return null;

  const assetsAllBatch = ctx.batchState.state.assetsAllBatch;

  let asset = null;

  if (id !== undefined) {
    asset = assetsAllBatch.get(`${id}`);
  } else if (evmAddress) {
    asset = [...assetsAllBatch.values()].find(
      (a) => a.evmAddress === evmAddress
    );
  } else if (assetRegistryId !== undefined) {
    asset = [...assetsAllBatch.values()].find(
      (a) => `${a.assetRegistryId}` === `${assetRegistryId}`
    );
  }

  if (asset) {
    return asset;
  }

  asset = await ctx.store.findOne(Asset, {
    // @ts-ignore
    where: {
      ...(id ? { id: `${id}` } : {}),
      ...(evmAddress ? { evmAddress } : {}),
      ...(assetRegistryId ? { assetRegistryId: `${assetRegistryId}` } : {}),
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

  if (!blockHeader || assetRegistryId === undefined) return null; //TODO fix this

  const storageData = await parsers.storage.assetRegistry.getAsset(
    +assetRegistryId,
    blockHeader
  );

  if (!storageData) return null;

  const erc20AssetContractAddress = await getAssetEvmAddressByType({
    assetId: +assetRegistryId,
    assetType: storageData.assetType,
    ctx,
  });

  const assetCustomLocation = getNewAssetMultiLocation({
    assetRegistryId,
    evmAddress: evmAddress ?? erc20AssetContractAddress,
    assetType: storageData.assetType,
  });

  if (!assetCustomLocation) return null;

  let bondUnderlyingAsset = null;
  let bondMaturity = null;

  if (storageData.assetType === AssetType.Bond) {
    const bondDetails = await parsers.storage.bonds.getBond({
      bondId: +assetRegistryId,
      block: blockHeader,
    });
    if (bondDetails) {
      bondUnderlyingAsset = await getOrCreateAsset({
        assetRegistryId: bondDetails.underlyingAsset,
        ctx,
        ensure: true,
        blockHeader,
      });
      bondMaturity = bondDetails.maturity;
    }
  }

  const assetEntityId = getAssetIdFromMultiLocation(assetCustomLocation);

  if (!assetEntityId) return null;

  const evmTokenContractData =
    storageData.assetType === AssetType.Erc20 &&
    (evmAddress || erc20AssetContractAddress)
      ? await MoneyMarketContractsManager.getInstance().getTokenDetails(
          evmAddress ?? erc20AssetContractAddress ?? ''
        )
      : null;

  const getDecimals = () => {
    if (storageData.assetType !== AssetType.Bond)
      return storageData.decimals ?? null;
    if (bondUnderlyingAsset) return bondUnderlyingAsset.decimals ?? null;
    return null;
  };

  const getSymbol = () => {
    if (storageData.assetType !== AssetType.Bond)
      return storageData.symbol ?? null;
    if (bondUnderlyingAsset)
      return bondUnderlyingAsset.symbol
        ? `${bondUnderlyingAsset.symbol}b`
        : null;
    return null;
  };

  const newAsset = new Asset({
    id: assetEntityId,
    evmAddress: erc20AssetContractAddress,
    assetRegistryId: `${assetRegistryId}`,
    multiLocationIds: [assetEntityId],
    multiLocationsMetadata: [assetCustomLocation],

    name: storageData.name,
    assetType: storageData.assetType,
    resourceType: evmTokenContractData
      ? evmTokenContractData.resourceType
      : ResourceType.Underlying,
    existentialDeposit: storageData.existentialDeposit,
    symbol: getSymbol(),
    decimals: getDecimals(),
    xcmRateLimit: storageData.xcmRateLimit ?? null,
    isSufficient: storageData.isSufficient ?? true,
    bondUnderlyingAsset,
    bondMaturity,
  });

  await ctx.store.save(newAsset);

  ctx.batchState.state.assetsAllBatch.set(newAsset.id, newAsset);

  return newAsset;
}

export async function getOrCreateMoneyMarketAsset({
  id,
  assetRegistryId,
  evmAddress,
  ensure = false,
  resourceType,
  processUnderlyingAsset = true,
  ctx,
}: {
  id?: string;
  assetRegistryId?: number | string;
  evmAddress?: string;
  ensure?: boolean;
  resourceType?: ResourceType;
  processUnderlyingAsset?: boolean;
  ctx: SqdProcessorContext<Store>;
}): Promise<Asset | null> {
  if (id === undefined && assetRegistryId === undefined && !evmAddress)
    return null;

  const assetsAllBatch = ctx.batchState.state.assetsAllBatch;

  let asset = null;

  if (id !== undefined) {
    asset = assetsAllBatch.get(`${id}`);
  } else if (evmAddress) {
    asset = [...assetsAllBatch.values()].find(
      (a) => a.evmAddress === evmAddress
    );
  } else if (assetRegistryId) {
    asset = [...assetsAllBatch.values()].find(
      (a) => `${a.assetRegistryId}` === `${assetRegistryId}`
    );
  }

  if (asset) return asset;

  asset = await ctx.store.findOne(Asset, {
    // @ts-ignore
    where: {
      ...(id ? { id: `${id}` } : {}),
      ...(evmAddress ? { evmAddress } : {}),
      ...(assetRegistryId ? { assetRegistryId } : {}),
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

  if (!contractData) return null;

  const assetCustomLocation = getNewAssetMultiLocation({
    evmAddress,
    assetType: AssetType.Erc20,
  });

  if (!assetCustomLocation) return null;

  const assetEntityId = getAssetIdFromMultiLocation(assetCustomLocation);

  if (!assetEntityId) return null;

  const underlyingAsset =
    processUnderlyingAsset && contractData.underlyingAssetAddress
      ? await getOrCreateAsset({
          ctx,
          evmAddress: contractData.underlyingAssetAddress.toLowerCase(),
          ensure: false,
        })
      : null;

  const newAsset = new Asset({
    id: assetEntityId,
    evmAddress: contractData.address,
    multiLocationIds: [assetEntityId],
    multiLocationsMetadata: [assetCustomLocation],
    name: contractData.name,
    assetType: AssetType.Erc20,
    resourceType: resourceType ?? contractData.resourceType,
    existentialDeposit: 0n,
    symbol: contractData.symbol ?? null,
    decimals: contractData.decimals ?? null,
    xcmRateLimit: null,
    isSufficient: true,
    underlyingAsset,
  });

  await ctx.store.save(newAsset);

  if (underlyingAsset) {
    if (contractData.resourceType === ResourceType.Collateral) {
      underlyingAsset.aToken = newAsset;
    } else if (contractData.resourceType === ResourceType.Debt) {
      underlyingAsset.variableDebtToken = newAsset;
    }
    assetsAllBatch.set(underlyingAsset.id, underlyingAsset);
    await ctx.store.upsert(underlyingAsset);
  }

  ctx.batchState.state.assetsAllBatch.set(newAsset.id, newAsset);

  return newAsset;
}

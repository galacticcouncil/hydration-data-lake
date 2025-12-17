import { SqdBlock, SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { Asset, AssetType, ResourceType } from '../../model';
import parsers from '../../parsers';
import {
  getAssetEvmAddressByType,
  getAssetIdFromCustomMultiLocation,
  getNewAssetMultiLocationFromStorageData,
  getNewCustomAssetMultiLocation,
} from './utils';
import { MoneyMarketContractsManager } from '../../utils/evmTools/moneyMarketContractsManager';
import { FindOptionsRelations } from 'typeorm';
import { AssetHubManager } from '../../utils/assetHubManager';
import { boolean } from '../../model/generated/marshal';

export async function getOrCreateAsset({
  id,
  assetRegistryId,
  evmAddress,
  ensure = false,
  blockHeader,
  relations,
  ctx,
}: {
  id?: string;
  assetRegistryId?: number | string;
  evmAddress?: string;
  ensure?: boolean;
  blockHeader?: SqdBlock;
  relations?: FindOptionsRelations<Asset>;
  ctx: SqdProcessorContext<Store>;
}): Promise<Asset | null> {
  if (id === undefined && !evmAddress && assetRegistryId === undefined)
    return null;

  const assetsAllBatch = ctx.batchState.state.assetsAll;

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

  asset = await ctx.storeUtils.findOneWithLogs(
    Asset,
    {
      // @ts-ignore
      where: {
        ...(id ? { id: `${id}` } : {}),
        ...(evmAddress ? { evmAddress } : {}),
        ...(assetRegistryId ? { assetRegistryId: `${assetRegistryId}` } : {}),
      },
      ...(relations ? { relations } : {}),
    },
    { className: 'Asset' }
  );

  if (asset) {
    ctx.batchState.state.assetsAll.set(asset.id, asset);
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

  const assetCustomLocation = getNewCustomAssetMultiLocation({
    assetRegistryId,
    evmAddress: evmAddress ?? erc20AssetContractAddress,
    assetType: storageData.assetType,
  });

  if (!assetCustomLocation) return null;

  const assetMultiLocationFromStorage =
    await getNewAssetMultiLocationFromStorageData({
      assetRegistryId,
      blockHeader,
    });

  let externalAssetMetadata = null;

  if (
    assetMultiLocationFromStorage &&
    storageData.assetType === AssetType.External
  ) {
    externalAssetMetadata =
      await AssetHubManager.getInstance().getExternalAssetDataFromAssetHub({
        assetMultilocation: assetMultiLocationFromStorage,
        forceRefetch: true,
      });
  }

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

  const assetEntityId = getAssetIdFromCustomMultiLocation(assetCustomLocation);

  if (!assetEntityId) return null;

  const evmTokenContractData =
    storageData.assetType === AssetType.Erc20 &&
    (evmAddress || erc20AssetContractAddress)
      ? await MoneyMarketContractsManager.getInstance().getResourceDetailsWithLogs(
          evmAddress ?? erc20AssetContractAddress ?? ''
        )
      : null;

  const getDecimals = () => {
    if (storageData.assetType === AssetType.External)
      return externalAssetMetadata?.decimals ?? storageData.decimals ?? null;

    if (storageData.assetType !== AssetType.Bond)
      return storageData.decimals ?? null;

    if (bondUnderlyingAsset) return bondUnderlyingAsset.decimals ?? null;

    return null;
  };

  const getSymbol = () => {
    if (storageData.assetType === AssetType.External)
      return externalAssetMetadata?.symbol ?? storageData.symbol ?? null;

    if (storageData.assetType !== AssetType.Bond)
      return storageData.symbol ?? null;

    if (bondUnderlyingAsset)
      return bondUnderlyingAsset.symbol
        ? `${bondUnderlyingAsset.symbol}b`
        : null;

    return null;
  };

  const getName = () => {
    if (storageData.assetType === AssetType.External)
      return externalAssetMetadata?.name ?? storageData.name ?? null;
    return storageData.name ?? null;
  };

  const newAsset = new Asset({
    id: assetEntityId,
    evmAddress: erc20AssetContractAddress,
    assetRegistryId: `${assetRegistryId}`,
    multiLocationIds: [assetEntityId],

    multiLocationsMetadata: [assetCustomLocation],
    multiLocations: assetMultiLocationFromStorage
      ? [assetMultiLocationFromStorage]
      : [],

    name: getName(),
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

  ctx.batchState.state.assetsAll.set(newAsset.id, newAsset);

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

  const assetsAllBatch = ctx.batchState.state.assetsAll;

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

  asset = await ctx.storeUtils.findOneWithLogs(
    Asset,
    {
      // @ts-ignore
      where: {
        ...(id ? { id: `${id}` } : {}),
        ...(evmAddress ? { evmAddress } : {}),
        ...(assetRegistryId ? { assetRegistryId } : {}),
      },
    },
    { className: 'Asset' }
  );

  if (asset) {
    ctx.batchState.state.assetsAll.set(asset.id, asset);
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
    await MoneyMarketContractsManager.getInstance().getResourceDetailsWithLogs(
      evmAddress
    );

  if (!contractData) return null;

  const assetCustomLocation = getNewCustomAssetMultiLocation({
    evmAddress,
    assetType: AssetType.Erc20,
  });

  if (!assetCustomLocation) return null;

  const assetEntityId = getAssetIdFromCustomMultiLocation(assetCustomLocation);

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
    multiLocations: [],
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

  ctx.batchState.state.assetsAll.set(newAsset.id, newAsset);

  return newAsset;
}

export async function getAllDebtAssets(
  ctx: SqdProcessorContext<Store>,
  ensureFromDb: boolean = false
) {
  const assetsAllBatch = ctx.batchState.state.assetsAll;
  const debtAssets = [...assetsAllBatch.values()].filter(
    (a) => a.resourceType === ResourceType.Debt
  );
  return debtAssets;
}

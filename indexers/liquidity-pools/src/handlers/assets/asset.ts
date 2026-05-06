import { FindOptionsRelations, In } from 'typeorm';

import { Store } from '@subsquid/typeorm-store';

import { Asset, AssetType, AssetResourceType } from '../../model';
import parsers from '../../parsers';
import { SqdBlock, SqdProcessorContext } from '../../processor';
import { AssetHubManager } from '../../utils/assetHubManager';
import { AaveMoneyMarketManager } from '../../utils/evmTools/aave/aaveMoneyMarketManager';
import {
  getAssetEvmAddressByType,
  getAssetIdFromCustomMultiLocation,
  getNewAssetMultiLocationFromStorageData,
  getNewCustomAssetMultiLocation,
} from './utils';
import { AaveMoneyMarketsRegistry } from '../../utils/evmTools/aave/aaveMoneyMarketsRegistry/aaveMoneyMarketsRegistry';

/**
 * Batch fetch or create multiple assets in a SINGLE database query.
 * This is 5-10x faster than using Promise.all() with individual getOrCreateAsset() calls.
 *
 * IMPORTANT: result map has keys as assetId but not assetRegistryId or EVM address.
 *
 * @param ids - Array of asset IDs to fetch
 * @param assetRegistryIds - Array of asset registry IDs to fetch
 * @param evmAddresses - Array of EVM addresses to fetch
 * @param ensure - If true, create missing assets (falls back to individual creation)
 * @param blockHeader - Required if ensure is true
 * @param relations - TypeORM relations to load
 * @param ctx - Processor context
 * @returns Map<assetId, Asset> for O(1) lookups
 *
 * @example
 * // Instead of:
 * await Promise.all(ids.map(id => getOrCreateAsset({ ctx, id })));
 *
 * // Use:
 * const assets = await batchGetOrCreateAssets({ ctx, ids });
 * const asset = assets.get(assetId); // O(1) lookup
 */
export async function batchGetOrCreateAssets({
  ids,
  assetRegistryIds,
  evmAddresses,
  ensure = false,
  blockHeader,
  relations,
  ctx,
}: {
  ids?: string[];
  assetRegistryIds?: (number | string)[];
  evmAddresses?: string[];
  ensure?: boolean;
  blockHeader?: SqdBlock;
  relations?: FindOptionsRelations<Asset>;
  ctx: SqdProcessorContext<Store>;
}): Promise<Map<string, Asset>> {
  const assetCache = new Map<string, Asset>();

  // Early exit if no IDs provided
  if (!ids?.length && !assetRegistryIds?.length && !evmAddresses?.length) {
    return assetCache;
  }

  const assetsAllBatch = ctx.batchState.state.assetsAll;

  // Step 1: Check batch state cache first (in-memory, instant)
  const missingIds: string[] = [];
  const missingRegistryIds: string[] = [];
  const missingEvmAddresses: string[] = [];
  const idsToLookup = new Set<string>();

  // Check IDs in cache
  if (ids) {
    for (const id of ids) {
      if (!id) continue;
      const cached = assetsAllBatch.get(`${id}`);
      if (cached) {
        assetCache.set(cached.id, cached);
      } else {
        missingIds.push(`${id}`);
        idsToLookup.add(`${id}`);
      }
    }
  }

  // Check registry IDs in cache
  if (assetRegistryIds) {
    for (const registryId of assetRegistryIds) {
      if (registryId === undefined || registryId === null) continue;
      const found = [...assetsAllBatch.values()].find(
        (a) => `${a.assetRegistryId}` === `${registryId}`
      );
      if (found) {
        assetCache.set(found.id, found);
      } else {
        missingRegistryIds.push(`${registryId}`);
      }
    }
  }

  // Check EVM addresses in cache
  if (evmAddresses) {
    for (const evmAddress of evmAddresses) {
      if (!evmAddress) continue;
      const found = [...assetsAllBatch.values()].find(
        (a) => a.evmAddress === evmAddress
      );
      if (found) {
        assetCache.set(found.id, found);
      } else {
        missingEvmAddresses.push(evmAddress);
      }
    }
  }

  // Step 2: Single batch query for ALL missing assets using IN operator
  if (
    missingIds.length > 0 ||
    missingRegistryIds.length > 0 ||
    missingEvmAddresses.length > 0
  ) {
    const whereConditions: any[] = [];

    if (missingIds.length > 0) {
      whereConditions.push({ id: In(missingIds) });
    }
    if (missingRegistryIds.length > 0) {
      whereConditions.push({ assetRegistryId: In(missingRegistryIds) });
    }
    if (missingEvmAddresses.length > 0) {
      whereConditions.push({ evmAddress: In(missingEvmAddresses) });
    }

    try {
      // SINGLE database query fetches ALL assets at once!
      const foundAssets = await ctx.storeUtils.findWithLogs(
        Asset,
        {
          where:
            whereConditions.length === 1 ? whereConditions[0] : whereConditions, // TypeORM automatically ORs array elements
          ...(relations ? { relations } : {}),
        },
        { className: 'Asset', originCallFn: 'batchGetOrCreateAssets' }
      );

      // Add found assets to both caches
      for (const asset of foundAssets) {
        assetCache.set(asset.id, asset);
        assetsAllBatch.set(asset.id, asset);
      }
    } catch (error) {
      console.error('batchGetOrCreateAssets :: Error fetching assets:', error);
    }
  }

  // Step 3: Handle 'ensure' mode for still-missing assets
  if (ensure && blockHeader) {
    // For assets still not found after batch query, try creating them
    const stillMissingIds = missingIds.filter((id) => !assetCache.has(id));
    const stillMissingRegistryIds = missingRegistryIds.filter(
      (regId) =>
        ![...assetCache.values()].some((a) => a.assetRegistryId === regId)
    );

    // Fall back to individual getOrCreateAsset for asset creation
    // (Creating assets requires complex blockchain queries that can't be easily batched)
    for (const id of stillMissingIds) {
      try {
        const asset = await getOrCreateAsset({
          ctx,
          id,
          ensure: true,
          blockHeader,
          relations,
        });
        if (asset) {
          assetCache.set(asset.id, asset);
        }
      } catch (error) {
        console.error(
          `batchGetOrCreateAssets :: Error creating asset ${id}:`,
          error
        );
      }
    }

    for (const registryId of stillMissingRegistryIds) {
      try {
        const asset = await getOrCreateAsset({
          ctx,
          assetRegistryId: registryId,
          ensure: true,
          blockHeader,
          relations,
        });
        if (asset) {
          assetCache.set(asset.id, asset);
        }
      } catch (error) {
        console.error(
          `batchGetOrCreateAssets :: Error creating asset with registryId ${registryId}:`,
          error
        );
      }
    }
  }

  return assetCache;
}

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
    { className: 'Asset', originCallFn: 'getOrCreateAsset' }
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

  if (!blockHeader || !assetRegistryId) {
    console.log(
      `getOrCreateAsset :: Missing blockHeader or assetRegistryId for asset creation.`
    );
    return null;
  } //TODO fix this
  if (+assetRegistryId > Number.MAX_SAFE_INTEGER) {
    console.log(
      `getOrCreateAsset :: assetRegistryId ${assetRegistryId} is too large to process. Skipping...`
    );
    return null;
  }
  const storageData = await parsers.storage.assetRegistry.getAsset(
    +assetRegistryId,
    blockHeader
  );

  if (!storageData) {
    console.log(
      `getOrCreateAsset :: No storage data found for assetRegistryId ${assetRegistryId} at block ${blockHeader.height}`
    );
    return null;
  }

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

  if (!assetCustomLocation) {
    console.log(
      `getOrCreateAsset :: No assetCustomLocation found for assetRegistryId ${assetRegistryId} at block ${blockHeader.height}`
    );
    return null;
  }

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

  if (!assetEntityId) {
    console.log(
      `getOrCreateAsset :: No assetEntityId found for assetRegistryId ${assetRegistryId} at block ${blockHeader.height}`
    );
    return null;
  }

  const evmTokenContractData =
    storageData.assetType === AssetType.Erc20 &&
    (evmAddress || erc20AssetContractAddress)
      ? await AaveMoneyMarketsRegistry.getInstance().getReserveDetailsWithLogs(
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
      : AssetResourceType.Underlying,
    existentialDeposit: storageData.existentialDeposit,
    symbol: getSymbol(),
    decimals: getDecimals(),
    xcmRateLimit: storageData.xcmRateLimit ?? null,
    isSufficient: storageData.isSufficient ?? true,
    bondUnderlyingAssetId: bondUnderlyingAsset?.id ?? null,
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
  resourceType?: AssetResourceType;
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
    { className: 'Asset', originCallFn: 'getOrCreateMoneyMarketAsset' }
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
    await AaveMoneyMarketsRegistry.getInstance().getReserveDetailsWithLogs(
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
    underlyingAssetId: underlyingAsset?.id ?? null,
  });

  await ctx.store.save(newAsset);

  if (underlyingAsset) {
    if (contractData.resourceType === AssetResourceType.aToken) {
      underlyingAsset.aTokenId = newAsset.id;
    } else if (contractData.resourceType === AssetResourceType.Debt) {
      underlyingAsset.variableDebtTokenId = newAsset.id;
    }
    assetsAllBatch.set(underlyingAsset.id, underlyingAsset);
    await ctx.store.upsert(underlyingAsset);
  }

  ctx.batchState.state.assetsAll.set(newAsset.id, newAsset);

  return newAsset;
}

export async function getAllMoneyMarketAssets(
  ctx: SqdProcessorContext<Store>,
  ensureFromDb: boolean = false
) {
  const assetsAllBatch = ctx.batchState.state.assetsAll;
  const debtAssets = [...assetsAllBatch.values()].filter(
    (a) =>
      a.resourceType === AssetResourceType.aToken ||
      a.resourceType === AssetResourceType.Debt
  );
  return debtAssets;
}

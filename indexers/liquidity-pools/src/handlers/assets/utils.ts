import pMap from 'p-map';

import { Store } from '@subsquid/typeorm-store';

import {
  Asset,
  AssetMultiLocation,
  AssetMultiLocationsInterior,
  AssetMultiLocationsInteriorKind,
  AssetType,
  AssetResourceType,
} from '../../model';
import parsers from '../../parsers';
import { AssetRegistryLocationSetData } from '../../parsers/batchBlocksParser/types';
import { getErc20AssetContractFromLocation } from '../../parsers/chains/hydration/utils';
import {
  AssetLocationJunction,
  AssetRegistryAssetLocation,
} from '../../parsers/types/events';
import { AssetDetailsWithId, BondDetails } from '../../parsers/types/storage';
import { SqdBlock, SqdProcessorContext } from '../../processor';
import { ProcessorStatusManager } from '../../processorStatusManager';
import { AssetHubManager } from '../../utils/assetHubManager';
import { EvmUtils } from '../../utils/evm';
import { AaveMoneyMarketManager } from '../../utils/evmTools/aave/aaveMoneyMarketManager';
import { anyToStringAllKeys } from '../../utils/helpers';
import { getOrCreateAsset, getOrCreateMoneyMarketAsset } from './asset';
import { AaveMoneyMarketsRegistry } from '../../utils/evmTools/aave/aaveMoneyMarketsRegistry/aaveMoneyMarketsRegistry';

export async function prefetchAllAssets(ctx: SqdProcessorContext<Store>) {
  ctx.batchState.state.assetsAll = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        Asset,
        {
          where: {},
          relations: {},
        },
        { className: 'Asset' }
      )
    ).map((asset) => [asset.id, asset])
  );
}

export async function ensureNativeToken(ctx: SqdProcessorContext<Store>) {
  let nativeToken = await getOrCreateAsset({ ctx, assetRegistryId: 0 });
  if (nativeToken) return;

  const multiLocation = getNewCustomAssetMultiLocation({
    assetRegistryId: 0,
    assetType: AssetType.Token,
  });

  nativeToken = new Asset({
    id: '0',
    assetRegistryId: '0',
    multiLocationsMetadata: multiLocation ? [multiLocation] : null,
    multiLocationIds: ['0'],
    name: 'Hydration',
    assetType: AssetType.Token,
    resourceType: AssetResourceType.Underlying,
    decimals: 12,
    existentialDeposit: BigInt('1000000000000'),
    symbol: 'HDX',
    xcmRateLimit: null,
    isSufficient: true,
  });

  await ctx.store.upsert(nativeToken);
  const assetsAllBatch = ctx.batchState.state.assetsAll;
  assetsAllBatch.set(nativeToken.id, nativeToken);
}

/**
 * "draftMultiLocationsData" argument is useful in case there 2 events in the
 * same block - AssetRegistry.Registered and AssetRegistry.LocationSet. So this
 * argument provides still not processed data about location. This trick is
 * useful for processing Erc20 assets, when AssetRegistry.LocationSet event is
 * emitter before AssetRegistry.Registered in the same block.
 * As an improvement, we can read the latest state of storage during processing
 * past blocks (on indexer reindexing phase), so this will allow as to get asset's
 * multi-location more certainly.
 */
export async function getAssetEvmAddressByType({
  assetId,
  assetType,
  draftMultiLocationsData,
  ctx,
}: {
  assetId: number;
  assetType: AssetType;
  draftMultiLocationsData?: AssetRegistryLocationSetData[];
  ctx: SqdProcessorContext<Store>;
}) {
  if (Number.isNaN(assetId)) return null;

  switch (assetType) {
    case AssetType.Erc20: {
      const assetLocationSetEvent =
        draftMultiLocationsData && draftMultiLocationsData.length > 0
          ? draftMultiLocationsData.find(
              (event) => event.eventData.params.assetId === assetId
            )
          : undefined;

      if (assetLocationSetEvent) {
        return (
          getErc20AssetContractFromLocation(
            assetLocationSetEvent.eventData.params.location
          )?.address ?? null
        );
      } else {
        return (
          (
            await parsers.storage.assetRegistry.getErc20AssetContractAddress(
              +assetId,
              ctx.blocks[0].header
            )
          )?.address ?? null
        );
      }
    }
    default:
      return EvmUtils.convertAssetIdToH160Address(assetId);
  }
}

export function getAssetIdFromEvmAddress(address: string) {
  const partialHash = address.slice(-8);
  return parseInt(partialHash, 16);
}

export async function actualiseAssets(ctx: SqdProcessorContext<Store>) {
  const latestActualisationPoint = (
    await ProcessorStatusManager.getInstance(ctx).getStatus()
  ).assetsLastUpdatedAtBlock;

  if (latestActualisationPoint > 0 && !ctx.isHead) return;

  if (
    latestActualisationPoint > 0 &&
    ctx.blocks[0].header.height <
      latestActualisationPoint +
        ctx.appConfig.ASSETS_ACTUALISATION_BLOCKS_PERIOD
  )
    return;

  let storageData: AssetDetailsWithId[] = [];
  let bondsStorageData: BondDetails[] = [];

  const allExistingAssets = new Map(
    (await ctx.storeUtils.findWithLogs(Asset, {}, { className: 'Asset' })).map(
      (asset) => [asset.id, asset]
    )
  );

  const assetsToSave: Asset[] = [];
  const mmAssetsToSave: Asset[] = [];

  const blockHeader = ctx.blocks[ctx.blocks.length - 1].header;

  if (latestActualisationPoint < 0) {
    /**
     * This case can happen only once in indexer life on first run and make sense
     * if indexing is starting not from genesis block. Main goal - ensure that
     * on launch time indexer contains all existing assets on start block.
     */
    storageData = await parsers.storage.assetRegistry.getAssetAll(blockHeader);
    bondsStorageData = await parsers.storage.bonds.getBondsAll({
      block: blockHeader,
    });
    const allAssetsStorageMultiLocationsMap: Map<
      number,
      AssetRegistryAssetLocation | null
    > = new Map(
      (
        (await parsers.storage.assetRegistry.getAssetLocationsMany({
          assetIds: storageData.map((a) => a.assetId),
          block: blockHeader,
        })) || []
      ).map((assetData) => [assetData.assetId, assetData.location])
    );

    await AssetHubManager.getInstance().prefetchAllAssetsMetadata();

    await pMap(
      storageData,
      async ({ assetId, data }) => {
        if (!data) {
          console.log(
            `actualiseAssets :: asset storage data not found for asset registry ID: ${assetId}`
          );
          return;
        }

        const erc20AssetContractAddress = await getAssetEvmAddressByType({
          assetId,
          assetType: data.assetType,
          ctx,
        });

        let erc20AssetContractDetails = null;

        if (data.assetType === AssetType.Erc20 && erc20AssetContractAddress) {
          // erc20AssetContractDetails =
          //   await AaveMoneyMarketManager.getInstance().getReserveDetailsWithLogs(
          //     erc20AssetContractAddress
          //   );
          erc20AssetContractDetails =
            await AaveMoneyMarketsRegistry.getInstance().getReserveDetailsWithLogs(
              erc20AssetContractAddress
            );
        }

        const assetCustomLocation = getNewCustomAssetMultiLocation({
          assetRegistryId: assetId,
          evmAddress: erc20AssetContractAddress,
          assetType: data.assetType,
        });

        if (!assetCustomLocation) {
          console.log(
            `actualiseAssets :: assetCustomLocation not found for asset registry ID: ${assetId}`
          );
          return;
        }

        const assetMultiLocationFromStorage =
          await getNewAssetMultiLocationFromStorageData({
            blockHeader,
            assetRegistryId: assetId,
            storageMultilocation:
              allAssetsStorageMultiLocationsMap.get(assetId),
          });

        let externalAssetMetadata = null;

        if (
          assetMultiLocationFromStorage &&
          data.assetType === AssetType.External
        ) {
          externalAssetMetadata =
            await AssetHubManager.getInstance().getExternalAssetDataFromAssetHub(
              {
                assetMultilocation: assetMultiLocationFromStorage,
              }
            );
        }

        const assetEntityId =
          getAssetIdFromCustomMultiLocation(assetCustomLocation);

        if (!assetEntityId) {
          console.log(
            `actualiseAssets :: assetEntityId not found for asset registry ID: ${assetId}`
          );
          return;
        }

        let bondUnderlyingAsset = null;
        let bondMaturity = null;

        if (data.assetType === AssetType.Bond) {
          const bondDetails = bondsStorageData.find(
            (bond) => `${bond.bondId}` === `${assetId}`
          );
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

        const getDecimals = () => {
          if (data.assetType === AssetType.External)
            return externalAssetMetadata?.decimals ?? data.decimals ?? null;
          if (data.assetType !== AssetType.Bond) return data.decimals ?? null;
          if (bondUnderlyingAsset) return bondUnderlyingAsset.decimals ?? null;
          return null;
        };

        const getSymbol = () => {
          if (data.assetType === AssetType.External)
            return externalAssetMetadata?.symbol ?? data.symbol ?? null;
          if (data.assetType !== AssetType.Bond) return data.symbol ?? null;
          if (bondUnderlyingAsset)
            return bondUnderlyingAsset.symbol
              ? `${bondUnderlyingAsset.symbol}b`
              : null;
          return null;
        };

        const getName = () => {
          if (data.assetType === AssetType.External)
            return externalAssetMetadata?.name ?? data.name ?? null;
          return data.name ?? null;
        };

        const newAsset = new Asset({
          id: assetEntityId,
          assetRegistryId: `${assetId}`,
          evmAddress: erc20AssetContractAddress,
          multiLocationsMetadata: [assetCustomLocation],
          multiLocations: assetMultiLocationFromStorage
            ? [assetMultiLocationFromStorage]
            : [],
          multiLocationIds: [assetEntityId],

          name: getName(),
          assetType: data.assetType,
          resourceType:
            erc20AssetContractDetails?.resourceType ??
            AssetResourceType.Underlying,
          existentialDeposit: data.existentialDeposit,
          symbol: getSymbol(),
          decimals: getDecimals(),
          xcmRateLimit: data.xcmRateLimit ?? null,
          isSufficient: data.isSufficient ?? true,
          bondUnderlyingAssetId: bondUnderlyingAsset?.id ?? null,
          bondMaturity,
        });

        assetsToSave.push(newAsset);
        ctx.batchState.state.assetsAll.set(newAsset.id, newAsset);
      },
      { concurrency: 500 }
    );

    /**
     * Iterate all available MM resources and create Asset entities.
     */
    for (const mmResourceDetails of [
      // ...AaveMoneyMarketManager.getInstance().moneyMarketReservesDetailsMap.values(),
      ...AaveMoneyMarketsRegistry.getInstance().moneyMarketReservesDetailsMap.values(),
    ]) {
      const mmTokenUnderlyingAsset = assetsToSave.find(
        (assetToSave) =>
          assetToSave.evmAddress ===
          mmResourceDetails.underlyingAssetAddress.toLowerCase()
      );
      if (!mmTokenUnderlyingAsset) {
        console.log(
          `actualiseAssets :: mmTokenUnderlyingAsset not found for mmReserve with address: ${mmResourceDetails.underlyingAssetAddress.toLowerCase()}`
        );
        continue;
      }

      if (
        !assetsToSave.find(
          (assetToSave) =>
            assetToSave.evmAddress ===
            mmResourceDetails.aTokenAddress.toLowerCase()
        )
      ) {
        const aTokenEntity = await getOrCreateMoneyMarketAsset({
          ctx,
          evmAddress: mmResourceDetails.aTokenAddress.toLowerCase(),
          ensure: true,
          processUnderlyingAsset: false,
        });
        if (aTokenEntity) {
          aTokenEntity.resourceType = AssetResourceType.aToken;
          // mmTokenUnderlyingAsset.aToken = aTokenEntity;
          // aTokenEntity.underlyingAsset = mmTokenUnderlyingAsset;
          mmAssetsToSave.push(aTokenEntity);
          ctx.batchState.state.assetsAll.set(aTokenEntity.id, aTokenEntity);
        }
      }

      if (
        !assetsToSave.find(
          (assetToSave) =>
            assetToSave.evmAddress ===
            mmResourceDetails.variableDebtTokenAddress.toLowerCase()
        )
      ) {
        const variableDebtTokenEntity = await getOrCreateMoneyMarketAsset({
          ctx,
          evmAddress: mmResourceDetails.variableDebtTokenAddress.toLowerCase(),
          ensure: true,
          processUnderlyingAsset: false,
        });
        if (variableDebtTokenEntity) {
          variableDebtTokenEntity.resourceType = AssetResourceType.Debt;
          // mmTokenUnderlyingAsset.variableDebtToken = variableDebtTokenEntity;
          // variableDebtTokenEntity.underlyingAsset = mmTokenUnderlyingAsset;
          mmAssetsToSave.push(variableDebtTokenEntity);
          ctx.batchState.state.assetsAll.set(
            variableDebtTokenEntity.id,
            variableDebtTokenEntity
          );
        }
      }
    }
  } else {
    if (allExistingAssets.size === 0) return;
    storageData = await parsers.storage.assetRegistry.getAssetMany(
      [...allExistingAssets.values()]
        .filter((asset) => asset.assetRegistryId)
        .map((asset) => +asset.assetRegistryId!),
      ctx.blocks[0].header
    );

    for (const assetStorageData of storageData) {
      if (!assetStorageData.data) continue;
      const assetEntity = [...allExistingAssets.values()].find(
        (asset) => asset.assetRegistryId === `${assetStorageData.assetId}`
      );
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
      ctx.batchState.state.assetsAll.set(assetEntity.id, assetEntity);
    }
  }

  await ctx.store.upsert(assetsToSave);
  await ctx.store.upsert(mmAssetsToSave);

  /**
   * This second step is required to avoid foreign key constraints on DB upsert of Asset
   */
  if (latestActualisationPoint < 0) {
    const erc20AssetToSave: Map<string, Asset> = new Map();

    for (const erc20Asset of [
      ...ctx.batchState.state.assetsAll.values(),
    ].filter((a) => a.assetType === AssetType.Erc20 && !!a.evmAddress)) {
      // const erc20AssetContractDetails =
      //   await AaveMoneyMarketManager.getInstance().getReserveDetailsWithLogs(
      //     erc20Asset.evmAddress!
      //   );
      const erc20AssetContractDetails =
        await AaveMoneyMarketsRegistry.getInstance().getReserveDetailsWithLogs(
          erc20Asset.evmAddress!
        );
      let underlyingAsset: Asset | null = null;

      if (erc20AssetContractDetails)
        underlyingAsset = erc20AssetContractDetails.underlyingAssetAddress
          ? await getOrCreateAsset({
              ctx,
              evmAddress:
                erc20AssetContractDetails.underlyingAssetAddress.toLowerCase(),
              ensure: false,
            })
          : null;

      if (!underlyingAsset) {
        console.log(
          `actualiseAssets :: underlyingAssett not found for mmReserve with address: ${erc20AssetContractDetails?.underlyingAssetAddress?.toLowerCase()} [${erc20Asset.evmAddress}]`
        );
        continue;
      }

      erc20Asset.underlyingAssetId = underlyingAsset.id;
      if (erc20Asset.resourceType === AssetResourceType.aToken) {
        underlyingAsset.aTokenId = erc20Asset.id;
      } else if (erc20Asset.resourceType === AssetResourceType.Debt) {
        underlyingAsset.variableDebtTokenId = erc20Asset.id;
      }
      erc20AssetToSave.set(erc20Asset.id, erc20Asset);
      erc20AssetToSave.set(underlyingAsset.id, underlyingAsset);
    }

    await ctx.store.upsert([...erc20AssetToSave.values()]);
  }

  await ProcessorStatusManager.getInstance(ctx).updateProcessorStatus({
    assetsLastUpdatedAtBlock: ctx.blocks[0].header.height,
  });
}

export function getNewCustomAssetMultiLocation({
  assetRegistryId,
  evmAddress,
  assetType,
}: {
  assetRegistryId?: number | string | null;
  evmAddress?: string | null;
  assetType: AssetType;
}): AssetMultiLocation | null {
  const tpl = new AssetMultiLocation({
    parents: 0,
    hierarchyLevel: 'X1',
    interior: [],
  });

  switch (assetType) {
    case AssetType.Bond:
    case AssetType.External:
    case AssetType.Token:
    case AssetType.StableSwap:
    case AssetType.XYK:
    case AssetType.PoolShare:
      if (assetRegistryId === null || assetRegistryId === undefined)
        return null;
      tpl.interior!.push(
        new AssetMultiLocationsInterior({
          kind: AssetMultiLocationsInteriorKind.GeneralIndex,
          value: `${assetRegistryId}`,
        })
      );
      break;
    case AssetType.Erc20:
      if (!evmAddress) return null;
      tpl.interior!.push(
        new AssetMultiLocationsInterior({
          kind: AssetMultiLocationsInteriorKind.AccountKey20,
          network: null,
          key: evmAddress,
        })
      );
      break;
    default:
      return null;
  }

  return tpl;
}

export async function getNewAssetMultiLocationFromStorageData({
  assetRegistryId,
  assetType,
  storageMultilocation,
  blockHeader,
}: {
  assetRegistryId: number | string;
  assetType?: AssetType;
  storageMultilocation?: AssetRegistryAssetLocation | null;
  blockHeader: SqdBlock;
}): Promise<AssetMultiLocation | null> {
  const storageData =
    storageMultilocation ??
    (await parsers.storage.assetRegistry.getAssetLocation({
      assetId: assetRegistryId,
      block: blockHeader,
    }));

  if (!storageData) {
    return null;
  }

  const tpl = new AssetMultiLocation({
    parents: storageData.parents,
    hierarchyLevel: storageData.interior.__kind,
    interior: [],
  });

  if (storageData.interior.__kind === 'Here') return tpl;

  if (
    storageData.interior.__kind === 'X1' &&
    !Array.isArray(storageData.interior.value)
  ) {
    tpl.interior.push(
      getNewAssetMultiLocationsInterior(storageData.interior.value)
    );
    return tpl;
  }

  for (const interiorValue of storageData.interior
    .value as AssetLocationJunction[]) {
    tpl.interior.push(getNewAssetMultiLocationsInterior(interiorValue));
  }
  return tpl;
}

function getNewAssetMultiLocationsInterior(
  interiorJunctionData: AssetLocationJunction
) {
  const newInterior = new AssetMultiLocationsInterior({
    kind: interiorJunctionData.__kind as AssetMultiLocationsInteriorKind,
  });

  const interiorValueKeys = Object.keys(interiorJunctionData).filter(
    (k) => k !== '__kind'
  );
  for (const k of interiorValueKeys) {
    const valueRaw = interiorJunctionData[k];
    if (k === 'value' && typeof valueRaw === 'object') {
      newInterior.valueJson = anyToStringAllKeys(valueRaw);
    } else {
      const decoratedValue = anyToStringAllKeys(valueRaw);
      if (typeof decoratedValue === 'string') {
        newInterior[k as keyof AssetMultiLocationsInterior] =
          decoratedValue as any;
      } else {
        try {
          newInterior[k as keyof AssetMultiLocationsInterior] = JSON.stringify(
            decoratedValue
          ) as any;
        } catch (e) {
          console.log(e);
        }
      }
    }
  }

  return newInterior;
}

export function getAssetIdFromCustomMultiLocation(
  location: AssetMultiLocation
): string | null {
  if (location.hierarchyLevel !== 'X1') return null;

  const junction = location.interior[0];

  switch (junction.kind) {
    case AssetMultiLocationsInteriorKind.GeneralIndex:
      return junction.value ?? null;
    case AssetMultiLocationsInteriorKind.AccountKey20:
      return junction.key ?? null;
    default:
      return null;
  }
}

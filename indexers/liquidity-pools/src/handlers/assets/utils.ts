import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  Asset,
  AssetMultiLocation,
  AssetMultiLocationsInterior,
  AssetMultiLocationsInteriorKind,
  AssetType,
  ResourceType,
} from '../../model';
import parsers from '../../parsers';
import { EvmUtils } from '../../utils/evm';
import { getOrCreateAsset, getOrCreateMoneyMarketAsset } from './asset';
import { ProcessorStatusManager } from '../../processorStatusManager';
import { AssetDetailsWithId } from '../../parsers/types/storage';
import { MoneyMarketContractsManager } from '../../utils/evmTools/moneyMarketContractsManager';
import { isU32 } from '../../utils/helpers';
import { AssetRegistryLocationSetData } from '../../parsers/batchBlocksParser/types';
import { getErc20AssetContractFromLocation } from '../../parsers/chains/hydration/utils';

export async function prefetchAllAssets(ctx: SqdProcessorContext<Store>) {
  ctx.batchState.state.assetsAllBatch = new Map(
    (await ctx.store.find(Asset, { where: {} })).map((asset) => [
      asset.id,
      asset,
    ])
  );
}

export async function ensureNativeToken(ctx: SqdProcessorContext<Store>) {
  let nativeToken = await getOrCreateAsset({ ctx, assetRegistryId: 0 });
  if (nativeToken) return;

  const multiLocation = getNewAssetMultiLocation({
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
    resourceType: ResourceType.Underlying,
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

  const allExistingAssets = new Map(
    (await ctx.store.find(Asset)).map((asset) => [asset.id, asset])
  );

  const assetsToSave: Asset[] = [];
  const mmAssetsToSave: Asset[] = [];

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

      const erc20AssetContractAddress = await getAssetEvmAddressByType({
        assetId,
        assetType: data.assetType,
        ctx,
      });

      let erc20AssetContractDetails = null;

      if (data.assetType === AssetType.Erc20 && erc20AssetContractAddress)
        erc20AssetContractDetails =
          await MoneyMarketContractsManager.getInstance().getTokenDetails(
            erc20AssetContractAddress
          );

      const assetCustomLocation = getNewAssetMultiLocation({
        assetRegistryId: assetId,
        evmAddress: erc20AssetContractAddress,
        assetType: data.assetType,
      });

      if (!assetCustomLocation) continue;

      const assetEntityId = getAssetIdFromMultiLocation(assetCustomLocation);

      if (!assetEntityId) continue;

      const newAsset = new Asset({
        id: assetEntityId,
        assetRegistryId: `${assetId}`,
        evmAddress: erc20AssetContractAddress,
        multiLocationsMetadata: [assetCustomLocation],
        multiLocationIds: [assetEntityId],

        name: data.name,
        assetType: data.assetType,
        resourceType:
          erc20AssetContractDetails?.resourceType ?? ResourceType.Underlying,
        existentialDeposit: data.existentialDeposit,
        symbol: data.symbol ?? null,
        decimals: data.decimals ?? null,
        xcmRateLimit: data.xcmRateLimit ?? null,
        isSufficient: data.isSufficient ?? true,
      });

      assetsToSave.push(newAsset);
      ctx.batchState.state.assetsAllBatch.set(newAsset.id, newAsset);
    }

    for (const mmResourceDetails of [
      ...MoneyMarketContractsManager.getInstance().moneyMarketResourcesDetailsMap.values(),
    ]) {
      const mmTokenUnderlyingAsset = assetsToSave.find(
        (assetToSave) =>
          assetToSave.evmAddress ===
          mmResourceDetails.underlyingAssetAddress.toLowerCase()
      );
      if (!mmTokenUnderlyingAsset) continue;

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
          aTokenEntity.resourceType = ResourceType.Collateral;
          // mmTokenUnderlyingAsset.aToken = aTokenEntity;
          // aTokenEntity.underlyingAsset = mmTokenUnderlyingAsset;
          mmAssetsToSave.push(aTokenEntity);
          ctx.batchState.state.assetsAllBatch.set(
            aTokenEntity.id,
            aTokenEntity
          );
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
          variableDebtTokenEntity.resourceType = ResourceType.Debt;
          // mmTokenUnderlyingAsset.variableDebtToken = variableDebtTokenEntity;
          // variableDebtTokenEntity.underlyingAsset = mmTokenUnderlyingAsset;
          mmAssetsToSave.push(variableDebtTokenEntity);
          ctx.batchState.state.assetsAllBatch.set(
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
      ctx.batchState.state.assetsAllBatch.set(assetEntity.id, assetEntity);
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
      ...ctx.batchState.state.assetsAllBatch.values(),
    ].filter((a) => a.assetType === AssetType.Erc20 && !!a.evmAddress)) {
      const erc20AssetContractDetails =
        await MoneyMarketContractsManager.getInstance().getTokenDetails(
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

      if (!underlyingAsset) continue;

      erc20Asset.underlyingAsset = underlyingAsset;
      if (erc20Asset.resourceType === ResourceType.Collateral) {
        underlyingAsset.aToken = erc20Asset;
      } else if (erc20Asset.resourceType === ResourceType.Debt) {
        underlyingAsset.variableDebtToken = erc20Asset;
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

export function getNewAssetMultiLocation({
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

export function getAssetIdFromMultiLocation(
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

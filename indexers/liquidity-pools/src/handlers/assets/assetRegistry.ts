import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  AssetRegistryLocationSetData,
  AssetRegistryRegisteredData,
  AssetRegistryUpdatedData,
} from '../../parsers/batchBlocksParser/types';
import {
  getAssetEvmAddressByType,
  getAssetIdFromMultiLocation,
  getNewAssetMultiLocation,
} from './utils';
import { Asset, AssetType, ResourceType } from '../../model';
import { getOrCreateAsset } from './asset';
import { getErc20AssetContractFromLocation } from '../../parsers/chains/hydration/utils';
import { EventName } from '../../parsers/types/events';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { MoneyMarketContractsManager } from '../../utils/evmTools/moneyMarketContractsManager';
import parsers from '../../parsers';

export async function assetRegistered(
  ctx: SqdProcessorContext<Store>,
  eventCallData: AssetRegistryRegisteredData,
  parsedEvents: BatchBlocksParsedDataManager
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

  // TODO check location in current state for Erc20 assets
  const erc20AssetContractAddress = await getAssetEvmAddressByType({
    assetId,
    assetType: assetType,
    draftMultiLocationsData: [
      ...parsedEvents
        .getSectionByEventName(EventName.AssetRegistry_LocationSet)
        .values(),
    ],
    ctx,
  });

  // TODO added error handling
  if (!erc20AssetContractAddress) return;

  const existingAsset = await getOrCreateAsset({
    evmAddress: erc20AssetContractAddress,
    ensure: false,
    ctx,
  });

  const state = ctx.batchState.state;

  if (existingAsset) {
    existingAsset.assetRegistryId = `${assetId}`;
    state.assetsAll.set(existingAsset.id, existingAsset);
    state.assetIdsToSave.add(existingAsset.id);
    return;
  }

  const assetCustomLocation = getNewAssetMultiLocation({
    assetRegistryId: assetId,
    evmAddress: erc20AssetContractAddress,
    assetType,
  });

  if (!assetCustomLocation) return null;

  const assetEntityId = getAssetIdFromMultiLocation(assetCustomLocation);

  if (!assetEntityId) return null;

  const evmTokenContractData =
    assetType === AssetType.Erc20
      ? await MoneyMarketContractsManager.getInstance().getResourceDetails(
          erc20AssetContractAddress
        )
      : null;

  let bondUnderlyingAsset = null;
  let bondMaturity = null;

  if (assetType === AssetType.Bond) {
    const bondDetails = await parsers.storage.bonds.getBond({
      bondId: +assetId,
      block: eventMetadata.blockHeader,
    });
    if (bondDetails) {
      bondUnderlyingAsset = await getOrCreateAsset({
        assetRegistryId: bondDetails.underlyingAsset,
        ctx,
        ensure: true,
        blockHeader: eventMetadata.blockHeader,
      });
      bondMaturity = bondDetails.maturity;
    }
  }

  const getDecimals = () => {
    if (assetType !== AssetType.Bond) return decimals ?? null;
    if (bondUnderlyingAsset) return bondUnderlyingAsset.decimals ?? null;
    return null;
  };
  const getSymbol = () => {
    if (assetType !== AssetType.Bond) return symbol ?? null;
    if (bondUnderlyingAsset)
      return bondUnderlyingAsset.symbol
        ? `${bondUnderlyingAsset.symbol}b`
        : null;
    return null;
  };

  const newAsset = new Asset({
    id: assetEntityId,
    evmAddress: erc20AssetContractAddress,
    assetRegistryId: `${assetId}`,
    multiLocationIds: [assetEntityId],
    multiLocationsMetadata: [assetCustomLocation],
    name: assetName,
    resourceType: evmTokenContractData?.resourceType ?? ResourceType.Underlying,
    assetType,
    existentialDeposit,
    symbol: getSymbol(),
    decimals: getDecimals(),
    xcmRateLimit,
    isSufficient,
    bondUnderlyingAsset,
    bondMaturity,
  });

  state.assetsAll.set(newAsset.id, newAsset);
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
    assetRegistryId: assetId,
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
  state.assetsAll.set(asset.id, asset);
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
    assetRegistryId: assetId,
    ensure: true,
    blockHeader: eventMetadata.blockHeader,
  });

  if (!asset) return;

  if (asset.assetType !== AssetType.Erc20) return;

  asset.evmAddress = getErc20AssetContractFromLocation(location)?.address;

  const assetMultiLocation = getNewAssetMultiLocation({
    evmAddress: asset.evmAddress,
    assetType: AssetType.Erc20,
  });

  if (assetMultiLocation) asset.multiLocationsMetadata = [assetMultiLocation];

  const state = ctx.batchState.state;
  state.assetsAll.set(asset.id, asset);
  state.assetIdsToSave.add(asset.id);
}

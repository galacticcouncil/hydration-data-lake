import { Block, ProcessorContext } from '../../processor';
import { Asset, AssetType, ResourceType } from '../../model';
import parsers from '../../parsers';
import { AssetDetails } from '../../parsers/types/storage';
import { getAssetEvmAddressByType } from './utils';
import { MoneyMarketContractsManager } from '../../utils/evm/moneyMarketContractsManager';
import { Store } from '@subsquid/typeorm-store';

export async function getOrCreateAsset({
  id,
  evmAddress,
  ensure = false,
  blockHeader,
  ctx,
  assetStorageData,
}: {
  id?: string | number;
  evmAddress?: string;
  ensure?: boolean;
  blockHeader?: Block;
  ctx: ProcessorContext<Store>;
  assetStorageData?: AssetDetails;
}): Promise<Asset | null> {
  if (id === undefined && !evmAddress) return null;

  if (
    (id && ctx.appConfig.BLACKLISTED_ASSET_IDS.has(`${id}`)) ||
    (evmAddress && ctx.appConfig.BLACKLISTED_ASSET_IDS.has(evmAddress))
  )
    return null;

  const assetsAllBatch = ctx.batchState.state.assetsAllBatch;

  let asset = null;

  if (id !== undefined) {
    asset = assetsAllBatch.get(`${id}`);
  } else if (evmAddress) {
    asset = [...assetsAllBatch.values()].find(
      (a) => a.evmAddress === evmAddress
    );
  }

  if (asset) {
    return asset;
  }

  asset = await ctx.store.findOne(Asset, {
    where: {
      ...(id ? { id: `${id}` } : {}),
      ...(evmAddress ? { evmAddress } : {}),
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

  if (!blockHeader || id === undefined) return null;

  const storageData =
    assetStorageData ??
    (await parsers.storage.assetRegistry.getAsset(+id, blockHeader));

  if (!storageData) return null;

  const erc20AssetContractAddress = await getAssetEvmAddressByType({
    assetId: +id,
    assetType: storageData.assetType,
    ctx,
  });

  let bondUnderlyingAsset = null;
  let bondMaturity = null;

  if (storageData.assetType === AssetType.Bond) {
    const bondDetails = await parsers.storage.bonds.getBond({
      bondId: +id,
      block: blockHeader,
    });
    if (bondDetails) {
      bondUnderlyingAsset = await getOrCreateAsset({
        id: bondDetails.underlyingAsset,
        ctx,
        ensure: true,
        blockHeader,
      });
      bondMaturity = bondDetails.maturity;
    }
  }

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
    id: `${id}`,
    evmAddress: erc20AssetContractAddress,
    name: storageData.name,
    assetType: storageData.assetType,
    resourceType: evmTokenContractData
      ? evmTokenContractData.resourceType
      : ResourceType.Underlying,
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

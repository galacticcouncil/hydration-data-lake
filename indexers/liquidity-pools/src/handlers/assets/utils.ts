import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { Asset, AssetType, ResourceType } from '../../model';
import parsers from '../../parsers';
import { EvmUtils } from '../../utils/evm';
import { getOrCreateAsset } from './asset';
import { ProcessorStatusManager } from '../../processorStatusManager';
import { AssetDetailsWithId } from '../../parsers/types/storage';
import { MoneyMarketContractsManager } from '../../utils/evmTools/moneyMarketContractsManager';

export async function prefetchAllAssets(ctx: SqdProcessorContext<Store>) {
  ctx.batchState.state.assetsAllBatch = new Map(
    (await ctx.store.find(Asset, { where: {} })).map((asset) => [
      asset.id,
      asset,
    ])
  );
}

export async function ensureNativeToken(ctx: SqdProcessorContext<Store>) {
  let nativeToken = await getOrCreateAsset({ ctx, id: 0 });
  if (nativeToken) return;

  nativeToken = new Asset({
    id: '0',
    synthetic: false,
    active: true,
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

export async function getAssetEvmAddressByType({
  assetId,
  assetType,
  ctx,
}: {
  assetId: number;
  assetType: AssetType;
  ctx: SqdProcessorContext<Store>;
}) {
  if (Number.isNaN(assetId)) return null;

  switch (assetType) {
    case AssetType.Erc20:
      return (
        (
          await parsers.storage.assetRegistry.getErc20AssetContractAddress(
            +assetId,
            ctx.blocks[0].header
          )
        )?.address ?? null
      );
    default:
      return EvmUtils.convertAssetIdToH160Address(assetId);
  }
}

export function getAssetIdFromEvmAddress(address: string) {
  const partialHash = address.slice(-13);
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

      const newAsset = new Asset({
        id: `${assetId}`,
        synthetic: false,
        active: true,
        name: data.name,
        assetType: data.assetType,
        resourceType: erc20AssetContractDetails
          ? erc20AssetContractDetails.resourceType
          : ResourceType.Underlying,
        existentialDeposit: data.existentialDeposit,
        symbol: data.symbol ?? null,
        decimals: data.decimals ?? null,
        xcmRateLimit: data.xcmRateLimit ?? null,
        isSufficient: data.isSufficient ?? true,
        evmAddress: erc20AssetContractAddress,
      });

      assetsToSave.push(newAsset);
      ctx.batchState.state.assetsAllBatch.set(newAsset.id, newAsset);
    }

    // for (const mmResourceDetails of [
    //   ...MoneyMarketContractsManager.getInstance().moneyMarketResourcesDetailsMap.values(),
    // ]) {
    //   const mmTokenUnderlyingAsset = assetsToSave.find(
    //     (assetToSave) =>
    //       assetToSave.evmAddress ===
    //       mmResourceDetails.underlyingAssetAddress.toLowerCase()
    //   );
    //   if (!mmTokenUnderlyingAsset) continue;
    //
    //   if (
    //     !assetsToSave.find(
    //       (assetToSave) =>
    //         assetToSave.evmAddress ===
    //         mmResourceDetails.aTokenAddress.toLowerCase()
    //     )
    //   ) {
    //     const aTokenEntity = await getOrCreateMoneyMarketAsset({
    //       ctx,
    //       evmAddress: mmResourceDetails.aTokenAddress.toLowerCase(),
    //       ensure: true,
    //     });
    //     if (aTokenEntity) {
    //       aTokenEntity.resourceType = ResourceType.Collateral;
    //       mmTokenUnderlyingAsset.aToken = aTokenEntity;
    //       aTokenEntity.underlyingAsset = mmTokenUnderlyingAsset;
    //       assetsToSave.push(aTokenEntity);
    //     }
    //   }
    //
    //   if (
    //     !assetsToSave.find(
    //       (assetToSave) =>
    //         assetToSave.evmAddress ===
    //         mmResourceDetails.variableDebtTokenAddress.toLowerCase()
    //     )
    //   ) {
    //     const variableDebtTokenEntity = await getOrCreateMoneyMarketAsset({
    //       ctx,
    //       evmAddress: mmResourceDetails.variableDebtTokenAddress.toLowerCase(),
    //       ensure: true,
    //     });
    //     if (variableDebtTokenEntity) {
    //       variableDebtTokenEntity.resourceType = ResourceType.Debt;
    //       mmTokenUnderlyingAsset.variableDebtToken = variableDebtTokenEntity;
    //       variableDebtTokenEntity.underlyingAsset = mmTokenUnderlyingAsset;
    //       assetsToSave.push(variableDebtTokenEntity);
    //     }
    //   }
    // }

    // ctx.batchState.state.assetsAllBatch = new Map(
    //   assetsToSave.map((asset) => [asset.id, asset])
    // );
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

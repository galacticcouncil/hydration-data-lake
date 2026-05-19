import { SqdBlock, SqdProcessorContext } from '../../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import parsers from '../../../../../parsers';
import { HsmCollateralData } from '../../../../../parsers/types/storage';
import { Asset, HsmCollateral } from '../../../../../model';
import { getOrCreateAsset } from '../../../../assets/asset';
import { getOrCreateStableswap } from '../../stableswap/stablepool';
import { handleHsmCollateralConfigHistoricalDataEntity } from './historicalData';

export async function getOrCreateHsmCollateral({
  id,
  ctx,
  collateralData,
  blockHeader,
  assetRegistryId,
}: {
  id?: string;
  assetRegistryId: string;
  blockHeader: SqdBlock;
  ctx: SqdProcessorContext<Store>;
  collateralData?: HsmCollateralData;
}) {
  if (!id && !assetRegistryId) return null;
  let collateral = null;

  if (id) {
    collateral = ctx.batchState.state.hsmCollaterals.get(id);
  } else if (!id && assetRegistryId) {
    // Use assetId field for cache lookup
    collateral = Array.from(ctx.batchState.state.hsmCollaterals.values()).find(
      (c) => {
        // Fetch asset from cache to check assetRegistryId
        const asset = ctx.batchState.state.assetsAll.get(c.assetId);
        return asset?.assetRegistryId === assetRegistryId;
      }
    );
  }

  if (collateral) return collateral;

  // DB fallback
  collateral = await ctx.storeUtils.findOneWithLogs(
    HsmCollateral,
    {
      where: {
        ...(id ? { id } : {}),
      },
      relations: {
        pool: true,
        stableswap: true,
      },
    },
    { className: 'HsmCollateral', originCallFn: 'getOrCreateHsmCollateral' }
  );

  // If we didn't find by id and need to search by assetRegistryId
  if (!collateral && !id && assetRegistryId) {
    // Fetch asset from cache or DB
    let asset = [...ctx.batchState.state.assetsAll.values()].find(
      (a) => a.assetRegistryId === assetRegistryId
    );

    if (!asset) {
      asset = await ctx.storeUtils.findOneWithLogs(
        Asset,
        {
          where: { assetRegistryId },
        },
        { className: 'Asset', originCallFn: 'getOrCreateHsmCollateral' }
      );

      if (asset) {
        ctx.batchState.state.assetsAll.set(asset.id, asset);
      }
    }

    if (asset) {
      // Now query HsmCollateral by assetId
      collateral = await ctx.storeUtils.findOneWithLogs(
        HsmCollateral,
        {
          where: { assetId: asset.id },
          relations: {
            pool: true,
            stableswap: true,
          },
        },
        { className: 'HsmCollateral', originCallFn: 'getOrCreateHsmCollateral' }
      );
    }
  }

  if (collateral) {
    ctx.batchState.state.hsmCollaterals.set(collateral.id, collateral);
    return collateral;
  }

  const asset = await getOrCreateAsset({
    ctx,
    ...(id ? { id: id.replace(`${ctx.appConfig.HSMPOOL_ADDRESS}-`, ``) } : {}),
    assetRegistryId,
    ensure: true,
    blockHeader,
  });

  if (!asset || !asset.assetRegistryId) {
    console.log(`getOrCreateHsmCollateral :: asset not found.`);
    return null;
  }

  const collateralStorageData = collateralData
    ? await parsers.storage.hsm.getCollateral({
        collateralId: assetRegistryId ?? asset.assetRegistryId,
        block: blockHeader,
      })
    : null;

  if (!collateralStorageData) {
    console.log(
      `getOrCreateHsmCollateral :: collateralStorageData not found for asset ${assetRegistryId ?? asset.assetRegistryId}.`
    );
    return null;
  }

  const hsmPool = ctx.batchState.state.hsmpoolEntity;

  if (!hsmPool) {
    console.log(`getOrCreateHsmCollateral :: hsmPool not found.`);
    return null;
  }

  const stableswap = await getOrCreateStableswap({
    poolId: collateralStorageData.poolId,
    ctx,
    blockHeader,
    ensure: true,
  });

  if (!stableswap) {
    console.log(`getOrCreateHsmCollateral :: stableswap not found.`);
    return null;
  }

  collateral = new HsmCollateral({
    id: id ?? `${ctx.appConfig.HSMPOOL_ADDRESS}-${asset.id}`,
    pool: hsmPool,
    assetId: asset.id,
    stableswap,
    isRemoved: false,
  });

  ctx.batchState.state.hsmCollaterals.set(collateral.id, collateral);
  await ctx.store.upsert(collateral);

  return collateral;
}

export async function ensureHsmCollaterals(ctx: SqdProcessorContext<Store>) {
  if (ctx.batchState.state.hsmCollaterals.size > 0) return;

  const processingBlockHeader = ctx.blocks[ctx.blocks.length - 1].header;

  const allCollaterals = await parsers.storage.hsm.getAllCollaterals({
    block: processingBlockHeader,
  });

  if (!allCollaterals) return;

  for (const collateralData of allCollaterals) {
    await getOrCreateHsmCollateral({
      assetRegistryId: `${collateralData.collateralAssetId}`,
      collateralData,
      ctx,
      blockHeader: processingBlockHeader,
    });

    await handleHsmCollateralConfigHistoricalDataEntity({
      ctx,
      blockHeader: processingBlockHeader,
      fullStorageData: collateralData,
    });
  }

  // const existingCollateralsIndexedByAssetRegistryIdsMap = new Map(
  //   Array.from(ctx.batchState.state.hsmCollaterals.values()).map((c) => [
  //     ctx.batchState.state.assetsAll.get(c.assetId)?.assetRegistryId,
  //     c,
  //   ])
  // );
  //
  // for (const collateralData of allCollaterals) {
  //   if (
  //     !existingCollateralsIndexedByAssetRegistryIdsMap.has(
  //       `${collateralData.collateralAssetId}`
  //     )
  //   ) {
  //     await getOrCreateHsmCollateral({
  //       assetRegistryId: `${collateralData.collateralAssetId}`,
  //       collateralData,
  //       ctx,
  //       blockHeader: processingBlockHeader,
  //     });
  //     continue;
  //   }
  //   existingCollateralsIndexedByAssetRegistryIdsMap.delete(
  //     `${collateralData.collateralAssetId}`
  //   );
  // }
  //
  // for (const collateralToRemove of existingCollateralsIndexedByAssetRegistryIdsMap.values()) {
  //   collateralToRemove.isRemoved = true;
  // }
  //
  // await ctx.store.save(
  //   Array.from(existingCollateralsIndexedByAssetRegistryIdsMap.values())
  // );
}

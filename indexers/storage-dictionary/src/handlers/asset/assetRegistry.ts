import { Block, ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { Asset, AssetType, SubProcessorStatus } from '../../model';
import parsers from '../../parsers';
import { SubProcessorStatusManager } from '../../utils/subProcessorStatusManager';

export async function getAsset({
  ctx,
  id,
  ensure = false,
  blockHeader,
}: {
  ctx: ProcessorContext<Store>;
  id: string | number;
  ensure?: boolean;
  blockHeader?: Block;
}): Promise<Asset | null> {
  const assetsAllBatch = ctx.batchState.state.assetsAllBatch;

  let asset = assetsAllBatch.get(`${id}`);
  if (asset) return asset;

  asset = await ctx.store.findOne(Asset, { where: { id: `${id}` } });

  if (asset) return asset;

  if (!asset && !ensure) return null;

  /**
   * Following logic below is implemented and will be used only if indexer
   * has been started not from genesis block and some assets have not been
   * pre-created before indexing start point.
   */

  if (!blockHeader) return null;
  const storageData = await parsers.storage.assetRegistry.getAsset(
    +id,
    blockHeader
  );

  if (!storageData) return null;

  const newAsset = new Asset({
    id: `${id}`,
    name: storageData.name,
    assetType: storageData.assetType,
    existentialDeposit: storageData.existentialDeposit,
    symbol: storageData.symbol ?? null,
    decimals: storageData.decimals ?? null,
    xcmRateLimit: storageData.xcmRateLimit ?? null,
    isSufficient: storageData.isSufficient ?? true,
  });

  await ctx.store.save(newAsset);

  assetsAllBatch.set(newAsset.id, newAsset);
  ctx.batchState.state = {
    assetsAllBatch,
  };

  return newAsset;
}

export async function prefetchAllAssets(ctx: ProcessorContext<Store>) {
  ctx.batchState.state = {
    assetsAllBatch: new Map(
      (await ctx.store.find(Asset, { where: {} })).map((asset) => [
        asset.id,
        asset,
      ])
    ),
  };
}

export async function ensureNativeToken(ctx: ProcessorContext<Store>) {
  let nativeToken = await getAsset({ ctx, id: 0 });
  if (nativeToken) return;

  nativeToken = new Asset({
    id: '0',
    name: 'Hydration',
    assetType: AssetType.Token,
    decimals: 12,
    existentialDeposit: BigInt('1000000000000'),
    symbol: 'HDX',
    xcmRateLimit: null,
    isSufficient: true,
  });

  await ctx.store.upsert(nativeToken);
  const assetsAllBatch = ctx.batchState.state.assetsAllBatch;
  assetsAllBatch.set(nativeToken.id, nativeToken);
  ctx.batchState.state = {
    assetsAllBatch,
  };
}

/**
 * If Storage Dictionary is running as multiprocessor indexer, we need be sure
 * that only one processor creates Assets to avoid deadlock error in DB.
 *
 * @param statusManager
 * @param ctx
 */
export async function waitForAssetsActualisation(
  statusManager: SubProcessorStatusManager,
  ctx: ProcessorContext<Store>
) {
  if (ctx.appConfig.ASSETS_TRACKER_PROCESSOR) return;

  const procStatus = await statusManager.getStatus();

  if (
    !!procStatus.assetsActualisedAtBlock &&
    procStatus.assetsActualisedAtBlock > 0
  )
    return;

  await new Promise<void>((res) => {
    const interval = setInterval(async () => {
      const assetsActualisationProcStatus = await ctx.store.findOne(
        SubProcessorStatus,
        {
          where: {
            id: ctx.appConfig.ASSETS_ACTUALISATION_PROC_STATE_SCHEMA_NAME,
          },
        }
      );

      if (
        !!assetsActualisationProcStatus &&
        assetsActualisationProcStatus.assetsActualisedAtBlock !== null &&
        assetsActualisationProcStatus.assetsActualisedAtBlock !== undefined &&
        assetsActualisationProcStatus.assetsActualisedAtBlock > 0
      ) {
        clearTimeout(interval);
        await statusManager.setSubProcessorStatus({
          assetsActualisedAtBlock:
            assetsActualisationProcStatus.assetsActualisedAtBlock,
        });
        res();
      }
      console.log(
        `Processor ${ctx.appConfig.STATE_SCHEMA_NAME} is waiting for assets actualisation.`
      );
    }, 5_000);
  });
}

export async function actualiseAssets(
  ctx: ProcessorContext<Store>,
  statusManager: SubProcessorStatusManager
) {
  if (!ctx.appConfig.ASSETS_TRACKER_PROCESSOR) return;

  const latestActualisationPoint = (await statusManager.getStatus())
    .assetsActualisedAtBlock;

  // if (ctx.blocks[0].header.height < latestActualisationPoint + 100) return;

  const allExistingAssets = new Map(
    (await ctx.store.find(Asset)).map((asset) => [asset.id, asset])
  );

  const storageData = await parsers.storage.assetRegistry.getAssetsAll(
    ctx.blocks[0].header
  );
  const assetsToUpdate: Asset[] = [];

  for (const assetStorageData of storageData) {
    if (!assetStorageData.data) continue;

    const {
      name,
      assetType,
      existentialDeposit,
      symbol,
      decimals,
      xcmRateLimit,
      isSufficient,
    } = assetStorageData.data;

    const assetEntity = new Asset({
      id: `${assetStorageData.assetId}`,
      name: name,
      assetType: assetType,
      existentialDeposit: existentialDeposit,
      symbol: symbol ?? null,
      decimals: decimals ?? null,
      xcmRateLimit: xcmRateLimit ?? null,
      isSufficient: isSufficient ?? true,
    });

    assetsToUpdate.push(assetEntity);
    allExistingAssets.set(assetEntity.id, assetEntity);
  }

  await ctx.store.upsert(assetsToUpdate);

  ctx.batchState.state = {
    assetsAllBatch: allExistingAssets,
  };

  await statusManager.setSubProcessorStatus({
    assetsActualisedAtBlock: ctx.blocks[0].header.height,
  });
}

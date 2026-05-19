import { Block, ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { Asset, AssetType, SubProcessorStatus } from '../../model';
import parsers from '../../parsers';
import { SubProcessorStatusManager } from '../../utils/subProcessorStatusManager';
import { AssetDetails } from '../../parsers/types/storage';
import { getAssetEvmAddressByType } from './utils';
import { getOrCreateAsset } from './asset';




export async function prefetchAllAssets(ctx: ProcessorContext<Store>) {
  ctx.batchState.state.assetsAllBatch = new Map(
    (await ctx.store.find(Asset)).map((asset) => [asset.id, asset])
  );
}

export async function ensureNativeToken(ctx: ProcessorContext<Store>) {
  let nativeToken = await getOrCreateAsset({ ctx, id: 0 });
  if (nativeToken) return;

  nativeToken = new Asset({
    id: `0`,
    name: 'Hydration',
    assetType: AssetType.Token,
    symbol: 'HDX',
    decimals: 12,
    xcmRateLimit: null,
    isSufficient: true,
  });

  await ctx.store.upsert(nativeToken);
  const assetsAllBatch = ctx.batchState.state.assetsAllBatch;
  assetsAllBatch.set(nativeToken.id, nativeToken);
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

  /**
   * Waiting will stop after first processed and saved blocks batch by assets
   * tracker processor. This should be enough to have in DB all necessary assets
   * for all sub-processors, including that one, which is processing last chunk of
   * blocks (from <last_chunk_start_block> to -1). It means that assets
   * tracker processor must start at <last_chunk_start_block> as well to cover
   * this processor data requirements.
   */
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
        return;
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

  // const allExistingAssets = new Map(
  //   (await ctx.store.find(Asset)).map((asset) => [asset.id, asset])
  // );

  const storageData = await parsers.storage.assetRegistry.getAssetsAll(
    ctx.blocks[ctx.blocks.length - 1].header
  );

  for (const assetStorageData of storageData) {
    if (!assetStorageData.data) continue;

    if (
      !ctx.batchState.state.assetsAllBatch.has(`${assetStorageData.assetId}`)
    ) {
      await getOrCreateAsset({
        id: assetStorageData.assetId,
        ctx,
        ensure: true,
        blockHeader: ctx.blocks[ctx.blocks.length - 1].header,
        assetStorageData: assetStorageData.data,
      });
      continue;
    }
    const asset = ctx.batchState.state.assetsAllBatch.get(
      `${assetStorageData.assetId}`
    );

    if (
      !asset ||
      (asset.name === assetStorageData.data.name &&
        asset.assetType === assetStorageData.data.assetType &&
        asset.symbol === assetStorageData.data.symbol &&
        asset.decimals === assetStorageData.data.decimals)
    )
      continue;

    if (!!assetStorageData.data.name) asset.name = assetStorageData.data.name;

    if (!!assetStorageData.data.assetType) {
      asset.assetType = assetStorageData.data.assetType;
    }
    if (!!assetStorageData.data.symbol)
      asset.symbol = assetStorageData.data.symbol;

    if (!!assetStorageData.data.decimals)
      asset.decimals = assetStorageData.data.decimals;

    if (!!assetStorageData.data.xcmRateLimit)
      asset.xcmRateLimit = assetStorageData.data.xcmRateLimit;

    if (!!assetStorageData.data.isSufficient)
      asset.isSufficient = assetStorageData.data.isSufficient;

    await ctx.store.save(asset);

    // const { name, assetType, symbol, decimals, xcmRateLimit, isSufficient } =
    //   assetStorageData.data;
    //
    // const assetEntity = new Asset({
    //   id: `${assetStorageData.assetId}`,
    //   name: name,
    //   assetType: assetType,
    //   symbol: symbol ?? null,
    //   decimals: decimals ?? null,
    //   xcmRateLimit: xcmRateLimit ?? null,
    //   isSufficient: isSufficient ?? true,
    // });
    //
    // assetsToUpdate.push(assetEntity);
    // allExistingAssets.set(assetEntity.id, assetEntity);
  }

  // await ctx.store.upsert(assetsToUpdate);

  // ctx.batchState.state = {
  //   assetsAll: allExistingAssets,
  // };

  await statusManager.setSubProcessorStatus({
    assetsActualisedAtBlock: ctx.blocks[0].header.height,
  });
}

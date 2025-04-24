import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../../parsers/batchBlocksParser';
import parsers from '../../../parsers';
import { blake2AsHex } from '@polkadot/util-crypto';
import { StableMath } from '@galacticcouncil/sdk';
import {
  StableswapAssetHistoricalData,
  StableswapHistoricalData,
} from '../../../model';
import { getOrCreateStableswap } from './stablepool';
import { getOrCreateAsset } from '../../assets/asset';
import { BlockHeader } from '@subsquid/substrate-processor';
import { splitIntoBatches } from '../../../utils/helpers';

async function getStableswapDataPromise({
  ctx,
  poolId,
  blockHeader,
}: {
  ctx: SqdProcessorContext<Store>;
  poolId: number;
  blockHeader: BlockHeader;
}): Promise<{
  poolData: StableswapHistoricalData;
  assetsData: StableswapAssetHistoricalData[];
} | null> {
  //TODO add using pool data from current batch cache
  const poolStorageData = await parsers.storage.stableswap.getPoolData({
    poolId,
    block: blockHeader,
  });

  if (!poolStorageData) return null;

  const assetsData = await Promise.all(
    poolStorageData.assets.map(async (assetId) => ({
      assetId,
      data: await parsers.storage.stableswap.getPoolAssetInfo({
        poolId,
        assetId,
        block: blockHeader,
        poolAddress: blake2AsHex(StableMath.getPoolAddress(poolId)),
      }),
      storageData: await parsers.storage.stableswap.getPoolAssetStorageData({
        poolId,
        assetId,
        block: blockHeader,
        poolAddress: blake2AsHex(StableMath.getPoolAddress(poolId)),
      }),
    }))
  );

  const poolEntity = await getOrCreateStableswap({
    ctx,
    poolId,
    ensure: true,
    blockHeader,
  });

  if (!poolEntity) return null;

  const stableswapAssetsMap = new Map(
    poolEntity.assets.map((sAsset) => [sAsset.asset.id, sAsset])
  );

  const poolHistoricalDataEntity = new StableswapHistoricalData({
    id: `${poolId}-${blockHeader.height}`,
    pool: poolEntity,

    initialAmplification: poolStorageData.initialAmplification,
    finalAmplification: poolStorageData.finalAmplification,
    initialAmplificationChangeAtBlockHeight: poolStorageData.initialBlock,
    finalAmplificationChangeAtBlockHeight: poolStorageData.finalBlock,
    fee: poolStorageData.fee,
    pegs: assetsData.map(
      (assetData) => assetData.storageData?.peg ?? ['1', '1']
    ),

    relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
      blockHeader.height
    ).height,
    paraBlockHeight: blockHeader.height,
    block: ctx.batchState.state.batchBlocks.get(blockHeader.id),
  });

  const poolAssetHistoricalDataEntities = [];

  for (const { assetId: arAssetId, data, storageData } of assetsData.filter(
    (data) => !!data && !!data.data
  )) {
    const asset = await getOrCreateAsset({
      ctx,
      assetRegistryId: arAssetId,
      ensure: true,
      blockHeader,
    });

    if (!asset) continue;

    poolAssetHistoricalDataEntities.push(
      new StableswapAssetHistoricalData({
        id: `${poolId}-${asset.id}-${blockHeader.height}`,
        asset,
        stableswapAsset: stableswapAssetsMap.get(asset.id),
        poolHistoricalData: poolHistoricalDataEntity,
        freeBalance: data!.free,
        tradable: storageData?.tradable.bits ?? 15,

        relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
          blockHeader.height
        ).height,
        paraBlockHeight: blockHeader.height,
        block: ctx.batchState.state.batchBlocks.get(blockHeader.id),
      })
    );
  }

  return {
    poolData: poolHistoricalDataEntity,
    assetsData: poolAssetHistoricalDataEntities,
  };
}

export async function handleStableswapHistoricalData(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  if (!ctx.appConfig.PROCESS_STABLEPOOLS) return;

  const predefinedEntities = [];

  for (const blocksSubBatch of splitIntoBatches(ctx.blocks, 100)) {
    const allPoolsPerBlock: Array<{ blockHeader: BlockHeader; ids: number[] }> =
      await Promise.all(
        blocksSubBatch.map(async ({ header: blockHeader }) => {
          const poolShareTokenPairs =
            await parsers.storage.stableswap.getAllPoolIds({
              block: blockHeader,
            });
          return {
            blockHeader,
            ids: poolShareTokenPairs,
          };
        })
      );

    predefinedEntities.push(
      await Promise.all(
        allPoolsPerBlock
          .map(({ blockHeader, ids }) =>
            ids.map((poolId) => ({
              blockHeader: blockHeader,
              poolId,
            }))
          )
          .flat()
          .map((item) => getStableswapDataPromise({ ...item, ctx }))
      )
    );
  }

  for (const entitiesToSave of predefinedEntities
    .flat()
    .filter((item) => !!item)) {
    ctx.batchState.state.stablepoolAllHistoricalData.set(
      entitiesToSave.poolData.id,
      entitiesToSave.poolData
    );

    for (const assetData of entitiesToSave.assetsData.filter(
      (item) => !!item
    )) {
      ctx.batchState.state.stablepoolAssetsAllHistoricalData.set(
        assetData.id,
        assetData
      );
    }
  }

  await ctx.store.save([
    ...ctx.batchState.state.stablepoolAllHistoricalData.values(),
  ]);
  await ctx.store.save([
    ...ctx.batchState.state.stablepoolAssetsAllHistoricalData.values(),
  ]);
}

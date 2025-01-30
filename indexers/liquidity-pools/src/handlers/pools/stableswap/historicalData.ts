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
import { getAsset } from '../../assets/assetRegistry';
import { BlockHeader } from '@subsquid/substrate-processor';

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
    }))
  );

  const poolEntity = await getOrCreateStableswap({
    ctx,
    poolId,
    ensure: true,
    blockHeader,
  });

  if (!poolEntity) return null;

  const poolHistoricalDataEntity = new StableswapHistoricalData({
    id: `${poolId}-${blockHeader.height}`,
    pool: poolEntity,
    initialAmplification: poolStorageData.initialAmplification,
    finalAmplification: poolStorageData.finalAmplification,
    initialAmplificationChangeAtBlockHeight: poolStorageData.initialBlock,
    finalAmplificationChangeAtBlockHeight: poolStorageData.finalBlock,
    fee: poolStorageData.fee,
    relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
      blockHeader.height
    ).height,
    paraBlockHeight: blockHeader.height,
    block: ctx.batchState.state.batchBlocks.get(blockHeader.id),
  });

  const poolAssetHistoricalDataEntities = [];

  for (const { assetId, data } of assetsData.filter(
    (data) => !!data && !!data.data
  )) {
    const asset = await getAsset({
      ctx,
      id: assetId,
      ensure: true,
      blockHeader,
    });

    if (!asset) continue;

    poolAssetHistoricalDataEntities.push(
      new StableswapAssetHistoricalData({
        id: `${poolId}-${assetId}-${blockHeader.height}`,
        asset,
        poolHistoricalData: poolHistoricalDataEntity,
        freeBalance: data!.free,
        // reserved: data!.reserved,
        // miscFrozen: data!.miscFrozen,
        // feeFrozen: data!.feeFrozen,
        // frozen: data!.frozen,
        // flags: data!.flags,
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

  const predefinedEntities = await Promise.all(
    [...ctx.batchState.state.stableswapIdsForStoragePrefetch.entries()]
      .map(([blockNumber, { blockHeader, ids }]) =>
        [...ids.values()].map((poolId) => ({
          blockHeader: blockHeader,
          poolId,
        }))
      )

      .flat()
      .map((item) => getStableswapDataPromise({ ...item, ctx }))
  );

  const stablepoolAllHistoricalData =
    ctx.batchState.state.stablepoolAllHistoricalData;
  const stablepoolAssetsAllHistoricalData =
    ctx.batchState.state.stablepoolAssetsAllHistoricalData;

  for (const entitiesToSave of predefinedEntities.filter((item) => !!item)) {
    stablepoolAllHistoricalData.set(
      entitiesToSave.poolData.id,
      entitiesToSave.poolData
    );

    for (const assetData of entitiesToSave.assetsData.filter(
      (item) => !!item
    )) {
      stablepoolAssetsAllHistoricalData.set(assetData.id, assetData);
    }
  }

  await ctx.store.save([...stablepoolAllHistoricalData.values()]);
  await ctx.store.save([...stablepoolAssetsAllHistoricalData.values()]);
}

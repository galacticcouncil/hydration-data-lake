import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import parsers from '../../parsers';
import { blake2AsHex } from '@polkadot/util-crypto';
import { StableMath } from '@galacticcouncil/sdk';
import {
  StablepoolAssetHistoricalData,
  StablepoolHistoricalData,
} from '../../model';
import { getStablepool } from './stablepool';
import { getAsset } from '../assets/assetRegistry';

export async function handleStablepoolHistoricalData(
  ctx: ProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  if (!ctx.appConfig.PROCESS_STABLEPOOLS) return;

  const predefinedEntities = await Promise.all(
    [...ctx.batchState.state.stablepoolIdsForStoragePrefetch.entries()]
      .map(([blockNumber, { blockHeader, ids }]) =>
        [...ids.values()].map((poolId) => ({
          blockHeader: blockHeader,
          poolId,
        }))
      )

      .flat()
      .map(async ({ poolId, blockHeader }) => {
        const poolStorageData = await parsers.storage.stableswap.getPoolData({
          assetId: poolId,
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

        const poolEntity = await getStablepool(ctx, poolId);

        if (!poolEntity) return null;

        const poolHistoricalDataEntity = new StablepoolHistoricalData({
          id: `${poolId}-${blockHeader.height}`,
          pool: poolEntity,
          initialAmplification: poolStorageData.initialAmplification,
          finalAmplification: poolStorageData.finalAmplification,
          initialBlock: poolStorageData.initialBlock,
          finalBlock: poolStorageData.finalBlock,
          fee: poolStorageData.fee,
          relayChainBlockHeight:
            ctx.batchState.state.relayChainInfo.get(blockHeader.height)
              ?.relaychainBlockNumber ?? 0,
          paraChainBlockHeight: blockHeader.height,
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
            new StablepoolAssetHistoricalData({
              id: `${poolId}-${assetId}-${blockHeader.height}`,
              asset,
              poolHistoricalData: poolHistoricalDataEntity,
              free: data!.free,
              reserved: data!.reserved,
              miscFrozen: data!.miscFrozen,
              feeFrozen: data!.feeFrozen,
              frozen: data!.frozen,
              flags: data!.flags,
              paraChainBlockHeight: blockHeader.height,
            })
          );
        }

        return {
          poolData: poolHistoricalDataEntity,
          assetsData: poolAssetHistoricalDataEntities,
        };
      })
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

  ctx.batchState.state = {
    stablepoolAllHistoricalData,
    stablepoolAssetsAllHistoricalData,
  };

  await ctx.store.save([...stablepoolAllHistoricalData.values()]);
  await ctx.store.save([...stablepoolAssetsAllHistoricalData.values()]);
}

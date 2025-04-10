import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../../parsers/batchBlocksParser';
import parsers from '../../../parsers';
import {
  OmnipoolAssetHistoricalData,
  OmnipoolHistoricalData,
} from '../../../model';
import { getOrCreateAsset } from '../../assets/asset';
import { getOrCreateOmnipoolAsset } from './omnipoolAssets';

export async function handleOmnipoolHistoricalData(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  if (!ctx.appConfig.PROCESS_OMNIPOOLS) return;

  const predefinedEntities = await Promise.all(
    [...ctx.batchState.state.omnipoolAssetIdsForStoragePrefetch.entries()]
      .map(([blockNumber, { blockHeader, ids }]) =>
        [...ids.values()].map((arAssetId) => ({
          blockHeader: blockHeader,
          arAssetId,
        }))
      )
      .flat()
      .map(async ({ arAssetId, blockHeader }) => {
        if (
          !ctx.batchState.state.omnipoolAllHistoricalData.has(
            `${ctx.appConfig.OMNIPOOL_ADDRESS}-${blockHeader.height}`
          )
        ) {
          const poolStorageData = await parsers.storage.omnipool.getPoolData({
            block: blockHeader,
            poolAddress: ctx.appConfig.OMNIPOOL_ADDRESS,
          });

          if (!poolStorageData) return null;

          const {
            maxInRatio,
            maxOutRatio,
            minTradingLimit,
            minPoolLiquidity,
            minWithdrawalFee,
            burnProtocolFee,
            hdxAssetId,
            hubAssetId,
          } = poolStorageData;

          const hdxAsset = await getOrCreateAsset({
            id: `${hdxAssetId}`,
            ensure: true,
            blockHeader,
            ctx,
          });
          if (!hdxAsset) return null;

          const hubAsset = await getOrCreateAsset({
            id: `${hubAssetId}`,
            ensure: true,
            blockHeader,
            ctx,
          });
          if (!hubAsset) return null;

          ctx.batchState.state.omnipoolAllHistoricalData.set(
            `${ctx.appConfig.OMNIPOOL_ADDRESS}-${blockHeader.height}`,
            new OmnipoolHistoricalData({
              id: `${ctx.appConfig.OMNIPOOL_ADDRESS}-${blockHeader.height}`,
              pool: ctx.batchState.state.omnipoolEntity!,

              maxInRatio,
              maxOutRatio,
              minTradingLimit,
              minPoolLiquidity,
              minWithdrawalFee,
              burnProtocolFee,
              hdxAsset,
              hubAsset,

              relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
                blockHeader.height
              ).height,
              paraBlockHeight: blockHeader.height,
              block: ctx.batchState.state.batchBlocks.get(blockHeader.id),
            })
          );
        }

        const assetStateStorageData =
          await parsers.storage.omnipool.getOmnipoolAssetData({
            assetId: arAssetId,
            block: blockHeader,
          });

        if (!assetStateStorageData) return null;

        const assetsBalances = await parsers.storage.omnipool.getPoolAssetInfo({
          assetId: arAssetId,
          block: blockHeader,
          poolAddress: ctx.appConfig.OMNIPOOL_ADDRESS,
        });

        if (!assetsBalances) return null;

        if (!ctx.batchState.state.omnipoolEntity) return null;

        const asset = await getOrCreateAsset({
          ctx,
          assetRegistryId: arAssetId,
          ensure: true,
          blockHeader,
        });

        if (!asset) return null;

        const omnipoolAsset = await getOrCreateOmnipoolAsset({
          ctx,
          assetId: asset.id,
          ensure: true,
          blockHeader,
        });

        if (!omnipoolAsset) return null;

        const newEntity = new OmnipoolAssetHistoricalData({
          id: `${ctx.appConfig.OMNIPOOL_ADDRESS}-${asset.id}-${blockHeader.height}`,
          asset,
          omnipoolAsset,
          poolHistoricalData:
            ctx.batchState.state.omnipoolAllHistoricalData.get(
              `${ctx.appConfig.OMNIPOOL_ADDRESS}-${blockHeader.height}`
            )!,

          assetCap: assetStateStorageData.cap,
          assetShares: assetStateStorageData.shares,
          assetHubReserve: assetStateStorageData.hubReserve,
          assetProtocolShares: assetStateStorageData.protocolShares,
          tradable: assetStateStorageData.tradable.bits,
          freeBalance: assetsBalances.free,

          relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
            blockHeader.height
          ).height,
          paraBlockHeight: blockHeader.height,
          block: ctx.batchState.state.batchBlocks.get(blockHeader.id),
        });

        return newEntity;
      })
  );

  ctx.batchState.state.omnipoolAssetAllHistoricalData = new Map(
    predefinedEntities.filter((item) => !!item).map((item) => [item.id, item])
  );

  await ctx.store.save([
    ...ctx.batchState.state.omnipoolAllHistoricalData.values(),
  ]);
  await ctx.store.save([
    ...ctx.batchState.state.omnipoolAssetAllHistoricalData.values(),
  ]);
}

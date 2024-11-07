import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import parsers from '../../parsers';
import { OmnipoolAssetHistoricalData } from '../../model';
import { getAsset } from '../assets/assetRegistry';
import { getOmnipoolAsset } from './omnipoolAssets';

export async function handleOmnipoolAssetHistoricalData(
  ctx: ProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  if (!ctx.appConfig.PROCESS_OMNIPOOLS) return;

  const predefinedEntities = await Promise.all(
    [...ctx.batchState.state.omnipoolAssetIdsForStoragePrefetch.entries()]
      .map(([blockNumber, { blockHeader, ids }]) =>
        [...ids.values()].map((assetId) => ({
          blockHeader: blockHeader,
          assetId,
        }))
      )
      .flat()
      .map(async ({ assetId, blockHeader }) => {
        const assetStateStorageData =
          await parsers.storage.omnipool.getOmnipoolAssetData({
            assetId,
            block: blockHeader,
          });

        if (!assetStateStorageData) return null;

        const assetsBalances = await parsers.storage.omnipool.getPoolAssetInfo({
          assetId,
          block: blockHeader,
          poolAddress: ctx.appConfig.OMNIPOOL_ADDRESS,
        });

        if (!assetsBalances) return null;

        if (!ctx.batchState.state.omnipoolEntity) return null;

        const omnipoolAsset = await getOmnipoolAsset(ctx, assetId);

        if (!omnipoolAsset) return null;

        const asset = await getAsset({
          ctx,
          id: assetId,
          ensure: true,
          blockHeader,
        });

        if (!asset) return null;

        const newEntity = new OmnipoolAssetHistoricalData({
          id: `${ctx.appConfig.OMNIPOOL_ADDRESS}-${assetId}-${blockHeader.height}`,
          asset,
          omnipoolAsset,

          stateCap: assetStateStorageData.cap,
          stateShares: assetStateStorageData.shares,
          stateHubReserve: assetStateStorageData.hubReserve,
          stateProtocolShares: assetStateStorageData.protocolShares,

          balanceFree: assetsBalances.free,
          balanceFlags: assetsBalances.flags,
          balanceFrozen: assetsBalances.frozen,
          balanceReserved: assetsBalances.reserved,
          balanceFeeFrozen: assetsBalances.feeFrozen,
          balanceMiscFrozen: assetsBalances.miscFrozen,

          relayChainBlockHeight:
            ctx.batchState.state.relayChainInfo.get(blockHeader.height)
              ?.relaychainBlockNumber ?? 0,
          paraChainBlockHeight: blockHeader.height,
        });

        return newEntity;
      })
  );

  const predefinedEntitiesWithoutDuplicates = new Map(
    predefinedEntities.filter((item) => !!item).map((item) => [item.id, item])
  );

  await ctx.store.save([...predefinedEntitiesWithoutDuplicates.values()]);
}

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
import { splitIntoBatches } from '../../../utils/helpers';
import { BlockHeader } from '@subsquid/substrate-processor';

export async function handleOmnipoolHistoricalData(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  if (!ctx.appConfig.PROCESS_OMNIPOOLS) return;

  const predefinedEntities = [];

  for (const blocksSubBatch of splitIntoBatches(
    ctx.blocks,
    ctx.appConfig.HISTORICAL_DATA_PROCESSING_SUB_BATCH_SIZE
  )) {
    const allPoolAssetsPerBlock: Array<{
      blockHeader: BlockHeader;
      assetRegistryIds: number[];
    }> = await Promise.all(
      blocksSubBatch.map(async ({ header: blockHeader }) => {
        const assetRegistryIds =
          await parsers.storage.omnipool.getOmnipoolAllAssetIds({
            block: blockHeader,
          });
        /**
         * We need add H2O asset manually as it's not presented in storage
         */
        assetRegistryIds.push(1);

        return {
          blockHeader,
          assetRegistryIds,
        };
      })
    );

    predefinedEntities.push(
      await Promise.all(
        allPoolAssetsPerBlock
          .map(({ blockHeader, assetRegistryIds }) =>
            assetRegistryIds.map((arAssetId) => ({
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
              ctx.batchState.state.omnipoolAllHistoricalData.set(
                `${ctx.appConfig.OMNIPOOL_ADDRESS}-${blockHeader.height}`,
                new OmnipoolHistoricalData({
                  id: `${ctx.appConfig.OMNIPOOL_ADDRESS}-${blockHeader.height}`,
                  pool: ctx.batchState.state.omnipoolEntity!,

                  relayBlockHeight:
                    ctx.batchState.getRelayChainBlockDataFromCache(
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

            let hubAssetTradeability = null;

            if (arAssetId === 1) {
              hubAssetTradeability =
                await parsers.storage.omnipool.getOmnipoolHubAssetTradability({
                  block: blockHeader,
                });
            }

            if (
              (arAssetId !== 1 && !assetStateStorageData) ||
              (arAssetId === 1 && !hubAssetTradeability)
            )
              return null;

            const assetsBalances =
              await parsers.storage.omnipool.getPoolAssetInfo({
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

              assetCap: assetStateStorageData?.cap ?? 0n,
              assetShares: assetStateStorageData?.shares ?? 0n,
              assetHubReserve: assetStateStorageData?.hubReserve ?? 0n,
              assetProtocolShares: assetStateStorageData?.protocolShares ?? 0n,
              tradable:
                arAssetId === 1
                  ? hubAssetTradeability!.bits
                  : assetStateStorageData!.tradable.bits,
              freeBalance: assetsBalances.free,

              relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
                blockHeader.height
              ).height,
              paraBlockHeight: blockHeader.height,
              block: ctx.batchState.state.batchBlocks.get(blockHeader.id),
            });

            return newEntity;
          })
      )
    );
  }

  ctx.batchState.state.omnipoolAssetAllHistoricalData = new Map(
    predefinedEntities
      .flat()
      .filter((item) => !!item)
      .map((item) => [item.id, item])
  );

  await ctx.store.save([
    ...ctx.batchState.state.omnipoolAllHistoricalData.values(),
  ]);
  await ctx.store.save([
    ...ctx.batchState.state.omnipoolAssetAllHistoricalData.values(),
  ]);
}

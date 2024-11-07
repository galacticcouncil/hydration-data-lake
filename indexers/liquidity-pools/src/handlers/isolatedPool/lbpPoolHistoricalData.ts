import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import parsers from '../../parsers';
import { LbpPoolHistoricalData } from '../../model';
import { getAsset } from '../assets/assetRegistry';
import { getLbpPoolByAssets } from './lbpPool';
import { getAccount } from '../accounts';

export async function handleLbpPoolHistoricalData(
  ctx: ProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  if (!ctx.appConfig.PROCESS_LBP_POOLS) return;

  const predefinedEntities = await Promise.all(
    [...ctx.batchState.state.lbpPoolAssetIdsForStoragePrefetch.entries()]
      .map(([blockNumber, { blockHeader, ids }]) =>
        [...ids.values()].map((assetIdsPair) => ({
          blockHeader: blockHeader,
          assetIdsPair,
        }))
      )
      .flat()
      .map(async ({ assetIdsPair, blockHeader }) => {
        const pool = await getLbpPoolByAssets({
          ctx,
          assetIds: assetIdsPair.split('-'),
        });

        if (!pool) return null;

        const poolStorageData = await parsers.storage.lbp.getPoolData({
          block: blockHeader,
          poolAddress: pool.account.id,
        });

        if (!poolStorageData) return null;

        const assetsData = new Map(
          (
            await Promise.all(
              [pool.assetA.id, pool.assetB.id].map(async (assetId) => ({
                assetId,
                data: await parsers.storage.lbp.getPoolAssetInfo({
                  assetId: +assetId!,
                  block: blockHeader,
                  poolAddress: pool.account.id,
                }),
              }))
            )
          )
            .filter((assetData) => !!assetData)
            .map((assetData) => [assetData.assetId, assetData.data])
        );

        const assetAEntity = await getAsset({
          ctx,
          id: pool.assetA.id,
          ensure: true,
          blockHeader,
        });
        const assetBEntity = await getAsset({
          ctx,
          id: pool.assetB.id,
          ensure: true,
          blockHeader,
        });

        if (!assetAEntity || !assetBEntity) return null;

        const poolHistoricalDataEntity = new LbpPoolHistoricalData({
          id: `${pool.account.id}-${blockHeader.height}`,
          pool: pool,
          assetA: assetAEntity,
          assetB: assetBEntity,
          assetABalance: assetsData.get(assetAEntity.id)?.free ?? BigInt(0),
          assetBBalance: assetsData.get(assetBEntity.id)?.free ?? BigInt(0),

          owner: await getAccount(ctx, poolStorageData.owner),
          start: poolStorageData.start,
          end: poolStorageData.end,
          initialWeight: poolStorageData.initialWeight,
          finalWeight: poolStorageData.finalWeight,
          weightCurve: poolStorageData.weightCurve.__kind,
          fee: poolStorageData.fee,
          feeCollector: poolStorageData.feeCollector
            ? await getAccount(ctx, poolStorageData.feeCollector)
            : null,
          repayTarget: poolStorageData.repayTarget,

          relayChainBlockHeight:
            ctx.batchState.state.relayChainInfo.get(blockHeader.height)
              ?.relaychainBlockNumber ?? 0,
          paraChainBlockHeight: blockHeader.height,
        });

        return poolHistoricalDataEntity;
      })
  );

  const predefinedEntitiesWithoutDuplicates = new Map(
    predefinedEntities.filter((item) => !!item).map((item) => [item.id, item])
  );

  await ctx.store.save([...predefinedEntitiesWithoutDuplicates.values()]);
}

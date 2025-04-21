import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../../parsers/batchBlocksParser';
import parsers from '../../../parsers';
import { Lbppool, LbppoolHistoricalData } from '../../../model';
import { getOrCreateAsset } from '../../assets/asset';
import { getOrCreateLbppool } from './lbpPool';
import { getOrCreateAccount } from '../../accounts';
import { splitIntoBatches } from '../../../utils/helpers';
import { BlockHeader } from '@subsquid/substrate-processor';

export async function handleLbppoolHistoricalData(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  if (!ctx.appConfig.PROCESS_LBP_POOLS) return;

  const predefinedEntities = [];

  for (const blocksSubBatch of splitIntoBatches(ctx.blocks, 100)) {
    const allPoolsPerBlock: Array<{
      blockHeader: BlockHeader;
      pools: Lbppool[];
    }> = await Promise.all(
      blocksSubBatch.map(async ({ header: blockHeader }) => {
        const poolsStorageData = await parsers.storage.lbp.getAllPoolsData({
          block: blockHeader,
        });
        const poolEntities = [];

        for (const poolStorageData of poolsStorageData) {
          poolEntities.push(
            await getOrCreateLbppool({
              ctx,
              assetIds: [poolStorageData.assetAId, poolStorageData.assetBId],
              ensure: true,
              blockHeader,
              poolStorageData,
            })
          );
        }

        return {
          blockHeader,
          pools: poolEntities.filter((item) => !!item) as Lbppool[],
        };
      })
    );

    predefinedEntities.push(
      await Promise.all(
        allPoolsPerBlock
          .map(({ blockHeader, pools }) =>
            pools.map((pool) => ({
              blockHeader: blockHeader,
              pool,
            }))
          )
          .flat()
          .map(async ({ pool, blockHeader }) => {
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

            // TODO refactor redundant assets re-fetch
            const assetAEntity = await getOrCreateAsset({
              ctx,
              id: pool.assetA.id,
              ensure: true,
              blockHeader,
            });
            const assetBEntity = await getOrCreateAsset({
              ctx,
              id: pool.assetB.id,
              ensure: true,
              blockHeader,
            });

            if (
              !assetAEntity ||
              !assetAEntity.assetRegistryId ||
              !assetBEntity ||
              !assetBEntity.assetRegistryId
            )
              return null;

            const poolHistoricalDataEntity = new LbppoolHistoricalData({
              id: `${pool.account.id}-${blockHeader.height}`,
              pool: pool,
              assetA: assetAEntity,
              assetB: assetBEntity,
              assetABalance:
                assetsData.get(assetAEntity.assetRegistryId)?.free ?? BigInt(0),
              assetBBalance:
                assetsData.get(assetBEntity.assetRegistryId)?.free ?? BigInt(0),

              owner: await getOrCreateAccount({
                ctx,
                id: poolStorageData.owner,
              }),
              startBlockNumber: poolStorageData.start,
              endBlockNumber: poolStorageData.end,
              initialWeight: poolStorageData.initialWeight,
              finalWeight: poolStorageData.finalWeight,
              weightCurve: poolStorageData.weightCurve.__kind,
              fee: poolStorageData.fee,
              feeCollector: poolStorageData.feeCollector
                ? await getOrCreateAccount({
                    ctx,
                    id: poolStorageData.feeCollector,
                  })
                : null,
              repayTarget: poolStorageData.repayTarget,

              repayFee: poolStorageData.repayFee,
              maxInRatio: poolStorageData.maxInRatio,
              maxOutRatio: poolStorageData.maxOutRatio,
              minPoolLiquidity: poolStorageData.minPoolLiquidity,
              minTradingLimit: poolStorageData.minTradingLimit,

              relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
                blockHeader.height
              ).height,
              paraBlockHeight: blockHeader.height,
              block: ctx.batchState.state.batchBlocks.get(blockHeader.id),
            });

            return poolHistoricalDataEntity;
          })
      )
    );
  }
  ctx.batchState.state.lbpPoolAllHistoricalData = new Map(
    predefinedEntities
      .flat()
      .filter((item) => !!item)
      .map((item) => [item.id, item])
  );

  await ctx.store.save([
    ...ctx.batchState.state.lbpPoolAllHistoricalData.values(),
  ]);
}

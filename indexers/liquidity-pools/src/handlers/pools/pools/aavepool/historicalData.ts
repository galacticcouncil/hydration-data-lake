import { SqdProcessorContext } from '../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../../../parsers/batchBlocksParser';
import parsers from '../../../../parsers';
import { Aavepool, AavepoolHistoricalData, Asset } from '../../../../model';
import { getOrCreateAavepool } from './aavepool';
import { splitIntoBatches } from '../../../../utils/helpers';
import { BlockHeader } from '@subsquid/substrate-processor';
import { AaveTradeExecutorPoolDataWithPoolId } from '../../../../parsers/runtimeApiResolver/types';
import pMap from 'p-map';
import { MoneyMarketContractsManager } from '../../../../utils/evmTools/moneyMarketContractsManager';
import { getOrCreateAsset } from '../../../assets/asset';

export async function handleAavepoolHistoricalData(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  ctx.batchState.state.aavePools = new Map(
    (
      await ctx.store.find(Aavepool, {
        where: {},
        relations: { reserveAsset: true, aToken: true },
      })
    ).map((p) => [p.id, p])
  );

  const predefinedEntities: AavepoolHistoricalData[] = [];

  for (const blocksSubBatch of splitIntoBatches(
    ctx.blocks,
    ctx.appConfig.HISTORICAL_DATA_PROCESSING_SUB_BATCH_SIZE
  )) {
    const allPoolsPerBlock: Array<{
      blockHeader: BlockHeader;
      poolData: AaveTradeExecutorPoolDataWithPoolId;
    }> = [];

    await pMap(
      blocksSubBatch,
      async ({ header: blockHeader }): Promise<void> => {
        const poolsData = await parsers.storage.aaveTradeExecutor.getPools({
          block: blockHeader,
        });
        if (!poolsData) return;

        for (const poolData of poolsData) {
          allPoolsPerBlock.push({
            blockHeader: blockHeader,
            poolData: poolData,
          });
        }
      },
      {
        concurrency:
          ctx.appConfig.concurrency.ASYNC_OPERATIONS_CONCURRENCY_COMMON,
      }
    );

    await pMap(
      allPoolsPerBlock,
      async ({ poolData, blockHeader }) => {
        const pool = await getOrCreateAavepool({
          ctx,
          reserveAssetId: `${poolData.data.reserve}`,
          aTokenId: `${poolData.data.aToken}`,
          ensure: true,
          blockHeader,
        });

        if (!pool) return;

        const aTokenHistData =
          ctx.batchState.state.assetsHistoricalDataBatch.get(
            `${pool.aToken.id}-${blockHeader.height}`
          );

        let variableDebtTokenHistData;

        if (pool.reserveAsset.variableDebtToken) {
          variableDebtTokenHistData =
            ctx.batchState.state.assetsHistoricalDataBatch.get(
              `${pool.reserveAsset.variableDebtToken?.id}-${blockHeader.height}`
            );
        } else {
          const reserveAssetWithRelations = await ctx.store.findOne(Asset, {
            where: { id: pool.reserveAsset.id },
            relations: {
              variableDebtToken: true,
            },
          });
          if (reserveAssetWithRelations)
            variableDebtTokenHistData =
              ctx.batchState.state.assetsHistoricalDataBatch.get(
                `${reserveAssetWithRelations.variableDebtToken?.id}-${blockHeader.height}`
              );
        }

        const poolHistoricalDataEntity = new AavepoolHistoricalData({
          id: `${pool.id}-${blockHeader.height}`,
          pool,
          reserveAsset: pool.reserveAsset,
          reserveAssetRegistryId: pool.reserveAsset.assetRegistryId,
          aToken: pool.aToken,
          aTokenRegistryId: pool.aToken.assetRegistryId,

          liquidityIn: poolData.data.liquidityIn,
          liquidityOut: poolData.data.liquidityOut,

          aTokenTotalSupply: aTokenHistData?.totalIssuance ?? 0n,
          variableDebtTokenTotalSupply:
            variableDebtTokenHistData?.totalIssuance ?? 0n,

          tvlInRefAssetNorm: '0',

          relayBlockHeight:
            ctx.batchState.state.relayChainInfo.get(blockHeader.height)
              ?.relaychainBlockNumber ?? 0,
          paraBlockHeight: blockHeader.height,
          block: ctx.batchState.state.batchBlocks.get(blockHeader.id),
        });

        predefinedEntities.push(poolHistoricalDataEntity);
      },
      {
        concurrency:
          ctx.appConfig.concurrency.ASYNC_OPERATIONS_CONCURRENCY_COMMON,
      }
    );
  }

  ctx.batchState.state.aavePoolsHistoricalData = new Map(
    predefinedEntities.map((item) => [item.id, item])
  );

  await ctx.store.save(predefinedEntities);
}

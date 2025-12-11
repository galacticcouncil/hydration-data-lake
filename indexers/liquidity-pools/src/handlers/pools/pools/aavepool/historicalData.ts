import pMap from 'p-map';

import { BlockHeader } from '@subsquid/substrate-processor';
import { Store } from '@subsquid/typeorm-store';

import {
  Aavepool,
  AavepoolHistoricalData,
  Asset,
} from '../../../../model';
import parsers from '../../../../parsers';
import {
  BatchBlocksParsedDataManager,
} from '../../../../parsers/batchBlocksParser';
import {
  AaveTradeExecutorPoolDataWithPoolId,
} from '../../../../parsers/runtimeApiResolver/types';
import { SqdProcessorContext } from '../../../../processor';
import { splitIntoBatches } from '../../../../utils/helpers';
import { getOrCreateAsset } from '../../../assets/asset';
import { getOrCreateAavepool } from './aavepool';

export async function handleAavepoolHistoricalData(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  ctx.batchState.state.aavePools = new Map(
    (
      await ctx.storeUtils.findWithLogs(Aavepool, {
        where: {},
        relations: {},
      }, { className: 'Aavepool' })
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
        const reserveAsset = await getOrCreateAsset({
          assetRegistryId: pool.reserveAssetId,
          ensure: true,
          blockHeader,
          ctx,
        })

        if (!reserveAsset) {
          console.log(`handleAavepoolHistoricalData :: reserve asset not found for pool ${pool.id} at block ${blockHeader.height}`);
          return;
        }

        const aTokenHistData =
          ctx.batchState.state.assetsHistoricalDataBatch.get(
            `${pool.aTokenId}-${blockHeader.height}`
          );

        let variableDebtTokenHistData;

        if (reserveAsset.variableDebtTokenId) {
          variableDebtTokenHistData =
            ctx.batchState.state.assetsHistoricalDataBatch.get(
              `${reserveAsset.variableDebtTokenId}-${blockHeader.height}`
            );
        } else {
 
          let debtAsset: Asset | undefined = undefined;
          if(reserveAsset?.variableDebtTokenId) {
            debtAsset = await ctx.storeUtils.findOneWithLogs(Asset, {
              where: { id: reserveAsset?.variableDebtTokenId as string },
              relations: {},
            }, { className: 'Asset' });
          }
          console.log({debtAsset})
          if (debtAsset)
            variableDebtTokenHistData =
              ctx.batchState.state.assetsHistoricalDataBatch.get(
                `${debtAsset?.id}-${blockHeader.height}`
              );
        }

        const aToken = await getOrCreateAsset({
          id: pool.aTokenId,
          assetRegistryId: pool.aTokenId,
          ensure: true,
          blockHeader,
          ctx,
        })

        if (!aToken) {
          console.log(`handleAavepoolHistoricalData :: aToken asset not found for pool ${pool.id} at block ${blockHeader.height}`);
          return;
        }

        const block = ctx.batchState.getParaBlockFromCacheByHeight(blockHeader.height);
        if (!block) {
          throw new Error(`Block not found in cache for height ${blockHeader.height}`);
        }

        const poolHistoricalDataEntity = new AavepoolHistoricalData({
          id: `${pool.id}-${blockHeader.height}`,
          pool,
          reserveAssetId: reserveAsset.id,
          reserveAssetRegistryId: reserveAsset.assetRegistryId,
          aTokenId: aToken?.id,
          aTokenRegistryId: aToken?.assetRegistryId?.toString() || '',

          liquidityIn: poolData.data.liquidityIn,
          liquidityOut: poolData.data.liquidityOut,

          aTokenTotalSupply: aTokenHistData?.totalIssuance ?? 0n,
          variableDebtTokenTotalSupply:
            variableDebtTokenHistData?.totalIssuance ?? 0n,

          tvlInRefAssetNorm: '0',
          paraBlockHeight: blockHeader.height,
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

  await ctx.storeUtils.upsertWithBatches(predefinedEntities);
}

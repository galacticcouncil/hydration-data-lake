import { TypeormDatabase, Store } from '@subsquid/typeorm-store';

import { Block, processor, ProcessorContext } from './processor';
import { BatchState } from './utils/batchState';
import { AppConfig } from './appConfig';
import {
  handleXykPoolsStorage,
  prefetchAllXykPoolRecordsForBlocksRangeToEnsureMissedBlocks,
} from './handlers/xykPool';
import {
  handleOmnipoolStorage,
  prefetchAllOmnipoolRecordsForBlocksRangeToEnsureMissedBlocks,
} from './handlers/omnipool';
import {
  handleStablepoolStorage,
  prefetchAllStablepoolRecordsForBlocksRangeToEnsureMissedBlocks,
} from './handlers/stablepool';
import * as crypto from 'node:crypto';
import { SubProcessorStatusManager } from './utils/subProcessorStatusManager';
import {
  handleLbpPoolsStorage,
  prefetchAllLbppoolRecordsForBlocksRangeToEnsureMissedBlocks,
} from './handlers/lbpPool';
import { splitIntoBatches } from './utils/helpers';
import {
  actualiseAssets,
  ensureNativeToken,
  prefetchAllAssets,
  waitForAssetsActualisation,
} from './handlers/asset/assetRegistry';
import { handleBlockEntities } from './handlers/blocks';
import {
  handleAssetsStorage,
  prefetchAllAssetHistDataRecordsForBlocksRangeToEnsureMissedBlocks,
} from './handlers/asset/historicalData';
import { handleOracles } from './handlers/oracles';
import {
  handleAavePoolsStorage,
  prefetchAllAavepoolRecordsForBlocksRangeToEnsureMissedBlocks,
} from './handlers/aavePool/historicalData';
import { prefetchAllEmaOracleRecordsForBlocksRangeToEnsureMissedBlocks } from './handlers/oracles/emaOracle/historicalData';
import { compressBlockStorage } from './handlers/blockDataCompresion';
import { getXykpoolHistDataWithUniqueData } from './handlers/xykPool/utils';
import { getStableswapHistDataWithUniqueData } from './handlers/stablepool/utils';
import { getOmnipoolHistDataWithUniqueData } from './handlers/omnipool/utils';
import { getAavepoolHistDataWithUniqueData } from './handlers/aavePool/utils';
import { getAssetHistDataWithUniqueData } from './handlers/asset/utils';
import { getEmaOracleHistDataWithUniqueData } from './handlers/oracles/emaOracle/utils';
import { getLbppoolHistDataWithUniqueData } from './handlers/lbpPool/utils';
import { LatestProcessedDataCacheManager } from './utils/latestProcessedDataCacheManager';
import { prefetchAllMmAggregatorOracleRecordsForBlocksRangeToEnsureMissedBlocks } from './handlers/oracles/mmAggregatorOracle/historicalData';
import { getMmAggregatorOraclesWithUniqueData } from './handlers/oracles/mmAggregatorOracle/utils';
import { handleAssetAccountBalancesPerBlock } from './handlers/balances';
import { MoneyMarketContractsManager } from './utils/evm/moneyMarketContractsManager';
import { prefetchAllAccountHistDataRecordsForBlocksRangeToEnsureMissedBlocks } from './handlers/balances/historicalData';
import { getAccAssetBalanceHistDataWithUniqueData } from './handlers/balances/utils';
import {
  handleEvmEventsInBlock,
  handleEvmEventsInBlocksBatch,
  prefetchAllAccountsExtensions,
} from './handlers/evm';
import { getAccMmPosiotionHistDataWithUniqueData } from './handlers/accounts/utils';
import { runProcessorCustomDbMigrations } from './customDbMigrations/runProcessorCustomDbMigrations';

const appConfig = AppConfig.getInstance();

console.log(`Indexer is staring in ${process.env.NODE_ENV} environment`);

if (process.env.INDEXING_IS_PAUSED === 'true') {
  console.log('Indexing is paused. Waiting...');
  while (true) {}
}

async function runProcessor() {
  let customDbMigrationsExecuted = false;

  processor.run(
    new TypeormDatabase({
      supportHotBlocks: true,
      stateSchema: appConfig.STATE_SCHEMA_NAME,
      isolationLevel: 'READ COMMITTED',
    }),
    async (ctx) => {
      if (
        !customDbMigrationsExecuted &&
        appConfig.IS_CUSTOM_DB_MIGRATIONS_RUNNER
      ) {
        /**
         * This execution must be here because native indexer DB migrations
         * must be executed first.
         *
         * Configuring of "IS_CUSTOM_DB_MIGRATIONS_RUNNER" can be useful to
         * avoid parallel runs of the same bunch of migrations by multiple
         * processors if the indexer launched in multiprocessor mode. But even
         * though the migrations runner function will handle such collision with
         * retries logic, however, it will take more time.
         */
        await runProcessorCustomDbMigrations();
        customDbMigrationsExecuted = true;
      }

      console.time('TOTAL BATCH EXECUTION TIME');

      const ctxWithBatchState: Omit<
        ProcessorContext<Store>,
        'batchState' | 'appConfig'
      > = ctx;
      const batchState = new BatchState(
        ctxWithBatchState as ProcessorContext<Store>
      );
      (ctxWithBatchState as ProcessorContext<Store>).batchState = batchState;
      (ctxWithBatchState as ProcessorContext<Store>).appConfig =
        AppConfig.getInstance();

      const subProcessorStatusManager = new SubProcessorStatusManager(
        ctxWithBatchState as ProcessorContext<Store>
      );
      await subProcessorStatusManager.calcSubBatchConfig();

      console.log(`Batch size - ${ctx.blocks.length} blocks.`);

      console.time(`Blocks batch has been processed in`);

      await waitForAssetsActualisation(
        subProcessorStatusManager,
        ctxWithBatchState as ProcessorContext<Store>
      );

      await prefetchAllAssets(ctxWithBatchState as ProcessorContext<Store>);

      await ensureNativeToken(ctxWithBatchState as ProcessorContext<Store>);

      await actualiseAssets(
        ctxWithBatchState as ProcessorContext<Store>,
        subProcessorStatusManager
      );

      const orderedBlockNumbers = (
        ctxWithBatchState as ProcessorContext<Store>
      ).blocks
        .map((b) => b.header.height)
        .sort((a, b) => a - b);

      await prefetchAllXykPoolRecordsForBlocksRangeToEnsureMissedBlocks(
        ctxWithBatchState as ProcessorContext<Store>,
        orderedBlockNumbers
      );
      await prefetchAllStablepoolRecordsForBlocksRangeToEnsureMissedBlocks(
        ctxWithBatchState as ProcessorContext<Store>,
        orderedBlockNumbers
      );
      await prefetchAllOmnipoolRecordsForBlocksRangeToEnsureMissedBlocks(
        ctxWithBatchState as ProcessorContext<Store>,
        orderedBlockNumbers
      );
      await prefetchAllLbppoolRecordsForBlocksRangeToEnsureMissedBlocks(
        ctxWithBatchState as ProcessorContext<Store>,
        orderedBlockNumbers
      );
      await prefetchAllAavepoolRecordsForBlocksRangeToEnsureMissedBlocks(
        ctxWithBatchState as ProcessorContext<Store>,
        orderedBlockNumbers
      );
      await prefetchAllAssetHistDataRecordsForBlocksRangeToEnsureMissedBlocks(
        ctxWithBatchState as ProcessorContext<Store>,
        orderedBlockNumbers
      );
      await prefetchAllEmaOracleRecordsForBlocksRangeToEnsureMissedBlocks(
        ctxWithBatchState as ProcessorContext<Store>,
        orderedBlockNumbers
      );
      await prefetchAllMmAggregatorOracleRecordsForBlocksRangeToEnsureMissedBlocks(
        ctxWithBatchState as ProcessorContext<Store>,
        orderedBlockNumbers
      );
      await prefetchAllAccountHistDataRecordsForBlocksRangeToEnsureMissedBlocks(
        ctxWithBatchState as ProcessorContext<Store>,
        orderedBlockNumbers
      );

      await MoneyMarketContractsManager.getInstance().initContractInstances({
        ctx: ctxWithBatchState as ProcessorContext<Store>,
        blockNumber: ctx.blocks[ctx.blocks.length - 1].header.height,
      });

      /**
       * This must be processed outside of the parallel processing
       */
      if (appConfig.PROCESS_ACCOUNTS) {
        await prefetchAllAccountsExtensions(ctx as ProcessorContext<Store>);
        await handleEvmEventsInBlocksBatch(ctx as ProcessorContext<Store>);
      }

      let blocksSubBatchIndex = 1;

      console.log('START processing blocks');

      for (const blocksSubBatch of splitIntoBatches(
        ctx.blocks,
        subProcessorStatusManager.subBatchConfig.subBatchSize
      )) {
        console.time(
          `Blocks sub-batch #${blocksSubBatchIndex} with size ${subProcessorStatusManager.subBatchConfig.subBatchSize} blocks has been processed in`
        );

        await handleBlockEntities(
          blocksSubBatch,
          ctxWithBatchState as ProcessorContext<Store>
        );

        await Promise.all(
          blocksSubBatch.map(async (block) => {
            if (appConfig.PROCESS_LBP_POOLS)
              await handleLbpPoolsStorage(
                ctxWithBatchState as ProcessorContext<Store>,
                block.header
              );
            if (appConfig.PROCESS_XYK_POOLS)
              await handleXykPoolsStorage(
                ctxWithBatchState as ProcessorContext<Store>,
                block.header
              );
            if (appConfig.PROCESS_OMNIPOOLS)
              await handleOmnipoolStorage(
                ctxWithBatchState as ProcessorContext<Store>,
                block.header
              );
            if (appConfig.PROCESS_STABLEPOOLS)
              await handleStablepoolStorage(
                ctxWithBatchState as ProcessorContext<Store>,
                block.header
              );
            if (appConfig.PROCESS_GENERIC_HIST_DATA) {
              await Promise.all([
                handleAssetsStorage(
                  ctxWithBatchState as ProcessorContext<Store>,
                  block.header
                ),
                handleOracles(
                  ctxWithBatchState as ProcessorContext<Store>,
                  block.header
                ),
                handleAavePoolsStorage(
                  ctxWithBatchState as ProcessorContext<Store>,
                  block.header
                ),
              ]);
            }
            if (appConfig.PROCESS_ACCOUNTS) {
              // await handleEvmEventsInBlock(
              //   block,
              //   ctxWithBatchState as ProcessorContext<Store>
              // );
              await handleAssetAccountBalancesPerBlock(
                block,
                ctxWithBatchState as ProcessorContext<Store>
              );
            }

            /**
             * Should avoid compressing in this point in case
             * PERSIST_HIST_DATA_ONLY_ON_CHANGE === true
             * because compressBlockStorage mutates cached entities.
             * Will be done in "persistUniqueEntities" function.
             */
            if (!appConfig.PERSIST_HIST_DATA_ONLY_ON_CHANGE)
              await compressBlockStorage(
                ctxWithBatchState as ProcessorContext<Store>,
                block.header
              );
          })
        );

        console.timeEnd(
          `Blocks sub-batch #${blocksSubBatchIndex} with size ${subProcessorStatusManager.subBatchConfig.subBatchSize} blocks has been processed in`
        );
        const exactTimeout = crypto.randomInt(
          0,
          appConfig.SUB_BATCH_MAX_TIMEOUT_MS
        );
        await new Promise((res) => setTimeout(res, exactTimeout));
        console.log(`Sub-batch timeout: ${exactTimeout}ms.`);
        blocksSubBatchIndex++;
      }
      console.timeEnd(`Blocks batch has been processed in`);

      console.time(`Unique entities have been saved in`);
      await persistUniqueEntities(ctxWithBatchState as ProcessorContext<Store>);
      console.timeEnd(`Unique entities have been saved in`);

      await subProcessorStatusManager.setSubProcessorStatus({
        height: ctx.blocks[ctx.blocks.length - 1].header.height,
      });
      console.log('Batch complete');
      console.timeEnd('TOTAL BATCH EXECUTION TIME');
    }
  );
}

runProcessor().catch(console.error);

async function persistUniqueEntities(ctx: ProcessorContext<Store>) {
  if (!ctx.appConfig.PERSIST_HIST_DATA_ONLY_ON_CHANGE) return;

  if (appConfig.PROCESS_LBP_POOLS) {
    const { pools: lbppools, poolAssets: lbppoolAssets } =
      await getLbppoolHistDataWithUniqueData({
        ctx,
        poolsData: ctx.batchState.state.lbpPools,
        poolAssetsData: ctx.batchState.state.lbpPoolAssetsData,
      });

    if (lbppools.size !== 0)
      await ctx.store.upsert(Array.from(lbppools.values()));
    if (lbppoolAssets.size !== 0)
      await ctx.store.upsert(Array.from(lbppoolAssets.values()));
  }

  if (appConfig.PROCESS_XYK_POOLS) {
    await LatestProcessedDataCacheManager.getInstance().prefetchLastXykpoolAssetHistDataItem(
      ctx
    );

    const { pools: xykpools, poolAssets: xykpoolAssets } =
      await getXykpoolHistDataWithUniqueData(
        ctx.batchState.state.xykPoolAssetsData,
        ctx
      );

    const xykpoolAssetsToSaveList = Array.from(xykpoolAssets.values());

    LatestProcessedDataCacheManager.getInstance().setLastXykpoolAssetHistDataItem(
      xykpoolAssetsToSaveList
    );

    await ctx.store.upsert(Array.from(xykpools.values()));
    await ctx.store.upsert(xykpoolAssetsToSaveList);
  }

  if (appConfig.PROCESS_OMNIPOOLS) {
    const { pools: omnipools, poolAssets: omnipoolAssets } =
      await getOmnipoolHistDataWithUniqueData({
        ctx,
        poolsData: ctx.batchState.state.omnipools,
        poolAssetsData: ctx.batchState.state.omnipoolAssetsData,
      });

    if (omnipools.size !== 0)
      await ctx.store.upsert(Array.from(omnipools.values()));
    if (omnipoolAssets.size !== 0)
      await ctx.store.upsert(Array.from(omnipoolAssets.values()));
  }

  if (appConfig.PROCESS_STABLEPOOLS) {
    const { pools: stableswaps, poolAssets: stableswapAssets } =
      await getStableswapHistDataWithUniqueData({
        ctx,
        poolsData: ctx.batchState.state.stablepools,
        poolAssetsData: ctx.batchState.state.stablepoolAssetsData,
      });

    const mmAggregatorOracles = await getMmAggregatorOraclesWithUniqueData(
      ctx.batchState.state.mmAggregatorOracles,
      ctx
    );

    if (stableswaps.size !== 0)
      await ctx.store.upsert(Array.from(stableswaps.values()));
    if (stableswapAssets.size !== 0)
      await ctx.store.upsert(Array.from(stableswapAssets.values()));
    if (mmAggregatorOracles.size !== 0)
      await ctx.store.upsert(Array.from(mmAggregatorOracles.values()));
  }

  if (appConfig.PROCESS_GENERIC_HIST_DATA) {
    await LatestProcessedDataCacheManager.getInstance().prefetchLastAssetHistDataItem(
      ctx
    );

    const aavepoolsToSave = await getAavepoolHistDataWithUniqueData(
      ctx.batchState.state.aavepools,
      ctx
    );

    const eassetHistDataToSave = await getAssetHistDataWithUniqueData(
      ctx.batchState.state.assetHistoricalDataItems,
      ctx
    );

    const emaOracleDataToSave = await getEmaOracleHistDataWithUniqueData(
      ctx.batchState.state.emaOracles,
      ctx
    );

    const aavepoolsToSaveList = Array.from(aavepoolsToSave.values());
    const eassetHistDataToSaveList = Array.from(eassetHistDataToSave.values());
    const emaOracleDataToSaveList = Array.from(emaOracleDataToSave.values());

    LatestProcessedDataCacheManager.getInstance().setLastAssetHistoricalDataItem(
      eassetHistDataToSaveList
    );
    LatestProcessedDataCacheManager.getInstance().setLastAavepool(
      aavepoolsToSaveList
    );
    LatestProcessedDataCacheManager.getInstance().setLastEmaOracle(
      emaOracleDataToSaveList
    );

    console.time('SAVE');
    await ctx.store.upsert(aavepoolsToSaveList);
    await ctx.store.upsert(eassetHistDataToSaveList);
    await ctx.store.upsert(emaOracleDataToSaveList);
    console.timeEnd('SAVE');
  }

  if (appConfig.PROCESS_ACCOUNTS) {
    const accountAssetBalances = await getAccAssetBalanceHistDataWithUniqueData(
      ctx.batchState.state.accAssetBalanceHistData,
      ctx
    );
    const accountMmPositionData = await getAccMmPosiotionHistDataWithUniqueData(
      ctx.batchState.state.accMmPositionHistData,
      ctx
    );

    const accountAssetBalancesToSaveList = Array.from(
      accountAssetBalances.values()
    );

    const accountMmPositionDataToSaveList = Array.from(
      accountMmPositionData.values()
    );

    LatestProcessedDataCacheManager.getInstance().setLastAccAssetBalanceHistDataItem(
      accountAssetBalancesToSaveList
    );
    LatestProcessedDataCacheManager.getInstance().setLastAccMmPositionHistDataItem(
      accountMmPositionDataToSaveList
    );

    if (accountAssetBalancesToSaveList.length !== 0)
      await ctx.store.upsert(accountAssetBalancesToSaveList);

    if (accountMmPositionDataToSaveList.length !== 0)
      await ctx.store.upsert(accountMmPositionDataToSaveList);
  }

  for (const block of ctx.blocks) {
    await compressBlockStorage(ctx, block.header);
  }
}

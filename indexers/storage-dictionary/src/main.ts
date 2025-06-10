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
import { handleOracles } from './handlers/oracles/emaOracle';
import {
  handleAavePoolsStorage,
  prefetchAllAavepoolRecordsForBlocksRangeToEnsureMissedBlocks,
} from './handlers/aavePool/historicalData';
import { prefetchAllEmaOracleRecordsForBlocksRangeToEnsureMissedBlocks } from './handlers/oracles/emaOracle/historicalData';
import { compressBlockStorage } from './handlers/blockDataCompresion';

const appConfig = AppConfig.getInstance();

console.log(`Indexer is staring in ${process.env.NODE_ENV} environment`);

if (process.env.INDEXING_IS_PAUSED === 'true') {
  console.log('Indexing is paused. Waiting...');
  while (true) {}
}

processor.run(
  new TypeormDatabase({
    supportHotBlocks: true,
    stateSchema: appConfig.STATE_SCHEMA_NAME,
    isolationLevel: 'READ COMMITTED',
  }),
  async (ctx) => {
    const ctxWithBatchState: Omit<
      ProcessorContext<Store>,
      'batchState' | 'appConfig'
    > = ctx;
    const batchState = new BatchState();
    (ctxWithBatchState as ProcessorContext<Store>).batchState = batchState;
    (ctxWithBatchState as ProcessorContext<Store>).appConfig =
      AppConfig.getInstance();

    // if (
    //   (ctxWithBatchState as ProcessorContext<Store>).appConfig
    //     .INDEXING_IS_PAUSED
    // ) {
    //   await new Promise((res) => console.log('Indexing is paused. Waiting...'));
    // }

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

    await prefetchAllXykPoolRecordsForBlocksRangeToEnsureMissedBlocks(
      ctxWithBatchState as ProcessorContext<Store>
    );
    await prefetchAllStablepoolRecordsForBlocksRangeToEnsureMissedBlocks(
      ctxWithBatchState as ProcessorContext<Store>
    );
    await prefetchAllOmnipoolRecordsForBlocksRangeToEnsureMissedBlocks(
      ctxWithBatchState as ProcessorContext<Store>
    );
    await prefetchAllLbppoolRecordsForBlocksRangeToEnsureMissedBlocks(
      ctxWithBatchState as ProcessorContext<Store>
    );
    await prefetchAllAavepoolRecordsForBlocksRangeToEnsureMissedBlocks(
      ctxWithBatchState as ProcessorContext<Store>
    );
    await prefetchAllAssetHistDataRecordsForBlocksRangeToEnsureMissedBlocks(
      ctxWithBatchState as ProcessorContext<Store>
    );
    await prefetchAllEmaOracleRecordsForBlocksRangeToEnsureMissedBlocks(
      ctxWithBatchState as ProcessorContext<Store>
    );

    let blocksSubBatchIndex = 1;

    for (const blocksSubBatch of splitIntoBatches(
      ctx.blocks,
      subProcessorStatusManager.subBatchConfig.subBatchSize
      // 334
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

    await subProcessorStatusManager.setSubProcessorStatus({
      height: ctx.blocks[ctx.blocks.length - 1].header.height,
    });
    console.log('Batch complete');
  }
);

import { TypeormDatabase, Store } from '@subsquid/typeorm-store';

import { processor, ProcessorContext } from './processor';
import { BatchState } from './utils/batchState';
import { AppConfig } from './appConfig';
import { handleXykPoolsStorage } from './handlers/xykPool';
import { handleOmnipoolStorage } from './handlers/omnipoolPool';
import { handleStablepoolStorage } from './handlers/stablepool';
// import { splitIntoBatches } from '@repo/data-lake-utils/common';
import * as crypto from 'node:crypto';
import { SubProcessorStatusManager } from './utils/subProcessorStatusManager';
import { handleLbpPoolsStorage } from './handlers/lbpPool';
import { splitIntoBatches } from './utils/helpers';
import {
  actualiseAssets,
  ensureNativeToken,
  prefetchAllAssets,
} from './handlers/asset/assetRegistry';

const appConfig = AppConfig.getInstance();

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

    const subProcessorStatusManager = new SubProcessorStatusManager(
      ctxWithBatchState as ProcessorContext<Store>
    );
    await subProcessorStatusManager.calcSubBatchConfig();

    await prefetchAllAssets(ctxWithBatchState as ProcessorContext<Store>);

    await ensureNativeToken(ctxWithBatchState as ProcessorContext<Store>);

    await actualiseAssets(
      ctxWithBatchState as ProcessorContext<Store>,
      subProcessorStatusManager
    );

    console.log(`Batch size - ${ctx.blocks.length} blocks.`);

    console.time(`Blocks batch has been processed in`);
    let blocksSubBatchIndex = 1;
    for (const blocksSubBatch of splitIntoBatches(
      ctx.blocks,
      subProcessorStatusManager.subBatchConfig.subBatchSize
      // 334
    )) {
      console.time(
        `Blocks sub-batch #${blocksSubBatchIndex} with size ${subProcessorStatusManager.subBatchConfig.subBatchSize} blocks has been processed in`
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

import { TypeormDatabase, Store } from '@subsquid/typeorm-store';

import { processor, SqdProcessorContext } from './processor';
import { BatchState } from './utils/batchState';
import { AppConfig } from './appConfig';
import { printV8MemoryHeap } from './utils/helpers';
import {
  execAllInOneProcessorHandlers,
  execCoreProcessorHandlers,
} from './processorHelpers/multiprocessorHandlers';
import { execSpotPricesProcessorHandlers } from './processorHelpers/multiprocessorHandlers/spotPricesProc';
import { RedisTimeSeriesManager } from './utils/redisTimeSeriesManager';

console.log(
  `Indexer is staring for CHAIN - ${process.env.CHAIN} in ${process.env.NODE_ENV} environment`
);

if (process.env.INDEXING_IS_PAUSED === 'true') {
  console.log('Indexing is paused. Waiting...');
  while (true) {}
}

const appConfig = AppConfig.getInstance();

processor.run(
  new TypeormDatabase({
    supportHotBlocks: true,
    stateSchema: appConfig.STATE_SCHEMA_NAME,
    isolationLevel: 'READ COMMITTED',
  }),
  async (ctx) => {
    printV8MemoryHeap();

    console.time('TOTAL BATCH EXECUTION TIME');

    const ctxWithBatchState: Omit<
      SqdProcessorContext<Store>,
      'batchState' | 'appConfig'
    > = ctx;
    (ctxWithBatchState as SqdProcessorContext<Store>).batchState =
      new BatchState(ctxWithBatchState as SqdProcessorContext<Store>);
    (ctxWithBatchState as SqdProcessorContext<Store>).appConfig =
      AppConfig.getInstance();

    await RedisTimeSeriesManager.getInstance().initClient();

    await execAllInOneProcessorHandlers(
      ctxWithBatchState as SqdProcessorContext<Store>
    );

    await execCoreProcessorHandlers(
      ctxWithBatchState as SqdProcessorContext<Store>
    );

    await execSpotPricesProcessorHandlers(
      ctxWithBatchState as SqdProcessorContext<Store>
    );

    (ctxWithBatchState as SqdProcessorContext<Store>).batchState.wipeState();

    console.timeEnd('TOTAL BATCH EXECUTION TIME');
  }
);

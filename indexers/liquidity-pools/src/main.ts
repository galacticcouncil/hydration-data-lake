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
import { handleReaggregationProcessing } from './processorHelpers/multiprocessorHandlers/recalculationProcessing';
import {
  getProcessingMode,
  ProcessingMode,
} from './processorHelpers/getProcessingMode';
import { TypeormDatabaseUtils } from './utils/typeormDatabaseUtils';

console.log(
  `Indexer is staring for CHAIN - ${process.env.CHAIN} in ${process.env.NODE_ENV} environment`
);

/**
 * Pause mechanism for indexing operations.
 *
 * When INDEXING_IS_PAUSED environment variable is set to 'true',
 * the processor enters a waiting state without terminating the application.
 * This allows for graceful pause/resume functionality during maintenance
 * or debugging without requiring a full restart.
 *
 * Note: The processor will remain in this loop until the environment
 * variable is changed and the application is restarted.
 */
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

    const ctxWithBatchState = ctx as SqdProcessorContext<Store>;
    ctxWithBatchState.batchState = new BatchState(
      ctxWithBatchState as SqdProcessorContext<Store>
    );
    ctxWithBatchState.appConfig = AppConfig.getInstance();
    ctxWithBatchState.storeUtils = new TypeormDatabaseUtils();

    await RedisTimeSeriesManager.getInstance().initClient();

    console.log(`Processing mode >>> ${getProcessingMode(ctxWithBatchState)}`);

    switch (getProcessingMode(ctxWithBatchState)) {
      case ProcessingMode.ALL_IN_ONE_MULTI_FLOW_PROCESSOR:
      case ProcessingMode.ALL_IN_ONE_SINGLE_FLOW_PROCESSOR:
        /**
         * ----- A L L  I N  O N E  S I N G L E  P R O C E S S O R ---------->>>
         *                            A N D
         * --- A L L  I N  O N E  M U L T I F L O W  P R O C E S S O R ------>>>
         */
        await execAllInOneProcessorHandlers(ctxWithBatchState);
        break;
      case ProcessingMode.REAGGREGATION_SINGLE_PROCESSOR:
        /**
         * ------------------ R E A G G R E G A T I O N --------------------->>>
         *
         * This block executes when the processor runs in reaggregation mode.
         * It performs data recalculation or reaggregation operations using
         * existing database records, bypassing normal event processing.
         */
        await handleReaggregationProcessing(ctxWithBatchState);
        break;

      case ProcessingMode.MULTI_PROCESSOR_CORE_PROCESSOR:
        /**
         * ----------- M U L T I  P R O C E S S O R :: C O R E -------------->>>
         */
        await execCoreProcessorHandlers(ctxWithBatchState);
        break;
      case ProcessingMode.MULTI_PROCESSOR_SPOT_PRICES_PROCESSOR:
        /**
         * ---------- M U L T I  P R O C E S S O R :: P R I C E S ----------->>>
         */
        await execSpotPricesProcessorHandlers(ctxWithBatchState);
        break;
    }

    ctxWithBatchState.batchState.wipeState();
    console.timeEnd('TOTAL BATCH EXECUTION TIME');
  }
);

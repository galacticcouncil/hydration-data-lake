import {
  MultiProcPoolJobProcessingStatus,
  MultiProcPoolJobsMap,
  MultiProcPoolManager,
  PgBossQueueName,
} from '../index';
import { AppConfig } from '../../../appConfig';

const appConfig = AppConfig.getInstance();

export class SpotPriceProcPoolManager {
  static async changeJobsStatusFromPreviousBatch({
    batchStartBlockHeight,
  }: {
    batchStartBlockHeight: number;
  }) {
    await MultiProcPoolManager.getInstance().changeJobsStatusFromPreviousBatch({
      batchStartBlockHeight,
      derivativeQueueNames: [
        PgBossQueueName.BALANCES_PROCESSOR,
        PgBossQueueName.POOL_AND_ASSET_METRICS_PROCESSOR,
      ],
      currentProcQueueName: PgBossQueueName.SPOT_PRICES_PROCESSOR,
      schemaName: appConfig.STATE_SCHEMA_NAME,
    });
  }

  static async publishPendingJobs({
    processedBlocksRange,
    processedBlocksList,
  }: {
    processedBlocksRange?: number[];
    processedBlocksList?: number[];
  }) {
    if (!processedBlocksRange && !processedBlocksList)
      throw new Error(
        'processedBlocksRange or processedBlocksList must be defined'
      );

    const blocksList =
      processedBlocksList ??
      Array.from(
        {
          length: processedBlocksRange![1] - processedBlocksRange![0] + 1,
        },
        (v, i) => processedBlocksRange![0] + i
      );

    const jobsMap: MultiProcPoolJobsMap = new Map([
      [
        PgBossQueueName.BALANCES_PROCESSOR,
        blocksList.map((blockNumber) => ({
          blockNumber,
          jobStatus: MultiProcPoolJobProcessingStatus.PENDING,
          producedBy: appConfig.STATE_SCHEMA_NAME,
        })),
      ],
      [
        PgBossQueueName.POOL_AND_ASSET_METRICS_PROCESSOR,
        blocksList.map((blockNumber) => ({
          blockNumber,
          jobStatus: MultiProcPoolJobProcessingStatus.PENDING,
          producedBy: appConfig.STATE_SCHEMA_NAME,
        })),
      ],
    ]);

    await MultiProcPoolManager.getInstance().publishPendingJobs(jobsMap);
  }

  static async waitAndGetJobsToProcess({
    fromBlock,
    toBlock,
  }: {
    fromBlock: number;
    toBlock: number;
  }) {
    await MultiProcPoolManager.getInstance().waitAndGetJobsToProcess({
      queueName: PgBossQueueName.SPOT_PRICES_PROCESSOR,
      schemaName: appConfig.STATE_SCHEMA_NAME,
      fromBlock,
      toBlock,
    });
  }
}

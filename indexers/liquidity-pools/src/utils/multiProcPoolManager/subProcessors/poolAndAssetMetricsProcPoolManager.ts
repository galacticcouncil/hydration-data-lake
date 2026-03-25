import {
  MultiProcPoolJobProcessingStatus,
  MultiProcPoolJobsMap,
  MultiProcPoolManager,
  PgBossQueueName,
} from '../index';
import { AppConfig } from '../../../appConfig';

const appConfig = AppConfig.getInstance();

export class PoolAndAssetMetricsProcPoolManager {
  static async changeJobsStatusFromPreviousBatch({
    batchStartBlockHeight,
  }: {
    batchStartBlockHeight: number;
  }) {
    await MultiProcPoolManager.getInstance().changeJobsStatusFromPreviousBatch({
      batchStartBlockHeight,
      currentProcQueueName: PgBossQueueName.POOL_AND_ASSET_METRICS_PROCESSOR,
      schemaName: appConfig.STATE_SCHEMA_NAME,
    });
  }

  static async waitAndGetJobsToProcess({
    fromBlock,
    toBlock,
  }: {
    fromBlock: number;
    toBlock: number;
  }) {
    await MultiProcPoolManager.getInstance().waitAndGetJobsToProcess({
      queueName: PgBossQueueName.POOL_AND_ASSET_METRICS_PROCESSOR,
      schemaName: appConfig.STATE_SCHEMA_NAME,
      fromBlock,
      toBlock,
    });
  }
  static async waitJobsToProcess({
    fromBlock,
    toBlock,
  }: {
    fromBlock: number;
    toBlock: number;
  }) {
    await MultiProcPoolManager.getInstance().waitJobsToProcess({
      queueName: PgBossQueueName.POOL_AND_ASSET_METRICS_PROCESSOR,
      schemaName: appConfig.STATE_SCHEMA_NAME,
      fromBlock,
      toBlock,
    });
  }
}

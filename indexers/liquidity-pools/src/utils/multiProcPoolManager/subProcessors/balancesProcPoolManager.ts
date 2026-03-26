import {
  MultiProcPoolJobProcessingStatus,
  MultiProcPoolJobsMap,
  MultiProcPoolManager,
  PgBossQueueName,
} from '../index';
import { AppConfig } from '../../../appConfig';

const appConfig = AppConfig.getInstance();

export class BalancesProcPoolManager {
  static async changeJobsStatusFromPreviousBatch({
    batchStartBlockHeight,
  }: {
    batchStartBlockHeight: number;
  }) {
    await MultiProcPoolManager.getInstance().changeJobsStatusFromPreviousBatch({
      batchStartBlockHeight,
      currentProcQueueName: PgBossQueueName.BALANCES_PROCESSOR,
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
      queueName: PgBossQueueName.BALANCES_PROCESSOR,
      schemaName: appConfig.STATE_SCHEMA_NAME,
      fromBlock,
      toBlock,
    });
  }
  static async checkNextAvailableBatchToProcess({
    currentHeadBlockNumber,
  }: {
    currentHeadBlockNumber: number;
  }) {
    await MultiProcPoolManager.getInstance().checkNextAvailableBatchToProcess({
      queueName: PgBossQueueName.BALANCES_PROCESSOR,
      schemaName: appConfig.STATE_SCHEMA_NAME,
      currentHeadBlockNumber,
    });
  }
}

import { RedisTimeSeriesManager } from '../redisTimeSeriesManager';
import { AppConfig } from '../../appConfig';
import {
  BullQueueClient,
  DataCommiterJobData,
  DataCommitterJobName,
} from './queueClient';
import { DoneCallback, Job } from 'bull';
import { ApiSupportPgClient } from './apiSupportPgClient';

const appConfig = AppConfig.getInstance();

export class TimeSeriesDataCommitManager {
  private static instance: TimeSeriesDataCommitManager;

  static getInstance(): TimeSeriesDataCommitManager {
    if (!TimeSeriesDataCommitManager.instance) {
      TimeSeriesDataCommitManager.instance = new TimeSeriesDataCommitManager();
    }
    return TimeSeriesDataCommitManager.instance;
  }

  async initCommiter() {
    if (!appConfig.COMMIT_HIST_DATA_TO_REDIS_TIME_SERIES) return;

    console.log('TimeSeriesCommitManager::initCommiter');

    const bullQueueClient = BullQueueClient.getInstance();

    try {
      // @ts-ignore
      bullQueueClient.dataCommitterQueue.process(
        DataCommitterJobName.commitAccountTotalBalance,
        1,
        (job) => this.commitAccountTotalBalancesJobHandler(job)
      );
    } catch (error) {
      console.error(
        `Error setting up ${DataCommitterJobName.commitAccountTotalBalance} processor:`,
        error
      );
    }

    try {
      // @ts-ignore
      bullQueueClient.dataCommitterQueue.process(
        DataCommitterJobName.commitAssetPriceVolume,
        1,
        (job) => this.commitAssetPriceVolumeJobHandler(job)
      );
    } catch (error) {
      console.error(
        `Error setting up ${DataCommitterJobName.commitAssetPriceVolume} processor:`,
        error
      );
    }
  }

  async addNewDataCommitterJob(jobData: DataCommiterJobData) {
    const bullQueueClient = BullQueueClient.getInstance();

    await bullQueueClient.setDataCommitterJob({
      jobName: jobData.actionName,
      data: jobData,
    });
  }

  async commitAssetPriceVolumeJobHandler(job: Job<DataCommiterJobData>) {
    if (!job.data) {
      return 'No job data';
    }
    const {
      actionName,
      priceVolumeDataMany,
      priceVolumeDataLatestProcessedBlock,
    } = job.data;

    if (
      (actionName !== DataCommitterJobName.commitAssetPriceVolume &&
        !priceVolumeDataMany) ||
      priceVolumeDataMany?.length === 0
    ) {
      return 'No enough params';
    }

    const redisTimeSeriesManager = RedisTimeSeriesManager.getInstance();

    await redisTimeSeriesManager.addMultiplePrices(
      job.data.priceVolumeDataMany!
    );

    if (!appConfig.redis.ENABLE_UPDATE_COMMIT_DATA_COUNTER_ON_COMMIT) return;

    const apiStatePgClient = ApiSupportPgClient.getInstance();

    let latestProcessedBlockHeight = priceVolumeDataLatestProcessedBlock;

    if (!latestProcessedBlockHeight) {
      const apiState = await apiStatePgClient.getApiState();
      latestProcessedBlockHeight = apiState.assetPriceLatestProcessedBlock;
    }

    try {
      await apiStatePgClient.upsertApiState({
        assetPriceLatestProcessedBlock: latestProcessedBlockHeight,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async commitAccountTotalBalancesJobHandler(job: Job<DataCommiterJobData>) {
    if (!job.data) {
      return 'No job data';
    }
    const {
      actionName,
      accountTotalBalanceMany,
      accountTotalBalanceLatestProcessedBlock,
    } = job.data;

    if (
      (actionName !== DataCommitterJobName.commitAccountTotalBalance &&
        !accountTotalBalanceMany) ||
      accountTotalBalanceMany?.length === 0
    ) {
      return 'No enough params';
    }

    const redisTimeSeriesManager = RedisTimeSeriesManager.getInstance();

    await redisTimeSeriesManager.addMultipleAccountTotalBalances(
      job.data.accountTotalBalanceMany!
    );

    if (!appConfig.redis.ENABLE_UPDATE_COMMIT_DATA_COUNTER_ON_COMMIT) return;

    const apiStatePgClient = ApiSupportPgClient.getInstance();

    let latestProcessedBlockHeight = accountTotalBalanceLatestProcessedBlock;

    if (!latestProcessedBlockHeight) {
      const apiState = await apiStatePgClient.getApiState();
      latestProcessedBlockHeight = apiState.accTotalBalanceLatestProcBlock;
    }

    try {
      await apiStatePgClient.upsertApiState({
        accTotalBalanceLatestProcBlock: latestProcessedBlockHeight,
      });
    } catch (e) {
      console.log(e);
    }
  }
}

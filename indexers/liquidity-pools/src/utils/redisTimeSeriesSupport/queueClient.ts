import { AppConfig } from '../../appConfig';
import Queue, { DoneCallback, Job, JobStatusClean } from 'bull';
import * as crypto from 'node:crypto';
import {
  AddMultipleAccountTotalBalancesPayload,
  AddMultiplePricesPayload,
} from '../redisTimeSeriesManager';

const appConfig = AppConfig.getInstance();

export enum HistDataScrapperJobName {
  assetPriceHistData = 'assetPriceHistData',
  accountTotalBalancesHistData = 'accountTotalBalancesHistData',
}

export enum DataCommitterJobName {
  commitAssetPriceVolume = 'commitAssetPriceVolume',
  commitAccountTotalBalance = 'commitAccountTotalBalance',
}

export type HistDataScrapperJobData = {
  blockHeight: number;
};

export type DataCommiterJobData = {
  actionName: DataCommitterJobName;
  priceVolumeDataMany?: AddMultiplePricesPayload[] | null;
  accountTotalBalanceMany?: AddMultipleAccountTotalBalancesPayload[] | null;
  priceVolumeDataLatestProcessedBlock?: number | null;
  accountTotalBalanceLatestProcessedBlock?: number | null;
  metadata: {
    commitRequestedAtParaBlock: number;
    requestSender: 'processor' | 'api';
  };
};

export class BullQueueClient {
  private static instance: BullQueueClient;

  private assetPriceScrapperQueueName = `${appConfig.INDEXER_ID}_PROCESSING_POOL`;
  public assetPriceScrapperQueue: Queue.Queue<HistDataScrapperJobData>;

  private dataCommitterQueueName = `${appConfig.INDEXER_ID}_DATA_COMMITTER`;
  public dataCommitterQueue: Queue.Queue<DataCommiterJobData>;

  static getInstance(): BullQueueClient {
    if (!BullQueueClient.instance) {
      BullQueueClient.instance = new BullQueueClient();
    }
    return BullQueueClient.instance;
  }

  constructor() {
    this.assetPriceScrapperQueue = new Queue(this.assetPriceScrapperQueueName, {
      redis: {
        port: appConfig.TS_REDIS_PORT,
        host: appConfig.TS_REDIS_HOST,
        password: appConfig.TS_REDIS_PASS,
        db: appConfig.TS_REDIS_KEY_SPACE_ID,
      },
    });

    this.dataCommitterQueue = new Queue(this.dataCommitterQueueName, {
      redis: {
        port: appConfig.TS_REDIS_PORT,
        host: appConfig.TS_REDIS_HOST,
        password: appConfig.TS_REDIS_PASS,
        db: appConfig.TS_REDIS_KEY_SPACE_ID,
      },
    });
  }

  async wipeScrapperQueue() {
    const statuses = [
      'completed',
      'failed',
      'active',
      'delayed',
      'wait',
      'failed',
    ] as JobStatusClean[];

    console.log(`wipeScrapperQueue [${this.assetPriceScrapperQueue.name}] >>>`);

    for (const status of statuses) {
      const removedJobs = await this.assetPriceScrapperQueue.clean(0, status);
      console.log(
        ` - Removed ${status} jobs: ${removedJobs ? removedJobs.length : 0}`
      );
    }
  }

  async cleanUpScrapperNextTickJobs(jobName: HistDataScrapperJobName) {
    console.log('cleanUpScrapperNextTickJobs - jobName -', jobName);
    let jobs: Array<Job<HistDataScrapperJobData>> = [];
    try {
      jobs = await this.assetPriceScrapperQueue.getJobs([
        'active',
        'delayed',
        'completed',
        'paused',
        'waiting',
        'failed',
      ]);
    } catch (e) {
      console.log(e);
    }

    if (!jobs || !jobs.length) return;

    console.log(jobs.map((j) => j.name));

    try {
      for (const job of jobs) {
        console.log(`> ${job.name} - ${job.id}`);
        if (job.name !== jobName) continue;
        try {
          await job.releaseLock();
        } catch (e) {
          console.log(e);
        }
        console.log(`> lock released ${job.name}`);
        try {
          await job.remove();
        } catch (e) {
          console.log(e);
        }
        console.log(`> removed ${job.name}`);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async setScrapperNextTickJob({
    jobName,
    data,
    customId,
  }: {
    jobName: HistDataScrapperJobName;
    data: HistDataScrapperJobData;
    customId?: string;
  }) {
    try {
      await this.assetPriceScrapperQueue.add(jobName, data, {
        // jobId: `${jobName}_${data.blockHeight}`,
        jobId: customId ?? crypto.randomUUID(),
        delay: appConfig.redis.TIME_SERIES_DATA_SCRAPPER_TIMEOUT_MS,
        removeOnComplete: true,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async setDataCommitterJob({
    jobName,
    data,
  }: {
    jobName: DataCommitterJobName;
    data: DataCommiterJobData;
  }) {
    try {
      await this.dataCommitterQueue.add(jobName, data, {
        jobId: crypto.randomUUID(),
        removeOnComplete: true,
      });
    } catch (e) {
      console.log(e);
    }
  }
}

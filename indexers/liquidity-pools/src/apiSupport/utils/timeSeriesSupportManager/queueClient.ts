import { AppConfig } from '../../../appConfig';
import Queue, { DoneCallback, Job } from 'bull';
import * as crypto from 'node:crypto';

const appConfig = AppConfig.getInstance();

export enum HistDataScrapperJobName {
  assetPriceHistData = 'assetPriceHistData',
  accountTotalBalancesHistData = 'accountTotalBalancesHistData',
}

export type HistDataScrapperJobData = {
  blockHeight: number;
};

export class BullQueueClient {
  private static instance: BullQueueClient;

  private queueName = `${appConfig.INDEXER_ID}_PROCESSING_POOL`;
  public assetPriceScrapperQueue: Queue.Queue<HistDataScrapperJobData>;

  static getInstance(): BullQueueClient {
    if (!BullQueueClient.instance) {
      BullQueueClient.instance = new BullQueueClient();
    }
    return BullQueueClient.instance;
  }

  constructor() {
    this.assetPriceScrapperQueue = new Queue(this.queueName, {
      redis: {
        port: appConfig.redis.TS_REDIS_PORT,
        host: appConfig.redis.TS_REDIS_HOST,
        password: appConfig.redis.TS_REDIS_PASS,
        db: appConfig.redis.TS_REDIS_KEY_SPACE_ID,
      },
    });
  }

  async cleanUpScrapperNextTickJobs(jobName: HistDataScrapperJobName) {
    try {
      const jobs = await this.assetPriceScrapperQueue.getJobs([
        'active',
        'delayed',
        'completed',
        'paused',
        'waiting',
      ]);

      for (const job of jobs) {
        if (job.name !== jobName) continue;
        try {
          await job.remove();
        } catch (e) {
          console.log(e);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  async setScrapperNextTickJob({
    jobName,
    data,
  }: {
    jobName: HistDataScrapperJobName;
    data: HistDataScrapperJobData;
  }) {
    try {
      await this.assetPriceScrapperQueue.add(jobName, data, {
        // jobId: `${jobName}_${data.blockHeight}`,
        jobId: crypto.randomUUID(),
        delay: appConfig.redis.TIME_SERIES_DATA_SCRAPPER_TIMEOUT_MS,
        removeOnComplete: true,
      });
    } catch (e) {
      console.log(e);
    }
  }
}

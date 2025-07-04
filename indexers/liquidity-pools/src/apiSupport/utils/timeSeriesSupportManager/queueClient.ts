import { AppConfig } from '../../../appConfig';
import { Pool, QueryResult, QueryResultRow } from 'pg';
import { getApiState, setApiState } from './sql/apiState.sql';
import Queue, { DoneCallback, Job } from 'bull';
import { JobProcessingStatus } from '../../../utils/processingPoolManager';

const appConfig = AppConfig.getInstance();

export class BullQueueClient {
  private static instance: BullQueueClient;

  private queueName = `${appConfig.INDEXER_ID}_PROCESSING_POOL`;
  public assetPriceScrapperQueue: Queue.Queue<{}>;

  static getInstance(): BullQueueClient {
    if (!BullQueueClient.instance) {
      BullQueueClient.instance = new BullQueueClient();
    }
    return BullQueueClient.instance;
  }

  constructor() {
    this.assetPriceScrapperQueue = new Queue(this.queueName, {
      redis: {
        port: appConfig.TS_REDIS_PORT,
        host: appConfig.TS_REDIS_HOST,
        password: appConfig.TS_REDIS_PASS,
        db: appConfig.TS_REDIS_KEY_SPACE_ID,
      },
    });
  }

  async cleanUpScrapperNextTickJobs() {
    try {
      const jobs = await this.assetPriceScrapperQueue.getJobs([
        'active',
        'delayed',
        'completed',
        'paused',
        'waiting',
      ]);

      for (const job of jobs) {
        if (job.name !== 'scrapperNextTickJob') continue;
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

  async setScrapperNextTickJob(jobId: string = '0') {
    try {
      await this.assetPriceScrapperQueue.add(
        'scrapperNextTickJob',
        {},
        { jobId, delay: 3_000, removeOnComplete: true }
      );
    } catch (e) {
      console.log(e);
    }
  }
}

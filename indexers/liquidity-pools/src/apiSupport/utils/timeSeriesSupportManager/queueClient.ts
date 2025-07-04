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
        port: appConfig.ORCHESTRATOR_QUEUE_REDIS_PORT,
        host: appConfig.ORCHESTRATOR_QUEUE_REDIS_HOST,
        password: appConfig.ORCHESTRATOR_QUEUE_REDIS_PASS,
      },
    });
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

  // async addProcessorForScrapperJob<T extends object>(
  //   processorFn: (job: Job<T>, done: DoneCallback) => Promise<void> | string
  // ) {
  //   await this.assetPriceScrapperQueue.process(
  //     'scrapperNextTickJob',
  //     1,
  //     processorFn
  //   );
  // }
}

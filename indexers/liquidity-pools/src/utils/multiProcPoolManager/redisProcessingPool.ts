import Queue, { JobStatus } from 'bull';
import { AppConfig } from '../../appConfig';

export enum JobProcessingStatus {
  READY_TO_PICK_UP = 'READY_TO_PICK_UP',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export type JobPayload = {
  blockNumber: number;
  status: JobProcessingStatus;
  consumed?: string;
};

const appConfig = AppConfig.getInstance();

export class ProcessingPoolManagerRedis {
  private static instance: ProcessingPoolManagerRedis;
  private processingPoolQueue: Queue.Queue<JobPayload>;
  private pendingBlocks: number[] = [];
  private queueName = `${appConfig.INDEXER_ID}_PROCESSING_POOL`;

  private processingJobs: Map<string, Queue.Job> = new Map();
  private completedJobs: Map<string, Queue.Job> = new Map();
  private maxJobsBatchNumber = appConfig.MAX_JOB_BATCH_SIZE;

  static getInstance(): ProcessingPoolManagerRedis {
    if (!ProcessingPoolManagerRedis.instance) {
      ProcessingPoolManagerRedis.instance = new ProcessingPoolManagerRedis();
    }
    return ProcessingPoolManagerRedis.instance;
  }

  constructor() {
    this.processingPoolQueue = new Queue(this.queueName, {
      redis: {
        port: appConfig.TS_REDIS_PORT,
        host: appConfig.TS_REDIS_HOST,
        password: appConfig.TS_REDIS_PASS,
      },
    });
  }

  async commitBlocksForProcessing(blockNumbers: number[]) {
    for (const blockNumber of this.pendingBlocks) {
      const existingJob = await this.processingPoolQueue.getJob(blockNumber);
      if (!existingJob) continue;
      try {
        await existingJob.update({
          ...existingJob.data,
          status: JobProcessingStatus.READY_TO_PICK_UP,
        });
      } catch (e) {
        console.log(e);
      }
    }

    const jobs = await this.processingPoolQueue.getWaiting();
    const lostJobsToUpdate = jobs.filter(
      (job) =>
        job.data.blockNumber < blockNumbers[0] &&
        job.data.status === JobProcessingStatus.PENDING
    );

    for (const lostJob of lostJobsToUpdate) {
      try {
        await lostJob.update({
          ...lostJob.data,
          status: JobProcessingStatus.READY_TO_PICK_UP,
        });
      } catch (e) {
        console.log(e);
      }
    }

    this.pendingBlocks = blockNumbers;

    try {
      await this.processingPoolQueue.addBulk(
        this.pendingBlocks.map((blockNumber) => ({
          data: { blockNumber, status: JobProcessingStatus.PENDING },
          opts: { jobId: blockNumber },
        }))
      );
    } catch (e) {
      console.log(e);
    }
  }

  async addProcessingJob(job: Queue.Job) {
    this.processingJobs.set(`${job.id}`, job);
  }

  /**
   * Move jobs to completedJobs accumulator to be released and moved to 'completed'
   * queue in the beginning of the next blocks batch handler.
   */
  completeProcessedJobs(jobIds: Array<string | number>) {
    for (const jobId of jobIds) {
      const job = this.processingJobs.get(`${jobId}`);
      if (!job) continue;
      this.processingJobs.delete(`${jobId}`);
      this.completedJobs.set(`${job.id}`, job);
    }
  }

  /**
   * We need to commit completed jobs only from the previous batch to be sure
   * that data is really persisted by DB transaction commit in the end of
   * blocks batch handler.
   */
  async releaseCompletedJobs() {
    for (const job of this.completedJobs.values()) {
      try {
        await job.update({
          ...job.data,
          status: JobProcessingStatus.COMPLETED,
        });
        await job.releaseLock();
        await job.remove();
      } catch (e) {
        console.log(e);
      }
    }

    this.completedJobs = new Map();
  }

  /**
   * Found allowed free jobs to process and lock them.
   */
  async takeJobsToProcessing(allowedIds: number[]): Promise<number[]> {
    const allowedIdsSet = new Set(allowedIds);
    const allActiveJobs = await this.processingPoolQueue.getWaiting();
    const allowedButPendingJobs = [];
    const allowedJobs = [];

    console.log('TOTAL JOBS COUNT ', allActiveJobs.length);

    for (const job of allActiveJobs) {
      if (
        (job.progress() !== 1 &&
          job.data.status !== JobProcessingStatus.COMPLETED &&
          allowedIdsSet.has(job.data.blockNumber) &&
          job.data.status === JobProcessingStatus.READY_TO_PICK_UP &&
          !this.processingJobs.has(`${job.data.blockNumber}`) &&
          !this.completedJobs.has(`${job.data.blockNumber}`)) ||
        (job.progress() === 1 &&
          job.data.status !== JobProcessingStatus.COMPLETED &&
          job.data.consumed === appConfig.STATE_SCHEMA_NAME &&
          allowedIdsSet.has(job.data.blockNumber) &&
          !this.processingJobs.has(`${job.data.blockNumber}`) &&
          !this.completedJobs.has(`${job.data.blockNumber}`))
      ) {
        allowedJobs.push(job);
      } else if (
        job.progress() !== 1 &&
        job.data.status !== JobProcessingStatus.COMPLETED &&
        allowedIdsSet.has(job.data.blockNumber) &&
        job.data.status === JobProcessingStatus.PENDING &&
        !this.processingJobs.has(`${job.data.blockNumber}`) &&
        !this.completedJobs.has(`${job.data.blockNumber}`)
      ) {
        allowedButPendingJobs.push(job);
      }
    }

    // const allowedJobs = allActiveJobs.filter((job) => {
    //   const jobProgress = job.progress();
    //   return (
    //     jobProgress !== 1 &&
    //     allowedIdsSet.has(job.data.blockNumber) &&
    //     job.data.status === JobProcessingStatus.READY_TO_PICK_UP &&
    //     !this.processingJobs.has(`${job.data.blockNumber}`) &&
    //     !this.completedJobs.has(`${job.data.blockNumber}`)
    //   );
    // });

    const lockedJobs: Queue.Job<JobPayload>[] = [];

    let tookJobsCounterIndex = 0;

    for (const job of allowedJobs) {
      if (tookJobsCounterIndex > this.maxJobsBatchNumber) continue;

      try {
        const lockKey = await job.takeLock();
        if (!lockKey) continue;

        await job.progress(1);
        await job.update({
          ...job.data,
          consumed: appConfig.STATE_SCHEMA_NAME,
        });
        tookJobsCounterIndex++;
        this.processingJobs.set(`${job.id}`, job);
        lockedJobs.push(job);
      } catch (e) {
        console.log(e);
      }
    }

    if (lockedJobs.length > 0)
      return lockedJobs.map((j) => j.data.blockNumber).sort((a, b) => a - b);

    if (allowedButPendingJobs.length === 0) return [];

    console.log(`Waiting for pending jobs change status`);
    await new Promise((resolve) => setTimeout(resolve, 5_000));
    return await ProcessingPoolManagerRedis.getInstance().takeJobsToProcessing(
      allowedIds
    );
  }
}

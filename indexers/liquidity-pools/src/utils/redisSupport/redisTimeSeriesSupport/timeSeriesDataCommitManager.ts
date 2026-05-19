import { RedisTimeSeriesManager } from '../redisTimeSeriesManager';
import { AppConfig } from '../../../appConfig';
import {
  BullQueueClient,
  DataCommiterJobData,
  DataCommitterJobName,
} from './queueClient';
import { Job } from 'bull';
import { ApiSupportPgClient } from './apiSupportPgClient';
import { splitIntoBatches } from '../../helpers';
import {
  PendingCommitsPgClient,
  PendingCommitRow,
} from './pendingCommitsPgClient';
import { AddMultiplePricesPayload } from '../redisTimeSeriesManager';
import { PendingRedisTsCommit } from '../../../model';
import { Store } from '@subsquid/typeorm-store';
import { SqdProcessorContext } from '../../../processor';

const appConfig = AppConfig.getInstance();

export type SubmitVolumePayloadInput = {
  paraBlockHeight: number;
  sampleTimestampMs: number;
  payload: AddMultiplePricesPayload;
};

export class TimeSeriesDataCommitManager {
  private static instance: TimeSeriesDataCommitManager;

  private drainerInterval: NodeJS.Timeout | null = null;
  private isDraining: boolean = false;

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

    for (const subBatch of splitIntoBatches(
      job.data.priceVolumeDataMany!,
      appConfig.redis.TIME_SERIES_DATA_COMMIT_SUB_BATCH_MAX_SIZE
    )) {
      await redisTimeSeriesManager.addMultiplePrices(subBatch);
    }

    if (!appConfig.redis.ENABLE_REDIS_TS_UPDATE_COMMIT_DATA_COUNTER_ON_COMMIT)
      return;

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

    for (const subBatch of splitIntoBatches(
      job.data.accountTotalBalanceMany!,
      appConfig.redis.TIME_SERIES_DATA_COMMIT_SUB_BATCH_MAX_SIZE
    )) {
      await redisTimeSeriesManager.addMultipleAccountTotalBalances(subBatch);
    }

    if (!appConfig.redis.ENABLE_REDIS_TS_UPDATE_COMMIT_DATA_COUNTER_ON_COMMIT)
      return;

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

  private buildPendingVolumeId(
    payload: AddMultiplePricesPayload,
    paraBlockHeight: number
  ): string {
    const a = payload.assetAId;
    const b = payload.assetBId ?? '';
    const [lo, hi] = +a < +b ? [a, b] : [b, a];
    return `${DataCommitterJobName.commitAssetPriceVolume}:${lo}:${hi}:${paraBlockHeight}`;
  }

  async submitVolume(
    input: SubmitVolumePayloadInput,
    ctx: SqdProcessorContext<Store>
  ): Promise<void> {
    if (!appConfig.COMMIT_HIST_DATA_TO_REDIS_TIME_SERIES) return;

    const useDrainer =
      ctx.isHead && appConfig.redis.REDIS_TS_VOLUME_DRAINER_ENABLED;

    if (!useDrainer) {
      await this.addNewDataCommitterJob({
        actionName: DataCommitterJobName.commitAssetPriceVolume,
        priceVolumeDataLatestProcessedBlock: input.paraBlockHeight,
        priceVolumeDataMany: [input.payload],
        metadata: {
          commitRequestedAtParaBlock:
            ctx.blocks[ctx.blocks.length - 1].header.height,
          requestSender: 'processor',
        },
      });
      return;
    }

    const entity = new PendingRedisTsCommit({
      id: this.buildPendingVolumeId(input.payload, input.paraBlockHeight),
      jobName: DataCommitterJobName.commitAssetPriceVolume,
      paraBlockHeight: input.paraBlockHeight,
      sampleTimestampMs: BigInt(input.sampleTimestampMs),
      payload: input.payload,
      createdAt: new Date(),
    });

    await ctx.storeUtils.upsertWithBatches([entity]);
  }

  startDrainer(): void {
    if (!appConfig.COMMIT_HIST_DATA_TO_REDIS_TIME_SERIES) return;
    if (!appConfig.redis.REDIS_TS_VOLUME_DRAINER_ENABLED) return;
    if (this.drainerInterval) return;

    console.log(
      `TimeSeriesDataCommitManager::startDrainer (poll=${appConfig.redis.REDIS_TS_DRAINER_POLL_INTERVAL_MS}ms, batch=${appConfig.redis.REDIS_TS_DRAINER_BATCH_SIZE}, safetyMargin=${appConfig.redis.REDIS_TS_DRAINER_FINALITY_SAFETY_MARGIN}, awaitAck=${appConfig.redis.REDIS_TS_DRAINER_AWAIT_BULL_ACK})`
    );

    this.drainerInterval = setInterval(() => {
      this.drainOnce().catch((e) =>
        console.log('TimeSeriesDataCommitManager::drainOnce error', e)
      );
    }, appConfig.redis.REDIS_TS_DRAINER_POLL_INTERVAL_MS);
  }

  async shutdownDrainer(): Promise<void> {
    if (this.drainerInterval) {
      clearInterval(this.drainerInterval);
      this.drainerInterval = null;
    }
    // Best-effort wait for any in-flight drain to finish.
    const waitStart = Date.now();
    while (this.isDraining && Date.now() - waitStart < 30_000) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  async drainOnce(): Promise<void> {
    if (this.isDraining) return;
    this.isDraining = true;

    try {
      const pgClient = PendingCommitsPgClient.getInstance();
      const latestProcessedBlock = await pgClient.getLatestProcessedBlock();
      const cutoff =
        latestProcessedBlock -
        (appConfig.BLOCKS_FINALITY_OFFSET +
          appConfig.redis.REDIS_TS_DRAINER_FINALITY_SAFETY_MARGIN);

      if (cutoff <= 0) return;

      const batchSize = appConfig.redis.REDIS_TS_DRAINER_BATCH_SIZE;

      while (true) {
        const rows = await pgClient.fetchPendingCommits(cutoff, batchSize);
        if (rows.length === 0) return;

        const flushed = await this.flushPendingCommitRows(
          rows,
          latestProcessedBlock
        );
        if (flushed.length === 0) return;

        await pgClient.deletePendingCommits(flushed.map((r) => r.id));

        if (rows.length < batchSize) return;
      }
    } finally {
      this.isDraining = false;
    }
  }

  private async flushPendingCommitRows(
    rows: PendingCommitRow[],
    commitRequestedAtParaBlock: number
  ): Promise<PendingCommitRow[]> {
    const volumeRows = rows.filter(
      (r) => r.jobName === DataCommitterJobName.commitAssetPriceVolume
    );
    if (volumeRows.length === 0) return [];

    const priceVolumeDataMany = volumeRows.map((r) => r.payload);
    const priceVolumeDataLatestProcessedBlock = volumeRows.reduce(
      (max, r) => (r.paraBlockHeight > max ? r.paraBlockHeight : max),
      0
    );

    const jobData: DataCommiterJobData = {
      actionName: DataCommitterJobName.commitAssetPriceVolume,
      priceVolumeDataLatestProcessedBlock,
      priceVolumeDataMany,
      metadata: {
        commitRequestedAtParaBlock,
        requestSender: 'processor',
      },
    };

    try {
      if (appConfig.redis.REDIS_TS_DRAINER_AWAIT_BULL_ACK) {
        const bullQueueClient = BullQueueClient.getInstance();
        const job = await bullQueueClient.dataCommitterQueue.add(
          DataCommitterJobName.commitAssetPriceVolume,
          jobData,
          { removeOnComplete: true }
        );
        await job.finished();
      } else {
        await this.addNewDataCommitterJob(jobData);
      }
    } catch (e) {
      console.log('TimeSeriesDataCommitManager::flushPendingCommitRows', e);
      return [];
    }

    return volumeRows;
  }
}

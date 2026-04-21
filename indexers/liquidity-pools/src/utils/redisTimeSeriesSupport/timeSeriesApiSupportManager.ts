import { ApiSupportPgClient } from './apiSupportPgClient';
import {
  getAssetSpotPricesByBlocksRange,
  getFirstAvailableAssetSpotPriceEntity,
} from './sql/assetSpotPrice.sql';
import {
  RedisTimeSeriesManager,
  RedisTimeSeriesName,
} from '../redisTimeSeriesManager';
import { AppConfig } from '../../appConfig';
import { getAssetPairVolumesByBlocksRange } from './sql/assetPairVolumes.sql';
import {
  BullQueueClient,
  HistDataScrapperJobData,
  HistDataScrapperJobName,
} from './queueClient';
import { DoneCallback, Job } from 'bull';
import * as crypto from 'node:crypto';
import {
  getAccTotalBalancesByBlocksRange,
  getFirstAvailableAccTotalBalanceEntity,
} from './sql/accTotalBalanceHistData.sql';
import { BigNumber } from './../bignumber';
import { splitIntoBatches } from '../helpers';

export interface AssetSpotPriceHistDataResponse {
  id: string;
  asset_in_asset_registry_id: string;
  asset_out_asset_registry_id: string;
  price_normalised: string;
  block_timestamp: number;
  para_block_height: number;
}

export interface AssetPairVolumeResponse {
  id: string;
  asset_a_registry_id: string;
  asset_b_registry_id: string;
  total_volume_normalised: string;
  block_timestamp: number;
  para_block_height: number;
}

export interface AccountTotalBalanceHistDataResponse {
  id: string;
  account_id: string;
  total_transferable_norm: string;
  total_locked_norm: string;
  total_debt_norm: string;
  block_timestamp: number;
  para_block_height: number;
}

const appConfig = AppConfig.getInstance();

export class TimeSeriesApiSupportManager {
  private static instance: TimeSeriesApiSupportManager;

  static getInstance(): TimeSeriesApiSupportManager {
    if (!TimeSeriesApiSupportManager.instance) {
      TimeSeriesApiSupportManager.instance = new TimeSeriesApiSupportManager();
    }
    return TimeSeriesApiSupportManager.instance;
  }

  getJobPrefix(name: HistDataScrapperJobName) {
    return `${name}_v4`;
  }

  async initHistDataScraper() {
    if (!appConfig.COMMIT_HIST_DATA_TO_REDIS_TIME_SERIES) return;

    await new Promise((res) => setTimeout(res, 90000));

    console.log('initHistDataScraper');

    const bullQueueClient = BullQueueClient.getInstance();
    const pgClient = ApiSupportPgClient.getInstance();
    const apiState = await pgClient.getApiState();

    // await bullQueueClient.cleanUpScrapperNextTickJobs(
    //   HistDataScrapperJobName.assetPriceHistData
    // );
    // await bullQueueClient.cleanUpScrapperNextTickJobs(
    //   HistDataScrapperJobName.accountTotalBalancesHistData
    // );

    await bullQueueClient.wipeScrapperQueue();

    await bullQueueClient.setScrapperNextTickJob({
      jobName: HistDataScrapperJobName.assetPriceHistData,
      data: {
        blockHeight: apiState.assetPriceLatestProcessedBlock,
      },
      customId: `${this.getJobPrefix(HistDataScrapperJobName.assetPriceHistData)}_${apiState.assetPriceLatestProcessedBlock}`,
    });

    await bullQueueClient.setScrapperNextTickJob({
      jobName: HistDataScrapperJobName.accountTotalBalancesHistData,
      data: {
        blockHeight: apiState.accTotalBalanceLatestProcBlock,
      },
      customId: `${this.getJobPrefix(HistDataScrapperJobName.accountTotalBalancesHistData)}_${apiState.accTotalBalanceLatestProcBlock}`,
    });

    try {
      // @ts-ignore
      bullQueueClient.assetPriceScrapperQueue.process(
        HistDataScrapperJobName.assetPriceHistData,
        (job, done) => this.assetHistDataScraperHandler(job, done)
      );
    } catch (error) {
      console.error(
        `Error setting up ${HistDataScrapperJobName.assetPriceHistData} processor:`,
        error
      );
    }

    try {
      // @ts-ignore
      bullQueueClient.assetPriceScrapperQueue.process(
        HistDataScrapperJobName.accountTotalBalancesHistData,
        (job, done) => this.accTotalBalancesHistDataScraperHandler(job, done)
      );
    } catch (error) {
      console.error(
        `Error setting up ${HistDataScrapperJobName.accountTotalBalancesHistData} processor:`,
        error
      );
    }
  }

  async assetHistDataScraperHandler(
    job: Job<HistDataScrapperJobData>,
    done: DoneCallback
  ) {
    if (
      !`${job.id}`.startsWith(
        this.getJobPrefix(HistDataScrapperJobName.assetPriceHistData)
      )
    ) {
      done();
      return;
    }
    const processingBlocksRange =
      appConfig.ASSET_HIST_DATA_TS_PULLING_BATCH_SIZE;
    const apiStatePgClient = ApiSupportPgClient.getInstance();
    const redisTimeSeriesManager = RedisTimeSeriesManager.getInstance();
    const bullQueueClient = BullQueueClient.getInstance();
    const apiState = await apiStatePgClient.getApiState();
    let latestProcessedBlockHeight = apiState.assetPriceLatestProcessedBlock;

    console.log(`assetHistDataScraperHandler jobId ${job.id} >>>`);

    if (latestProcessedBlockHeight === 0) {
      const firstAvailableAssetSpotPrice = await apiStatePgClient.query(
        getFirstAvailableAssetSpotPriceEntity,
        []
      );

      if (firstAvailableAssetSpotPrice.rows.length !== 0) {
        latestProcessedBlockHeight =
          firstAvailableAssetSpotPrice.rows[0].para_block_height;
      }
    }

    latestProcessedBlockHeight++;

    let fromBlockHeight = latestProcessedBlockHeight;
    let toBlockHeight = latestProcessedBlockHeight + processingBlocksRange;

    let isResultEmpty = false;

    let processedBlockHeight = 0;

    try {
      while (!isResultEmpty) {
        const assetSpotPriceHistDataChunk =
          await apiStatePgClient.query<AssetSpotPriceHistDataResponse>(
            getAssetSpotPricesByBlocksRange,
            [fromBlockHeight, toBlockHeight]
          );

        if (assetSpotPriceHistDataChunk.rows.length === 0) {
          isResultEmpty = true;
          break;
        }
        console.log(
          `AssetPriceVol :: Pushing data to TS: ${fromBlockHeight}/${toBlockHeight} >>>`
        );

        processedBlockHeight =
          assetSpotPriceHistDataChunk.rows[
            assetSpotPriceHistDataChunk.rows.length - 1
          ].para_block_height;

        const assetPairVolumesChunk =
          await apiStatePgClient.query<AssetPairVolumeResponse>(
            getAssetPairVolumesByBlocksRange,
            [fromBlockHeight, toBlockHeight]
          );

        if (assetSpotPriceHistDataChunk.rows.length > 0) {
          const preparedData = [];

          for (const row of assetSpotPriceHistDataChunk.rows) {
            preparedData.push({
              keyPrefix: appConfig.INDEXER_ID,
              name: RedisTimeSeriesName.price,
              assetAId: row.asset_in_asset_registry_id,
              assetBId: row.asset_out_asset_registry_id,
              timestamp: row.block_timestamp,
              value: BigNumber(row.price_normalised).toNumber(),
            });
          }

          for (const subBatch of splitIntoBatches(
            preparedData,
            appConfig.redis.TIME_SERIES_DATA_COMMIT_SUB_BATCH_MAX_SIZE
          )) {
            await redisTimeSeriesManager.addMultiplePrices(subBatch);
          }
        }

        if (assetPairVolumesChunk.rows.length > 0) {
          const preparedData = [];

          for (const row of assetPairVolumesChunk.rows) {
            preparedData.push({
              keyPrefix: appConfig.INDEXER_ID,
              name: RedisTimeSeriesName.volume,
              assetAId:
                +row.asset_a_registry_id < +row.asset_b_registry_id
                  ? row.asset_a_registry_id
                  : row.asset_b_registry_id,
              assetBId:
                +row.asset_a_registry_id < +row.asset_b_registry_id
                  ? row.asset_b_registry_id
                  : row.asset_a_registry_id,

              timestamp: row.block_timestamp,
              value: BigNumber(row.total_volume_normalised).toNumber(),
            });
          }

          for (const subBatch of splitIntoBatches(
            preparedData,
            appConfig.redis.TIME_SERIES_DATA_COMMIT_SUB_BATCH_MAX_SIZE
          )) {
            await redisTimeSeriesManager.addMultiplePrices(subBatch);
          }
        }

        await apiStatePgClient.upsertApiState({
          assetPriceLatestProcessedBlock: processedBlockHeight,
        });

        console.log(
          `AssetPriceVol :: Finished: ${fromBlockHeight}/${toBlockHeight} |`
        );

        fromBlockHeight = processedBlockHeight + 1;
        toBlockHeight = fromBlockHeight + processingBlocksRange;

        await new Promise((res) =>
          setTimeout(res, appConfig.redis.TIME_SERIES_DATA_SCRAPPER_TIMEOUT_MS)
        );
      }
    } catch (e) {
      console.log(e);
    }

    await bullQueueClient.setScrapperNextTickJob({
      jobName: HistDataScrapperJobName.assetPriceHistData,
      data: {
        blockHeight:
          processedBlockHeight || apiState.assetPriceLatestProcessedBlock,
      },
      customId: `${this.getJobPrefix(HistDataScrapperJobName.assetPriceHistData)}_${processedBlockHeight || apiState.assetPriceLatestProcessedBlock}`,
    });

    done();
  }

  async accTotalBalancesHistDataScraperHandler(
    job: Job<HistDataScrapperJobData>,
    done: DoneCallback
  ) {
    if (
      !`${job.id}`.startsWith(
        this.getJobPrefix(HistDataScrapperJobName.accountTotalBalancesHistData)
      )
    ) {
      done();
      return;
    }
    const processingBlocksRange =
      appConfig.ASSET_HIST_DATA_TS_PULLING_BATCH_SIZE;
    const pgClient = ApiSupportPgClient.getInstance();
    const redisTimeSeriesManager = RedisTimeSeriesManager.getInstance();
    const bullQueueClient = BullQueueClient.getInstance();
    const apiState = await pgClient.getApiState();
    let latestProcessedBlockHeight = apiState.accTotalBalanceLatestProcBlock;
    console.log(`accTotalBalancesHistDataScraperHandler jobId ${job.id} >>>`);

    if (latestProcessedBlockHeight === 0) {
      const firstAvailableAccTotalBalance = await pgClient.query(
        getFirstAvailableAccTotalBalanceEntity,
        []
      );

      if (firstAvailableAccTotalBalance.rows.length !== 0) {
        latestProcessedBlockHeight =
          firstAvailableAccTotalBalance.rows[0].para_block_height;
      }
    }

    latestProcessedBlockHeight++;

    let fromBlockHeight = latestProcessedBlockHeight;
    let toBlockHeight = latestProcessedBlockHeight + processingBlocksRange;

    let isResultEmpty = false;

    let processedBlockHeight = 0;

    try {
      while (!isResultEmpty) {
        const accTotalBalancesHistDataChunk =
          await pgClient.query<AccountTotalBalanceHistDataResponse>(
            getAccTotalBalancesByBlocksRange,
            [fromBlockHeight, toBlockHeight]
          );

        if (accTotalBalancesHistDataChunk.rows.length === 0) {
          isResultEmpty = true;
          break;
        }

        console.log(
          `AccTotalBal :: Pulling data (${accTotalBalancesHistDataChunk.rows.length} records) to TS: ${fromBlockHeight}/${toBlockHeight} >>>`
        );

        processedBlockHeight =
          accTotalBalancesHistDataChunk.rows[
            accTotalBalancesHistDataChunk.rows.length - 1
          ].para_block_height;

        if (accTotalBalancesHistDataChunk.rows.length > 0) {
          const preparedData = [];

          for (const row of accTotalBalancesHistDataChunk.rows) {
            preparedData.push([
              {
                name: RedisTimeSeriesName.acc_bal_tot_tns,
                accountId: row.account_id,
                timestamp: row.block_timestamp,
                value: +row.total_transferable_norm,
                keyPrefix: appConfig.INDEXER_ID,
              },
              {
                name: RedisTimeSeriesName.acc_bal_tot_loc,
                accountId: row.account_id,
                timestamp: row.block_timestamp,
                value: +row.total_locked_norm,
                keyPrefix: appConfig.INDEXER_ID,
              },
              {
                name: RedisTimeSeriesName.acc_bal_tot_debt,
                accountId: row.account_id,
                timestamp: row.block_timestamp,
                value: +row.total_debt_norm,
                keyPrefix: appConfig.INDEXER_ID,
              },
            ]);
          }

          for (const subBatch of splitIntoBatches(
            preparedData.flat(),
            appConfig.redis.TIME_SERIES_DATA_COMMIT_SUB_BATCH_MAX_SIZE
          )) {
            await redisTimeSeriesManager.addMultipleAccountTotalBalances(
              subBatch
            );
          }
        }

        await pgClient.upsertApiState({
          accTotalBalanceLatestProcBlock: processedBlockHeight,
        });

        console.log(
          `AccTotalBal :: Finished ${fromBlockHeight}/${toBlockHeight} |`
        );

        fromBlockHeight = processedBlockHeight + 1;
        toBlockHeight = fromBlockHeight + processingBlocksRange;

        await new Promise((res) =>
          setTimeout(res, appConfig.redis.TIME_SERIES_DATA_SCRAPPER_TIMEOUT_MS)
        );
      }
    } catch (e) {
      console.log(e);
    }

    await bullQueueClient.setScrapperNextTickJob({
      jobName: HistDataScrapperJobName.accountTotalBalancesHistData,
      data: {
        blockHeight:
          processedBlockHeight || apiState.accTotalBalanceLatestProcBlock,
      },
      customId: `${this.getJobPrefix(HistDataScrapperJobName.accountTotalBalancesHistData)}_${processedBlockHeight || apiState.accTotalBalanceLatestProcBlock}`,
    });

    done();
  }
}

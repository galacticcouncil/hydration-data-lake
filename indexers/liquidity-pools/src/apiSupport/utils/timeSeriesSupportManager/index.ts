import { ApiSupportPgClient } from './apiSupportPgClient';
import {
  getAssetSpotPricesByBlocksRange,
  getFirstAvailableAssetSpotPriceEntity,
} from './sql/assetSpotPrice.sql';
import {
  RedisTimeSeriesManager,
  RedisTimeSeriesName,
} from '../../../utils/redisTimeSeriesManager';
import { AppConfig } from '../../../appConfig';
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

  async initHistDataScraper() {
    if (!appConfig.COMMIT_HIST_DATA_TO_REDIS_TIME_SERIES) return;

    console.log('initHistDataScraper');

    const bullQueueClient = BullQueueClient.getInstance();
    const pgClient = ApiSupportPgClient.getInstance();
    const apiState = await pgClient.getApiState();

    await bullQueueClient.cleanUpScrapperNextTickJobs(
      HistDataScrapperJobName.assetPriceHistData
    );
    await bullQueueClient.cleanUpScrapperNextTickJobs(
      HistDataScrapperJobName.accountTotalBalancesHistData
    );

    await bullQueueClient.setScrapperNextTickJob({
      jobName: HistDataScrapperJobName.assetPriceHistData,
      data: {
        blockHeight: apiState.assetPriceLatestProcessedBlock,
      },
    });

    await bullQueueClient.setScrapperNextTickJob({
      jobName: HistDataScrapperJobName.accountTotalBalancesHistData,
      data: {
        blockHeight: apiState.accTotalBalanceLatestProcBlock,
      },
    });

    bullQueueClient.assetPriceScrapperQueue
      .process(HistDataScrapperJobName.assetPriceHistData, (job, done) =>
        this.assetHistDataScraperHandler(job, done)
      )
      .catch((error) => {
        console.error(
          `Error setting up ${HistDataScrapperJobName.assetPriceHistData} processor:`,
          error
        );
      });

    bullQueueClient.assetPriceScrapperQueue
      .process(
        HistDataScrapperJobName.accountTotalBalancesHistData,
        (job, done) => this.accTotalBalancesHistDataScraperHandler(job, done)
      )
      .catch((error) => {
        console.error(
          `Error setting up ${HistDataScrapperJobName.accountTotalBalancesHistData} processor:`,
          error
        );
      });
  }

  async assetHistDataScraperHandler(
    job: Job<HistDataScrapperJobData>,
    done: DoneCallback
  ) {
    const processingBlocksRange =
      appConfig.ASSET_HIST_DATA_TS_PULLING_BATCH_SIZE;
    const apiStatePgClient = ApiSupportPgClient.getInstance();
    const redisTimeSeriesManager = RedisTimeSeriesManager.getInstance();
    const bullQueueClient = BullQueueClient.getInstance();
    const apiState = await apiStatePgClient.getApiState();
    let latestProcessedBlockHeight = apiState.assetPriceLatestProcessedBlock;

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
      // console.log(
      //   `AssetPriceVol :: Pushing data to TS: ${fromBlockHeight}/${toBlockHeight}`
      // );

      processedBlockHeight =
        assetSpotPriceHistDataChunk.rows[
          assetSpotPriceHistDataChunk.rows.length - 1
        ].para_block_height;

      const assetPairVolumesChunk =
        await apiStatePgClient.query<AssetPairVolumeResponse>(
          getAssetPairVolumesByBlocksRange,
          [fromBlockHeight, toBlockHeight]
        );

      if (assetSpotPriceHistDataChunk.rows.length > 0)
        await redisTimeSeriesManager.addMultiplePrices(
          assetSpotPriceHistDataChunk.rows.map((row) => ({
            keyPrefix: appConfig.INDEXER_ID,
            name: RedisTimeSeriesName.price,
            assetAId: row.asset_in_asset_registry_id,
            assetBId: row.asset_out_asset_registry_id,
            timestamp: row.block_timestamp,
            value: +row.price_normalised,
          }))
        );

      if (assetPairVolumesChunk.rows.length > 0)
        await redisTimeSeriesManager.addMultiplePrices(
          assetPairVolumesChunk.rows.map((row) => ({
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
            value: +row.total_volume_normalised,
          }))
        );

      await apiStatePgClient.upsertApiState({
        assetPriceLatestProcessedBlock: processedBlockHeight,
      });

      fromBlockHeight = processedBlockHeight + 1;
      toBlockHeight = fromBlockHeight + processingBlocksRange;
    }

    await bullQueueClient.setScrapperNextTickJob({
      jobName: HistDataScrapperJobName.assetPriceHistData,
      data: { blockHeight: processedBlockHeight },
    });
    done();
  }

  async accTotalBalancesHistDataScraperHandler(
    job: Job<HistDataScrapperJobData>,
    done: DoneCallback
  ) {
    const processingBlocksRange =
      appConfig.ASSET_HIST_DATA_TS_PULLING_BATCH_SIZE;
    const pgClient = ApiSupportPgClient.getInstance();
    const redisTimeSeriesManager = RedisTimeSeriesManager.getInstance();
    const bullQueueClient = BullQueueClient.getInstance();
    const apiState = await pgClient.getApiState();
    let latestProcessedBlockHeight = apiState.accTotalBalanceLatestProcBlock;

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
        `AccTotalBal :: Pulling data to TS: ${fromBlockHeight}/${toBlockHeight}`
      );

      processedBlockHeight =
        accTotalBalancesHistDataChunk.rows[
          accTotalBalancesHistDataChunk.rows.length - 1
        ].para_block_height;

      if (accTotalBalancesHistDataChunk.rows.length > 0)
        await redisTimeSeriesManager.addMultipleAccountTotalBalances(
          accTotalBalancesHistDataChunk.rows.map((row) => ({
            name: RedisTimeSeriesName.acc_bal_tot_tns,
            accountId: row.account_id,
            timestamp: row.block_timestamp,
            value: +row.total_transferable_norm,
            keyPrefix: appConfig.INDEXER_ID,
          }))
        );

      await pgClient.upsertApiState({
        accTotalBalanceLatestProcBlock: processedBlockHeight,
      });

      fromBlockHeight = processedBlockHeight + 1;
      toBlockHeight = fromBlockHeight + processingBlocksRange;
    }

    await bullQueueClient.setScrapperNextTickJob({
      jobName: HistDataScrapperJobName.accountTotalBalancesHistData,
      data: { blockHeight: processedBlockHeight },
    });
    done();
  }
}

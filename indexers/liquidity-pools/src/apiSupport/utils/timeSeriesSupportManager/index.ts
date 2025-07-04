import { SupportPgClient } from './pgClient';
import {
  getAssetSpotPricesByBlocksRange,
  getFirstAvailableAssetSpotPriceEntity,
} from './sql/assetSpotPrice.sql';
import {
  RedisInstance,
  RedisTimeSeriesManager,
} from '../../../utils/redisTimeSeriesManager';
import { AppConfig } from '../../../appConfig';
import { getAssetPairVolumesByBlocksRange } from './sql/assetPairVolumes.sql';
import { BullQueueClient } from './queueClient';
import { DoneCallback, Job } from 'bull';
import * as crypto from 'node:crypto';

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

const appConfig = AppConfig.getInstance();

export class TimeSeriesApiSupportManager {
  private static instance: TimeSeriesApiSupportManager;

  static getInstance(): TimeSeriesApiSupportManager {
    if (!TimeSeriesApiSupportManager.instance) {
      TimeSeriesApiSupportManager.instance = new TimeSeriesApiSupportManager();
    }
    return TimeSeriesApiSupportManager.instance;
  }

  async initAssetHistDataScraper() {
    console.log('initAssetHistDataScraper');

    const bullQueueClient = BullQueueClient.getInstance();
    const pgClient = SupportPgClient.getInstance();
    const latestProcessedBlockHeight = (await pgClient.getApiState())
      .assetPriceLatestProcessedBlock;

    await bullQueueClient.setScrapperNextTickJob(
      latestProcessedBlockHeight.toString()
    );

    bullQueueClient.assetPriceScrapperQueue
      .process('scrapperNextTickJob', (job, done) =>
        this.assetHistDataScraperHandler(job, done)
      )
      .catch((error) => {
        console.error('Error setting up scrapperNextTickJob processor:', error);
      });
  }

  async assetHistDataScraperHandler<T extends object>(
    job: Job<T>,
    done: DoneCallback
  ) {
    console.log('assetHistDataScraperHandler');
    const processingBlocksRange = 10;
    const pgClient = SupportPgClient.getInstance();
    const redisTimeSeriesManager = RedisTimeSeriesManager.getInstance();
    const bullQueueClient = BullQueueClient.getInstance();
    let latestProcessedBlockHeight = (await pgClient.getApiState())
      .assetPriceLatestProcessedBlock;

    if (latestProcessedBlockHeight === 0) {
      const firstAvailableAssetSpotPrice = await pgClient.query(
        getFirstAvailableAssetSpotPriceEntity,
        []
      );

      if (firstAvailableAssetSpotPrice.rows.length !== 0) {
        latestProcessedBlockHeight =
          firstAvailableAssetSpotPrice.rows[0].para_block_height;
      }
    }

    console.log('latestProcessedBlockHeight - ', latestProcessedBlockHeight);

    latestProcessedBlockHeight++;

    let fromBlockHeight = latestProcessedBlockHeight;
    let toBlockHeight = latestProcessedBlockHeight + processingBlocksRange;

    let isResultEmpty = false;

    let processedBlockHeight = 0;
    console.time('adding data to redis');

    while (!isResultEmpty) {
      const assetSpotPriceHistDataChunk =
        await pgClient.query<AssetSpotPriceHistDataResponse>(
          getAssetSpotPricesByBlocksRange,
          [fromBlockHeight, toBlockHeight]
        );

      if (assetSpotPriceHistDataChunk.rows.length === 0) {
        console.log(`assetSpotPriceHistDataChunk is empty. Exiting...`);
        isResultEmpty = true;
        break;
      }

      processedBlockHeight =
        assetSpotPriceHistDataChunk.rows[
          assetSpotPriceHistDataChunk.rows.length - 1
        ].para_block_height;

      const assetPairVolumesChunk =
        await pgClient.query<AssetPairVolumeResponse>(
          getAssetPairVolumesByBlocksRange,
          [fromBlockHeight, toBlockHeight]
        );

      if (assetSpotPriceHistDataChunk.rows.length > 0)
        await redisTimeSeriesManager.addMultiplePrices(
          assetSpotPriceHistDataChunk.rows.map((row) => ({
            keyPrefix: appConfig.INDEXER_ID,
            name: 'price',
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
            name: 'volume',
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

      await pgClient.upsertApiState({
        assetPriceLatestProcessedBlock: processedBlockHeight,
      });

      fromBlockHeight = processedBlockHeight + 1;
      toBlockHeight = fromBlockHeight + processingBlocksRange;
    }
    console.timeEnd('adding data to redis');

    await bullQueueClient.setScrapperNextTickJob(
      // processedBlockHeight.toString()
      crypto.randomUUID()
    );
    done();
  }
}

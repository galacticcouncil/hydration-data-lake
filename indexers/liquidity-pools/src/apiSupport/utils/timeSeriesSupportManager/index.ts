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
    let latestProcessedBlockHeight = 8154900;
    const processingBlocksRange = 1000;
    const pgClient = SupportPgClient.getInstance();
    const redisTimeSeriesManager = RedisTimeSeriesManager.getInstance();

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

    let fromBlockHeight = latestProcessedBlockHeight;
    let toBlockHeight = latestProcessedBlockHeight + processingBlocksRange;

    let isResultEmpty = false;

    while (!isResultEmpty) {
      console.time('loop');
      console.log('getAssetSpotPricesByBlocksRange >');
      const assetSpotPriceHistDataChunk =
        await pgClient.query<AssetSpotPriceHistDataResponse>(
          getAssetSpotPricesByBlocksRange,
          [fromBlockHeight, toBlockHeight]
        );
      console.log('getAssetSpotPricesByBlocksRange <');

      if (assetSpotPriceHistDataChunk.rows.length === 0) {
        console.log(`assetSpotPriceHistDataChunk is empty. Exiting...`);
        isResultEmpty = true;
        break;
      }

      console.log('getAssetPairVolumesByBlocksRange >');
      const assetPairVolumesChunk =
        await pgClient.query<AssetPairVolumeResponse>(
          getAssetPairVolumesByBlocksRange,
          [fromBlockHeight, toBlockHeight]
        );
      console.log('getAssetPairVolumesByBlocksRange <');

      fromBlockHeight = toBlockHeight + 1;
      toBlockHeight = fromBlockHeight + processingBlocksRange;

      console.log(
        `fromBlockHeight: [${fromBlockHeight}] || toBlockHeight: [${toBlockHeight}]`
      );

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
      console.timeEnd('loop');
    }
  }
}

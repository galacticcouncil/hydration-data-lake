import {
  createClient,
  RedisClientType,
  RedisFunctions,
  RedisScripts,
  RedisDefaultModules,
  // RespVersions,
  // TypeMapping,
  // TIME_SERIES_AGGREGATION_TYPE,
  // TIME_SERIES_DUPLICATE_POLICIES,
} from 'redis';
import { AppConfig } from '../../appConfig';
import {
  TimeSeriesAggregationType,
  TimeSeriesDuplicatePolicies,
} from '@redis/time-series';
import { TimeSeriesBucketTimestamp } from '@redis/time-series/dist/commands';

export type RedisInstance = RedisClientType<
  RedisDefaultModules,
  RedisFunctions,
  RedisScripts
  // RespVersions,
  // TypeMapping
>;

export type TimeSeriesPriceAndVolumeBuckets = {
  priceData: Map<string, Map<number, { timestamp: number; value: number }>>;
  volumeData: Map<number, { timestamp: number; value: number }>;
};

const appConfig = AppConfig.getInstance();

export class RedisTimeSeriesManager {
  private static instance: RedisTimeSeriesManager;
  private openClient: RedisInstance | null = null;

  static getInstance(): RedisTimeSeriesManager {
    if (!RedisTimeSeriesManager.instance) {
      RedisTimeSeriesManager.instance = new RedisTimeSeriesManager();
    }
    return RedisTimeSeriesManager.instance;
  }

  private async getOpenClient() {
    if (this.openClient) return this.openClient;

    const client = createClient({
      socket: {
        port: appConfig.TS_REDIS_PORT,
        host: appConfig.TS_REDIS_HOST,
      },
      password: appConfig.TS_REDIS_PASS,
      database: appConfig.TS_REDIS_KEY_SPACE_ID,
      // ...(appConfig.REDIS_ENABLE_SSL
      //   ? { tls: {}, connectTimeout: 60_000 }
      //   : {}),
    });

    client.on('connect', () => {
      console.log('RedisTimeSeries client connect');
    });
    client.on('connecting', () => {
      console.log('RedisTimeSeries client connecting');
    });
    client.on('ready', () => {
      console.log('RedisTimeSeries client ready');
    });
    client.on('reconnecting', () => {
      console.log('RedisTimeSeries client reconnecting');
    });

    this.openClient = await client.connect();

    return this.openClient;
  }

  async initClient() {
    await this.getOpenClient();
  }

  getVolumeSeriesLabel(assetAId: string, assetBId: string) {
    const assetsSorted = [+assetAId, +assetBId].sort((a, b) => a - b);
    return { volPair: assetsSorted.join(':') };
  }
  getVolumeSeriesLabelFilter(assetAId: string, assetBId: string) {
    // const assetsSorted = [+assetAId, +assetBId].sort((a, b) => a - b);
    // return `volPair=${assetsSorted.join(':')}`;
    // const assetsSorted = [+assetAId, +assetBId].sort((a, b) => a - b);
    console.log(`volPair=(${assetAId}:${assetBId},${assetBId}:${assetAId})`);
    return `volPair=(${assetAId}:${assetBId},${assetBId}:${assetAId})`;
  }

  private getSeriesKey({
    name,
    assetAId,
    assetBId = '10',
    keyPrefix,
  }: {
    name: 'price' | 'volume';
    assetAId: string;
    assetBId?: string;
    keyPrefix?: string | number;
  }) {
    return `ts:${keyPrefix ? keyPrefix : 'none'}:${name}:${assetAId}:${assetBId}`;
  }

  private async isTimeSeriesExists(key: string) {
    const openClient = await this.getOpenClient();
    try {
      await openClient.ts.info(key);
      return true;
    } catch (err: any) {
      if (err.message.includes('TSDB') && err.message.includes('not exist')) {
        return false;
      }
      throw err;
    }
  }

  private async ensureTimeSeries(
    key: string,
    labels: {
      [label: string]: string;
    } = {}
  ) {
    if (await this.isTimeSeriesExists(key)) return;
    const openClient = await this.getOpenClient();
    await openClient.ts.create(key, {
      RETENTION: 0,
      DUPLICATE_POLICY: TimeSeriesDuplicatePolicies.LAST,
      LABELS: {
        indVer: appConfig.INDEXER_ID,
        ...labels,
      },
    });
  }

  async addToTimeSeries({
    name,
    assetAId,
    assetBId = '10',
    value,
    timestamp,
    keyPrefix,
  }: {
    name: 'price' | 'volume';
    assetAId: string;
    assetBId?: string;
    value: number;
    timestamp: number;
    keyPrefix?: string | number;
  }) {
    try {
      const key = this.getSeriesKey({ keyPrefix, name, assetAId, assetBId });
      await this.ensureTimeSeries(key, {
        astAId: assetAId,
        astBId: assetBId,
        name,
        ...this.getVolumeSeriesLabel(assetAId, assetBId),
      });
      const openClient = await this.getOpenClient();

      await openClient.ts.add(key, timestamp, value);
    } catch (e) {
      console.log(e);
    }
  }

  async addMultiplePrices(
    data: {
      name: 'price' | 'volume';
      assetAId: string;
      assetBId?: string;
      value: number;
      timestamp: number;
      keyPrefix?: string | number;
    }[]
  ) {
    try {
      const openClient = await this.getOpenClient();

      const keysMap: Map<
        string,
        { assetAId: string; assetBId: string; name: string }
      > = new Map();
      const listToSave = [];

      for (const {
        keyPrefix,
        name,
        assetAId,
        assetBId,
        value,
        timestamp,
      } of data) {
        const key = this.getSeriesKey({
          keyPrefix,
          name,
          assetAId,
          assetBId,
        });
        keysMap.set(key, { assetAId, assetBId: assetBId || '10', name });
        listToSave.push({ key, timestamp, value });
      }

      for (const [uniqueKey, indexerData] of keysMap.entries())
        await this.ensureTimeSeries(uniqueKey, {
          name: indexerData.name,
          astAId: indexerData.assetAId,
          astBId: indexerData.assetBId,
          ...this.getVolumeSeriesLabel(
            indexerData.assetAId,
            indexerData.assetBId
          ),
        });

      await openClient.ts.mAdd(listToSave);
    } catch (e) {
      console.log(e);
    }
  }

  async getPricesAndVolumesFromTimeSeries({
    assetInId,
    assetOutId = appConfig.ASSET_PRICE_BASE_ASSET_ID,
    startTimestamp,
    endTimestamp,
    indexerId,
    bucketSizeMs,
  }: {
    assetInId: string;
    assetOutId?: string;
    startTimestamp: number;
    endTimestamp: number;
    indexerId: string;
    bucketSizeMs: number;
  }): Promise<TimeSeriesPriceAndVolumeBuckets> {
    try {
      const openClient = await this.getOpenClient();

      let priceKeysMap = new Map<string, string>([
        [
          this.getSeriesKey({
            keyPrefix: appConfig.INDEXER_ID,
            name: 'price',
            assetAId: assetInId,
            assetBId: assetOutId,
          }),
          `${assetInId}:${assetOutId}`,
        ],
      ]);

      const volumeKeysMap = new Map([
        [
          this.getSeriesKey({
            keyPrefix: appConfig.INDEXER_ID,
            name: 'volume',
            assetAId: assetInId,
            assetBId: assetOutId,
          }),
          `${assetInId}:${assetOutId}`,
        ],
        [
          this.getSeriesKey({
            keyPrefix: appConfig.INDEXER_ID,
            name: 'volume',
            assetAId: assetOutId,
            assetBId: assetInId,
          }),
          `${assetOutId}:${assetInId}`,
        ],
      ]);

      let assetAIdFilter = `astAId=${assetInId}`;
      let assetBIdFilter = `astBId=${appConfig.ASSET_PRICE_BASE_ASSET_ID}`;

      if (assetOutId !== appConfig.ASSET_PRICE_BASE_ASSET_ID) {
        assetAIdFilter = `astAId=(${assetInId},${assetOutId})`;
        assetBIdFilter = `astBId=(${assetInId},${assetOutId},${appConfig.ASSET_PRICE_BASE_ASSET_ID})`;

        priceKeysMap = new Map([
          [
            this.getSeriesKey({
              keyPrefix: appConfig.INDEXER_ID,
              name: 'price',
              assetAId: assetInId,
              assetBId: appConfig.ASSET_PRICE_BASE_ASSET_ID,
            }),
            `${assetInId}:${appConfig.ASSET_PRICE_BASE_ASSET_ID}`,
          ],
          [
            this.getSeriesKey({
              keyPrefix: appConfig.INDEXER_ID,
              name: 'price',
              assetAId: assetOutId,
              assetBId: appConfig.ASSET_PRICE_BASE_ASSET_ID,
            }),
            `${assetOutId}:${appConfig.ASSET_PRICE_BASE_ASSET_ID}`,
          ],
        ]);
      }

      const buckets = await openClient.ts.mRange(
        startTimestamp,
        endTimestamp,
        [assetAIdFilter, assetBIdFilter, `name=(price,volume)`],
        bucketSizeMs !== 0
          ? {
              AGGREGATION: {
                type: TimeSeriesAggregationType.AVG,
                timeBucket: bucketSizeMs,
                EMPTY: true,
                BUCKETTIMESTAMP: TimeSeriesBucketTimestamp.MID,
              },
            }
          : undefined
      );

      const resultFiltered: TimeSeriesPriceAndVolumeBuckets = {
        priceData: new Map(),
        volumeData: new Map(),
      };

      for (const bucket of buckets) {
        if (priceKeysMap.has(bucket.key)) {
          resultFiltered.priceData.set(
            priceKeysMap.get(bucket.key)!,
            new Map(bucket.samples.map((s) => [s.timestamp, s]))
          );
          continue;
        }
        if (volumeKeysMap.has(bucket.key)) {
          resultFiltered.volumeData = new Map(
            bucket.samples.map((s) => [s.timestamp, s])
          );
        }
      }

      return resultFiltered;
    } catch (e) {
      console.log(e);
      return {
        priceData: new Map(),
        volumeData: new Map(),
      };
    }
  }
}

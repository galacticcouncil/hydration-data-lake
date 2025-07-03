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

export type RedisInstance = RedisClientType<
  RedisDefaultModules,
  RedisFunctions,
  RedisScripts
  // RespVersions,
  // TypeMapping
>;

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
        port: appConfig.ORCHESTRATOR_QUEUE_REDIS_PORT,
        host: appConfig.ORCHESTRATOR_QUEUE_REDIS_HOST,
      },
      password: appConfig.ORCHESTRATOR_QUEUE_REDIS_PASS,
      database: 3,
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
        });

      await openClient.ts.mAdd(listToSave);
    } catch (e) {
      console.log(e);
    }
  }

  async getPricesFromTimeSeries({
    assetInId,
    assetOutId = '10',
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
  }) {
    try {
      const key = this.getSeriesKey({
        keyPrefix: indexerId,
        name: 'price',
        assetAId: assetInId,
        assetBId: assetOutId,
      });
      console.log('key - ', key);
      const openClient = await this.getOpenClient();

      const buckets = await openClient.ts.range(
        key,
        startTimestamp,
        endTimestamp,
        {
          AGGREGATION: {
            type: TimeSeriesAggregationType.AVG,
            timeBucket: bucketSizeMs,
          },
        }
      );

      return buckets;
    } catch (e) {
      console.log(e);
      return [];
    }
  }
}

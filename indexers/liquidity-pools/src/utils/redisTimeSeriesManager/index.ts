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
import pMap from 'p-map';
import { RedisTimeSeriesMigrationsManager } from './migrationsManager';
import timeSeriesMigrations from './migrations';

export type RedisInstance = RedisClientType<
  RedisDefaultModules,
  RedisFunctions,
  RedisScripts
  // RespVersions,
  // TypeMapping
>;

export enum RedisTimeSeriesName {
  price = 'price',
  volume = 'volume',

  acc_bal_tot_tns = 'acc_bal_tot_tns',
  acc_bal_tot_loc = 'acc_bal_tot_loc',
  acc_bal_tot_debt = 'acc_bal_tot_debt',
}

export type TimeSeriesPriceAndVolumeBuckets = {
  priceData: Map<string, Map<number, { timestamp: number; value: number }>>;
  volumeData: Map<number, { timestamp: number; value: number }>;
};
export type TimeSeriesAccTotalBalancesBuckets = {
  transferable: Map<number, { timestamp: number; value: number }>;
  locked: Map<number, { timestamp: number; value: number }>;
  debt: Map<number, { timestamp: number; value: number }>;
};

export type AddMultiplePricesPayload = {
  name: RedisTimeSeriesName;
  assetAId: string;
  assetBId?: string;
  value: number;
  timestamp: number;
  keyPrefix?: string | number;
};

export type AddMultipleAccountTotalBalancesPayload = {
  name: RedisTimeSeriesName;
  accountId: string;
  value: number;
  timestamp: number;
  keyPrefix?: string | number;
};

export type RedisTimeSeriesKey = string;

const appConfig = AppConfig.getInstance();

export class RedisTimeSeriesManager extends RedisTimeSeriesMigrationsManager {
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

  /**
   * Initialize client and run pending migrations
   * Call this method on application bootstrap
   */
  async initClientAndRunMigrations() {
    await this.getOpenClient();
    await this.runTimeSeriesMigrations(timeSeriesMigrations);
  }

  private fillNaNWithPrevious(
    data: Array<{ timestamp: number; value: number }>
  ): Array<{ timestamp: number; value: number }> {
    let previousValue: number | null = null;

    return data.map((item) => {
      if (isNaN(item.value)) {
        return { ...item, value: previousValue !== null ? previousValue : 0 };
      }
      previousValue = item.value;
      return item;
    });
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
    accountId,
    keyPrefix,
  }: {
    name: RedisTimeSeriesName;
    assetAId?: string;
    assetBId?: string;
    accountId?: string;
    keyPrefix?: string | number;
  }) {
    if (!assetAId && !accountId)
      throw Error(
        `getSeriesKey function didn't receive enough args. [assetAId => ${assetAId} | accountId => ${accountId}]`
      );

    const key = `ts:${keyPrefix ? keyPrefix : 'none'}:${name}`;

    if (
      name === RedisTimeSeriesName.price ||
      name === RedisTimeSeriesName.volume
    )
      return key + `:${assetAId}:${assetBId}`;

    if (
      name === RedisTimeSeriesName.acc_bal_tot_loc ||
      name === RedisTimeSeriesName.acc_bal_tot_tns ||
      name === RedisTimeSeriesName.acc_bal_tot_debt
    )
      return key + `:${accountId}`;

    throw Error(`getSeriesKey function didn't receive correct name`);
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
    const openClient = await this.getOpenClient();
    try {
      // Try to create first (atomic operation)
      await openClient.ts.create(key, {
        RETENTION: 0,
        DUPLICATE_POLICY: TimeSeriesDuplicatePolicies.LAST,
        LABELS: {
          indVer: appConfig.INDEXER_ID,
          ...labels,
        },
      });
    } catch (err: any) {
      // Gracefully handle concurrent creation attempts
      if (
        err.message &&
        (err.message.includes('TSDB: key already exists') ||
          err.message.includes('key already exists'))
      ) {
        // Key exists, verify it's a valid TimeSeries
        if (await this.isTimeSeriesExists(key)) {
          return;
        }
        // Key exists but isn't a TimeSeries - this is a problem
        throw new Error(
          `Key ${key} exists but is not a TimeSeries. Manual cleanup required.`
        );
      }
      // Re-throw other errors
      throw err;
    }
  }

  async addToTimeSeries({
    name,
    assetAId,
    assetBId = '10',
    value,
    timestamp,
    keyPrefix,
  }: {
    name: RedisTimeSeriesName;
    assetAId: string;
    assetBId?: string;
    value: number;
    timestamp: number;
    keyPrefix?: string | number;
  }) {
    if (!appConfig.COMMIT_HIST_DATA_TO_REDIS_TIME_SERIES) return;

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

  async addMultiplePrices(data: AddMultiplePricesPayload[]) {
    if (!appConfig.COMMIT_HIST_DATA_TO_REDIS_TIME_SERIES) return;

    try {
      const openClient = await this.getOpenClient();

      const keysMap: Map<
        RedisTimeSeriesKey,
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

      // await pMap(
      //   Array.from(keysMap.entries()),
      //   ([uniqueKey, indexerData]) =>
      //     this.ensureTimeSeries(uniqueKey, {
      //       name: indexerData.name,
      //       astAId: indexerData.assetAId,
      //       astBId: indexerData.assetBId,
      //       ...this.getVolumeSeriesLabel(
      //         indexerData.assetAId,
      //         indexerData.assetBId
      //       ),
      //     }),
      //   { concurrency: 10 }
      // );
      for (const [uniqueKey, indexerData] of keysMap.entries()) {
        await this.ensureTimeSeries(uniqueKey, {
          name: indexerData.name,
          astAId: indexerData.assetAId,
          astBId: indexerData.assetBId,
          ...this.getVolumeSeriesLabel(
            indexerData.assetAId,
            indexerData.assetBId
          ),
        });
      }

      await openClient.ts.mAdd(listToSave);
    } catch (e) {
      console.log(e);
    }
  }

  async addMultipleAccountTotalBalances(
    data: AddMultipleAccountTotalBalancesPayload[]
  ) {
    if (!appConfig.COMMIT_HIST_DATA_TO_REDIS_TIME_SERIES) return;

    try {
      const openClient = await this.getOpenClient();

      const keysMap: Map<
        RedisTimeSeriesKey,
        { accountId: string; name: string }
      > = new Map();

      const listToSave = [];

      for (const { keyPrefix, name, accountId, value, timestamp } of data) {
        const key = this.getSeriesKey({
          keyPrefix,
          name,
          accountId,
        });
        keysMap.set(key, { accountId, name });
        listToSave.push({ key, timestamp, value });
      }

      for (const [uniqueKey, indexerData] of keysMap.entries())
        await this.ensureTimeSeries(uniqueKey, {
          name: indexerData.name,
          accountId: indexerData.accountId,
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
    const defaultResponse = {
      priceData: new Map(),
      volumeData: new Map(),
    };

    if (!appConfig.USE_HIST_DATA_FROM_REDIS_TIME_SERIES) return defaultResponse;

    try {
      const openClient = await this.getOpenClient();

      let priceKeysMap = new Map<string, string>([
        [
          this.getSeriesKey({
            keyPrefix: appConfig.INDEXER_ID,
            name: RedisTimeSeriesName.price,
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
            name: RedisTimeSeriesName.volume,
            assetAId: assetInId,
            assetBId: assetOutId,
          }),
          `${assetInId}:${assetOutId}`,
        ],
        [
          this.getSeriesKey({
            keyPrefix: appConfig.INDEXER_ID,
            name: RedisTimeSeriesName.volume,
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
              name: RedisTimeSeriesName.price,
              assetAId: assetInId,
              assetBId: appConfig.ASSET_PRICE_BASE_ASSET_ID,
            }),
            `${assetInId}:${appConfig.ASSET_PRICE_BASE_ASSET_ID}`,
          ],
          [
            this.getSeriesKey({
              keyPrefix: appConfig.INDEXER_ID,
              name: RedisTimeSeriesName.price,
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
      return defaultResponse;
    }
  }

  async getAccTotalBalancesFromTimeSeries({
    accountId,
    startTimestamp,
    endTimestamp,
    indexerId,
    bucketSizeMs,
  }: {
    accountId: string;
    startTimestamp: number;
    endTimestamp: number;
    indexerId: string;
    bucketSizeMs: number;
  }): Promise<TimeSeriesAccTotalBalancesBuckets> {
    const defaultResponse: TimeSeriesAccTotalBalancesBuckets = {
      transferable: new Map(),
      locked: new Map(),
      debt: new Map(),
    };

    if (!appConfig.USE_HIST_DATA_FROM_REDIS_TIME_SERIES) return defaultResponse;

    try {
      const openClient = await this.getOpenClient();

      const totalTransferableBalanceKey = this.getSeriesKey({
        name: RedisTimeSeriesName.acc_bal_tot_tns,
        accountId,
        keyPrefix: indexerId,
      });
      const totalLockedBalanceKey = this.getSeriesKey({
        name: RedisTimeSeriesName.acc_bal_tot_loc,
        accountId,
        keyPrefix: indexerId,
      });
      const totalDebtBalanceKey = this.getSeriesKey({
        name: RedisTimeSeriesName.acc_bal_tot_debt,
        accountId,
        keyPrefix: indexerId,
      });

      const buckets = await openClient.ts.mRange(
        startTimestamp,
        endTimestamp,
        [
          `accountId=${accountId}`,
          `name=(${RedisTimeSeriesName.acc_bal_tot_tns},${RedisTimeSeriesName.acc_bal_tot_loc},${RedisTimeSeriesName.acc_bal_tot_debt})`,
        ],
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

      const resultFiltered: TimeSeriesAccTotalBalancesBuckets = {
        transferable: new Map(),
        locked: new Map(),
        debt: new Map(),
      };

      for (const bucket of buckets) {
        if (bucket.key === totalTransferableBalanceKey) {
          resultFiltered.transferable = new Map(
            this.fillNaNWithPrevious(bucket.samples).map((s) => [
              s.timestamp,
              s,
            ])
          );
          continue;
        }
        if (bucket.key === totalDebtBalanceKey) {
          resultFiltered.debt = new Map(
            this.fillNaNWithPrevious(bucket.samples).map((s) => [
              s.timestamp,
              s,
            ])
          );
          continue;
        }
        if (bucket.key === totalLockedBalanceKey) {
          resultFiltered.locked = new Map(
            this.fillNaNWithPrevious(bucket.samples).map((s) => [
              s.timestamp,
              s,
            ])
          );
        }
      }

      return resultFiltered;
    } catch (e) {
      console.log(e);
      return defaultResponse;
    }
  }

  async clearTimeSeriesByKeyPrefix(
    keyPrefix: string | number,
    batchSize: number = 1000
  ): Promise<{ deletedCount: number }> {
    try {
      const openClient = await this.getOpenClient();
      const pattern = `ts:${keyPrefix}:*`;
      let cursor = 0;
      let deletedCount = 0;

      console.log(`Starting deletion of time series with pattern: ${pattern}`);

      do {
        const result = await openClient.scan(cursor, {
          MATCH: pattern,
          COUNT: batchSize,
        });

        cursor = result.cursor;
        const keys = result.keys;

        if (keys.length > 0) {
          await openClient.del(keys);
          deletedCount += keys.length;
          console.log(`Deleted ${keys.length} keys (total: ${deletedCount})`);
        }
      } while (cursor !== 0);

      console.log(
        `Completed deletion: ${deletedCount} keys removed for prefix ${keyPrefix}`
      );

      return { deletedCount };
    } catch (e) {
      console.log(`Error clearing time series by prefix ${keyPrefix}:`, e);
      throw e;
    }
  }
}

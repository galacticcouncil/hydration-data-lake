import {
  createClient,
  RedisClientType,
  RedisFunctions,
  RedisScripts,
  RedisDefaultModules,
} from 'redis';
import { AppConfig } from '../../appConfig';
import { ApiSupportPgClient } from '../redisTimeSeriesSupport/apiSupportPgClient';

export type RedisInstance = RedisClientType<
  RedisDefaultModules,
  RedisFunctions,
  RedisScripts
>;

export enum MigrationKey {
  TS_DB_MIGRATIONS_ALL = 'ts_db_migrations:all',
}

export type TimeSeriesMigrationAction = 'CLEAR_BY_INDEXER_ID';

export interface TimeSeriesMigration {
  id: string;
  action: TimeSeriesMigrationAction;
  keyPrefix?: string | number;
  description?: string;
}

const appConfig = AppConfig.getInstance();

export class RedisTimeSeriesMigrationsManager {
  private migrationsClient: RedisInstance | null = null;

  protected async getMigrationsClient(): Promise<RedisInstance> {
    if (this.migrationsClient) return this.migrationsClient;

    const client = createClient({
      socket: {
        port: appConfig.TS_REDIS_PORT,
        host: appConfig.TS_REDIS_HOST,
      },
      password: appConfig.TS_REDIS_PASS,
      database: appConfig.TS_REDIS_KEY_SPACE_ID,
    });

    client.on('connect', () => {
      console.log('RedisTimeSeries Migrations client connect');
    });
    client.on('ready', () => {
      console.log('RedisTimeSeries Migrations client ready');
    });
    client.on('error', (err) => {
      console.error('RedisTimeSeries Migrations client error:', err);
    });

    this.migrationsClient = await client.connect();

    return this.migrationsClient;
  }

  /**
   * This method should be implemented by the child class (RedisTimeSeriesManager)
   * to clear time series records by key prefix
   */
  protected async clearTimeSeriesByKeyPrefix(
    keyPrefix: string | number,
    batchSize?: number
  ): Promise<{ deletedCount: number }> {
    throw new Error(
      'clearTimeSeriesByKeyPrefix must be implemented by child class'
    );
  }

  /**
   * This method should be implemented by the child class (RedisTimeSeriesManager)
   * to clear time series records by key prefix
   */
  protected async clearTimeSeriesByKeyPrefixAndTimeRange({
    keyPrefix,
    fromTimestamp,
    toTimestamp,
    batchSize,
  }: {
    keyPrefix: string | number;
    fromTimestamp: number;
    toTimestamp: number;
    batchSize?: number;
  }): Promise<{ keysProcessed: number; totalRangesDeleted: number }> {
    throw new Error(
      'clearTimeSeriesByKeyPrefixAndTimeRange must be implemented by child class'
    );
  }

  async runTimeSeriesMigrations(
    migrations: TimeSeriesMigration[]
  ): Promise<void> {
    const client = await this.getMigrationsClient();
    const migrationsMap = new Map(migrations.map((item) => [item.id, item]));
    let migrationIdsToRun: string[] = [];

    const migrationsTableKey = await client.keys(
      MigrationKey.TS_DB_MIGRATIONS_ALL
    );

    if (!migrationsTableKey || migrationsTableKey.length === 0) {
      migrationIdsToRun = [...migrationsMap.keys()];
    } else {
      const executedMigrations = await client.sMembers(
        MigrationKey.TS_DB_MIGRATIONS_ALL
      );

      for (const item of executedMigrations) {
        migrationsMap.delete(item);
      }
      migrationIdsToRun = [...migrationsMap.keys()];
    }

    if (!migrationIdsToRun || migrationIdsToRun.length === 0) {
      console.log(`RedisTimeSeries :: No pending DB migrations found.`);
      return;
    }

    for (const migrationId of migrationIdsToRun) {
      const migrationDetails = migrationsMap.get(migrationId);

      if (!migrationDetails) continue;

      try {
        switch (migrationDetails.action) {
          case 'CLEAR_BY_INDEXER_ID': {
            if (!migrationDetails.keyPrefix) {
              throw new Error(
                `Migration ${migrationId} requires keyPrefix parameter`
              );
            }

            console.log(
              `RedisTimeSeries :: Running migration [id: ${migrationDetails.id}] - ${migrationDetails.description || 'Clearing time series by indexer ID'}`
            );

            await this.clearTimeSeriesByKeyPrefix(migrationDetails.keyPrefix);

            try {
              await ApiSupportPgClient.getInstance().upsertApiState({
                accTotalBalanceLatestProcBlock: 0,
              });
            } catch (error) {
              console.log(error);
            }

            await client.sAdd(
              MigrationKey.TS_DB_MIGRATIONS_ALL,
              migrationDetails.id
            );

            console.log(
              `RedisTimeSeries :: Migration completed [id: ${migrationDetails.id} // action: ${migrationDetails.action} // keyPrefix: ${migrationDetails.keyPrefix}]`
            );
            break;
          }
          default:
            console.warn(
              `RedisTimeSeries :: Unknown migration action: ${migrationDetails.action}`
            );
        }
      } catch (error) {
        console.error(
          `RedisTimeSeries :: Migration failed [id: ${migrationId}]:`,
          error
        );
        throw error;
      }
    }
  }

  async closeMigrationsClient(): Promise<void> {
    if (this.migrationsClient) {
      await this.migrationsClient.quit();
      this.migrationsClient = null;
    }
  }
}

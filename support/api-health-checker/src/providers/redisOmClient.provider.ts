import { Injectable, OnApplicationBootstrap, Provider } from '@nestjs/common';
import { Redis } from 'ioredis';
import { AppConfig } from '../config.module';
import { Repository, Schema } from 'redis-om';
import { createClient, RedisClientType } from 'redis';
import {
  LatestProcessedBlocksEntity,
  MmEventsStatusScoreEntity,
  NotificationTriggersStateEntity,
  RedisOmEntityId,
  SwappedEventsStatusScoreEntity,
} from '../types/redisOm';

const mmEventsTrackingStatusSchema = new Schema(
  'mmEventsTrackingStatus',
  {
    initialized: { type: 'boolean' },
    mmEventsTrackingStatusScore: { type: 'number' },
  },
  {
    dataStructure: 'JSON',
  },
);
const swapsTrackingStatusSchema = new Schema(
  'swapsTrackingStatus',
  {
    initialized: { type: 'boolean' },
    swapsTrackingStatusScore: { type: 'number' },
  },
  {
    dataStructure: 'JSON',
  },
);

const latestProcessedBlocksSchema = new Schema(
  'latestProcessedBlocks',
  {
    initialized: { type: 'boolean' },
    latestOnChainBlockHeight: { type: 'number' },
    latestIndexerBlockHeight: { type: 'number' },
  },
  {
    dataStructure: 'JSON',
  },
);

const notificationTriggersStateSchema = new Schema(
  'notificationsTriggersState',
  {
    initialized: { type: 'boolean' },
    latestOnChainBlockHeight: { type: 'number' },
    latestIndexerBlockHeight: { type: 'number' },
  },
  {
    dataStructure: 'JSON',
  },
);

@Injectable()
export class RedisOmClientProvider implements OnApplicationBootstrap {
  private latestProcessedBlocksRepo: Repository<LatestProcessedBlocksEntity> | null =
    null;
  private mmEventsTrackingStatusRepo: Repository<MmEventsStatusScoreEntity> | null =
    null;
  private swapsTrackingStatusRepo: Repository<SwappedEventsStatusScoreEntity> | null =
    null;
  private notificationTriggersStateRepo: Repository<NotificationTriggersStateEntity> | null =
    null;

  constructor(private appConfig: AppConfig) {}

  async onApplicationBootstrap(): Promise<string | void> {
    await this.initAllRepositories();
  }

  private getClient() {
    const client = createClient({
      socket: {
        host: this.appConfig.REDIS_HOST,
        port: +this.appConfig.REDIS_PORT,
      },
      password: this.appConfig.REDIS_PASSWORD,
      database: 2,
      ...(this.appConfig.REDIS_QUEUE_ENABLE_SSL
        ? { tls: {}, connectTimeout: 60_000 }
        : {}),
    });

    client.on('connect', () => {
      console.log('RedisOM client connect');
    });
    client.on('connecting', () => {
      console.log('RedisOM client connecting');
    });
    client.on('ready', () => {
      console.log('RedisOM client ready');
    });
    client.on('reconnecting', () => {
      console.log('RedisOM client reconnecting');
    });

    return client;
  }

  private async initAllRepositories() {
    const openClient = await this.getClient().connect();

    this.latestProcessedBlocksRepo =
      new Repository<LatestProcessedBlocksEntity>(
        latestProcessedBlocksSchema,
        openClient,
      );
    this.mmEventsTrackingStatusRepo = new Repository<MmEventsStatusScoreEntity>(
      mmEventsTrackingStatusSchema,
      openClient,
    );
    this.swapsTrackingStatusRepo =
      new Repository<SwappedEventsStatusScoreEntity>(
        swapsTrackingStatusSchema,
        openClient,
      );
    this.notificationTriggersStateRepo =
      new Repository<NotificationTriggersStateEntity>(
        notificationTriggersStateSchema,
        openClient,
      );

    await this.initStatusesDefaultValues();
  }

  async initStatusesDefaultValues() {
    const currentLatestProcessedBlocksStatus =
      await this.latestProcessedBlocksRepository.fetch(
        RedisOmEntityId.LATEST_PROCESSED_BLOCKS,
      );
    if (!currentLatestProcessedBlocksStatus.initialized)
      await this.latestProcessedBlocksRepository.save(
        RedisOmEntityId.LATEST_PROCESSED_BLOCKS,
        {
          initialized: true,
          latestOnChainBlockHeight: 0,
          latestIndexerBlockHeight: 0,
        },
      );

    const currentMmEventsStatus =
      await this.mmEventsTrackingStatusRepository.fetch(
        RedisOmEntityId.MM_EVENTS_STATUS_SCORE,
      );
    if (!currentMmEventsStatus.initialized)
      await this.mmEventsTrackingStatusRepository.save(
        RedisOmEntityId.MM_EVENTS_STATUS_SCORE,
        {
          initialized: true,
          mmEventsTrackingStatusScore: this.appConfig.EVENT_STATUS_MAX_SCORE,
        },
      );

    const currentSwappedEventsStatus =
      await this.swapsTrackingStatusRepository.fetch(
        RedisOmEntityId.SWAPPED_EVENTS_STATUS_SCORE,
      );
    if (!currentSwappedEventsStatus.initialized)
      await this.swapsTrackingStatusRepository.save(
        RedisOmEntityId.SWAPPED_EVENTS_STATUS_SCORE,
        {
          initialized: true,
          swappedEventsTrackingStatusScore:
            this.appConfig.EVENT_STATUS_MAX_SCORE,
        },
      );

    const currentNotificationTriggersState =
      await this.notificationTriggersStateRepository.fetch(
        RedisOmEntityId.NOTIFICATION_TRIGGERS_STATE,
      );
    if (!currentNotificationTriggersState.initialized)
      await this.notificationTriggersStateRepository.save(
        RedisOmEntityId.NOTIFICATION_TRIGGERS_STATE,
        {
          initialized: true,
          processedBlocksDifference: 0,
          swappedEventsTrackingStatus: 0,
          mmEventsTrackingStatus: 0,
        },
      );
  }

  get latestProcessedBlocksRepository() {
    return this.latestProcessedBlocksRepo;
  }
  get mmEventsTrackingStatusRepository() {
    return this.mmEventsTrackingStatusRepo;
  }
  get swapsTrackingStatusRepository() {
    return this.swapsTrackingStatusRepo;
  }
  get notificationTriggersStateRepository() {
    return this.notificationTriggersStateRepo;
  }
}

export const RedisOmClientProviderToken = 'RedisOmClientProviderToken';

export const RedisOmClientProviderFactory: Provider = {
  provide: RedisOmClientProviderToken,
  useClass: RedisOmClientProvider,
};

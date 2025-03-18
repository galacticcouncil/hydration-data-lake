import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import {
  EventCheckJobPayload,
  EventCheckJobResult,
} from '../../types/queueJob';
import { AppConfig } from '../../config.module';
import {
  RedisOmClientProvider,
  RedisOmClientProviderToken,
} from '../../providers/redisOmClient.provider';
import { GlobalStatusName } from '../../types/common';
import { RedisOmEntityId } from '../../types/redisOm';
import { NotificationsDispatcherService } from '../notificationsDispatcher/notificationsDispatcher.service';

@Injectable()
export class HealthCheckStatusService {
  constructor(
    private appConfig: AppConfig,
    private notificationsDispatcherService: NotificationsDispatcherService,

    @Inject(RedisOmClientProviderToken)
    private readonly redisOmClientProvider: RedisOmClientProvider,
  ) {}

  async updateGlobalStatusScore({
    scoreDiff,
    statusName,
  }: {
    scoreDiff: number;
    statusName: GlobalStatusName;
  }) {
    switch (statusName) {
      case GlobalStatusName.SWAPS: {
        const currentStatus =
          await this.redisOmClientProvider.swapsTrackingStatusRepository.fetch(
            RedisOmEntityId.SWAPPED_EVENTS_STATUS_SCORE,
          );

        if (
          currentStatus.swappedEventsTrackingStatusScore + scoreDiff < 0 ||
          currentStatus.swappedEventsTrackingStatusScore + scoreDiff >
            this.appConfig.EVENT_STATUS_MAX_SCORE
        )
          return;

        const oldValue = currentStatus.swappedEventsTrackingStatusScore;
        const newValue =
          currentStatus.swappedEventsTrackingStatusScore + scoreDiff;
        const changeDirection = oldValue > newValue ? 'reduce' : 'increase';

        currentStatus.swappedEventsTrackingStatusScore += scoreDiff;

        await this.redisOmClientProvider.swapsTrackingStatusRepository.save(
          RedisOmEntityId.SWAPPED_EVENTS_STATUS_SCORE,
          currentStatus,
        );
        await this.notificationsDispatcherService.updateNotificationTriggersState(
          { changeDirection, statusName },
        );
        break;
      }
      case GlobalStatusName.MM_EVENTS: {
        const currentStatus =
          await this.redisOmClientProvider.mmEventsTrackingStatusRepository.fetch(
            RedisOmEntityId.MM_EVENTS_STATUS_SCORE,
          );

        if (
          currentStatus.mmEventsTrackingStatusScore + scoreDiff < 0 ||
          currentStatus.mmEventsTrackingStatusScore + scoreDiff >
            this.appConfig.EVENT_STATUS_MAX_SCORE
        )
          return;

        const oldValue = currentStatus.mmEventsTrackingStatusScore;
        const newValue = currentStatus.mmEventsTrackingStatusScore + scoreDiff;
        const changeDirection = oldValue > newValue ? 'reduce' : 'increase';

        currentStatus.mmEventsTrackingStatusScore += scoreDiff;

        await this.redisOmClientProvider.mmEventsTrackingStatusRepository.save(
          RedisOmEntityId.MM_EVENTS_STATUS_SCORE,
          currentStatus,
        );

        await this.notificationsDispatcherService.updateNotificationTriggersState(
          { changeDirection, statusName },
        );
      }
    }
  }

  async saveLatestProcessedBlocks({
    onChainData,
    indexerData,
  }: {
    onChainData: number;
    indexerData?: number;
  }) {
    const status =
      await this.redisOmClientProvider.latestProcessedBlocksRepository.fetch(
        RedisOmEntityId.LATEST_PROCESSED_BLOCKS,
      );

    if (!status) return;

    const previousDiffDirection =
      status.latestOnChainBlockHeight - status.latestIndexerBlockHeight >=
      this.appConfig.BLOCKS_DIFF_ALERT_THRESHOLD
        ? -1
        : 1;

    const indexerLastBlock = indexerData ?? status.latestIndexerBlockHeight;

    const currentDiffDirection =
      onChainData - indexerLastBlock >=
      this.appConfig.BLOCKS_DIFF_ALERT_THRESHOLD
        ? -1
        : 1;

    const isBlocksDiffDirectionChanged =
      previousDiffDirection !== currentDiffDirection;

    status.latestOnChainBlockHeight = onChainData;
    if (indexerData) status.latestIndexerBlockHeight = indexerData;

    await this.redisOmClientProvider.latestProcessedBlocksRepository.save(
      RedisOmEntityId.LATEST_PROCESSED_BLOCKS,
      status,
    );

    if (isBlocksDiffDirectionChanged)
      await this.notificationsDispatcherService.updateNotificationTriggersState(
        {
          changeDirection: currentDiffDirection > 0 ? 'increase' : 'reduce',
          statusName: GlobalStatusName.LATEST_PROCESSED_BLOCKS,
        },
      );
  }
}

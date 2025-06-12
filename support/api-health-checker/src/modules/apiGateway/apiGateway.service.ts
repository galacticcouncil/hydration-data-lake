import { Inject, Injectable } from '@nestjs/common';
import { IndexerStatusResponse } from './dto/indexerStatus.response';
import { AppConfig } from '../../config.module';
import {
  RedisOmClientProvider,
  RedisOmClientProviderToken,
} from '../../providers/redisOmClient.provider';
import { RedisOmEntityId } from '../../types/redisOm';

@Injectable()
export class ApiGatewayService {
  constructor(
    private appConfig: AppConfig,
    @Inject(RedisOmClientProviderToken)
    private readonly redisOmClientProvider: RedisOmClientProvider,
  ) {}

  async getGlobalIndexerStatus(): Promise<IndexerStatusResponse> {
    const response: IndexerStatusResponse = {
      latestIndexerBlockHeight: 0,
      latestOnChainBlockHeight: 0,
      swappedEventsTrackingStatusScore: this.appConfig.EVENT_STATUS_MAX_SCORE,
      mmEventsTrackingStatusScore: this.appConfig.EVENT_STATUS_MAX_SCORE,
      version: '1742583860376',
    };

    try {
      const latestBlocks =
        await this.redisOmClientProvider.latestProcessedBlocksRepository.fetch(
          RedisOmEntityId.LATEST_PROCESSED_BLOCKS,
        );
      const mmEventsStatus =
        await this.redisOmClientProvider.mmEventsTrackingStatusRepository.fetch(
          RedisOmEntityId.MM_EVENTS_STATUS_SCORE,
        );
      const swappedEventsStatus =
        await this.redisOmClientProvider.swapsTrackingStatusRepository.fetch(
          RedisOmEntityId.SWAPPED_EVENTS_STATUS_SCORE,
        );

      response.latestOnChainBlockHeight =
        latestBlocks.latestOnChainBlockHeight ?? 0;
      response.latestIndexerBlockHeight =
        latestBlocks.latestIndexerBlockHeight ?? 0;
      response.swappedEventsTrackingStatusScore =
        swappedEventsStatus.swappedEventsTrackingStatusScore ?? 0;
      response.mmEventsTrackingStatusScore =
        mmEventsStatus.mmEventsTrackingStatusScore ?? 0;

      return response;
    } catch (e) {
      console.log(e);
      return response;
    }
  }
}

import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  EventCheckJobPayload,
  EventCheckJobResult,
} from '../../types/queueJob';
import { AppConfig } from '../../config.module';
import { IndexerApiService } from '../indexerApi/indexerApi.service';
import { QueueService } from '../queue/queue.service';
import { HealthCheckStatusService } from './healthCheckStatus.service';
import { GlobalStatusName } from '../../types/common';
import { EventName } from '../../types/events';
import { NotificationsDispatcherService } from '../notificationsDispatcher/notificationsDispatcher.service';
import {
  RedisOmClientProvider,
  RedisOmClientProviderToken,
} from '../../providers/redisOmClient.provider';
import { RedisOmEntityId } from '../../types/redisOm';

@Injectable()
export class HealthCheckCoreService {
  constructor(
    private appConfig: AppConfig,
    private indexerApiService: IndexerApiService,
    @Inject(forwardRef(() => QueueService))
    private queueService: QueueService,
    private healthCheckStatusService: HealthCheckStatusService,
    private notificationsDispatcherService: NotificationsDispatcherService,

    @Inject(RedisOmClientProviderToken)
    private readonly redisOmClientProvider: RedisOmClientProvider,
  ) {}

  async handleBroadcastSwappedOnChainEvent(
    jobData: EventCheckJobPayload<EventName.Broadcast_Swapped3>,
  ): Promise<EventCheckJobResult> {
    const { payload: jobPayload, meta: jobMeta } = jobData;

    const indexerEventData =
      await this.indexerApiService.getBroadcastSwappedEventIndexerData({
        onChainEventPayload: jobPayload,
        onChainEventMeta: jobMeta,
      });

    if (
      !indexerEventData &&
      jobMeta.jobExecAttempt <
        this.appConfig.EVENT_CHECK_JOB_ATTEMPTS_NUMBER_THRESHOLD
    ) {
      await this.queueService.rescheduleEventCheckJob({ jobPayload: jobData });
      return { success: false };
    } else if (
      !indexerEventData &&
      jobMeta.jobExecAttempt >=
        this.appConfig.EVENT_CHECK_JOB_ATTEMPTS_NUMBER_THRESHOLD
    ) {
      await this.healthCheckStatusService.updateGlobalStatusScore({
        scoreDiff: -1,
        statusName: GlobalStatusName.SWAPS,
      });
      return;
    }

    if (
      indexerEventData.length === 0 ||
      indexerEventData[0].swaps.nodes.length === 0
    ) {
      await this.healthCheckStatusService.updateGlobalStatusScore({
        scoreDiff: -1,
        statusName: GlobalStatusName.SWAPS,
      });
      return;
    }
    const indexedSwapToCheck = indexerEventData[0].swaps.nodes[0];
    let isIndexerDataValid = true;

    if (
      indexedSwapToCheck.filler.id !== jobPayload.filler ||
      indexedSwapToCheck.swapper.id !== jobPayload.swapper ||
      indexedSwapToCheck.operationType !== jobPayload.operation
    ) {
      await this.healthCheckStatusService.updateGlobalStatusScore({
        scoreDiff: -1,
        statusName: GlobalStatusName.SWAPS,
      });
      return;
    }

    const onChainSwapInputs = new Map(
      jobPayload.inputs.map((input) => [
        input.assetId.toString(),
        input.amount,
      ]),
    );
    const onChainSwapOutputs = new Map(
      jobPayload.outputs.map((output) => [
        output.assetId.toString(),
        output.amount,
      ]),
    );

    for (const input of indexedSwapToCheck.swapInputs.nodes) {
      if (
        !onChainSwapInputs.has(`${input.asset.assetRegistryId}`) ||
        onChainSwapInputs.get(`${input.asset.assetRegistryId}`) !== input.amount
      )
        isIndexerDataValid = false;
    }
    for (const output of indexedSwapToCheck.swapOutputs.nodes) {
      if (
        !onChainSwapOutputs.has(`${output.asset.assetRegistryId}`) ||
        onChainSwapOutputs.get(`${output.asset.assetRegistryId}`) !==
          output.amount
      )
        isIndexerDataValid = false;
    }

    if (!isIndexerDataValid) {
      await this.healthCheckStatusService.updateGlobalStatusScore({
        scoreDiff: -1,
        statusName: GlobalStatusName.SWAPS,
      });
      return;
    }

    await this.healthCheckStatusService.updateGlobalStatusScore({
      scoreDiff: 1,
      statusName: GlobalStatusName.SWAPS,
    });

    return { success: false };
  }

  async handleBestBlockOnChainEvent(
    jobData: EventCheckJobPayload<EventName.BestBlock>,
  ): Promise<EventCheckJobResult> {
    const { payload: jobPayload } = jobData;

    const indexerEventData =
      await this.indexerApiService.getIndexerLatestProcessedBlockData();

    await this.healthCheckStatusService.saveLatestProcessedBlocks({
      onChainData: jobPayload.height,
      indexerData: (indexerEventData || [])[0]?.latestProcessedBlock ?? null,
    });

    return { success: false };
  }

  async handleMmSupplyOnChainEvent(
    jobData: EventCheckJobPayload<EventName.MoneyMarket_Supply>,
  ): Promise<EventCheckJobResult> {
    const { payload: jobPayload, meta: jobMeta } = jobData;

    const indexerAccountData = await this.indexerApiService.getAccountData({
      boundEvmAddress: jobPayload.userAddress,
    });

    const indexerEventData =
      await this.indexerApiService.getMoneyMarketEventSupplyIndexerData({
        accountSubstrateAddress: (indexerAccountData || [])[0]?.id ?? '',
        onChainEventPayload: jobPayload,
        onChainEventMeta: jobMeta,
      });

    if (
      !indexerEventData &&
      jobMeta.jobExecAttempt <
        this.appConfig.EVENT_CHECK_JOB_ATTEMPTS_NUMBER_THRESHOLD
    ) {
      await this.queueService.rescheduleEventCheckJob({ jobPayload: jobData });
      return { success: false };
    } else if (
      !indexerEventData &&
      jobMeta.jobExecAttempt >=
        this.appConfig.EVENT_CHECK_JOB_ATTEMPTS_NUMBER_THRESHOLD
    ) {
      await this.healthCheckStatusService.updateGlobalStatusScore({
        scoreDiff: -1,
        statusName: GlobalStatusName.MM_EVENTS,
      });
      return;
    }

    if (indexerEventData.length === 0 || !indexerEventData[0].supply) {
      await this.healthCheckStatusService.updateGlobalStatusScore({
        scoreDiff: -1,
        statusName: GlobalStatusName.MM_EVENTS,
      });
      return;
    }
    const indexedSupplyToCheck = indexerEventData[0].supply;

    if (
      indexedSupplyToCheck.amount !== jobPayload.amount ||
      indexedSupplyToCheck.account.boundEvmAddress !== jobPayload.userAddress ||
      indexedSupplyToCheck.asset.evmAddress !== jobPayload.reserveAddress
    ) {
      await this.healthCheckStatusService.updateGlobalStatusScore({
        scoreDiff: -1,
        statusName: GlobalStatusName.MM_EVENTS,
      });
      return;
    }

    await this.healthCheckStatusService.updateGlobalStatusScore({
      scoreDiff: 1,
      statusName: GlobalStatusName.MM_EVENTS,
    });

    return { success: false };
  }

  async handleMmBorrowOnChainEvent(
    jobData: EventCheckJobPayload<EventName.MoneyMarket_Borrow>,
  ): Promise<EventCheckJobResult> {
    const { payload: jobPayload, meta: jobMeta } = jobData;

    const indexerAccountData = await this.indexerApiService.getAccountData({
      boundEvmAddress: jobPayload.userAddress,
    });

    const indexerEventData =
      await this.indexerApiService.getMoneyMarketEventBorrowIndexerData({
        accountSubstrateAddress: (indexerAccountData || [])[0]?.id ?? '',
        onChainEventPayload: jobPayload,
        onChainEventMeta: jobMeta,
      });

    if (
      !indexerEventData &&
      jobMeta.jobExecAttempt <
        this.appConfig.EVENT_CHECK_JOB_ATTEMPTS_NUMBER_THRESHOLD
    ) {
      await this.queueService.rescheduleEventCheckJob({ jobPayload: jobData });
      return { success: false };
    } else if (
      !indexerEventData &&
      jobMeta.jobExecAttempt >=
        this.appConfig.EVENT_CHECK_JOB_ATTEMPTS_NUMBER_THRESHOLD
    ) {
      await this.healthCheckStatusService.updateGlobalStatusScore({
        scoreDiff: -1,
        statusName: GlobalStatusName.MM_EVENTS,
      });
      return;
    }

    if (indexerEventData.length === 0 || !indexerEventData[0].borrow) {
      await this.healthCheckStatusService.updateGlobalStatusScore({
        scoreDiff: -1,
        statusName: GlobalStatusName.MM_EVENTS,
      });
      return;
    }
    const indexedBorrowToCheck = indexerEventData[0].borrow;

    if (
      indexedBorrowToCheck.amount !== jobPayload.amount ||
      indexedBorrowToCheck.account.boundEvmAddress !== jobPayload.userAddress ||
      indexedBorrowToCheck.asset.evmAddress !== jobPayload.reserveAddress
    ) {
      await this.healthCheckStatusService.updateGlobalStatusScore({
        scoreDiff: -1,
        statusName: GlobalStatusName.MM_EVENTS,
      });
      return;
    }

    await this.healthCheckStatusService.updateGlobalStatusScore({
      scoreDiff: 1,
      statusName: GlobalStatusName.MM_EVENTS,
    });

    return { success: false };
  }
}

import { AppConfig } from '../../config.module';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import {
  EventCheckJobPayload,
  EventCheckJobResult,
  QueueName,
} from '../../types/queueJob';
import { EventName } from '../../types/events';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { HealthCheckCoreService } from '../healthCheckCore/healthCheckCore.service';

@Injectable()
export class QueueSupportService {
  constructor(
    private appConfig: AppConfig,
    @Inject(forwardRef(() => HealthCheckCoreService))
    private healthCheckCoreService: HealthCheckCoreService,

    @InjectQueue(QueueName.EVENT_CHECK)
    private eventCheckJobsQueue: Queue,
  ) {
    console.log('QueueSupportService');
  }

  async processOnChainEventJob(
    job: Job<EventCheckJobPayload>,
  ): Promise<EventCheckJobResult> {
    switch (job.data.meta.eventName) {
      case EventName.Broadcast_Swapped:
        return this.healthCheckCoreService.handleBroadcastSwappedOnChainEvent(
          job.data,
        );
      case EventName.BestBlock:
        return this.healthCheckCoreService.handleBestBlockOnChainEvent(
          job.data,
        );
      case EventName.MoneyMarket_Supply:
        return this.healthCheckCoreService.handleMmSupplyOnChainEvent(job.data);
      case EventName.MoneyMarket_Borrow:
        return this.healthCheckCoreService.handleMmBorrowOnChainEvent(job.data);
      default:
        return {
          success: false,
          message: `Handler for event ${job.data.meta.eventName} is not implemented.`,
        };
    }
  }
}

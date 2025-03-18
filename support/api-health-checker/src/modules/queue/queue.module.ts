import { Global, Module } from '@nestjs/common';
import { CommonUtils } from '../../utils/commonUtils';
import { QueueService } from './queue.service';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { QueueName } from '../../types/queueJob';
import { QueueSupportService } from './queueSupport.service';
import { HealthCheckCoreService } from '../healthCheckCore/healthCheckCore.service';
import { IndexerApiService } from '../indexerApi/indexerApi.service';
import { HealthCheckStatusService } from '../healthCheckCore/healthCheckStatus.service';
import { NotificationsDispatcherService } from '../notificationsDispatcher/notificationsDispatcher.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueName.EVENT_CHECK,
    }),
    BullBoardModule.forFeature({
      name: QueueName.EVENT_CHECK,
      adapter: BullAdapter,
    }),
  ],
  providers: [
    QueueService,
    QueueSupportService,
    CommonUtils,
    HealthCheckCoreService,
    HealthCheckStatusService,
    IndexerApiService,
    NotificationsDispatcherService,
  ],
  exports: [QueueService, QueueSupportService],
})
export class QueueModule {}

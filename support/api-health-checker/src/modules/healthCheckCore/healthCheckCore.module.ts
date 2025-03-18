import { Global, Module } from '@nestjs/common';
import { HealthCheckCoreService } from './healthCheckCore.service';
import { HealthCheckStatusService } from './healthCheckStatus.service';
import { IndexerApiService } from '../indexerApi/indexerApi.service';
import { QueueModule } from '../queue/queue.module';
import { NotificationsDispatcherService } from '../notificationsDispatcher/notificationsDispatcher.service';

@Module({
  imports: [QueueModule],
  providers: [
    HealthCheckCoreService,
    HealthCheckStatusService,
    IndexerApiService,
    NotificationsDispatcherService,
  ],
  exports: [
    HealthCheckCoreService,
    HealthCheckStatusService,
    IndexerApiService,
  ],
})
export class HealthCheckCoreModule {}

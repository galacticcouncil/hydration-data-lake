import { Global, Module } from '@nestjs/common';
import { BootstrapService } from './bootstrap.service';
import { ShutdownService } from './shutdown.service';
import { OnChainEventsService } from '../onChainEvents/onChainEvents.service';
import { QueueService } from '../queue/queue.service';
import { BullModule } from '@nestjs/bull';
import { QueueName } from '../../types/queueJob';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { QueueModule } from '../queue/queue.module';
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
    QueueModule,
  ],
  providers: [
    BootstrapService,
    ShutdownService,
    OnChainEventsService,
    NotificationsDispatcherService,
  ],
})
export class AppBootstrapperModule {}

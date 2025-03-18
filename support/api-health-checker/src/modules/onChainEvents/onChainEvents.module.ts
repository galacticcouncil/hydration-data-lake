import { Global, Module } from '@nestjs/common';
import { OnChainEventsService } from './onChainEvents.service';
import { QueueService } from '../queue/queue.service';
import { BullModule } from '@nestjs/bull';
import { QueueName } from '../../types/queueJob';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { QueueModule } from '../queue/queue.module';

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
  providers: [OnChainEventsService],
  exports: [OnChainEventsService],
})
export class OnChainEventsModule {}

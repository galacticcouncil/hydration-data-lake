import { Global, Module } from '@nestjs/common';
import { NotificationsDispatcherService } from './notificationsDispatcher.service';

@Module({
  providers: [NotificationsDispatcherService],
  exports: [NotificationsDispatcherService],
})
export class NotificationsDispatcherModule {}

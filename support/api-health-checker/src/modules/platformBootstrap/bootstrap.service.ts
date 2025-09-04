import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { AppConfig } from '../../config.module';
import { ShutdownService } from './shutdown.service';
import { QueueService } from '../queue/queue.service';
import { OnChainEventsService } from '../onChainEvents/onChainEvents.service';
import { NotificationsDispatcherService } from '../notificationsDispatcher/notificationsDispatcher.service';
import { GlobalStatusName } from '../../types/common';

@Injectable()
export class BootstrapService implements OnApplicationBootstrap {
  constructor(
    private appConfig: AppConfig,
    private shutdownService: ShutdownService,
    private queueService: QueueService,
    private onChainEventsService: OnChainEventsService,
    private notificationsDispatcherService: NotificationsDispatcherService,
  ) {}

  async onApplicationBootstrap(): Promise<string | void> {
    console.log(':::CommonBootstrapperService:::');

    if (this.appConfig.APP_TERMINATED) {
      this.shutdownService.shutdown();
      return 'Shutting down...';
    }

    await this.queueService.resumeAllQueues();

    await this.queueService.initNotificationTriggersCheckingJob();

    console.log('onApplicationBootstrap');

    this.onChainEventsService.subscribeToEvents().then();

    console.log('onApplicationBootstrap finish');
  }
}

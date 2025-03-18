import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Subject } from 'rxjs';
import { QueueService } from '../queue/queue.service';

@Injectable()
export class ShutdownService implements OnModuleDestroy {
  private shutdownListener$: Subject<void> = new Subject();
  constructor(private readonly queueService: QueueService) {}

  async onModuleDestroy() {
    console.log('Executing OnDestroy Hook');
    await this.queueService.pauseAllQueues();
  }

  subscribeToShutdown(shutdownFn: () => void): void {
    this.shutdownListener$.subscribe(() => shutdownFn());
  }

  shutdown() {
    this.shutdownListener$.next();
  }
}

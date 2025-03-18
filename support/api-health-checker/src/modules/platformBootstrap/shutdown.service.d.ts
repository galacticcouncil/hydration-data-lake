import { OnModuleDestroy } from '@nestjs/common';
import { QueueService } from '../queue/queue.service';
export declare class ShutdownService implements OnModuleDestroy {
    private readonly queueService;
    private shutdownListener$;
    constructor(queueService: QueueService);
    onModuleDestroy(): Promise<void>;
    subscribeToShutdown(shutdownFn: () => void): void;
    shutdown(): void;
}

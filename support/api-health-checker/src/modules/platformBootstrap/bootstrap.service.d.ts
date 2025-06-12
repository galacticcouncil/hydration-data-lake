import { OnApplicationBootstrap } from '@nestjs/common';
import { AppConfig } from '../../config.module';
import { ShutdownService } from './shutdown.service';
import { QueueService } from '../queue/queue.service';
export declare class BootstrapService implements OnApplicationBootstrap {
    private appConfig;
    private shutdownService;
    private queueService;
    constructor(appConfig: AppConfig, shutdownService: ShutdownService, queueService: QueueService);
    onApplicationBootstrap(): Promise<string | void>;
}

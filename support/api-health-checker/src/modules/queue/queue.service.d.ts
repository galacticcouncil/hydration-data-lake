import { AppConfig } from '../../config.module';
import { Job, Queue } from 'bull';
export declare class QueueService {
    private appConfig;
    positionsJobsQueue: Queue;
    appHasLaunched: boolean;
    constructor(appConfig: AppConfig, positionsJobsQueue: Queue);
    pauseAllQueues(): Promise<void>;
    resumeAllQueues(): Promise<void>;
    removeJobById(id: string): Promise<void>;
    setRecurringJob(): Promise<void>;
    processMakeBalancesSnapshotJob(job: Job<null>): Promise<"some job handler run here" | "failed">;
}

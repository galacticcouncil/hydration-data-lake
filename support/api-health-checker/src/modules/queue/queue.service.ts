import { AppConfig } from '../../config.module';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { EventCheckJobPayload, QueueName } from '../../types/queueJob';
import { EventName } from '../../types/events';
import { QueueSupportService } from './queueSupport.service';
import { NotificationsDispatcherService } from '../notificationsDispatcher/notificationsDispatcher.service';

@Processor(QueueName.EVENT_CHECK)
export class QueueService {
  constructor(
    private appConfig: AppConfig,
    private queueSupportService: QueueSupportService,
    private notificationsDispatcherService: NotificationsDispatcherService,

    @InjectQueue(QueueName.EVENT_CHECK)
    public eventCheckJobsQueue: Queue,
  ) {
    console.log('QueueService');
  }

  async pauseAllQueues(): Promise<void> {
    await this.eventCheckJobsQueue.pause();
    console.log(`[x] Queue ${QueueName.EVENT_CHECK} has been paused`);
  }
  async resumeAllQueues(): Promise<void> {
    await this.eventCheckJobsQueue.resume();
    console.log(`[v] Queue ${QueueName.EVENT_CHECK} has been resumed`);
  }

  async removeJobById(id: string) {
    const allExistingJob = await this.eventCheckJobsQueue.getJob(id);
    if (!allExistingJob) {
      console.log(
        `Job with ID ${id} has not been found. Deletion is not possible.`,
      );
      return;
    }
    try {
      await allExistingJob.remove();
    } catch (e) {
      console.log(`Remove job ${id} with error ${e}`);
    }
  }

  async initNotificationTriggersCheckingJob() {
    await this.removeJobById('check_notification_triggers_state');
    await this.eventCheckJobsQueue.add(
      'check_notification_triggers_state',
      null,
      {
        attempts: 1,
        removeOnComplete: false,
        jobId: 'check_notification_triggers_state',
        repeat: {
          every: 5_000,
        },
      },
    );
  }

  async setEventCheckJob({
    eventName,
    jobId,
    payload,
  }: {
    eventName: EventName;
    jobId?: string;
    payload: EventCheckJobPayload;
  }) {
    await this.eventCheckJobsQueue.add(eventName, payload, {
      attempts: 1,
      removeOnComplete: false,
      jobId,
      delay: this.appConfig.EVENT_CHECK_JOB_DELAY_MS,
    });
  }

  async rescheduleEventCheckJob({
    jobPayload,
    jobId,
  }: {
    jobPayload: EventCheckJobPayload;
    jobId?: string;
  }) {
    const jobPayloadPrepared = {
      ...jobPayload,
    };
    jobPayloadPrepared.meta.jobExecAttempt++;

    await this.eventCheckJobsQueue.add(
      jobPayload.meta.eventName,
      jobPayloadPrepared,
      {
        attempts: 1,
        removeOnComplete: false,
        jobId,
        delay: this.appConfig.EVENT_CHECK_JOB_DELAY_MS,
      },
    );
  }

  @Process({ name: '*', concurrency: 10 })
  async processOnChainEventJob(job: Job<null>) {
    await job.takeLock();

    try {
      const result = await this.queueSupportService.processOnChainEventJob(job);
      await job.moveToCompleted(JSON.stringify(result), true);
      await job.releaseLock();
      return result;
    } catch (e) {
      console.log(e);

      await job.moveToFailed({
        message: (e as Error).message || 'Something went wrong.',
      });
      await job.releaseLock();
      console.log(`released failed - ${job.id}`);
      return 'failed';
    }
  }
  @Process({ name: 'check_notification_triggers_state', concurrency: 1 })
  async processCheckNotificationTriggersStateJob(job: Job<null>) {
    await job.takeLock();

    try {
      const result =
        await this.notificationsDispatcherService.processCheckNotificationTriggersStateJob();
      await job.moveToCompleted(JSON.stringify(result), true);
      await job.releaseLock();
      return result;
    } catch (e) {
      console.log(e);

      await job.moveToFailed({
        message: (e as Error).message || 'Something went wrong.',
      });
      await job.releaseLock();
      console.log(`released failed - ${job.id}`);
      return 'failed';
    }
  }
}

import { ProcessorContext } from '../processor';
import { Store } from '@subsquid/typeorm-store';
import { ProcessorStatus } from '../model';

export class ProcessorStatusManager {
  private static instance: ProcessorStatusManager;
  currentStatusEntity: ProcessorStatus | null = null;

  constructor(private ctx: ProcessorContext<Store>) {}

  static getInstance(ctx: ProcessorContext<Store>): ProcessorStatusManager {
    if (!ProcessorStatusManager.instance) {
      ProcessorStatusManager.instance = new ProcessorStatusManager(ctx);
    }
    ProcessorStatusManager.instance.initCtx(ctx);
    return ProcessorStatusManager.instance;
  }

  initCtx(ctx: ProcessorContext<Store>) {
    this.ctx = ctx;
  }

  async getStatus(ensure = false) {
    if (this.currentStatusEntity) return this.currentStatusEntity;

    let statusEntity = await this.ctx.store.findOne(ProcessorStatus, {
      where: { id: '1' },
    });

    if (statusEntity) {
      this.currentStatusEntity = statusEntity;
      return statusEntity;
    }

    statusEntity = new ProcessorStatus({
      id: '1',
      assetsActualisedAtBlock: -1,
      initialIndexingStartedAtTime: new Date(),
      initialIndexingFinishedAtTime: this.ctx.isHead ? new Date() : null,
    });

    if (ensure) await this.ctx.store.save(statusEntity);
    this.currentStatusEntity = statusEntity;
    return statusEntity;
  }

  async updateProcessorStatus(payload: Omit<Partial<ProcessorStatus>, 'id'>) {
    const status = await this.getStatus();

    if (payload.assetsActualisedAtBlock)
      status.assetsActualisedAtBlock = payload.assetsActualisedAtBlock;
    if (payload.initialIndexingStartedAtTime)
      status.initialIndexingStartedAtTime =
        payload.initialIndexingStartedAtTime;
    if (payload.initialIndexingFinishedAtTime)
      status.initialIndexingFinishedAtTime =
        payload.initialIndexingFinishedAtTime;

    await this.ctx.store.save(status);
  }
}

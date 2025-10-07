import { SqdProcessorContext } from '../processor';
import { Store } from '@subsquid/typeorm-store';
import { ProcessorStatus } from '../model';

export class ProcessorStatusManager {
  private static instance: ProcessorStatusManager;
  currentStatusEntity: ProcessorStatus | null = null;

  constructor(private ctx: SqdProcessorContext<Store>) {}

  static getInstance(ctx: SqdProcessorContext<Store>): ProcessorStatusManager {
    if (!ProcessorStatusManager.instance) {
      ProcessorStatusManager.instance = new ProcessorStatusManager(ctx);
    }
    ProcessorStatusManager.instance.initCtx(ctx);
    return ProcessorStatusManager.instance;
  }

  static async updateInitialIndexingFinishedAtTime(
    ctx: SqdProcessorContext<Store>
  ) {
    const statusManager = ProcessorStatusManager.getInstance(ctx);
    const currentStatus = await statusManager.getStatus();

    if (ctx.isHead && !currentStatus.initialIndexingFinishedAt)
      await statusManager.updateProcessorStatus({
        initialIndexingFinishedAt: new Date(),
      });
  }

  initCtx(ctx: SqdProcessorContext<Store>) {
    this.ctx = ctx;
  }

  async getStatus(ensure = false) {
    if (this.currentStatusEntity) return this.currentStatusEntity;

    let statusEntity = await this.ctx.storeUtils.findOneWithLogs(ProcessorStatus, {
      where: { id: this.ctx.appConfig.STATE_SCHEMA_NAME },
    }, { className: 'ProcessorStatus' });

    if (statusEntity) {
      this.currentStatusEntity = statusEntity;
      return statusEntity;
    }

    statusEntity = new ProcessorStatus({
      id: this.ctx.appConfig.STATE_SCHEMA_NAME,
      assetsLastUpdatedAtBlock: -1,
      poolsDestroyedUpdatedAtBlock: -1,
      initialIndexingStartedAt: new Date(),
      initialIndexingFinishedAt: this.ctx.isHead ? new Date() : null,
      latestProcessedBlock: 0,
      stableswapHistDataLatestBlock: 0,
      omnipoolHistDataLatestBlock: 0,
      xykpoolHistDataLatestBlock: 0,
      aavepoolHistDataLatestBlock: 0,
    });

    if (ensure) await this.ctx.store.save(statusEntity);
    this.currentStatusEntity = statusEntity;
    return statusEntity;
  }

  async updateProcessorStatus(payload: Omit<Partial<ProcessorStatus>, 'id'>) {
    const status = await this.getStatus();

    if (payload.assetsLastUpdatedAtBlock)
      status.assetsLastUpdatedAtBlock = payload.assetsLastUpdatedAtBlock;
    if (payload.initialIndexingStartedAt)
      status.initialIndexingStartedAt = payload.initialIndexingStartedAt;
    if (payload.initialIndexingFinishedAt)
      status.initialIndexingFinishedAt = payload.initialIndexingFinishedAt;
    if (payload.poolsDestroyedUpdatedAtBlock)
      status.poolsDestroyedUpdatedAtBlock =
        payload.poolsDestroyedUpdatedAtBlock;
    if (payload.latestProcessedBlock)
      status.latestProcessedBlock = payload.latestProcessedBlock;
    if (payload.stableswapHistDataLatestBlock)
      status.stableswapHistDataLatestBlock =
        payload.stableswapHistDataLatestBlock;
    if (payload.omnipoolHistDataLatestBlock)
      status.omnipoolHistDataLatestBlock = payload.omnipoolHistDataLatestBlock;
    if (payload.xykpoolHistDataLatestBlock)
      status.xykpoolHistDataLatestBlock = payload.xykpoolHistDataLatestBlock;
    if (payload.aavepoolHistDataLatestBlock)
      status.aavepoolHistDataLatestBlock = payload.aavepoolHistDataLatestBlock;

    await this.ctx.store.save(status);
  }
}

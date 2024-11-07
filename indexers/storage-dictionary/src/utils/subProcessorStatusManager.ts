import { ProcessorContext } from '../processor';
import { Store } from '@subsquid/typeorm-store';
import { SubProcessorStatus } from '../model';

export class SubProcessorStatusManager {
  private subBatchConf: { subBatchSize: number } = { subBatchSize: 0 };
  currentStatusEntity: SubProcessorStatus | null = null;

  constructor(private ctx: ProcessorContext<Store>) {}

  get subBatchConfig() {
    return this.subBatchConf;
  }

  async getStatus(ensure = false) {
    if (this.currentStatusEntity) return this.currentStatusEntity;

    let statusEntity = await this.ctx.store.findOne(SubProcessorStatus, {
      where: { id: this.ctx.appConfig.STATE_SCHEMA_NAME },
    });

    if (statusEntity) {
      this.currentStatusEntity = statusEntity;
      return statusEntity;
    }

    statusEntity = new SubProcessorStatus({
      id: this.ctx.appConfig.STATE_SCHEMA_NAME,
      fromBlock: this.ctx.appConfig.START_BLOCK,
      toBlock: this.ctx.appConfig.END_BLOCK,
      height: this.ctx.blocks[0]?.header.height ?? this.ctx.appConfig.END_BLOCK,
    });

    if (ensure) await this.ctx.store.save(statusEntity);
    this.currentStatusEntity = statusEntity;
    return statusEntity;
  }

  async setSubProcessorStatus(height: number) {
    const status = await this.getStatus();
    status.height = height;
    await this.ctx.store.save(status);
  }

  async calcSubBatchConfig() {
    await this.getStatus(true); // Just to init status entity for current sub-processor

    const allSubProcessorsStats = await this.ctx.store.find(SubProcessorStatus);

    const activeSubProcessors = allSubProcessorsStats.filter(
      (stats) => stats.toBlock !== stats.height
    );

    if (allSubProcessorsStats.length === 0) {
      this.subBatchConf.subBatchSize =
        this.ctx.appConfig.INDEXER_MAX_SUB_BATCH_SIZE /
        this.ctx.appConfig.INDEXER_SUB_PROCESSORS_NUMBER;
    } else if (
      allSubProcessorsStats.length > 0 &&
      allSubProcessorsStats.length <
        this.ctx.appConfig.INDEXER_SUB_PROCESSORS_NUMBER
    ) {
      this.subBatchConf.subBatchSize = Math.ceil(
        this.ctx.appConfig.INDEXER_MAX_SUB_BATCH_SIZE /
          (activeSubProcessors.length +
            (this.ctx.appConfig.INDEXER_SUB_PROCESSORS_NUMBER -
              allSubProcessorsStats.length))
      );
    } else {
      this.subBatchConf.subBatchSize =
        activeSubProcessors.length > 0
          ? Math.ceil(
              this.ctx.appConfig.INDEXER_MAX_SUB_BATCH_SIZE /
                activeSubProcessors.length
            )
          : this.ctx.appConfig.INDEXER_MAX_SUB_BATCH_SIZE;
    }
  }
}

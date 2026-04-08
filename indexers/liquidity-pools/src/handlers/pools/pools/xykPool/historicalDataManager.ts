import { AppConfig } from '../../../../appConfig';
import { SqdProcessorContext } from '../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  XykpoolHistoricalData,
  XykpoolHistoricalDataLatest,
} from '../../../../model';
import { In } from 'typeorm';

export class XykpoolHistoricalDataManager {
  private static instance: XykpoolHistoricalDataManager;
  private appConfig: AppConfig;
  private allPoolIds: string[] = [];
  private processingPoolIds: string[] = [];
  private currentProcessingOffset: number = 0;

  static getInstance(): XykpoolHistoricalDataManager {
    if (!XykpoolHistoricalDataManager.instance) {
      XykpoolHistoricalDataManager.instance =
        new XykpoolHistoricalDataManager();
    }
    return XykpoolHistoricalDataManager.instance;
  }

  constructor() {
    this.appConfig = AppConfig.getInstance();
  }

  private getAllActivePools(ctx: SqdProcessorContext<Store>) {
    return Array.from(ctx.batchState.state.xykAllBatchPools.values()).filter(
      (p) => !p.isDestroyed
    );
  }

  private getFullListOfPoolsSorted(ctx: SqdProcessorContext<Store>) {
    let pools = this.getAllActivePools(ctx).map((p) => ({
      poolId: p.id,
      shareTokenId: p.shareTokenId,
    }));

    pools = pools.sort(
      (a, b) => Number(a.shareTokenId) - Number(b.shareTokenId)
    );

    return pools.map((p) => p.poolId);
  }

  async getPoolIdsSetToProcessAndPrefillHistData(
    currentBlockHeight: number,
    ctx: SqdProcessorContext<Store>
  ) {
    if (
      !this.appConfig.XYKPOOL_HIST_DATA_TRACKING_BATCH_SIZE_PER_BLOCK ||
      this.appConfig.XYKPOOL_HIST_DATA_TRACKING_BATCH_SIZE_PER_BLOCK < 0
    ) {
      return new Set(this.getAllActivePools(ctx).map((p) => p.id));
    }

    if (this.allPoolIds.length === 0) {
      this.allPoolIds = this.getFullListOfPoolsSorted(ctx);
      this.processingPoolIds = [...this.allPoolIds];
      return new Set(this.processingPoolIds);
    }

    // TODO refactor this approach to actualize pools lis tat each block
    this.allPoolIds = this.getFullListOfPoolsSorted(ctx);

    if (this.currentProcessingOffset >= this.allPoolIds.length) {
      this.currentProcessingOffset = 0;
    }
    const startPointer =
      this.currentProcessingOffset === 0 ? 0 : this.currentProcessingOffset;

    const endPointer =
      this.currentProcessingOffset +
      this.appConfig.XYKPOOL_HIST_DATA_TRACKING_BATCH_SIZE_PER_BLOCK;

    this.currentProcessingOffset = endPointer;

    this.processingPoolIds = this.allPoolIds.slice(startPointer, endPointer);

    const missedLastHistDataPoolIds =
      await this.prefillHistoricalDataForSkippedPools(currentBlockHeight, ctx);

    if (missedLastHistDataPoolIds.length > 0) {
      this.processingPoolIds = [
        ...this.processingPoolIds,
        ...missedLastHistDataPoolIds,
      ];
    }

    return new Set(this.processingPoolIds);
  }

  async prefillHistoricalDataForSkippedPools(
    currentBlockHeight: number,
    ctx: SqdProcessorContext<Store>
  ) {
    if (
      !this.appConfig.XYKPOOL_HIST_DATA_TRACKING_BATCH_SIZE_PER_BLOCK ||
      this.appConfig.XYKPOOL_HIST_DATA_TRACKING_BATCH_SIZE_PER_BLOCK < 0
    )
      return [] as string[];

    const tmpProcessingPoolIdsSet = new Set(this.processingPoolIds);
    const poolIdsToPrefill = this.allPoolIds.filter(
      (id) => !tmpProcessingPoolIdsSet.has(id)
    );
    const poolIdsToPrefillSet: Set<string> = new Set(poolIdsToPrefill);

    const latestHistDataForPools = await ctx.storeUtils.findWithLogs(
      XykpoolHistoricalDataLatest,
      { where: { id: In(poolIdsToPrefill) }, relations: { pool: true } }
    );

    for (const lastHistData of latestHistDataForPools) {
      if (poolIdsToPrefillSet.has(lastHistData.id)) {
        poolIdsToPrefillSet.delete(lastHistData.id);
      }

      const newHistData = new XykpoolHistoricalData({
        id: `${lastHistData.id}-${currentBlockHeight}`,
        // pool: ctx.batchState.state.xykAllBatchPools.get(lastHistData.id),
        pool: lastHistData.pool,
        assetAId: lastHistData.assetAId,
        assetBId: lastHistData.assetBId,
        assetABalance: lastHistData.assetABalance,
        assetBBalance: lastHistData.assetBBalance,
        tvlInRefAssetNorm: '0',
        paraBlockHeight: currentBlockHeight,
      });

      ctx.batchState.state.xykPoolAllHistoricalData.set(
        newHistData.id,
        newHistData
      );
    }

    return Array.from(poolIdsToPrefillSet.values());
  }
}

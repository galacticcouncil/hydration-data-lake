import { AppConfig } from '../../../../appConfig';
import { SqdProcessorContext } from '../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  XykpoolHistoricalData,
  XykpoolHistoricalDataLatest,
} from '../../../../model';
import { In } from 'typeorm';
import { LatestProcessedDataCacheManager } from '../../../../utils/latestProcessedDataCacheManager';

/**
 * Selects which XYK pools get full historical-data processing on each head
 * block, and prefills `XykpoolHistoricalData` rows for the rest by cloning
 * their last known `XykpoolHistoricalDataLatest` snapshot.
 *
 * Why throttle: at chain head (`ctx.blocks.length === 1`) recomputing every
 * pool every 6s is expensive. `XYKPOOL_HIST_DATA_TRACKING_BATCH_SIZE_PER_BLOCK`
 * (`n`) caps how many pools are recomputed per block; the rest get a cheap
 * row-copy so the historical series stays continuous.
 *
 * Selection modes (per block):
 *  - `n < 0` / unset → recompute all active pools (no throttling).
 *  - `n <= 1` or `HIGH_PRIO_SUBSET_SIZE <= 0` → single moving window walks
 *    the full list sorted by `shareTokenId` (legacy round-robin).
 *  - otherwise → TVL-prioritized two-window selection: every block ranks
 *    pools by `tvlInRefAssetNorm` desc (read from the in-memory
 *    `LatestProcessedDataCacheManager` cache, no DB hit) and splits them
 *    into a top-`HIGH_PRIO_SUBSET_SIZE` "hot" set and a "cold" remainder.
 *    Each block recomputes `n - 1` hot pools + `1` cold pool, advancing two
 *    independent round-robin cursors so high-TVL pools refresh
 *    `(n - 1) / HIGH_PRIO_SUBSET_SIZE`× per block while every cold pool
 *    still rotates through over time. If cold is empty, the spare slot
 *    spills back into hot.
 *
 * Pools not selected on a given block are passed to
 * `prefillHistoricalDataForSkippedPools`, which clones their latest snapshot
 * with `tvlInRefAssetNorm = '0'` and the current block height — keeping the
 * historical table dense without recomputing TVL.
 *
 * Singleton: state (`allPoolIds`, cursors) persists across blocks for the
 * lifetime of the process.
 */
export class XykpoolHistoricalDataManager {
  private static instance: XykpoolHistoricalDataManager;
  private appConfig: AppConfig;
  private allPoolIds: string[] = [];
  private processingPoolIds: string[] = [];

  // Single moving window cursor — used when prioritization is disabled
  // (n <= 1 or HIGH_PRIO_SUBSET_SIZE <= 0).
  private currentProcessingOffset: number = 0;

  // Two-window cursors — used when prioritization is active.
  private highPrioPoolIds: string[] = [];
  private lowPrioPoolIds: string[] = [];
  private highPrioOffset: number = 0;
  private lowPrioOffset: number = 0;

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

  /**
   * Rank active pools by `tvlInRefAssetNorm` (desc) using the in-memory
   * `LatestProcessedDataCacheManager` cache. Pools with no TVL data or TVL `0`
   * fall to the bottom; ties are broken by `shareTokenId` ascending to keep
   * ordering stable across blocks.
   */
  private rankPoolsByTvl(ctx: SqdProcessorContext<Store>): {
    highPrio: string[];
    lowPrio: string[];
  } {
    const cache = LatestProcessedDataCacheManager.getInstance();
    const active = this.getAllActivePools(ctx);

    const ranked = active
      .map((p) => {
        const last = cache.getLastXykpoolHistoricalDataItem(p.id);
        const tvl = last?.tvlInRefAssetNorm
          ? Number(last.tvlInRefAssetNorm)
          : 0;
        return {
          id: p.id,
          shareTokenId: Number(p.shareTokenId),
          tvl: Number.isFinite(tvl) ? tvl : 0,
        };
      })
      .sort((a, b) => {
        if (b.tvl !== a.tvl) return b.tvl - a.tvl;
        return a.shareTokenId - b.shareTokenId;
      });

    const subsetSize =
      this.appConfig.XYKPOOL_HIST_DATA_TRACKING_HIGH_PRIO_SUBSET_SIZE;

    return {
      highPrio: ranked.slice(0, subsetSize).map((r) => r.id),
      lowPrio: ranked.slice(subsetSize).map((r) => r.id),
    };
  }

  /**
   * Take `count` items from `list` advancing `offsetRef.value`, wrapping
   * around to the head if needed. Returns at most `min(count, list.length)`
   * unique items in a single pass (no duplicates within one call).
   */
  private takeWindow(
    list: string[],
    offsetRef: { value: number },
    count: number
  ): string[] {
    if (list.length === 0 || count <= 0) return [];

    const take = Math.min(count, list.length);

    if (offsetRef.value >= list.length) offsetRef.value = 0;

    const start = offsetRef.value;
    const end = start + take;

    if (end <= list.length) {
      offsetRef.value = end === list.length ? 0 : end;
      return list.slice(start, end);
    }

    // Wrap around: take tail then head
    const tail = list.slice(start);
    const headCount = take - tail.length;
    const head = list.slice(0, headCount);
    offsetRef.value = headCount;
    return [...tail, ...head];
  }

  async getPoolIdsSetToProcessAndPrefillHistData(
    currentBlockHeight: number,
    ctx: SqdProcessorContext<Store>
  ) {
    const n = this.appConfig.XYKPOOL_HIST_DATA_TRACKING_BATCH_SIZE_PER_BLOCK;

    // (a) disabled / process all active pools
    if (!n || n < 0) {
      return new Set(this.getAllActivePools(ctx).map((p) => p.id));
    }

    const subsetSize =
      this.appConfig.XYKPOOL_HIST_DATA_TRACKING_HIGH_PRIO_SUBSET_SIZE;

    // (b) n <= 1 or prioritization disabled → legacy single moving window
    if (n <= 1 || subsetSize <= 0) {
      return this.legacySingleWindowSelection(currentBlockHeight, ctx);
    }

    // (c) prioritized two-window selection
    const { highPrio, lowPrio } = this.rankPoolsByTvl(ctx);
    this.highPrioPoolIds = highPrio;
    this.lowPrioPoolIds = lowPrio;
    this.allPoolIds = [...highPrio, ...lowPrio];

    let highPrioTake = Math.min(n - 1, highPrio.length);
    const lowPrioTake = Math.min(n - highPrioTake, lowPrio.length);

    // If low-prio is empty/short, fill remainder from high-prio so we always
    // emit `min(n, totalActive)` pools per block.
    if (highPrioTake + lowPrioTake < n) {
      highPrioTake = Math.min(n - lowPrioTake, highPrio.length);
    }

    const highPrioOffsetRef = { value: this.highPrioOffset };
    const lowPrioOffsetRef = { value: this.lowPrioOffset };

    const selected = [
      ...this.takeWindow(this.highPrioPoolIds, highPrioOffsetRef, highPrioTake),
      ...this.takeWindow(this.lowPrioPoolIds, lowPrioOffsetRef, lowPrioTake),
    ];

    this.highPrioOffset = highPrioOffsetRef.value;
    this.lowPrioOffset = lowPrioOffsetRef.value;

    this.processingPoolIds = selected;

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

  /**
   * Legacy behavior: single moving window across the full pool list, sorted by
   * `shareTokenId`. Used when `n <= 1` or prioritization is explicitly off.
   */
  private async legacySingleWindowSelection(
    currentBlockHeight: number,
    ctx: SqdProcessorContext<Store>
  ): Promise<Set<string>> {
    if (this.allPoolIds.length === 0) {
      this.allPoolIds = this.getFullListOfPoolsSorted(ctx);
      this.processingPoolIds = [...this.allPoolIds];
      return new Set(this.processingPoolIds);
    }

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
      { where: { id: In(poolIdsToPrefill) }, relations: { pool: true } },
      {
        className: 'XykpoolHistoricalDataLatest',
        originCallFn: 'prefillHistoricalDataForSkippedPools',
      }
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

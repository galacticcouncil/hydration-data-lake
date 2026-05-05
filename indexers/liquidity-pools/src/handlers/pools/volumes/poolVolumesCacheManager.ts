import {
  HsmpoolAssetHistoricalData,
  OmnipoolAssetVolumeHistoricalData,
  StableswapAssetVolumeHistoricalData,
  StableswapVolumeHistoricalData,
  XykpoolVolumeHistoricalData,
} from '../../../model';
import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';

export class PoolVolumesCacheManager {
  private static instance: PoolVolumesCacheManager;
  private cacheInvalidatedAtBlock: number = 0;
  private cacheMaxObservedHeight: number = -1;

  public xykPoolVolumesCache: Map<string, XykpoolVolumeHistoricalData> =
    new Map();

  public stablswapVolumesCache: Map<string, StableswapVolumeHistoricalData> =
    new Map();

  public stablswapAssetVolumesCache: Map<
    string,
    StableswapAssetVolumeHistoricalData
  > = new Map();

  public omnipoolAssetVolumesCache: Map<
    string,
    OmnipoolAssetVolumeHistoricalData
  > = new Map();

  public hsmpoolAssetHistoricalDataCache: Map<
    string,
    HsmpoolAssetHistoricalData
  > = new Map();

  static getInstance(): PoolVolumesCacheManager {
    if (!PoolVolumesCacheManager.instance) {
      PoolVolumesCacheManager.instance = new PoolVolumesCacheManager();
    }
    return PoolVolumesCacheManager.instance;
  }

  private clearAll() {
    this.xykPoolVolumesCache = new Map();
    this.stablswapVolumesCache = new Map();
    this.stablswapAssetVolumesCache = new Map();
    this.omnipoolAssetVolumesCache = new Map();
    this.hsmpoolAssetHistoricalDataCache = new Map();
  }

  wipeCache(ctx: SqdProcessorContext<Store>) {
    const incomingFirstHeight = ctx.blocks[0].header.height;

    // Reorg/rollback safety: if SQD re-runs a previously processed block range,
    // any cached entry from the rolled-back range now reflects post-rollback
    // state that no longer exists in DB. Reading it as "previous volume"
    // baseline would feed wrong assetTotalVol*Norm into the new records.
    if (
      this.cacheMaxObservedHeight >= 0 &&
      incomingFirstHeight <= this.cacheMaxObservedHeight
    ) {
      console.warn(
        `[reorg] Invalidating PoolVolumesCacheManager. ` +
          `incomingBatchFirstBlockHeight=${incomingFirstHeight}, ` +
          `cacheMaxObservedHeight=${this.cacheMaxObservedHeight}`
      );
      this.clearAll();
      this.cacheInvalidatedAtBlock =
        ctx.blocks[ctx.blocks.length - 1].header.height;
      this.cacheMaxObservedHeight = -1;
      return;
    }

    if (
      incomingFirstHeight - this.cacheInvalidatedAtBlock >
      ctx.appConfig.CACHED_POOL_VOLUME_HIS_DATA_TTL_BLOCKS
    ) {
      this.clearAll();
      this.cacheInvalidatedAtBlock =
        ctx.blocks[ctx.blocks.length - 1].header.height;
      this.cacheMaxObservedHeight = -1;
    }
  }

  addLatestRecordsToCache(ctx: SqdProcessorContext<Store>) {
    upsertLatestPerGroup(
      ctx.batchState.state.xykPoolVolumes,
      this.xykPoolVolumesCache
    );
    upsertLatestPerGroup(
      ctx.batchState.state.omnipoolAssetVolumes,
      this.omnipoolAssetVolumesCache
    );
    upsertLatestPerGroup(
      ctx.batchState.state.stablepoolVolumeCollections,
      this.stablswapVolumesCache
    );
    upsertLatestPerGroup(
      ctx.batchState.state.stablepoolAssetVolumes,
      this.stablswapAssetVolumesCache
    );
    upsertLatestPerGroup(
      ctx.batchState.state.hsmpoolAssetHistData,
      this.hsmpoolAssetHistoricalDataCache
    );

    const lastBlockHeight = ctx.blocks[ctx.blocks.length - 1].header.height;
    if (lastBlockHeight > this.cacheMaxObservedHeight) {
      this.cacheMaxObservedHeight = lastBlockHeight;
    }
  }
}

/**
 * Keep the highest-paraBlockHeight record per group key in `target`, where the
 * group key is the entity id minus its trailing `-<paraBlockHeight>` segment.
 *
 * Why: consumers look up via `getPoolAssetLastVolumeFromCache` /
 * `getPoolAssetPreviousVolumeFromCache`, which scan keys by group prefix
 * (e.g. `<poolAddress>-<assetId>-`) and pick the max-height match. Storing
 * one entry per group instead of one entry total makes the cache useful
 * across all assets, not just whichever asset traded last in the batch.
 */
function upsertLatestPerGroup<
  T extends { id: string; paraBlockHeight: number },
>(source: Map<string, T>, target: Map<string, T>) {
  const latestPerGroup = new Map<string, T>();

  for (const item of source.values()) {
    const groupKey = item.id.slice(0, item.id.lastIndexOf('-'));
    const existing = latestPerGroup.get(groupKey);
    if (!existing || existing.paraBlockHeight < item.paraBlockHeight) {
      latestPerGroup.set(groupKey, item);
    }
  }

  for (const [groupKey, item] of latestPerGroup) {
    const existingInTarget = target.get(item.id);
    if (existingInTarget) continue;

    // Drop any older entry for the same group before inserting the new one,
    // otherwise the cache grows unbounded and prefix scans iterate stale rows.
    for (const existingKey of target.keys()) {
      if (existingKey.startsWith(groupKey + '-') && existingKey !== item.id) {
        target.delete(existingKey);
      }
    }

    target.set(item.id, item);
  }
}

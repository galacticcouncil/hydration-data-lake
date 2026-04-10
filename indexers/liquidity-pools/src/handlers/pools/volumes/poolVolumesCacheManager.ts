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

  wipeCache(ctx: SqdProcessorContext<Store>) {
    if (
      ctx.blocks[0].header.height - this.cacheInvalidatedAtBlock >
      ctx.appConfig.CACHED_POOL_VOLUME_HIS_DATA_TTL_BLOCKS
    ) {
      this.xykPoolVolumesCache = new Map();
      this.stablswapVolumesCache = new Map();
      this.stablswapAssetVolumesCache = new Map();
      this.omnipoolAssetVolumesCache = new Map();
      this.hsmpoolAssetHistoricalDataCache = new Map();

      this.cacheInvalidatedAtBlock =
        ctx.blocks[ctx.blocks.length - 1].header.height;
    }
  }

  addLatestRecordsToCache(ctx: SqdProcessorContext<Store>) {
    let xykPoolVolumeLatestRecord: XykpoolVolumeHistoricalData | null = null;
    let stablswapVolumeRecord = null;
    let stablswapAssetVolumeRecord = null;
    let omnipoolAssetVolumeRecord = null;
    let hsmpoolAssetHistoricalDataRecord: HsmpoolAssetHistoricalData | null =
      null;

    for (const data of ctx.batchState.state.xykPoolVolumes.values()) {
      if (
        xykPoolVolumeLatestRecord &&
        xykPoolVolumeLatestRecord.paraBlockHeight >= data.paraBlockHeight
      )
        continue;
      xykPoolVolumeLatestRecord = data;
    }

    for (const data of ctx.batchState.state.omnipoolAssetVolumes.values()) {
      if (
        omnipoolAssetVolumeRecord &&
        omnipoolAssetVolumeRecord.paraBlockHeight >= data.paraBlockHeight
      )
        continue;
      omnipoolAssetVolumeRecord = data;
    }

    for (const data of ctx.batchState.state.stablepoolVolumeCollections.values()) {
      if (
        stablswapVolumeRecord &&
        stablswapVolumeRecord.paraBlockHeight >= data.paraBlockHeight
      )
        continue;
      stablswapVolumeRecord = data;
    }

    for (const data of ctx.batchState.state.stablepoolAssetVolumes.values()) {
      if (
        stablswapAssetVolumeRecord &&
        stablswapAssetVolumeRecord.paraBlockHeight >= data.paraBlockHeight
      )
        continue;
      stablswapAssetVolumeRecord = data;
    }

    for (const data of ctx.batchState.state.hsmpoolAssetHistData.values()) {
      if (
        hsmpoolAssetHistoricalDataRecord &&
        hsmpoolAssetHistoricalDataRecord.paraBlockHeight >= data.paraBlockHeight
      )
        continue;
      hsmpoolAssetHistoricalDataRecord = data;
    }

    if (xykPoolVolumeLatestRecord)
      this.xykPoolVolumesCache.set(
        xykPoolVolumeLatestRecord.id,
        xykPoolVolumeLatestRecord
      );

    if (stablswapVolumeRecord)
      this.stablswapVolumesCache.set(
        stablswapVolumeRecord.id,
        stablswapVolumeRecord
      );

    if (stablswapAssetVolumeRecord)
      this.stablswapAssetVolumesCache.set(
        stablswapAssetVolumeRecord.id,
        stablswapAssetVolumeRecord
      );

    if (omnipoolAssetVolumeRecord)
      this.omnipoolAssetVolumesCache.set(
        omnipoolAssetVolumeRecord.id,
        omnipoolAssetVolumeRecord
      );

    if (hsmpoolAssetHistoricalDataRecord)
      this.hsmpoolAssetHistoricalDataCache.set(
        hsmpoolAssetHistoricalDataRecord.id,
        hsmpoolAssetHistoricalDataRecord
      );
  }
}

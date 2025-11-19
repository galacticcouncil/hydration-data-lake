import { LessThan } from 'typeorm';

import { Store } from '@subsquid/typeorm-store';

import {
  LbppoolVolumeHistoricalData,
  OmnipoolAssetVolumeHistoricalData,
  StableswapAssetVolumeHistoricalData,
  StableswapVolumeHistoricalData,
  XykpoolVolumeHistoricalData,
} from '../../../model';
import { SqdProcessorContext } from '../../../processor';

export { handleXykPoolVolumeUpdates, initXykPoolVolume } from './xykPoolVolume';
export { handleLbppoolVolumeUpdates, initLbppoolVolume } from './lbppoolVolume';
export {
  handleOmnipoolAssetVolumeUpdates,
  initOmnipoolAssetVolume,
} from './omnipoolAssetVolume';

export async function getOldLbpVolume({
  ctx,
  poolId,
  currentBlockHeight,
}: {
  ctx: SqdProcessorContext<Store>;
  poolId: string;
  currentBlockHeight?: number;
}) {
  return await ctx.storeUtils.findOneWithLogs(LbppoolVolumeHistoricalData, {
    where: {
      pool: { id: poolId },
      ...(currentBlockHeight
        ? { paraBlockHeight: LessThan(currentBlockHeight) }
        : {}),
    },
    relations: {
      pool: true,
    },
    order: {
      paraBlockHeight: 'DESC',
    },
  }, { className: 'LbppoolVolumeHistoricalData' });
}

export async function getOldXykVolume({
  ctx,
  poolId,
  currentBlockHeight,
}: {
  ctx: SqdProcessorContext<Store>;
  poolId: string;
  currentBlockHeight?: number;
}) {
  return await ctx.storeUtils.findOneWithLogs(XykpoolVolumeHistoricalData, {
    where: {
      pool: { id: poolId },
      ...(currentBlockHeight
        ? { paraBlockHeight: LessThan(currentBlockHeight) }
        : {}),
    },
    relations: {
      pool: true,
    },
    order: {
      paraBlockHeight: 'DESC',
    },
  }, { className: 'XykpoolVolumeHistoricalData' });
}

export async function getOldOmnipoolAssetVolume({
  ctx,
  currentBlockHeight,
  omnipoolAssetId,
}: {
  ctx: SqdProcessorContext<Store>;
  omnipoolAssetId: string;
  currentBlockHeight?: number;
}) {
  return await ctx.storeUtils.findOneWithLogs(OmnipoolAssetVolumeHistoricalData, {
    where: {
      omnipoolAsset: { id: omnipoolAssetId },
      ...(currentBlockHeight
        ? { paraBlockHeight: LessThan(currentBlockHeight) }
        : {}),
    },
    relations: {
      omnipoolAsset: true,
    },
    order: {
      paraBlockHeight: 'DESC',
    },
  }, { className: 'OmnipoolAssetVolumeHistoricalData' });
}

export async function getOldStablepoolAssetVolume({
  ctx,
  assetId,
  poolId,
  currentBlockHeight,
}: {
  ctx: SqdProcessorContext<Store>;
  assetId: string | number;
  poolId: string;
  currentBlockHeight?: number;
}) {
  return await ctx.storeUtils.findOneWithLogs(StableswapAssetVolumeHistoricalData, {
    where: {
      asset: { id: `${assetId}` },
      volumesCollection: { pool: { id: poolId } },
      ...(currentBlockHeight
        ? { paraBlockHeight: LessThan(currentBlockHeight) }
        : {}),
    },
    relations: {
      asset: true,
      volumesCollection: true,
    },
    order: {
      paraBlockHeight: 'DESC',
    },
  }, { className: 'StableswapAssetVolumeHistoricalData' });
}

export async function getOldStablepoolVolume({
  ctx,
  poolId,
  currentBlockHeight,
}: {
  ctx: SqdProcessorContext<Store>;
  poolId: string;
  currentBlockHeight?: number;
}) {
  return await ctx.storeUtils.findOneWithLogs(StableswapVolumeHistoricalData, {
    where: {
      pool: { id: `${poolId}` },
      ...(currentBlockHeight
        ? { paraBlockHeight: LessThan(currentBlockHeight) }
        : {}),
    },
    relations: {
      pool: true,
    },
    order: {
      paraBlockHeight: 'DESC',
    },
  }, { className: 'StableswapVolumeHistoricalData' });
}

export function getLastVolumeFromCache(
  volume: Map<
    string,
    LbppoolVolumeHistoricalData | XykpoolVolumeHistoricalData
  >,
  poolId: string
) {
  return volume.get(
    Array.from(volume.keys())
      .filter((k) => {
        return k.startsWith(poolId + '-');
      })
      .sort((a, b) => {
        return parseInt(b.split('-')[1]) - parseInt(a.split('-')[1]);
      })[0]
  );
}

export function getPreviousVolumeFromCache(
  volume: Map<
    string,
    LbppoolVolumeHistoricalData | XykpoolVolumeHistoricalData
  >,
  poolId: string,
  currentBlockHeight: number
) {
  return volume.get(
    Array.from(volume.keys())
      .filter((k) => {
        return (
          k.startsWith(poolId + '-') &&
          parseInt(k.split('-')[1]) < currentBlockHeight
        );
      })
      .sort((a, b) => {
        return parseInt(b.split('-')[1]) - parseInt(a.split('-')[1]);
      })[0]
  );
}

/**
 * @param volumes Map<string, PoolAssetHistoricalVolume>
 * @param poolAssetId  <poolId>-<assetId>
 */
export function getPoolAssetLastVolumeFromCache<T extends { id: string }>(
  volumes: Map<string, T>,
  poolAssetId: string
) {
  return volumes.get(
    Array.from(volumes.keys())
      .filter((k) => {
        return k.startsWith(poolAssetId + '-');
      })
      .sort((a, b) => {
        return parseInt(b.split('-')[2]) - parseInt(a.split('-')[2]);
      })[0]
  );
}

/**
 * @param volumes Map<string, PoolAssetHistoricalVolume>
 * @param poolAssetId  <poolId>-<assetId>
 */
export function getPoolAssetPreviousVolumeFromCache<T extends { id: string }>(
  volumes: Map<string, T>,
  poolAssetId: string,
  currentBlockHeight: number
) {
  return volumes.get(
    Array.from(volumes.keys())
      .filter((k) => {
        return (
          k.startsWith(poolAssetId + '-') &&
          parseInt(k.split('-')[2]) < currentBlockHeight
        );
      })
      .sort((a, b) => {
        return parseInt(b.split('-')[2]) - parseInt(a.split('-')[2]);
      })[0]
  );
}

/**
 * @param volumes Map<string, PoolAssetHistoricalVolume>
 * @param poolAssetId  <poolId>-<assetId>
 */
export function getPoolPreviousVolumeFromCache<T extends { id: string }>(
  volumes: Map<string, T>,
  poolId: string,
  currentBlockHeight: number
) {
  return volumes.get(
    Array.from(volumes.keys())
      .filter((k) => {
        return (
          k.startsWith(poolId + '-') &&
          parseInt(k.split('-')[1]) < currentBlockHeight
        );
      })
      .sort((a, b) => {
        return parseInt(b.split('-')[1]) - parseInt(a.split('-')[1]);
      })[0]
  );
}

import {
  LbppoolHistoricalVolume,
  OmnipoolAssetHistoricalVolume,
  StableswapAssetHistoricalVolume,
  XykpoolHistoricalVolume,
} from '../../model';
import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
export { handleXykPoolVolumeUpdates, initXykPoolVolume } from './xykPoolVolume';
export { handleLbppoolVolumeUpdates, initLbppoolVolume } from './lbppoolVolume';
export {
  handleOmnipoolAssetVolumeUpdates,
  initOmnipoolAssetVolume,
} from './omnipoolAssetVolume';

export async function getOldLbpVolume(
  ctx: SqdProcessorContext<Store>,
  poolId: string
) {
  return await ctx.store.findOne(LbppoolHistoricalVolume, {
    where: {
      pool: { id: poolId },
    },
    relations: {
      pool: true,
      assetA: true,
      assetB: true,
    },
    order: {
      paraChainBlockHeight: 'DESC',
    },
  });
}

export async function getOldXykVolume(
  ctx: SqdProcessorContext<Store>,
  poolId: string
) {
  return await ctx.store.findOne(XykpoolHistoricalVolume, {
    where: {
      pool: { id: poolId },
    },
    relations: {
      pool: true,
      assetA: true,
      assetB: true,
    },
    order: {
      paraChainBlockHeight: 'DESC',
    },
  });
}

export async function getOldOmnipoolAssetVolume(
  ctx: SqdProcessorContext<Store>,
  omnipoolAssetId: string
) {
  return await ctx.store.findOne(OmnipoolAssetHistoricalVolume, {
    where: {
      omnipoolAsset: { id: omnipoolAssetId },
    },
    relations: {
      omnipoolAsset: { asset: true },
    },
    order: {
      paraChainBlockHeight: 'DESC',
    },
  });
}

export async function getOldStablepoolAssetVolume(
  ctx: SqdProcessorContext<Store>,
  assetId: string | number,
  poolId: string
) {
  return await ctx.store.findOne(StableswapAssetHistoricalVolume, {
    where: {
      asset: { id: `${assetId}` },
      volumesCollection: { pool: { id: poolId } },
    },
    relations: {
      asset: true,
      volumesCollection: true,
    },
    order: {
      paraChainBlockHeight: 'DESC',
    },
  });
}

export function getLastVolumeFromCache(
  volume: Map<string, LbppoolHistoricalVolume | XykpoolHistoricalVolume>,
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

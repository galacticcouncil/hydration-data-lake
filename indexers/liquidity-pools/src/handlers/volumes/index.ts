import {
  LbpPoolHistoricalVolume,
  OmnipoolAssetHistoricalVolume,
  StablepoolAssetHistoricalVolume,
  XykPoolHistoricalVolume,
} from '../../model';
import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
export { handleXykPoolVolumeUpdates, initXykPoolVolume } from './xykPoolVolume';
export { handleLbpPoolVolumeUpdates, initLbpPoolVolume } from './lbpPoolVolume';
export {
  handleOmnipoolAssetVolumeUpdates,
  initOmnipoolAssetVolume,
} from './omnipoolAssetVolume';

export async function getOldLbpVolume(
  ctx: ProcessorContext<Store>,
  poolId: string
) {
  return await ctx.store.findOne(LbpPoolHistoricalVolume, {
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
  ctx: ProcessorContext<Store>,
  poolId: string
) {
  return await ctx.store.findOne(XykPoolHistoricalVolume, {
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
  ctx: ProcessorContext<Store>,
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
  ctx: ProcessorContext<Store>,
  assetId: string | number,
  poolId: string
) {
  return await ctx.store.findOne(StablepoolAssetHistoricalVolume, {
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
  volume: Map<string, LbpPoolHistoricalVolume | XykPoolHistoricalVolume>,
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

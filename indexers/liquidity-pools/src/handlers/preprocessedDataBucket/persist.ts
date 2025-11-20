import { Store } from '@subsquid/typeorm-store';
import { Entity } from '@subsquid/typeorm-store/src/store';

import {
  AssetAssetsPairVolume,
  AssetHistoricalData,
  AssetsPairVolumeHistoricalData,
  AssetSpotPriceHistoricalData,
  LbppoolVolumeHistoricalData,
  OmnipoolAssetVolumeHistoricalData,
  PreprocessedDataBucket,
  StableswapAssetVolumeHistoricalData,
  StableswapVolumeHistoricalData,
  XykpoolVolumeHistoricalData,
} from '../../model';
import { SqdProcessorContext } from '../../processor';

export async function savePreprocessedData({
  dataToSave,
  ctx,
}: {
  dataToSave: Map<string, Entity & { paraBlockHeight: number }>;
  ctx: SqdProcessorContext<Store>;
}) {
  const entitiesToSave: PreprocessedDataBucket[] = [];

  for (const entity of dataToSave.values()) {
    let decoratedPayload = null;
    switch (entity.constructor.name) {
      case 'AssetHistoricalData':
        decoratedPayload = decorateAssetHistoricalData(
          entity as AssetHistoricalData
        );
        break;
      case 'AssetSpotPriceHistoricalData':
        decoratedPayload = decorateAssetSpotPriceHistoricalData(
          entity as AssetSpotPriceHistoricalData
        );
        break;
      case 'AssetsPairVolumeHistoricalData':
        decoratedPayload = decorateAssetsPairVolumeHistoricalData(
          entity as AssetsPairVolumeHistoricalData
        );
        break;
      case 'AssetAssetsPairVolume':
        decoratedPayload = decorateAssetAssetsPairVolume(
          entity as AssetAssetsPairVolume
        );
        break;
      case 'XykpoolVolumeHistoricalData':
        decoratedPayload = decorateXykpoolVolumeHistoricalData(
          entity as XykpoolVolumeHistoricalData
        );
        break;
      case 'LbppoolVolumeHistoricalData':
        decoratedPayload = decorateLbppoolVolumeHistoricalData(
          entity as LbppoolVolumeHistoricalData
        );
        break;
      case 'OmnipoolAssetVolumeHistoricalData':
        decoratedPayload = decorateOmnipoolAssetVolumeHistoricalData(
          entity as OmnipoolAssetVolumeHistoricalData
        );
        break;
      case 'StableswapAssetVolumeHistoricalData':
        decoratedPayload = decorateStableswapAssetVolumeHistoricalData(
          entity as StableswapAssetVolumeHistoricalData
        );
        break;
      case 'StableswapVolumeHistoricalData':
        decoratedPayload = decorateStableswapVolumeHistoricalData(
          entity as StableswapVolumeHistoricalData
        );
        break;
    }

    if (!decoratedPayload) continue;

    entitiesToSave.push(
      new PreprocessedDataBucket({
        id: `${entity.constructor.name}-${entity.id}`,
        processorId: ctx.appConfig.STATE_SCHEMA_NAME,
        paraBlockHeight: entity.paraBlockHeight,
        entityName: entity.constructor.name,
        data: decoratedPayload,
      })
    );
  }

  await ctx.store.upsert(entitiesToSave);
}

function getAllEntityProps(entity: Entity) {
  const entries = Object.entries(entity);
  const decorated: Record<string, any> = {};
  for (const [key, value] of entries) {
    decorated[key] = typeof value === 'bigint' ? value.toString() : value;
  }
  return decorated;
}

function decorateAssetHistoricalData(src: AssetHistoricalData) {
  const decorated: Record<string, any> = getAllEntityProps(src);

  decorated.assetId = src.assetId;

  delete decorated.spotPrices;
  delete decorated.assetPairVolumes;

  return decorated;
}

function decorateAssetsPairVolumeHistoricalData(
  src: AssetsPairVolumeHistoricalData
) {
  const decorated: Record<string, any> = getAllEntityProps(src);

  decorated.assetA = src.assetAId;
  decorated.assetB = src.assetBId;

  decorated.assetRegistryAId = src.assetRegistryAId;
  decorated.assetRegistryBId = src.assetRegistryBId;

  return decorated;
}

function decorateAssetSpotPriceHistoricalData(
  src: AssetSpotPriceHistoricalData
) {
  const decorated: Record<string, any> = getAllEntityProps(src);

  decorated.assetInHistData = src.assetInHistData.id;
  decorated.assetIn = src.assetInId;
  decorated.assetOut = src.assetOutId;

  return decorated;
}

function decorateAssetAssetsPairVolume(src: AssetAssetsPairVolume) {
  const decorated: Record<string, any> = getAllEntityProps(src);

  decorated.assetHistoricalData = src.assetHistoricalData.id;
  decorated.assetsPairVolumeHistoricalData =
    src.assetsPairVolumeHistoricalData.id;

  return decorated;
}

function decorateXykpoolVolumeHistoricalData(src: XykpoolVolumeHistoricalData) {
  const decorated: Record<string, any> = getAllEntityProps(src);

  decorated.pool = src.pool.id;
  decorated.assetAId = src.assetAId;
  decorated.assetBId = src.assetBId;

  return decorated;
}

function decorateLbppoolVolumeHistoricalData(src: LbppoolVolumeHistoricalData) {
  const decorated: Record<string, any> = getAllEntityProps(src);

  decorated.pool = src.pool.id;
  decorated.assetAId = src.assetAId;
  decorated.assetBId = src.assetBId;

  return decorated;
}

function decorateOmnipoolAssetVolumeHistoricalData(
  src: OmnipoolAssetVolumeHistoricalData
) {
  const decorated: Record<string, any> = getAllEntityProps(src);

  decorated.omnipoolAsset = src.omnipoolAsset.id;

  return decorated;
}

function decorateStableswapAssetVolumeHistoricalData(
  src: StableswapAssetVolumeHistoricalData
) {
  const decorated: Record<string, any> = getAllEntityProps(src);

  decorated.volumesCollection = src.volumesCollection.id;
  decorated.assetId = src.assetId;

  return decorated;
}

function decorateStableswapVolumeHistoricalData(
  src: StableswapVolumeHistoricalData
) {
  const decorated: Record<string, any> = getAllEntityProps(src);

  decorated.pool = src.pool.id;

  delete decorated.assetVolumes;

  return decorated;
}

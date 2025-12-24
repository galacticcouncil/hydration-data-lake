import { In } from 'typeorm';

import { Store } from '@subsquid/typeorm-store';

import {
  AssetAssetsPairVolume,
  AssetDynamicFee,
  AssetHistoricalData,
  AssetsPairVolumeHistoricalData,
  AssetSpotPriceHistoricalData,
  Block as BlockEntity,
  LbppoolVolumeHistoricalData,
  OmnipoolAssetVolumeHistoricalData,
  PreprocessedDataBucket,
  StableswapAssetVolumeHistoricalData,
  StableswapVolumeHistoricalData,
  XykpoolVolumeHistoricalData,
} from '../../model';
import { SqdProcessorContext } from '../../processor';
import { getOrCreateAsset } from '../assets/asset';
import { getOrCreatePriceRoute } from '../assets/priceRoute/priceRoute';

export type PrefetchedCache = {
  blocks: Map<string, BlockEntity>;
  xykPoolVolumes: Map<string, XykpoolVolumeHistoricalData>;
  lbppoolVolumes: Map<string, LbppoolVolumeHistoricalData>;
  omnipoolAssetVolumes: Map<string, OmnipoolAssetVolumeHistoricalData>;
  stableswapVolumes: Map<string, StableswapVolumeHistoricalData>;
  stableswapAssetVolumes: Map<string, StableswapAssetVolumeHistoricalData>;
};

export type ResultCache = {
  assetHistoricalData: Map<string, AssetHistoricalData>;
  assetSpotPriceHistoricalData: Map<string, AssetSpotPriceHistoricalData>;
  assetsPairVolumeHistoricalData: Map<string, AssetsPairVolumeHistoricalData>;
  assetAssetsPairVolume: Array<AssetAssetsPairVolume>;
  xykPoolVolumes: Array<XykpoolVolumeHistoricalData>;
  lbppoolVolumes: Array<LbppoolVolumeHistoricalData>;
  omnipoolAssetVolumes: Array<OmnipoolAssetVolumeHistoricalData>;
  stableswapVolumes: Array<StableswapVolumeHistoricalData>;
  stableswapAssetVolumes: Array<StableswapAssetVolumeHistoricalData>;
};

export type IdsToPrefetchScope = {
  bockIdsToPrefetch: string[];
  xykpoolVolIdsToPrefetch: string[];
  lbppoolVolIdsToPrefetch: string[];
  omnipoolAssetVolIdsToPrefetch: string[];
  stableswapVolIdsToPrefetch: string[];
  stableswapAssetVolIdsToPrefetch: string[];
};

export async function* fetchDbDataByPages<R = []>({
  requestPromise,
  limit,
  totalCount,
}: {
  requestPromise: (args: { pageSize: number; offset: number }) => Promise<R>;
  limit: number;
  totalCount: number;
}) {
  const pageSize = limit;
  let offset = 0;

  while (offset < totalCount) {
    const responseWithTotal = await requestPromise({
      pageSize,
      offset,
    });

    yield responseWithTotal;

    offset += pageSize;
  }
}

export async function handlePreprocDataBuckets({
  buckets,
  ctx,
  resultCache,
  prefetchedCache,
}: {
  buckets: PreprocessedDataBucket[];
  prefetchedCache: PrefetchedCache;
  resultCache: ResultCache;
  ctx: SqdProcessorContext<Store>;
}) {
  /**
   * Following entities must be processed firstly and in particular order:
   * - AssetHistoricalData
   * - AssetSpotPriceHistoricalData
   * - AssetsPairVolumeHistoricalData
   */

  for (const { data } of buckets.filter(
    (b) => b.entityName === 'AssetHistoricalData'
  )) {
    const preprocData = data as any;
    const asset = await getOrCreateAsset({
      id: preprocData.asset,
      ctx,
      ensure: false,
    });
    if (!asset) continue;

    const block =
      prefetchedCache.blocks.get(preprocData.block) ??
      (await ctx.storeUtils.findOneWithLogs(
        BlockEntity,
        {
          where: { id: preprocData.block },
        },
        { className: 'BlockEntity' }
      ));

    const newEntity = new AssetHistoricalData({
      id: preprocData.id,
      assetId: asset.id,
      totalIssuance: BigInt(preprocData.totalIssuance),
      dynamicFee: preprocData.dynamicFee
        ? new AssetDynamicFee(preprocData.dynamicFee)
        : null,
      usdPriceNormalised: preprocData.usdPriceNormalised,
      paraBlockHeight: preprocData.paraBlockHeight,
    });
    resultCache.assetHistoricalData.set(newEntity.id, newEntity);
  }

  for (const { data } of buckets.filter(
    (b) => b.entityName === 'AssetSpotPriceHistoricalData'
  )) {
    const preprocData = data as any;

    const assetIn = await getOrCreateAsset({
      id: preprocData.assetIn,
      ctx,
      ensure: false,
    });
    if (!assetIn) continue;

    const assetOut = await getOrCreateAsset({
      id: preprocData.assetOut,
      ctx,
      ensure: false,
    });
    if (!assetOut) continue;

    const block =
      prefetchedCache.blocks.get(preprocData.block) ??
      (await ctx.storeUtils.findOneWithLogs(
        BlockEntity,
        {
          where: { id: preprocData.block },
        },
        { className: 'BlockEntity' }
      ));

    if (!block) continue;

    const assetInHistData = resultCache.assetHistoricalData.get(
      preprocData.assetInHistData
    );
    if (!assetInHistData) continue;

    const priceRoute = getOrCreatePriceRoute(preprocData.priceRoute, ctx);

    const newEntity = new AssetSpotPriceHistoricalData({
      id: preprocData.id,
      assetInId: assetIn.id,
      assetOutId: assetOut.id,
      price: BigInt(preprocData.price),
      priceNormalised: preprocData.priceNormalised,
      priceRoute,
      paraBlockHeight: preprocData.paraBlockHeight,
    });
    resultCache.assetSpotPriceHistoricalData.set(newEntity.id, newEntity);
  }

  for (const { data } of buckets.filter(
    (b) => b.entityName === 'AssetsPairVolumeHistoricalData'
  )) {
    const preprocData = data as any;

    const block =
      prefetchedCache.blocks.get(preprocData.block) ??
      (await ctx.storeUtils.findOneWithLogs(
        BlockEntity,
        {
          where: { id: preprocData.block },
        },
        { className: 'BlockEntity' }
      ));
    if (!block) continue;

    const assetA = await getOrCreateAsset({
      id: preprocData.assetA,
      ctx,
      ensure: false,
    });
    if (!assetA) continue;

    const assetB = await getOrCreateAsset({
      id: preprocData.assetB,
      ctx,
      ensure: false,
    });
    if (!assetB) continue;

    const newEntity = new AssetsPairVolumeHistoricalData({
      id: preprocData.id,
      assetAId: assetA.id,
      assetRegistryAId: assetA.assetRegistryId?.toString(),
      assetBId: assetB.id,
      assetRegistryBId: assetB.assetRegistryId?.toString(),
      assetAVolume: BigInt(preprocData.assetAVolume),
      assetBVolume: BigInt(preprocData.assetBVolume),
      totalVolumeNormalised: preprocData.totalVolumeNormalised,
      paraBlockHeight: preprocData.paraBlockHeight,
    });
    resultCache.assetsPairVolumeHistoricalData.set(newEntity.id, newEntity);
  }

  for (const bucket of buckets) {
    switch (bucket.entityName) {
      case 'AssetAssetsPairVolume': {
        const preprocData = bucket.data as any;

        const assetHistoricalData = resultCache.assetHistoricalData.get(
          preprocData.assetHistoricalData
        );
        if (!assetHistoricalData) break;

        const assetsPairVolumeHistoricalData =
          resultCache.assetsPairVolumeHistoricalData.get(
            preprocData.assetsPairVolumeHistoricalData
          );
        if (!assetHistoricalData) break;

        const newEntity = new AssetAssetsPairVolume({
          id: preprocData.id,
          assetHistoricalData,
          assetsPairVolumeHistoricalData,
          paraBlockHeight: preprocData.paraBlockHeight,
        });
        resultCache.assetAssetsPairVolume.push(newEntity);
        break;
      }
      case 'XykpoolVolumeHistoricalData': {
        const preprocData = bucket.data as any;

        const existingVolEntity = prefetchedCache.xykPoolVolumes.get(
          preprocData.id
        );
        if (!existingVolEntity) break;

        existingVolEntity.assetAVolInNorm = preprocData.assetAVolInNorm;
        existingVolEntity.assetAVolOutNorm = preprocData.assetAVolOutNorm;
        existingVolEntity.assetBVolInNorm = preprocData.assetBVolInNorm;
        existingVolEntity.assetBVolOutNorm = preprocData.assetBVolOutNorm;
        existingVolEntity.assetAFeeVolNorm = preprocData.assetAFeeVolNorm;
        existingVolEntity.assetBFeeVolNorm = preprocData.assetBFeeVolNorm;
        existingVolEntity.assetATotalVolInNorm =
          preprocData.assetATotalVolInNorm;
        existingVolEntity.assetATotalVolOutNorm =
          preprocData.assetATotalVolOutNorm;
        existingVolEntity.assetBTotalVolInNorm =
          preprocData.assetBTotalVolInNorm;
        existingVolEntity.assetBTotalVolOutNorm =
          preprocData.assetBTotalVolOutNorm;
        existingVolEntity.assetAFeesTotalVolNorm =
          preprocData.assetAFeesTotalVolNorm;
        existingVolEntity.assetBFeesTotalVolNorm =
          preprocData.assetBFeesTotalVolNorm;

        resultCache.xykPoolVolumes.push(existingVolEntity);
        break;
      }
      case 'LbppoolVolumeHistoricalData': {
        const preprocData = bucket.data as any;

        const existingVolEntity = prefetchedCache.lbppoolVolumes.get(
          preprocData.id
        );
        if (!existingVolEntity) break;

        existingVolEntity.assetAVolInNorm = preprocData.assetAVolInNorm;
        existingVolEntity.assetAVolOutNorm = preprocData.assetAVolOutNorm;
        existingVolEntity.assetBVolInNorm = preprocData.assetBVolInNorm;
        existingVolEntity.assetBVolOutNorm = preprocData.assetBVolOutNorm;
        existingVolEntity.assetAFeeVolNorm = preprocData.assetAFeeVolNorm;
        existingVolEntity.assetBFeeVolNorm = preprocData.assetBFeeVolNorm;
        existingVolEntity.assetATotalVolInNorm =
          preprocData.assetATotalVolInNorm;
        existingVolEntity.assetATotalVolOutNorm =
          preprocData.assetATotalVolOutNorm;
        existingVolEntity.assetBTotalVolInNorm =
          preprocData.assetBTotalVolInNorm;
        existingVolEntity.assetBTotalVolOutNorm =
          preprocData.assetBTotalVolOutNorm;
        existingVolEntity.assetAFeesTotalVolNorm =
          preprocData.assetAFeesTotalVolNorm;
        existingVolEntity.assetBFeesTotalVolNorm =
          preprocData.assetBFeesTotalVolNorm;

        resultCache.lbppoolVolumes.push(existingVolEntity);

        break;
      }
      case 'OmnipoolAssetVolumeHistoricalData': {
        const preprocData = bucket.data as any;

        const existingVolEntity = prefetchedCache.omnipoolAssetVolumes.get(
          preprocData.id
        );
        if (!existingVolEntity) break;

        existingVolEntity.assetFeeVolNorm = preprocData.assetFeeVolNorm;
        existingVolEntity.assetTotalFeesVolNorm =
          preprocData.assetTotalFeesVolNorm;
        existingVolEntity.assetVolInNorm = preprocData.assetVolInNorm;
        existingVolEntity.assetVolOutNorm = preprocData.assetVolOutNorm;
        existingVolEntity.assetTotalVolInNorm = preprocData.assetTotalVolInNorm;
        existingVolEntity.assetTotalVolOutNorm =
          preprocData.assetTotalVolOutNorm;

        resultCache.omnipoolAssetVolumes.push(existingVolEntity);

        break;
      }
      case 'StableswapAssetVolumeHistoricalData': {
        const preprocData = bucket.data as any;

        const existingVolEntity = prefetchedCache.stableswapAssetVolumes.get(
          preprocData.id
        );
        if (!existingVolEntity) break;

        existingVolEntity.assetFeeVolNorm = preprocData.assetFeeVolNorm;
        existingVolEntity.assetTotalFeesVolNorm =
          preprocData.assetTotalFeesVolNorm;
        existingVolEntity.assetVolInNorm = preprocData.assetVolInNorm;
        existingVolEntity.assetVolOutNorm = preprocData.assetVolOutNorm;
        existingVolEntity.assetTotalVolInNorm = preprocData.assetTotalVolInNorm;
        existingVolEntity.assetTotalVolOutNorm =
          preprocData.assetTotalVolOutNorm;

        resultCache.stableswapAssetVolumes.push(existingVolEntity);
        break;
      }
      case 'StableswapVolumeHistoricalData': {
        const preprocData = bucket.data as any;

        const existingVolEntity = prefetchedCache.stableswapVolumes.get(
          preprocData.id
        );
        if (!existingVolEntity) break;

        existingVolEntity.poolVolInNorm = preprocData.poolVolInNorm;
        existingVolEntity.poolVolOutNorm = preprocData.poolVolOutNorm;
        existingVolEntity.poolFeesVolNorm = preprocData.poolFeesVolNorm;
        existingVolEntity.poolTotalVolInNorm = preprocData.poolTotalVolInNorm;
        existingVolEntity.poolTotalVolOutNorm = preprocData.poolTotalVolOutNorm;
        existingVolEntity.poolTotalFeesVolNorm =
          preprocData.poolTotalFeesVolNorm;

        resultCache.stableswapVolumes.push(existingVolEntity);

        break;
      }
    }
  }
}

export function getIdsToPrefetch(
  pageData: PreprocessedDataBucket[]
): IdsToPrefetchScope {
  const bockIdsToPrefetch: string[] = [];
  const xykpoolVolIdsToPrefetch: string[] = [];
  const lbppoolVolIdsToPrefetch: string[] = [];
  const omnipoolAssetVolIdsToPrefetch: string[] = [];
  const stableswapVolIdsToPrefetch: string[] = [];
  const stableswapAssetVolIdsToPrefetch: string[] = [];

  for (const { data, entityName } of pageData) {
    const bucketData = data as any;
    if (!!bucketData.block) bockIdsToPrefetch.push(bucketData.block);

    switch (entityName) {
      case 'XykpoolVolumeHistoricalData':
        xykpoolVolIdsToPrefetch.push(bucketData.id);
        break;
      case 'LbppoolVolumeHistoricalData':
        lbppoolVolIdsToPrefetch.push(bucketData.id);
        break;
      case 'OmnipoolAssetVolumeHistoricalData':
        omnipoolAssetVolIdsToPrefetch.push(bucketData.id);
        break;
      case 'StableswapVolumeHistoricalData':
        stableswapVolIdsToPrefetch.push(bucketData.id);
        break;
      case 'StableswapAssetVolumeHistoricalData':
        stableswapAssetVolIdsToPrefetch.push(bucketData.id);
        break;
    }
  }

  return {
    bockIdsToPrefetch,
    xykpoolVolIdsToPrefetch,
    lbppoolVolIdsToPrefetch,
    omnipoolAssetVolIdsToPrefetch,
    stableswapVolIdsToPrefetch,
    stableswapAssetVolIdsToPrefetch,
  };
}

export async function getPrefetchedCache({
  bockIdsToPrefetch,
  xykpoolVolIdsToPrefetch,
  lbppoolVolIdsToPrefetch,
  omnipoolAssetVolIdsToPrefetch,
  stableswapVolIdsToPrefetch,
  stableswapAssetVolIdsToPrefetch,
  ctx,
}: {
  bockIdsToPrefetch: string[];
  xykpoolVolIdsToPrefetch: string[];
  lbppoolVolIdsToPrefetch: string[];
  omnipoolAssetVolIdsToPrefetch: string[];
  stableswapVolIdsToPrefetch: string[];
  stableswapAssetVolIdsToPrefetch: string[];
  ctx: SqdProcessorContext<Store>;
}): Promise<PrefetchedCache> {
  const [
    blocksList,
    xykPoolVolumesList,
    lbppoolVolumesList,
    omnipoolAssetVolumesList,
    stableswapVolumesList,
    stableswapAssetVolumesList,
  ] = await Promise.all([
    ctx.storeUtils.findWithLogs(
      BlockEntity,
      {
        where: { id: In(bockIdsToPrefetch) },
      },
      { className: 'BlockEntity' }
    ),
    ctx.storeUtils.findWithLogs(
      XykpoolVolumeHistoricalData,
      {
        where: { id: In(xykpoolVolIdsToPrefetch) },
        relations: { pool: true },
      },
      { className: 'XykpoolVolumeHistoricalData' }
    ),
    ctx.storeUtils.findWithLogs(
      LbppoolVolumeHistoricalData,
      {
        where: { id: In(lbppoolVolIdsToPrefetch) },
        relations: { pool: true },
      },
      { className: 'LbppoolVolumeHistoricalData' }
    ),
    ctx.storeUtils.findWithLogs(
      OmnipoolAssetVolumeHistoricalData,
      {
        where: { id: In(omnipoolAssetVolIdsToPrefetch) },
        relations: { omnipoolAsset: true },
      },
      { className: 'OmnipoolAssetVolumeHistoricalData' }
    ),
    ctx.storeUtils.findWithLogs(
      StableswapVolumeHistoricalData,
      {
        where: { id: In(stableswapVolIdsToPrefetch) },
        relations: { pool: true },
      },
      { className: 'StableswapVolumeHistoricalData' }
    ),
    ctx.storeUtils.findWithLogs(
      StableswapAssetVolumeHistoricalData,
      {
        where: { id: In(stableswapAssetVolIdsToPrefetch) },
        relations: { volumesCollection: true },
      },
      { className: 'StableswapAssetVolumeHistoricalData' }
    ),
  ]);

  return {
    blocks: new Map(blocksList.map((i) => [i.id, i])),
    xykPoolVolumes: new Map(xykPoolVolumesList.map((i) => [i.id, i])),
    lbppoolVolumes: new Map(lbppoolVolumesList.map((i) => [i.id, i])),
    omnipoolAssetVolumes: new Map(
      omnipoolAssetVolumesList.map((i) => [i.id, i])
    ),
    stableswapVolumes: new Map(stableswapVolumesList.map((i) => [i.id, i])),
    stableswapAssetVolumes: new Map(
      stableswapAssetVolumesList.map((i) => [i.id, i])
    ),
  } as PrefetchedCache;
}

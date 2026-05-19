import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { PreprocessedDataBucket } from '../../model';
import {
  getIdsToPrefetch,
  getPrefetchedCache,
  handlePreprocDataBuckets,
  ResultCache,
} from './helpers';

export async function processPreprocessedDataBuckets(
  ctx: SqdProcessorContext<Store>
) {
  let isBlockNumberToProcess = true;
  console.time('totalBucketsCount fetch - ');
  const totalBucketsCount = await ctx.store.count(PreprocessedDataBucket);
  console.log(`Total buckets count: ${totalBucketsCount}`);
  console.timeEnd('totalBucketsCount fetch - ');

  while (isBlockNumberToProcess) {
    const anyBucket = await ctx.storeUtils.findOneWithLogs(PreprocessedDataBucket, {
      where: {},
      order: { paraBlockHeight: 'ASC' },
    }, {
      className: 'PreprocessedDataBucket',
      originCallFn: 'processPreprocessedDataBuckets',
    });
    if (!anyBucket) {
      isBlockNumberToProcess = false;
      break;
    }

    const bucketsForBlock = await ctx.store.find(PreprocessedDataBucket, {
      where: { paraBlockHeight: anyBucket.paraBlockHeight },
    });

    const prefetchedCache = await getPrefetchedCache({
      ...getIdsToPrefetch(bucketsForBlock),
      ctx,
    });

    const resultCache: ResultCache = {
      assetHistoricalData: new Map(),
      assetSpotPriceHistoricalData: new Map(),
      assetsPairVolumeHistoricalData: new Map(),
      assetAssetsPairVolume: [],
      xykPoolVolumes: [],
      lbppoolVolumes: [],
      omnipoolAssetVolumes: [],
      stableswapVolumes: [],
      stableswapAssetVolumes: [],
    };

    await handlePreprocDataBuckets({
      ctx,
      prefetchedCache,
      resultCache,
      buckets: bucketsForBlock,
    });

    /**
     * Order of saving following entities must be observed.
     */
    // await ctx.store.upsert([...resultCache.assetHistoricalData.values()]);
    // await ctx.store.upsert([
    //   ...resultCache.assetSpotPriceHistoricalData.values(),
    // ]);
    // await ctx.store.upsert([
    //   ...resultCache.assetsPairVolumeHistoricalData.values(),
    // ]);
    // await ctx.store.upsert(resultCache.assetAssetsPairVolume);
    await ctx.store.upsert(resultCache.lbppoolVolumes);
    await ctx.store.upsert(resultCache.xykPoolVolumes);
    await ctx.store.upsert(resultCache.omnipoolAssetVolumes);
    await ctx.store.upsert(resultCache.stableswapVolumes);
    await ctx.store.upsert(resultCache.stableswapAssetVolumes);

    for (const i of resultCache.assetHistoricalData.values()) {
      ctx.batchState.state.assetsHistoricalDataBatch.set(i.id, i);
    }
    for (const i of resultCache.assetSpotPriceHistoricalData.values()) {
      ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.set(i.id, i);
    }
    for (const i of resultCache.assetsPairVolumeHistoricalData.values()) {
      ctx.batchState.state.assetsPairVolumeHistoricalDataBatch.set(i.id, i);
    }
    for (const i of resultCache.assetAssetsPairVolume) {
      ctx.batchState.state.assetAssetsPairVolumesBatch.set(i.id, i);
    }
    // for (const i of resultCache.lbppoolVolumes) {
    //   ctx.batchState.state.lbpPoolVolumes.set(i.id, i);
    // }
    // for (const i of resultCache.xykPoolVolumes) {
    //   ctx.batchState.state.xykPoolVolumes.set(i.id, i);
    // }
    // for (const i of resultCache.omnipoolAssetVolumes) {
    //   ctx.batchState.state.omnipoolAssetVolumes.set(i.id, i);
    // }
    // for (const i of resultCache.stableswapVolumes) {
    //   ctx.batchState.state.stablepoolVolumeCollections.set(i.id, i);
    // }
    // for (const i of resultCache.stableswapAssetVolumes) {
    //   ctx.batchState.state.stablepoolAssetVolumes.set(i.id, i);
    // }

    await ctx.store.remove(bucketsForBlock);
  }

  // const totalBucketsCount = await ctx.store.count(PreprocessedDataBucket);
  // const fetchDataCallback = async ({
  //   pageSize,
  //   offset,
  // }: {
  //   pageSize: number;
  //   offset: number;
  // }) =>
  //   ctx.store.find(PreprocessedDataBucket, {
  //     where: {},
  //     take: pageSize,
  //     skip: offset,
  //   });
  //
  // for await (const bucketsPage of fetchDbDataByPages({
  //   limit: 1000,
  //   totalCount: totalBucketsCount,
  //   requestPromise: fetchDataCallback,
  // })) {
  //   if (!bucketsPage) continue;
  //
  //   const prefetchedCache = await getPrefetchedCache({
  //     ...getIdsToPrefetch(bucketsPage),
  //     ctx,
  //   });
  //
  //   const resultCache: ResultCache = {
  //     assetHistoricalData: new Map(),
  //     assetSpotPriceHistoricalData: new Map(),
  //     assetsPairVolumeHistoricalData: new Map(),
  //     assetAssetsPairVolume: new Map(),
  //     xykPoolVolumes: new Map(),
  //     lbppoolVolumes: new Map(),
  //     omnipoolAssetVolumes: new Map(),
  //     stableswapVolumes: new Map(),
  //     stableswapAssetVolumes: new Map(),
  //   };
  //
  //   await ctx.store.remove(bucketsPage);
  // }
}

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

  while (isBlockNumberToProcess) {
    const anyBucket = await ctx.store.findOne(PreprocessedDataBucket, {
      where: {},
      order: { paraBlockHeight: 'ASC' },
    });
    if (!anyBucket) {
      isBlockNumberToProcess = false;
      break;
    }

    const bucketsForBlock = await ctx.store.find(PreprocessedDataBucket, {
      where: { paraBlockHeight: anyBucket.paraBlockHeight },
    });

    console.log(
      ' --- bucketsForBlock - ',
      anyBucket.paraBlockHeight,
      bucketsForBlock.length
    );

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
    await ctx.store.upsert([...resultCache.assetHistoricalData.values()]);
    await ctx.store.upsert([
      ...resultCache.assetSpotPriceHistoricalData.values(),
    ]);
    await ctx.store.upsert([
      ...resultCache.assetsPairVolumeHistoricalData.values(),
    ]);
    await ctx.store.upsert(resultCache.assetAssetsPairVolume);
    await ctx.store.upsert(resultCache.lbppoolVolumes);
    await ctx.store.upsert(resultCache.xykPoolVolumes);
    await ctx.store.upsert(resultCache.omnipoolAssetVolumes);
    await ctx.store.upsert(resultCache.stableswapVolumes);
    await ctx.store.upsert(resultCache.stableswapAssetVolumes);

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

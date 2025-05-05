import { SqdProcessorContext } from '../../../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { AssetHistoricalData } from '../../../../../../model';
import { In } from 'typeorm';

export async function fetchAssetsHistoricalData({
  blockNumber,
  ctx,
}: {
  blockNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  // const allAssetsCachedMap = ctx.batchState.state.assetsAllBatch;

  /**
   * Assets are pre-loaded in cache during initial batch processing.
   * Direct database queries are skipped as cache contains complete asset data.
   */

  const cachedHistData = [
    ...ctx.batchState.state.assetsHistoricalDataBatch.values(),
  ].filter(
    (item) => item.paraBlockHeight === blockNumber
    // &&
    // allAssetsCachedMap.has(item.asset.id) // TODO check this condition item.paraBlockHeight === blockNumber
  );

  // const cachedHistDataIdsSet = new Set(cachedHistData.map((i) => i.asset.id));

  const persistedHistData = await ctx.store.find(AssetHistoricalData, {
    where: {
      paraBlockHeight: blockNumber,
      // paraBlockHeight: LessThanOrEqual(blockNumber),
      // id: In(
      //   [...allAssetsCachedMap.values()]
      //     .filter((a) => !cachedHistDataIdsSet.has(a.id))
      //     .map((a) => `${a.id}-${blockNumber}`)
      // ),
    },
    relations: {
      asset: true,
    },
  });

  return new Map([
    ...persistedHistData.map((ahd): [string, AssetHistoricalData] => [
      ahd.asset.id,
      ahd,
    ]),
    ...cachedHistData.map((ahd): [string, AssetHistoricalData] => [
      ahd.asset.id,
      ahd,
    ]),
  ]);
}

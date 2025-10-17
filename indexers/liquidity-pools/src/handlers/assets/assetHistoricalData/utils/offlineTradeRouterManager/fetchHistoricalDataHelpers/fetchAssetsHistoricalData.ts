import { SqdProcessorContext } from '../../../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { AssetHistoricalData } from '../../../../../../model';
import { Between } from 'typeorm/find-options/operator/Between';

export async function fetchAssetsHistoricalData({
  blockNumber,
  ctx,
}: {
  blockNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  /**
   * Assets are pre-loaded in cache during initial batch processing.
   * Direct database queries are skipped as cache contains complete asset data.
   */

  const cachedHistData = [
    ...ctx.batchState.state.assetsHistoricalDataBatch.values(),
  ].filter((item) => item.paraBlockHeight === blockNumber);

  const persistedHistData = await ctx.storeUtils.findWithLogs(
    AssetHistoricalData,
    {
      where: {
        paraBlockHeight: blockNumber,
      },
      relations: {
        asset: true,
      },
    },
    {
      className: 'AssetHistoricalData',
      originCallFn: 'offline_trade_router_spot_price_calc_prefetch',
    }
  );

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

export async function fetchAssetsHistoricalDataForBlocksRangeResolver({
  blockFromNumber,
  blockToNumber,
  ctx,
}: {
  blockFromNumber: number;
  blockToNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  /**
   * Assets are pre-loaded in cache during initial batch processing.
   * Direct database queries are skipped as cache contains complete asset data.
   */

  const cachedHistData = [
    ...ctx.batchState.state.assetsHistoricalDataBatch.values(),
  ].filter(
    (item) =>
      item.paraBlockHeight > blockFromNumber - 1 &&
      item.paraBlockHeight < blockToNumber + 1
  );

  const persistedHistData = ctx.appConfig
    .ENSURE_PREFETCH_PERSISTENT_DATA_FOR_SPOT_PRICE
    ? await ctx.storeUtils.findWithLogs(
        AssetHistoricalData,
        {
          where: {
            paraBlockHeight: Between(blockFromNumber - 1, blockToNumber + 1),
          },
          relations: {
            asset: true,
          },
        },
        {
          className: 'AssetHistoricalData',
          originCallFn: 'offline_trade_router_spot_price_calc_prefetch',
        }
      )
    : [];

  const mergedDataMap = new Map([
    ...persistedHistData.map((ahd): [string, AssetHistoricalData] => [
      ahd.id,
      ahd,
    ]),
    ...cachedHistData.map((ahd): [string, AssetHistoricalData] => [
      ahd.id,
      ahd,
    ]),
  ]);

  const histDataPerBlock = new Map<number, Map<string, AssetHistoricalData>>();

  for (const histDataItem of [...mergedDataMap.values()]) {
    if (!histDataPerBlock.has(histDataItem.paraBlockHeight))
      histDataPerBlock.set(histDataItem.paraBlockHeight, new Map());

    histDataPerBlock
      .get(histDataItem.paraBlockHeight)!
      .set(histDataItem.asset.id, histDataItem);
  }

  return histDataPerBlock;
}

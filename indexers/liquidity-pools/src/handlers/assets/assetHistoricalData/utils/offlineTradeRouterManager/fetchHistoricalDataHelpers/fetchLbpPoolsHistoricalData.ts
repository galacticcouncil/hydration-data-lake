import {
  In,
  Not,
} from 'typeorm';
import { Between } from 'typeorm/find-options/operator/Between';

import { Store } from '@subsquid/typeorm-store';

import {
  Lbppool,
  LbppoolHistoricalData,
} from '../../../../../../model';
import { SqdProcessorContext } from '../../../../../../processor';

export async function fetchLbpPoolsHistoricalData({
  blockNumber,
  ctx,
}: {
  blockNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  const allActivePoolsCached = [
    ...ctx.batchState.state.lbpAllBatchPools.values(),
  ].filter((item) => !item.isDestroyed);

  const allActivePoolsPersisted = ctx.appConfig
    .ENSURE_PREFETCH_PERSISTENT_DATA_FOR_SPOT_PRICE
    ? await ctx.storeUtils.findWithLogs(
        Lbppool,
        {
          where: {
            isDestroyed: false,
          },
          relations: {
          },
        },
        {
          className: 'Lbppool',
          originCallFn: 'offline_trade_router_spot_price_calc_prefetch',
        }
      )
    : [];

  const allActivePools: Map<string, Lbppool> = new Map([
    ...allActivePoolsCached.map((pool): [string, Lbppool] => [pool.id, pool]),
    ...allActivePoolsPersisted.map((pool): [string, Lbppool] => [
      pool.id,
      pool,
    ]),
  ]);

  const cachedHistData = [
    ...ctx.batchState.state.lbpPoolAllHistoricalData.values(),
  ].filter(
    (item) =>
      item.paraBlockHeight === blockNumber && allActivePools.has(item.id) // TODO check this condition item.paraBlockHeight === blockNumber
  );

  const persistedHistData = ctx.appConfig
    .ENSURE_PREFETCH_PERSISTENT_DATA_FOR_SPOT_PRICE
    ? await ctx.storeUtils.findWithLogs(
        LbppoolHistoricalData,
        {
          where: {
            // paraBlockHeight: LessThanOrEqual(blockNumber),
            paraBlockHeight: blockNumber,
            pool: {
              id: In([...allActivePools.keys()]),
            },
            ...(cachedHistData.length > 0
              ? { id: Not(In(cachedHistData.map((i) => i.id))) }
              : {}),
          },
          relations: {
            pool: true,
          },
        },
        {
          className: 'LbppoolHistoricalData',
          originCallFn: 'offline_trade_router_spot_price_calc_prefetch',
        }
      )
    : [];

  return new Map([
    ...persistedHistData.map((histData): [string, LbppoolHistoricalData] => [
      histData.pool.id,
      histData,
    ]),
    ...cachedHistData.map((histData): [string, LbppoolHistoricalData] => [
      histData.pool.id,
      histData,
    ]),
  ]);
}

export async function fetchLbpPoolsHistoricalDataForBlocksRangeResolver({
  blockFromNumber,
  blockToNumber,
  ctx,
}: {
  blockFromNumber: number;
  blockToNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  const allActivePoolsCached = [
    ...ctx.batchState.state.lbpAllBatchPools.values(),
  ].filter((item) => !item.isDestroyed);

  const allActivePoolsPersisted = ctx.appConfig
    .ENSURE_PREFETCH_PERSISTENT_DATA_FOR_SPOT_PRICE
    ? await ctx.storeUtils.findWithLogs(
        Lbppool,
        {
          where: {
            isDestroyed: false,
          },
          relations: {
          },
        },
        {
          className: 'Lbppool',
          originCallFn: 'offline_trade_router_spot_price_calc_prefetch',
        }
      )
    : [];

  const allActivePools = new Map<string, Lbppool>();
  for (const histData of allActivePoolsPersisted) {
    allActivePools.set(histData.id, histData);
  }
  for (const histData of allActivePoolsCached) {
    allActivePools.set(histData.id, histData);
  }

  const cachedHistData = [
    ...ctx.batchState.state.lbpPoolAllHistoricalData.values(),
  ].filter(
    (item) =>
      item.paraBlockHeight > blockFromNumber - 1 &&
      item.paraBlockHeight < blockToNumber + 1 &&
      allActivePools.has(item.id) // TODO check this condition item.paraBlockHeight === blockNumber
  );

  const persistedHistData = ctx.appConfig
    .ENSURE_PREFETCH_PERSISTENT_DATA_FOR_SPOT_PRICE
    ? await ctx.storeUtils.findWithLogs(
        LbppoolHistoricalData,
        {
          where: {
            paraBlockHeight: Between(blockFromNumber - 1, blockToNumber + 1),
            pool: {
              id: In([...allActivePools.keys()]),
            },
            ...(cachedHistData.length > 0
              ? { id: Not(In(cachedHistData.map((i) => i.id))) }
              : {}),
          },
          relations: {
            pool: true,
          },
        },
        {
          className: 'LbppoolHistoricalData',
          originCallFn: 'offline_trade_router_spot_price_calc_prefetch',
        }
      )
    : [];

  const mergedDataMap = new Map<string, LbppoolHistoricalData>();
  for (const histData of persistedHistData) {
    mergedDataMap.set(histData.id, histData);
  }
  for (const histData of cachedHistData) {
    mergedDataMap.set(histData.id, histData);
  }

  const histDataPerBlock = new Map<
    number,
    Map<string, LbppoolHistoricalData>
  >();

  for (const histDataItem of mergedDataMap.values()) {
    if (!histDataPerBlock.has(histDataItem.paraBlockHeight))
      histDataPerBlock.set(histDataItem.paraBlockHeight, new Map());

    histDataPerBlock
      .get(histDataItem.paraBlockHeight)!
      .set(histDataItem.pool.id, histDataItem);
  }

  return histDataPerBlock;
}

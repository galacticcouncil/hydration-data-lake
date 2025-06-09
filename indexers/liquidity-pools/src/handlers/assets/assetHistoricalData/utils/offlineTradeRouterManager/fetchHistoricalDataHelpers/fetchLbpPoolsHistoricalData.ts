import { SqdProcessorContext } from '../../../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  AssetHistoricalData,
  Lbppool,
  LbppoolHistoricalData,
} from '../../../../../../model';
import { In, Not } from 'typeorm';
import { fetchAssetsHistoricalDataForBlocksRange } from './fetchAssetsHistoricalData';
import { Between } from 'typeorm/find-options/operator/Between';

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

  const allActivePoolsPersisted = await ctx.store.find(Lbppool, {
    where: {
      isDestroyed: false,
    },
    relations: {
      account: true,
      assetA: true,
      assetB: true,
      owner: true,
      feeCollector: true,
    },
  });

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

  const persistedHistData = await ctx.store.find(LbppoolHistoricalData, {
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
      pool: { account: true },
      assetA: true,
      assetB: true,
      owner: true,
      feeCollector: true,
    },
  });

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

export async function fetchLbpPoolsHistoricalDataForBlocksRange({
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

  const allActivePoolsPersisted = await ctx.store.find(Lbppool, {
    where: {
      isDestroyed: false,
    },
    relations: {
      account: true,
      assetA: true,
      assetB: true,
      owner: true,
      feeCollector: true,
    },
  });

  // const allActivePools: Map<string, Lbppool> = new Map([
  //   ...allActivePoolsCached.map((pool): [string, Lbppool] => [pool.id, pool]),
  //   ...allActivePoolsPersisted.map((pool): [string, Lbppool] => [
  //     pool.id,
  //     pool,
  //   ]),
  // ]);

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

  const persistedHistData = await ctx.store.find(LbppoolHistoricalData, {
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
      pool: { account: true },
      assetA: true,
      assetB: true,
      owner: true,
      feeCollector: true,
    },
  });

  // const mergedDataMap = new Map([
  //   ...persistedHistData.map((histData): [string, LbppoolHistoricalData] => [
  //     histData.id,
  //     histData,
  //   ]),
  //   ...cachedHistData.map((histData): [string, LbppoolHistoricalData] => [
  //     histData.id,
  //     histData,
  //   ]),
  // ]);

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

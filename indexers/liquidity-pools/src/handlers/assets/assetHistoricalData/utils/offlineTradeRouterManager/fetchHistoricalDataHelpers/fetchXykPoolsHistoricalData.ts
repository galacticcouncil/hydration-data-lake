import { SqdProcessorContext } from '../../../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  LbppoolHistoricalData,
  Xykpool,
  XykpoolHistoricalData,
} from '../../../../../../model';
import { In, Not } from 'typeorm';
import { fetchLbpPoolsHistoricalDataForBlocksRange } from './fetchLbpPoolsHistoricalData';
import { Between } from 'typeorm/find-options/operator/Between';

export async function fetchXykPoolsHistoricalData({
  blockNumber,
  ctx,
}: {
  blockNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  // const allActivePoolsCached = [
  //   ...ctx.batchState.state.xykAllBatchPools.values(),
  // ].filter((item) => !item.isDestroyed);

  const allActivePoolsCached: Xykpool[] = [];
  for (const item of ctx.batchState.state.xykAllBatchPools.values()) {
    if (item.isDestroyed) continue;
    allActivePoolsCached.push(item);
  }

  const allActivePoolsPersisted = await ctx.storeUtils.findWithLogs(Xykpool, {
    where: {
      isDestroyed: false,
    },
    relations: {
      account: true,
      assetA: true,
      assetB: true,
      shareToken: true,
    },
  }, { className: 'Xykpool' });

  const allActivePools: Map<string, Xykpool> = new Map([
    ...allActivePoolsCached.map((pool): [string, Xykpool] => [pool.id, pool]),
    ...allActivePoolsPersisted.map((pool): [string, Xykpool] => [
      pool.id,
      pool,
    ]),
  ]);

  // const cachedHistData = [
  //   ...ctx.batchState.state.xykPoolAllHistoricalData.values(),
  // ].filter(
  //   (item) =>
  //     item.paraBlockHeight === blockNumber && allActivePools.has(item.id) // TODO check this condition item.paraBlockHeight === blockNumber
  // );
  const cachedHistData: XykpoolHistoricalData[] = [];
  for (const item of ctx.batchState.state.xykPoolAllHistoricalData.values()) {
    if (item.paraBlockHeight !== blockNumber) continue;
    if (!allActivePools.has(item.id)) continue;
    cachedHistData.push(item);
  }

  const persistedHistData = await ctx.storeUtils.findWithLogs(XykpoolHistoricalData, {
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
      pool: { account: true, shareToken: true },
      assetA: true,
      assetB: true,
    },
  }, { className: 'XykpoolHistoricalData' });

  return new Map([
    ...persistedHistData.map((histData): [string, XykpoolHistoricalData] => [
      histData.pool.id,
      histData,
    ]),
    ...cachedHistData.map((histData): [string, XykpoolHistoricalData] => [
      histData.pool.id,
      histData,
    ]),
  ]);
}

export async function fetchXykPoolsHistoricalDataForBlocksRange({
  blockFromNumber,
  blockToNumber,
  ctx,
}: {
  blockFromNumber: number;
  blockToNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  const allActivePoolsCached = [
    ...ctx.batchState.state.xykAllBatchPools.values(),
  ].filter((item) => !item.isDestroyed);

  const allActivePoolsPersisted = await ctx.storeUtils.findWithLogs(Xykpool, {
    where: {
      isDestroyed: false,
    },
    relations: {
      account: true,
      assetA: true,
      assetB: true,
      shareToken: true,
    },
  }, { className: 'Xykpool' });

  const allActivePools = new Map<string, Xykpool>();
  for (const histData of allActivePoolsCached) {
    allActivePools.set(histData.id, histData);
  }
  for (const histData of allActivePoolsPersisted) {
    allActivePools.set(histData.id, histData);
  }

  const cachedHistData = [
    ...ctx.batchState.state.xykPoolAllHistoricalData.values(),
  ].filter(
    (item) =>
      item.paraBlockHeight > blockFromNumber - 1 &&
      item.paraBlockHeight < blockToNumber + 1 &&
      allActivePools.has(item.id) // TODO check this condition item.paraBlockHeight === blockNumber
  );
  const persistedHistData = await ctx.storeUtils.findWithLogs(XykpoolHistoricalData, {
    where: {
      // paraBlockHeight: LessThanOrEqual(blockNumber),
      paraBlockHeight: Between(blockFromNumber - 1, blockToNumber + 1),
      pool: {
        id: In([...allActivePools.keys()]),
      },
      ...(cachedHistData.length > 0
        ? { id: Not(In(cachedHistData.map((i) => i.id))) }
        : {}),
    },
    relations: {
      pool: { account: true, shareToken: true },
      assetA: true,
      assetB: true,
    },
  }, { className: 'XykpoolHistoricalData' });

  const mergedDataMap = new Map<string, XykpoolHistoricalData>();

  for (const histData of persistedHistData) {
    mergedDataMap.set(histData.id, histData);
  }
  for (const histData of cachedHistData) {
    mergedDataMap.set(histData.id, histData);
  }

  const histDataPerBlock = new Map<
    number,
    Map<string, XykpoolHistoricalData>
  >();

  for (const histDataItem of [...mergedDataMap.values()]) {
    if (!histDataPerBlock.has(histDataItem.paraBlockHeight))
      histDataPerBlock.set(histDataItem.paraBlockHeight, new Map());

    histDataPerBlock
      .get(histDataItem.paraBlockHeight)!
      .set(histDataItem.pool.id, histDataItem);
  }

  return histDataPerBlock;
}

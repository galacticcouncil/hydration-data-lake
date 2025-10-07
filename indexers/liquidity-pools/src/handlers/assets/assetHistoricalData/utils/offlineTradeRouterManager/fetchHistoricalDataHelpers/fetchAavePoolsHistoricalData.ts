import { SqdProcessorContext } from '../../../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { Aavepool, AavepoolHistoricalData } from '../../../../../../model';
import { In, LessThanOrEqual, Not } from 'typeorm';
import { Between } from 'typeorm/find-options/operator/Between';

export async function fetchAavePoolsHistoricalData({
  blockNumber,
  ctx,
}: {
  blockNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  const allPoolsCached = [...ctx.batchState.state.aavePools.values()];

  const allPoolsPersisted = await ctx.storeUtils.findWithLogs(Aavepool, {
    where: {},
    relations: {
      reserveAsset: true,
      aToken: true,
    },
  }, { className: 'Aavepool' });

  const allPools: Map<string, Aavepool> = new Map([
    ...allPoolsCached.map((pool): [string, Aavepool] => [pool.id, pool]),
    ...allPoolsPersisted.map((pool): [string, Aavepool] => [pool.id, pool]),
  ]);

  const cachedHistData = [
    ...ctx.batchState.state.aavePoolsHistoricalData.values(),
  ].filter(
    (item) => item.paraBlockHeight === blockNumber && allPools.has(item.id) // TODO check this condition item.paraBlockHeight === blockNumber
  );
  const persistedHistData = await ctx.storeUtils.findWithLogs(AavepoolHistoricalData, {
    where: {
      // paraBlockHeight: LessThanOrEqual(blockNumber),
      paraBlockHeight: blockNumber,
      pool: {
        id: In([...allPools.keys()]),
      },
      ...(cachedHistData.length > 0
        ? { id: Not(In(cachedHistData.map((i) => i.id))) }
        : {}),
    },
    relations: {
      pool: { reserveAsset: true, aToken: true },
    },
  }, { className: 'AavepoolHistoricalData' });

  return new Map([
    ...persistedHistData.map((histData): [string, AavepoolHistoricalData] => [
      histData.pool.id,
      histData,
    ]),
    ...cachedHistData.map((histData): [string, AavepoolHistoricalData] => [
      histData.pool.id,
      histData,
    ]),
  ]);
}

export async function fetchAavePoolsHistoricalDataForBlocksRange({
  blockFromNumber,
  blockToNumber,
  ctx,
}: {
  blockFromNumber: number;
  blockToNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  const allPoolsCached = [...ctx.batchState.state.aavePools.values()];

  const allPoolsPersisted = await ctx.storeUtils.findWithLogs(Aavepool, {
    where: {},
    relations: {
      reserveAsset: true,
      aToken: true,
    },
  }, { className: 'Aavepool' });

  // const allPools: Map<string, Aavepool> = new Map([
  //   ...allPoolsCached.map((pool): [string, Aavepool] => [pool.id, pool]),
  //   ...allPoolsPersisted.map((pool): [string, Aavepool] => [pool.id, pool]),
  // ]);

  const allPools = new Map<string, Aavepool>();
  for (const histData of allPoolsPersisted) {
    allPools.set(histData.id, histData);
  }
  for (const histData of allPoolsCached) {
    allPools.set(histData.id, histData);
  }

  const cachedHistData = [
    ...ctx.batchState.state.aavePoolsHistoricalData.values(),
  ].filter(
    (item) =>
      item.paraBlockHeight > blockFromNumber - 1 &&
      item.paraBlockHeight < blockToNumber + 1 &&
      allPools.has(item.id) // TODO check this condition item.paraBlockHeight === blockNumber
  );
  const persistedHistData = await ctx.storeUtils.findWithLogs(AavepoolHistoricalData, {
    where: {
      paraBlockHeight: Between(blockFromNumber - 1, blockToNumber + 1),
      pool: {
        id: In([...allPools.keys()]),
      },
      ...(cachedHistData.length > 0
        ? { id: Not(In(cachedHistData.map((i) => i.id))) }
        : {}),
    },
    relations: {
      pool: { reserveAsset: true, aToken: true },
    },
  }, { className: 'AavepoolHistoricalData' });

  // const mergedDataMap = new Map([
  //   ...persistedHistData.map((histData): [string, AavepoolHistoricalData] => [
  //     histData.id,
  //     histData,
  //   ]),
  //   ...cachedHistData.map((histData): [string, AavepoolHistoricalData] => [
  //     histData.id,
  //     histData,
  //   ]),
  // ]);

  const mergedDataMap = new Map<string, AavepoolHistoricalData>();
  for (const histData of persistedHistData) {
    mergedDataMap.set(histData.id, histData);
  }
  for (const histData of cachedHistData) {
    mergedDataMap.set(histData.id, histData);
  }

  const histDataPerBlock = new Map<
    number,
    Map<string, AavepoolHistoricalData>
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

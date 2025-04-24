import { SqdProcessorContext } from '../../../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { Xykpool, XykpoolHistoricalData } from '../../../../../../model';
import { In, Not } from 'typeorm';

export async function fetchXykPoolsHistoricalData({
  blockNumber,
  ctx,
}: {
  blockNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  const allActivePoolsCached = [
    ...ctx.batchState.state.xykAllBatchPools.values(),
  ].filter((item) => !item.isDestroyed);

  const allActivePoolsPersisted = await ctx.store.find(Xykpool, {
    where: {
      isDestroyed: false,
    },
    relations: {
      account: true,
      assetA: true,
      assetB: true,
      shareToken: true,
    },
  });

  const allActivePools: Map<string, Xykpool> = new Map([
    ...allActivePoolsCached.map((pool): [string, Xykpool] => [pool.id, pool]),
    ...allActivePoolsPersisted.map((pool): [string, Xykpool] => [
      pool.id,
      pool,
    ]),
  ]);

  const cachedHistData = [
    ...ctx.batchState.state.xykPoolAllHistoricalData.values(),
  ].filter(
    (item) =>
      item.paraBlockHeight === blockNumber && allActivePools.has(item.id) // TODO check this condition item.paraBlockHeight === blockNumber
  );
  const persistedHistData = await ctx.store.find(XykpoolHistoricalData, {
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
    },
  });

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

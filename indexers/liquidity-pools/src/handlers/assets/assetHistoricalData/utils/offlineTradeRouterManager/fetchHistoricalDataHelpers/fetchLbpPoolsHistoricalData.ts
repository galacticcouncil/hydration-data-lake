import { SqdProcessorContext } from '../../../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { Lbppool, LbppoolHistoricalData } from '../../../../../../model';
import { In, Not } from 'typeorm';

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

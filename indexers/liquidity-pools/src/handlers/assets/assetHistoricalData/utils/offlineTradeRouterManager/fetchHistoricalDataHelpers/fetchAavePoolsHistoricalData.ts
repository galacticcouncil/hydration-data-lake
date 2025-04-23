import { SqdProcessorContext } from '../../../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { Aavepool, AavepoolHistoricalData } from '../../../../../../model';
import { In, Not } from 'typeorm';

export async function fetchAavePoolsHistoricalData({
  blockNumber,
  ctx,
}: {
  blockNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  const allPoolsCached = [...ctx.batchState.state.aavePools.values()];

  const allPoolsPersisted = await ctx.store.find(Aavepool, {
    where: {},
    relations: {
      reserveAsset: true,
      aToken: true,
    },
  });

  const allPools: Map<string, Aavepool> = new Map([
    ...allPoolsCached.map((pool): [string, Aavepool] => [pool.id, pool]),
    ...allPoolsPersisted.map((pool): [string, Aavepool] => [pool.id, pool]),
  ]);

  const cachedHistData = [
    ...ctx.batchState.state.aavePoolsHistoricalData.values(),
  ].filter(
    (item) => item.paraBlockHeight === blockNumber && allPools.has(item.id) // TODO check this condition item.paraBlockHeight === blockNumber
  );
  const persistedHistData = await ctx.store.find(AavepoolHistoricalData, {
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
  });

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

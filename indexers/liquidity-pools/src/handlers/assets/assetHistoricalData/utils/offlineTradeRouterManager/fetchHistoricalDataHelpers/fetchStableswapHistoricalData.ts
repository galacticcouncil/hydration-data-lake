import { SqdProcessorContext } from '../../../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  Stableswap,
  StableswapAsset,
  StableswapAssetHistoricalData,
  StableswapHistoricalData,
} from '../../../../../../model';
import { In, Not } from 'typeorm';

export async function fetchStableswapHistoricalData({
  blockNumber,
  ctx,
}: {
  blockNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  const allActiveStableswapsCachedMap = new Map(
    [...ctx.batchState.state.stableswapAllBatchPools.values()]
      .filter((item) => !item.isDestroyed)
      .map((item) => [item.id, item])
  );

  const allStableswapAssetsCached = [
    ...ctx.batchState.state.stableswapAssetsAllBatch.values(),
  ].filter((sAsset) => allActiveStableswapsCachedMap.has(sAsset.pool.id));

  const allActiveStableswapsPersisted = await ctx.store.find(Stableswap, {
    where: {
      isDestroyed: false,
    },
    relations: {
      account: true,
      shareToken: true,
      assets: {
        asset: true,
        pool: true,
      },
    },
  });

  const allStableswapAssetsPersisted = allActiveStableswapsPersisted
    .map((pool) => pool.assets)
    .flat();

  const allActiveStablewaps: Map<string, Stableswap> = new Map([
    ...allActiveStableswapsPersisted.map((pool): [string, Stableswap] => [
      pool.id,
      pool,
    ]),
    ...[...allActiveStableswapsCachedMap.values()].map(
      (pool): [string, Stableswap] => [pool.id, pool]
    ),
  ]);

  const allStablewapAssets: Map<string, StableswapAsset> = new Map([
    ...allStableswapAssetsPersisted.map((sAsset): [string, StableswapAsset] => [
      sAsset.id,
      sAsset,
    ]),
    ...allStableswapAssetsCached.map((sAsset): [string, StableswapAsset] => [
      sAsset.id,
      sAsset,
    ]),
  ]);

  const cachedStableswapHistData = [
    ...ctx.batchState.state.stablepoolAllHistoricalData.values(),
  ].filter(
    (histData) =>
      histData.paraBlockHeight === blockNumber &&
      allActiveStablewaps.has(histData.pool.id) // TODO check this condition item.paraBlockHeight === blockNumber
  );

  const cachedStableswapAssetsHistDataList = [
    ...ctx.batchState.state.stablepoolAssetsAllHistoricalData.values(),
  ].filter(
    (histData) =>
      histData.paraBlockHeight === blockNumber &&
      allStablewapAssets.has(histData.stableswapAsset.id) // TODO check this condition item.paraBlockHeight === blockNumber
  );

  const cachedStableswapAssetsHistDataByPoolMap = new Map<
    string,
    StableswapAssetHistoricalData[]
  >();

  for (const sAssetHistData of cachedStableswapAssetsHistDataList) {
    const poolId = sAssetHistData.id.split('-')[0];
    if (!cachedStableswapAssetsHistDataByPoolMap.has(poolId))
      cachedStableswapAssetsHistDataByPoolMap.set(poolId, []);
    cachedStableswapAssetsHistDataByPoolMap.get(poolId)!.push(sAssetHistData);
  }

  const persistedStableswapHistData = await ctx.store.find(
    StableswapHistoricalData,
    {
      where: {
        paraBlockHeight: blockNumber,
        pool: {
          id: In([...allActiveStablewaps.keys()]),
        },
        ...(cachedStableswapHistData.length > 0
          ? { id: Not(In(cachedStableswapHistData.map((i) => i.id))) }
          : {}),
      },
      relations: {
        pool: true,
        assetsHistoricalData: {
          asset: true,
          stableswapAsset: true,
        },
      },
    }
  );

  const persistedStableswapAssetsHistDataMap = new Map<
    string,
    StableswapAssetHistoricalData[]
  >(
    persistedStableswapHistData.map((poolHisData) => [
      poolHisData.pool.id,
      poolHisData.assetsHistoricalData,
    ])
  );

  const allStableswapHistDataMap = new Map<string, StableswapHistoricalData>([
    ...persistedStableswapHistData.map(
      (
        poolData: StableswapHistoricalData
      ): [string, StableswapHistoricalData] => [poolData.pool.id, poolData]
    ),
    ...cachedStableswapHistData.map(
      (
        poolData: StableswapHistoricalData
      ): [string, StableswapHistoricalData] => [poolData.pool.id, poolData]
    ),
  ]);

  allStableswapHistDataMap.forEach((poolData, poolId) => {
    poolData.assetsHistoricalData = [
      ...new Map([
        ...(persistedStableswapAssetsHistDataMap.get(poolId) || []).map(
          (sAssetHistData): [string, StableswapAssetHistoricalData] => [
            sAssetHistData.id,
            sAssetHistData,
          ]
        ),
        ...(cachedStableswapAssetsHistDataByPoolMap.get(poolId) || []).map(
          (sAssetHistData): [string, StableswapAssetHistoricalData] => [
            sAssetHistData.id,
            sAssetHistData,
          ]
        ),
      ]).values(),
    ];
  });

  return allStableswapHistDataMap;
}

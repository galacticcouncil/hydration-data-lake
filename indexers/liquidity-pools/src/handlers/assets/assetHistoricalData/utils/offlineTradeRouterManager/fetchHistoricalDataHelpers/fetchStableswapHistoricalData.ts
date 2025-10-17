import { SqdProcessorContext } from '../../../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  AssetHistoricalData,
  Stableswap,
  StableswapAsset,
  StableswapAssetHistoricalData,
  StableswapHistoricalData,
} from '../../../../../../model';
import { In, Not } from 'typeorm';
import { Between } from 'typeorm/find-options/operator/Between';

export async function fetchStableswapHistoricalData({
  blockNumber,
  ctx,
}: {
  blockNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  const allActiveStableswapsCachedMap = new Map(
    [...ctx.batchState.state.stableswapPools.values()]
      .filter((item) => !item.isDestroyed)
      .map((item) => [item.id, item])
  );

  const allStableswapAssetsCached = [
    ...ctx.batchState.state.stableswapAssets.values(),
  ].filter((sAsset) => allActiveStableswapsCachedMap.has(sAsset.pool.id));

  const allActiveStableswapsPersisted = ctx.appConfig
    .ENSURE_PREFETCH_PERSISTENT_DATA_FOR_SPOT_PRICE
    ? await ctx.storeUtils.findWithLogs(
        Stableswap,
        {
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
        },
        {
          className: 'Stableswap',
          originCallFn: 'offline_trade_router_spot_price_calc_prefetch',
        }
      )
    : [];

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

  const persistedStableswapHistData = ctx.appConfig
    .ENSURE_PREFETCH_PERSISTENT_DATA_FOR_SPOT_PRICE
    ? await ctx.storeUtils.findWithLogs(
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
            pool: { account: true, shareToken: true },
            assetsHistoricalData: {
              asset: true,
              stableswapAsset: true,
            },
          },
        },
        {
          className: 'StableswapHistoricalData',
          originCallFn: 'offline_trade_router_spot_price_calc_prefetch',
        }
      )
    : [];

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

export async function fetchStableswapHistoricalDataForBlocksRangeResolver({
  blockFromNumber,
  blockToNumber,
  ctx,
}: {
  blockFromNumber: number;
  blockToNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  const allActiveStableswapsCachedMap = new Map(
    [...ctx.batchState.state.stableswapPools.values()]
      .filter((item) => !item.isDestroyed)
      .map((item) => [item.id, item])
  );

  const allStableswapAssetsCached = [
    ...ctx.batchState.state.stableswapAssets.values(),
  ].filter((sAsset) => allActiveStableswapsCachedMap.has(sAsset.pool.id));

  const allActiveStableswapsPersisted = ctx.appConfig
    .ENSURE_PREFETCH_PERSISTENT_DATA_FOR_SPOT_PRICE
    ? await ctx.storeUtils.findWithLogs(
        Stableswap,
        {
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
        },
        {
          className: 'Stableswap',
          originCallFn: 'offline_trade_router_spot_price_calc_prefetch',
        }
      )
    : [];

  const allStableswapAssetsPersisted = allActiveStableswapsPersisted
    .map((pool) => pool.assets)
    .flat();

  const allActiveStablewaps = new Map<string, Stableswap>();
  for (const histData of allActiveStableswapsPersisted) {
    allActiveStablewaps.set(histData.id, histData);
  }
  for (const histData of allActiveStableswapsCachedMap.values()) {
    allActiveStablewaps.set(histData.id, histData);
  }

  const allStablewapAssets = new Map<string, StableswapAsset>();
  for (const histData of allStableswapAssetsPersisted) {
    allStablewapAssets.set(histData.id, histData);
  }
  for (const histData of allStableswapAssetsCached) {
    allStablewapAssets.set(histData.id, histData);
  }

  const cachedStableswapHistData = [
    ...ctx.batchState.state.stablepoolAllHistoricalData.values(),
  ].filter(
    (histData) =>
      histData.paraBlockHeight > blockFromNumber - 1 &&
      histData.paraBlockHeight < blockToNumber + 1 &&
      allActiveStablewaps.has(histData.pool.id) // TODO check this condition item.paraBlockHeight === blockNumber
  );

  const cachedStableswapAssetsHistDataList = [
    ...ctx.batchState.state.stablepoolAssetsAllHistoricalData.values(),
  ].filter(
    (histData) =>
      histData.paraBlockHeight > blockFromNumber - 1 &&
      histData.paraBlockHeight < blockToNumber + 1 &&
      allStablewapAssets.has(histData.stableswapAsset.id) // TODO check this condition item.paraBlockHeight === blockNumber
  );

  const cachedStableswapAssetsHistDataByPoolMap = new Map<
    number,
    Map<string, StableswapAssetHistoricalData[]>
  >();

  for (const sAssetHistData of cachedStableswapAssetsHistDataList) {
    const poolId = sAssetHistData.id.split('-')[0];
    if (
      !cachedStableswapAssetsHistDataByPoolMap.has(
        sAssetHistData.paraBlockHeight
      )
    )
      cachedStableswapAssetsHistDataByPoolMap.set(
        sAssetHistData.paraBlockHeight,
        new Map()
      );

    if (
      !cachedStableswapAssetsHistDataByPoolMap
        .get(sAssetHistData.paraBlockHeight)!
        .has(poolId)
    )
      cachedStableswapAssetsHistDataByPoolMap
        .get(sAssetHistData.paraBlockHeight)!
        .set(poolId, []);

    cachedStableswapAssetsHistDataByPoolMap
      .get(sAssetHistData.paraBlockHeight)!
      .get(poolId)!
      .push(sAssetHistData);
  }

  const persistedStableswapHistData = ctx.appConfig
    .ENSURE_PREFETCH_PERSISTENT_DATA_FOR_SPOT_PRICE
    ? await ctx.storeUtils.findWithLogs(
        StableswapHistoricalData,
        {
          where: {
            paraBlockHeight: Between(blockFromNumber - 1, blockToNumber + 1),
            pool: {
              id: In([...allActiveStablewaps.keys()]),
            },
            ...(cachedStableswapHistData.length > 0
              ? { id: Not(In(cachedStableswapHistData.map((i) => i.id))) }
              : {}),
          },
          relations: {
            pool: { account: true, shareToken: true },
            assetsHistoricalData: {
              asset: true,
              stableswapAsset: true,
            },
          },
        },
        {
          className: 'StableswapHistoricalData',
          originCallFn: 'offline_trade_router_spot_price_calc_prefetch',
        }
      )
    : [];

  const persistedStableswapAssetsHistDataMap = new Map<
    number,
    Map<string, StableswapAssetHistoricalData[]>
  >();

  for (const stableswapHistData of persistedStableswapHistData) {
    if (
      !persistedStableswapAssetsHistDataMap.has(
        stableswapHistData.paraBlockHeight
      )
    ) {
      persistedStableswapAssetsHistDataMap.set(
        stableswapHistData.paraBlockHeight,
        new Map()
      );
    }

    persistedStableswapAssetsHistDataMap
      .get(stableswapHistData.paraBlockHeight)!
      .set(stableswapHistData.pool.id, stableswapHistData.assetsHistoricalData);
  }

  const allStableswapHistDataMap = new Map<string, StableswapHistoricalData>();
  for (const histData of persistedStableswapHistData) {
    allStableswapHistDataMap.set(histData.id, histData);
  }
  for (const histData of cachedStableswapHistData) {
    allStableswapHistDataMap.set(histData.id, histData);
  }

  allStableswapHistDataMap.forEach((poolData, poolId) => {
    poolData.assetsHistoricalData = [
      ...new Map([
        ...(
          ((persistedStableswapAssetsHistDataMap.get(
            poolData.paraBlockHeight
          ) || new Map<string, StableswapHistoricalData>())!.get(
            poolData.pool.id
          ) || []) as StableswapAssetHistoricalData[]
        ).map((sAssetHistData): [string, StableswapAssetHistoricalData] => [
          sAssetHistData.id,
          sAssetHistData,
        ]),
        ...(
          ((cachedStableswapAssetsHistDataByPoolMap.get(
            poolData.paraBlockHeight
          ) || new Map())!.get(poolData.pool.id) ||
            []) as StableswapAssetHistoricalData[]
        ).map((sAssetHistData): [string, StableswapAssetHistoricalData] => [
          sAssetHistData.id,
          sAssetHistData,
        ]),
      ]).values(),
    ];
  });

  const histDataPerBlock = new Map<
    number,
    Map<string, StableswapHistoricalData>
  >();

  for (const histDataItem of [...allStableswapHistDataMap.values()]) {
    if (!histDataPerBlock.has(histDataItem.paraBlockHeight))
      histDataPerBlock.set(histDataItem.paraBlockHeight, new Map());

    histDataPerBlock
      .get(histDataItem.paraBlockHeight)!
      .set(histDataItem.pool.id, histDataItem);
  }

  return histDataPerBlock;
}

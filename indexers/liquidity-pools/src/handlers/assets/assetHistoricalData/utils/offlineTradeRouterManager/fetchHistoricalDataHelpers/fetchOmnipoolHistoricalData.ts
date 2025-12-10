import { Between } from 'typeorm/find-options/operator/Between';

import { Store } from '@subsquid/typeorm-store';

import {
  OmnipoolAsset,
  OmnipoolAssetHistoricalData,
  OmnipoolHistoricalData,
} from '../../../../../../model';
import { SqdProcessorContext } from '../../../../../../processor';

export async function fetchOmnipoolHistoricalData({
  blockNumber,
  ctx,
}: {
  blockNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  const allActiveOmnipoolAssetsCached = [
    ...ctx.batchState.state.omnipoolAssets.values(),
  ].filter((oAsset) => !oAsset.isRemoved);

  const allActiveOmnipoolAssetsPersisted = ctx.appConfig
    .ENSURE_PREFETCH_PERSISTENT_DATA_FOR_SPOT_PRICE
    ? await ctx.storeUtils.findWithLogs(
        OmnipoolAsset,
        {
          where: {
            isRemoved: false,
          },
        },
        {
          className: 'OmnipoolAsset',
          originCallFn: 'offline_trade_router_spot_price_calc_prefetch',
        }
      )
    : [];

  const allActiveOmnipoolAssets: Map<string, OmnipoolAsset> = new Map([
    ...allActiveOmnipoolAssetsPersisted.map(
      (oAsset): [string, OmnipoolAsset] => [oAsset.assetId, oAsset]
    ),
    ...allActiveOmnipoolAssetsCached.map((oAsset): [string, OmnipoolAsset] => [
      oAsset.assetId,
      oAsset,
    ]),
  ]);

  const cachedOmnipoolHistData = [
    ...ctx.batchState.state.omnipoolAllHistoricalData.values(),
  ].filter((histData) => histData.paraBlockHeight === blockNumber)[0];

  const cachedOmnipoolAssetsHistData = [
    ...ctx.batchState.state.omnipoolAssetAllHistoricalData.values(),
  ].filter(
    (histData) =>
      histData.paraBlockHeight === blockNumber &&
      allActiveOmnipoolAssets.has(histData.omnipoolAsset.id) // TODO check this condition item.paraBlockHeight === blockNumber
  );

  const persistedOmnipoolHistData = ctx.appConfig
    .ENSURE_PREFETCH_PERSISTENT_DATA_FOR_SPOT_PRICE
    ? await ctx.storeUtils.findOneWithLogs(
        OmnipoolHistoricalData,
        {
          where: {
            paraBlockHeight: blockNumber,
          },
          relations: {
            pool: true,
            assetsHistoricalData: {
              omnipoolAsset: true,
            },
          },
        },
        { className: 'OmnipoolHistoricalData' }
      )
    : null;

  // if (!persistedOmnipoolHistData) return null;

  const persistedOmnipoolAssetsHistData = !!persistedOmnipoolHistData
    ? [...persistedOmnipoolHistData.assetsHistoricalData]
    : [];

  const omnipoolHistData = cachedOmnipoolHistData ?? persistedOmnipoolHistData;

  omnipoolHistData.assetsHistoricalData = [
    ...new Map<string, OmnipoolAssetHistoricalData>([
      ...persistedOmnipoolAssetsHistData.map(
        (oAssetHistData): [string, OmnipoolAssetHistoricalData] => [
          oAssetHistData.id,
          oAssetHistData,
        ]
      ),
      ...cachedOmnipoolAssetsHistData.map(
        (oAssetHistData): [string, OmnipoolAssetHistoricalData] => [
          oAssetHistData.id,
          oAssetHistData,
        ]
      ),
    ]).values(),
  ];

  return omnipoolHistData;
}

export async function fetchOmnipoolHistoricalDataForBlocksRangeResolver({
  blockFromNumber,
  blockToNumber,
  ctx,
}: {
  blockFromNumber: number;
  blockToNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  const allActiveOmnipoolAssetsCached = [
    ...ctx.batchState.state.omnipoolAssets.values(),
  ].filter((oAsset) => !oAsset.isRemoved);

  const allActiveOmnipoolAssetsPersisted = ctx.appConfig
    .ENSURE_PREFETCH_PERSISTENT_DATA_FOR_SPOT_PRICE
    ? await ctx.storeUtils.findWithLogs(
        OmnipoolAsset,
        {
          where: {
            isRemoved: false,
          },
        },
        {
          className: 'OmnipoolAsset',
          originCallFn: 'offline_trade_router_spot_price_calc_prefetch',
        }
      )
    : [];

  const allActiveOmnipoolAssets = new Map<string, OmnipoolAsset>();
  for (const histData of allActiveOmnipoolAssetsPersisted) {
    allActiveOmnipoolAssets.set(histData.assetId, histData);
  }
  for (const histData of allActiveOmnipoolAssetsCached) {
    allActiveOmnipoolAssets.set(histData.assetId, histData);
  }

  const cachedOmnipoolHistData = [
    ...ctx.batchState.state.omnipoolAllHistoricalData.values(),
  ].filter(
    (item) =>
      item.paraBlockHeight > blockFromNumber - 1 &&
      item.paraBlockHeight < blockToNumber + 1
  );

  const cachedOmnipoolAssetsHistData = [
    ...ctx.batchState.state.omnipoolAssetAllHistoricalData.values(),
  ].filter(
    (item) =>
      item.paraBlockHeight > blockFromNumber - 1 &&
      item.paraBlockHeight < blockToNumber + 1 &&
      allActiveOmnipoolAssets.has(item.omnipoolAsset.id) // TODO check this condition item.paraBlockHeight === blockNumber
  );

  const persistedOmnipoolHistData = ctx.appConfig
    .ENSURE_PREFETCH_PERSISTENT_DATA_FOR_SPOT_PRICE
    ? await ctx.storeUtils.findWithLogs(
        OmnipoolHistoricalData,
        {
          where: {
            paraBlockHeight: Between(blockFromNumber - 1, blockToNumber + 1),
          },
          relations: {
            pool: true,
            assetsHistoricalData: {
              omnipoolAsset: true,
            },
          },
        },
        {
          className: 'OmnipoolHistoricalData',
          originCallFn: 'offline_trade_router_spot_price_calc_prefetch',
        }
      )
    : [];

  const mergedOmnipoolHistDataMap = new Map<string, OmnipoolHistoricalData>();
  for (const histData of persistedOmnipoolHistData) {
    mergedOmnipoolHistDataMap.set(histData.id, histData);
  }
  for (const histData of cachedOmnipoolHistData) {
    mergedOmnipoolHistDataMap.set(histData.id, histData);
  }

  const persistedOmnipoolAssetsHistData = persistedOmnipoolHistData
    .map((poolHisData) => poolHisData.assetsHistoricalData)
    .flat();

  const mergedOmnipoolAssetHistDataMap = new Map<
    string,
    OmnipoolAssetHistoricalData
  >();
  for (const histData of persistedOmnipoolAssetsHistData) {
    mergedOmnipoolAssetHistDataMap.set(histData.id, histData);
  }
  for (const histData of cachedOmnipoolAssetsHistData) {
    mergedOmnipoolAssetHistDataMap.set(histData.id, histData);
  }

  const histDataPerBlock = new Map<number, OmnipoolHistoricalData>();

  for (const histDataItem of [...mergedOmnipoolHistDataMap.values()]) {
    histDataItem.assetsHistoricalData = [
      ...mergedOmnipoolAssetHistDataMap.values(),
    ].filter((i) => i.paraBlockHeight === histDataItem.paraBlockHeight);
    histDataPerBlock.set(histDataItem.paraBlockHeight, histDataItem);
  }

  return histDataPerBlock;
}

import { SqdProcessorContext } from '../../../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  LbppoolHistoricalData,
  OmnipoolAsset,
  OmnipoolAssetHistoricalData,
  OmnipoolHistoricalData,
} from '../../../../../../model';
import { fetchLbpPoolsHistoricalDataForBlocksRange } from './fetchLbpPoolsHistoricalData';
import { Between } from 'typeorm/find-options/operator/Between';

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

  const allActiveOmnipoolAssetsPersisted = await ctx.store.find(OmnipoolAsset, {
    where: {
      isRemoved: false,
    },
    relations: {
      asset: true,
    },
  });

  const allActiveOmnipoolAssets: Map<string, OmnipoolAsset> = new Map([
    ...allActiveOmnipoolAssetsPersisted.map(
      (oAsset): [string, OmnipoolAsset] => [oAsset.asset.id, oAsset]
    ),
    ...allActiveOmnipoolAssetsCached.map((oAsset): [string, OmnipoolAsset] => [
      oAsset.asset.id,
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

  const persistedOmnipoolHistData = await ctx.store.findOne(
    OmnipoolHistoricalData,
    {
      where: {
        paraBlockHeight: blockNumber,
      },
      relations: {
        pool: { account: true },
        assetsHistoricalData: {
          omnipoolAsset: true,
          asset: true,
        },
      },
    }
  );

  if (!persistedOmnipoolHistData) return null;

  const persistedOmnipoolAssetsHistData = [
    ...persistedOmnipoolHistData.assetsHistoricalData,
  ];

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

export async function fetchOmnipoolHistoricalDataForBlocksRange({
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

  const allActiveOmnipoolAssetsPersisted = await ctx.store.find(OmnipoolAsset, {
    where: {
      isRemoved: false,
    },
    relations: {
      asset: true,
    },
  });

  // const allActiveOmnipoolAssets: Map<string, OmnipoolAsset> = new Map([
  //   ...allActiveOmnipoolAssetsPersisted.map(
  //     (oAsset): [string, OmnipoolAsset] => [oAsset.asset.id, oAsset]
  //   ),
  //   ...allActiveOmnipoolAssetsCached.map((oAsset): [string, OmnipoolAsset] => [
  //     oAsset.asset.id,
  //     oAsset,
  //   ]),
  // ]);

  const allActiveOmnipoolAssets = new Map<string, OmnipoolAsset>();
  for (const histData of allActiveOmnipoolAssetsPersisted) {
    allActiveOmnipoolAssets.set(histData.asset.id, histData);
  }
  for (const histData of allActiveOmnipoolAssetsCached) {
    allActiveOmnipoolAssets.set(histData.asset.id, histData);
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

  const persistedOmnipoolHistData = await ctx.store.find(
    OmnipoolHistoricalData,
    {
      where: {
        paraBlockHeight: Between(blockFromNumber - 1, blockToNumber + 1),
      },
      relations: {
        pool: { account: true },
        assetsHistoricalData: {
          omnipoolAsset: true,
          asset: true,
        },
      },
    }
  );

  // const mergedOmnipoolHistDataMap = new Map([
  //   ...persistedOmnipoolHistData.map(
  //     (histData): [string, OmnipoolHistoricalData] => [histData.id, histData]
  //   ),
  //   ...cachedOmnipoolHistData.map(
  //     (histData): [string, OmnipoolHistoricalData] => [histData.id, histData]
  //   ),
  // ]);

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

  // const mergedOmnipoolAssetHistDataMap = new Map([
  //   ...persistedOmnipoolAssetsHistData.map(
  //     (histData): [string, OmnipoolAssetHistoricalData] => [
  //       histData.id,
  //       histData,
  //     ]
  //   ),
  //   ...cachedOmnipoolAssetsHistData.map(
  //     (histData): [string, OmnipoolAssetHistoricalData] => [
  //       histData.id,
  //       histData,
  //     ]
  //   ),
  // ]);

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

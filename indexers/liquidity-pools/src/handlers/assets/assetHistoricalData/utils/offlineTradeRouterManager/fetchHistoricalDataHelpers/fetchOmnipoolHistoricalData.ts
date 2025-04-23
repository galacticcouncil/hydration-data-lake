import { SqdProcessorContext } from '../../../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  OmnipoolAsset,
  OmnipoolAssetHistoricalData,
  OmnipoolHistoricalData,
} from '../../../../../../model';

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
        hdxAsset: true,
        hubAsset: true,
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

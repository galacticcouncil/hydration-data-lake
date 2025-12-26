import {
  XykpoolHistoricalData,
  XykpoolHistoricalDataLatest,
} from '../../../../model';

export function getXykpoolsHistDataLatest({
  histDataList,
}: {
  histDataList: XykpoolHistoricalData[];
}) {
  const indexedData: Map<string, XykpoolHistoricalData> = new Map();

  for (const data of histDataList) {
    const itemId = `${data.pool.id}`;
    const indexedValue = indexedData.get(itemId);

    if (indexedValue && indexedValue.paraBlockHeight >= data.paraBlockHeight)
      continue;

    indexedData.set(itemId, data);
  }

  const latestHistDataEntities = [];

  for (const [poolId, data] of indexedData.entries()) {
    latestHistDataEntities.push(
      new XykpoolHistoricalDataLatest({
        id: poolId,
        pool: data.pool,
        assetAId: data.assetAId,
        assetBId: data.assetBId,
        assetABalance: data.assetABalance,
        assetBBalance: data.assetBBalance,
        tvlInRefAssetNorm: data.tvlInRefAssetNorm,
        paraBlockHeight: data.paraBlockHeight,
      })
    );
  }
  return latestHistDataEntities;
}

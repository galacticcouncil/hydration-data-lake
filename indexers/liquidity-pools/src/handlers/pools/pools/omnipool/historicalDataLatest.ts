import {
  OmnipoolAssetHistoricalData,
  OmnipoolAssetHistoricalDataLatest,
} from '../../../../model';

export function getOmnipoolAssetsHistDataLatest({
  histDataList,
}: {
  histDataList: OmnipoolAssetHistoricalData[];
}) {
  const indexedData: Map<string, OmnipoolAssetHistoricalData> = new Map();

  for (const data of histDataList) {
    const itemId = `${data.omnipoolAsset.id}`;
    const indexedValue = indexedData.get(itemId);

    if (indexedValue && indexedValue.paraBlockHeight >= data.paraBlockHeight)
      continue;

    indexedData.set(itemId, data);
  }

  const latestHistDataEntities = [];

  for (const [id, data] of indexedData.entries()) {
    latestHistDataEntities.push(
      new OmnipoolAssetHistoricalDataLatest({
        id,

        poolHistoricalDataId: data.poolHistoricalData.id,
        omnipoolAssetId: data.omnipoolAsset.id,
        assetId: data.assetId,

        assetCap: data.assetCap,
        assetShares: data.assetShares,
        assetHubReserve: data.assetHubReserve,
        assetProtocolShares: data.assetProtocolShares,
        freeBalance: data.freeBalance,
        tradable: data.tradable,
        tvlInRefAssetNorm: data.tvlInRefAssetNorm,

        paraBlockHeight: data.paraBlockHeight,
      })
    );
  }
  return latestHistDataEntities;
}

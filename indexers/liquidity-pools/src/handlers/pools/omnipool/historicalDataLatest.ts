import {
  OmnipoolAssetHistoricalData,
  OmnipoolAssetHistoricalDataLatest,
} from '../../../model';

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

        omnipoolAssetId: data.omnipoolAsset.id,
        assetId: data.asset.id,

        assetCap: data.assetCap,
        assetShares: data.assetShares,
        assetHubReserve: data.assetHubReserve,
        assetProtocolShares: data.assetProtocolShares,
        freeBalance: data.freeBalance,

        paraBlockHeight: data.paraBlockHeight,
        blockId: data.block.id,
      })
    );
  }
  return latestHistDataEntities;
}

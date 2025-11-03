import {
  OmnipoolAssetHistoricalData,
  OmnipoolAssetHistoricalDataLatest,
  StableswapAssetHistoricalData,
  StableswapAssetHistoricalDataLatest,
} from '../../../model';

export function getStableswapAssetsHistDataLatest({
  histDataList,
}: {
  histDataList: StableswapAssetHistoricalData[];
}) {
  const indexedData: Map<string, StableswapAssetHistoricalData> = new Map();

  for (const data of histDataList) {
    const itemId = `${data.poolHistoricalData.pool.id}-${data.asset.id}`;
    const indexedValue = indexedData.get(itemId);

    if (indexedValue && indexedValue.paraBlockHeight >= data.paraBlockHeight)
      continue;

    indexedData.set(itemId, data);
  }

  const latestHistDataEntities = [];

  for (const [id, data] of indexedData.entries()) {
    latestHistDataEntities.push(
      new StableswapAssetHistoricalDataLatest({
        id,

        assetId: data.asset.id,
        poolId: data.poolHistoricalData.pool.id,
        stableswapAssetId: id,
        poolHistoricalDataId: data.poolHistoricalData.id,
        freeBalance: data.freeBalance,

        paraBlockHeight: data.paraBlockHeight,
        blockId: data.block.id,
      })
    );
  }
  return latestHistDataEntities;
}

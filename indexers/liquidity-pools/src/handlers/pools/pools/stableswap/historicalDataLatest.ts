import {
  StableswapAssetHistoricalData,
  StableswapAssetHistoricalDataLatest,
} from '../../../../model';

export function getStableswapAssetsHistDataLatest({
  histDataList,
}: {
  histDataList: StableswapAssetHistoricalData[];
}) {
  const indexedData: Map<string, StableswapAssetHistoricalData> = new Map();

  for (const data of histDataList) {
    const itemId = `${data.stableswapAsset.id}`;
    const indexedValue = indexedData.get(itemId);

    if (indexedValue && indexedValue.paraBlockHeight >= data.paraBlockHeight)
      continue;

    indexedData.set(itemId, data);
  }

  const latestHistDataEntities = [];

  for (const [id, data] of indexedData.entries()) {
    // Extract poolId from the ID format: <poolId>-<assetId>-<blockHeight>
    const poolId = id.split('-')[0];
    // Construct pool historical data ID: <poolId>-<blockHeight>
    const poolHistoricalDataId = `${poolId}-${data.paraBlockHeight}`;

    latestHistDataEntities.push(
      new StableswapAssetHistoricalDataLatest({
        id,

        assetId: data.assetId,
        poolId,
        stableswapAssetId: data.stableswapAsset.id,
        poolHistoricalDataId,
        freeBalance: data.freeBalance,
        tradable: data.tradable,
        tvlInRefAssetNorm: data.tvlInRefAssetNorm,

        paraBlockHeight: data.paraBlockHeight,
      })
    );
  }
  return latestHistDataEntities;
}

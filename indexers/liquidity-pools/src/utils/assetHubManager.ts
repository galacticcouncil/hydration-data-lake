import { AssetMultiLocation } from '../model';
import { AssetHubRpcManager } from './rpcCliens/assetHubRpcManager';

export type AssetHubAssetMetadata = {
  id: number;
  decimals: number;
  symbol: string;
  name: string;
};

export class AssetHubManager {
  private static instance: AssetHubManager;

  private assetMetadataCache: Map<number, AssetHubAssetMetadata> = new Map();

  static getInstance(): AssetHubManager {
    if (!AssetHubManager.instance) {
      AssetHubManager.instance = new AssetHubManager();
    }
    return AssetHubManager.instance;
  }

  async prefetchAllAssetsMetadata() {
    const allAssetsMetadataEntries =
      await AssetHubRpcManager.getInstance().getAllAssetsMetadata();

    if (!allAssetsMetadataEntries) return;

    for (const assetMetadataEntry of allAssetsMetadataEntries) {
      this.assetMetadataCache.set(assetMetadataEntry.id, assetMetadataEntry);
    }
  }

  async getExternalAssetDataFromAssetHub({
    assetMultilocation,
    withCache = true,
  }: {
    assetMultilocation: AssetMultiLocation;
    withCache?: boolean;
  }) {
    if (
      assetMultilocation.hierarchyLevel !== 'X3' ||
      (assetMultilocation.hierarchyLevel === 'X3' &&
        assetMultilocation.interior[0].kind !== 'Parachain') ||
      (assetMultilocation.hierarchyLevel === 'X3' &&
        assetMultilocation.interior[0].kind === 'Parachain' &&
        `${assetMultilocation.interior[0].value}` !== '1000')
    )
      return null;

    const assetHubAssetId = assetMultilocation.interior[2].value;

    if (!assetHubAssetId) return null;

    if (withCache && this.assetMetadataCache.has(+assetHubAssetId)) {
      return this.assetMetadataCache.get(+assetHubAssetId);
    }

    const assetHubAssetData =
      await AssetHubRpcManager.getInstance().getAssetMetadata({
        assetId: +assetHubAssetId,
      });

    if (assetHubAssetData)
      this.assetMetadataCache.set(+assetHubAssetId, assetHubAssetData);

    return assetHubAssetData;
  }
}

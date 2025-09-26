import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  getNewAssetMultiLocationFromStorageData,
  prefetchAllAssets,
} from '../../../handlers/assets/utils';
import { AssetRegistryAssetLocation } from '../../../parsers/types/events';
import parsers from '../../../parsers';
import { AssetHubManager } from '../../../utils/assetHubManager';
import { AssetType } from '../../../model';
import pMap from 'p-map';

export async function updateAssetsOnPostAggregationMode(
  ctx: SqdProcessorContext<Store>
) {
  console.log('updateAssetsOnPostAggregationMode :: START');
  await prefetchAllAssets(ctx);

  const processingBlockHeader = ctx.blocks[0].header;

  const allAssetRegistryIds = Array.from(
    ctx.batchState.state.assetsAll.values()
  )
    .map((a) => (a.assetRegistryId ? +a.assetRegistryId : null))
    .filter((a) => a !== null);

  console.time(`getAssetLocationsMany`);
  const allAssetsStorageMultiLocationsMap: Map<
    number,
    AssetRegistryAssetLocation | null
  > = new Map(
    (
      (await parsers.storage.assetRegistry.getAssetLocationsMany({
        assetIds: allAssetRegistryIds,
        block: processingBlockHeader,
      })) || []
    ).map((assetData) => [assetData.assetId, assetData.location])
  );
  console.timeEnd(`getAssetLocationsMany`);

  console.time(`prefetchAllAssetsMetadata`);
  await AssetHubManager.getInstance().prefetchAllAssetsMetadata();
  console.timeEnd(`prefetchAllAssetsMetadata`);

  for (const asset of ctx.batchState.state.assetsAll.values()) {
    if (!asset.assetRegistryId) continue;

    const assetMultiLocationFromStorage =
      await getNewAssetMultiLocationFromStorageData({
        blockHeader: processingBlockHeader,
        assetRegistryId: asset.assetRegistryId,
        storageMultilocation: allAssetsStorageMultiLocationsMap.get(
          +asset.assetRegistryId
        ),
      });

    if (!assetMultiLocationFromStorage) continue;

    let externalAssetMetadata = null;

    if (
      assetMultiLocationFromStorage &&
      asset.assetType === AssetType.External
    ) {
      externalAssetMetadata =
        await AssetHubManager.getInstance().getExternalAssetDataFromAssetHub({
          assetMultilocation: assetMultiLocationFromStorage,
        });
    }

    asset.multiLocations = [assetMultiLocationFromStorage];

    if (externalAssetMetadata && asset.assetType === AssetType.External) {
      asset.name = externalAssetMetadata.name ?? null;
      asset.decimals = externalAssetMetadata.decimals ?? null;
      asset.symbol = externalAssetMetadata.symbol ?? null;
    }

    ctx.batchState.state.assetsAll.set(asset.id, asset);
    console.log(`Asset ${asset.assetRegistryId} has been processed.`);
  }

  await ctx.store.upsert(Array.from(ctx.batchState.state.assetsAll.values()));
}

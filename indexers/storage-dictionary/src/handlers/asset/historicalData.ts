import { Block, ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  Asset,
  AssetDynamicFee,
  AssetHistoricalData,
} from '../../model';
import parsers from '../../parsers';
import { AssetDetails, AssetDetailsWithId } from '../../parsers/types/storage';
import { getOrCreateAsset } from './assetRegistry';

export async function handleAssetsStorage(
  ctx: ProcessorContext<Store>,
  currentBlockHeader: Block
): Promise<void> {
  const storageDataAllAssetsMap = new Map(
    (
      await parsers.storage.assetRegistry.getAssetsAll(
        ctx.blocks[ctx.blocks.length - 1].header
      )
    )
      .filter((res) => !!res.data)
      .map((res): [string, AssetDetailsWithId] => [`${res.assetId}`, res])
  );

  const allExistingAssets = new Map<string, Asset>();

  for (const assetStorageData of [...storageDataAllAssetsMap.values()]) {
    const asset = await getOrCreateAsset({
      id: assetStorageData.assetId,
      ctx,
      ensure: true,
      blockHeader: currentBlockHeader,
    });
    if (!asset) continue;
    allExistingAssets.set(asset.id, asset);
  }

  const totalIssuancePerAssetMap = new Map(
    (
      await parsers.storage.tokens.getManyTokensTotalIssuance({
        block: currentBlockHeader,
        tokenIds: [...allExistingAssets.keys()],
      })
    )
      .filter((res) => res.amount !== null)
      .map((res) => [res.tokenId, res.amount])
  );

  totalIssuancePerAssetMap.set(
    '0',
    await parsers.storage.balances.getTotalIssuance(currentBlockHeader)
  );

  /**
   * We need this fallback because some assets are not present in
   * tokens.totalIssuance storage.
   */
  for (const assetId of [...allExistingAssets.keys()]) {
    if (!totalIssuancePerAssetMap.has(assetId))
      totalIssuancePerAssetMap.set(`${assetId}`, 0n);
  }

  const dynamicFeePerAssetMap = new Map(
    (
      await parsers.storage.dynamicFees.getAssetFeesAll({
        block: currentBlockHeader,
      })
    ).map((res) => [`${res.assetId}`, res])
  );

  const allAssetHistoricalData = [];

  for (const asset of [...allExistingAssets.values()]) {
    if (
      !totalIssuancePerAssetMap.has(asset.id) ||
      !storageDataAllAssetsMap.has(asset.id)
    ) {
      console.log(
        'processAssetsHistoricalDataAtBlock :: assetRegistryId - ',
        asset.id,
        totalIssuancePerAssetMap.has(asset.id),
        storageDataAllAssetsMap.has(asset.id)
      );
      continue;
    }

    const assetDynamicFee = dynamicFeePerAssetMap.get(asset.id);

    const newAssetHistoricalData = new AssetHistoricalData({
      id: `${asset.id}-${currentBlockHeader.height}`,
      asset,

      totalIssuance: totalIssuancePerAssetMap.get(asset.id)!,
      existentialDeposit: storageDataAllAssetsMap.get(asset.id)!.data!
        .existentialDeposit,
      dynamicFee: assetDynamicFee
        ? new AssetDynamicFee({
            assetFee: assetDynamicFee.assetFee,
            protocolFee: assetDynamicFee.protocolFee,
            timestamp: assetDynamicFee.timestamp,
          })
        : null,
      paraBlockHeight: currentBlockHeader.height,
      relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
        currentBlockHeader.height
      ).height,
    });

    allAssetHistoricalData.push(newAssetHistoricalData);
  }

  ctx.store.upsert(allAssetHistoricalData);
}

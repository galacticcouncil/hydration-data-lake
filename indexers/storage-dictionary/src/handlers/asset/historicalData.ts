import { Block, ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  Aavepool,
  Asset,
  AssetHistoricalData,
  DataStructureTypeName,
} from '../../model';
import parsers from '../../parsers';
import { AssetDetails, AssetDetailsWithId } from '../../parsers/types/storage';
import { getOrCreateAsset } from './assetRegistry';
import { Between } from 'typeorm/find-options/operator/Between';
import { MinifiedDataStructuresManager } from '../../utils/minifiedDataStructuresManager';

export async function handleAssetsStorage(
  ctx: ProcessorContext<Store>,
  currentBlockHeader: Block
): Promise<void> {
  if (
    ctx.batchState.state.assetHistoricalDataProcessedBlocks.has(
      currentBlockHeader.height
    )
  )
    return;

  const storageDataAllAssetsMap = new Map(
    (await parsers.storage.assetRegistry.getAssetsAll(currentBlockHeader))
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
      continue;
    }

    const assetDynamicFee = dynamicFeePerAssetMap.get(asset.id);

    const newAssetHistoricalData = new AssetHistoricalData({
      id: `${asset.id}-${currentBlockHeader.height}`,
      asset,

      totalIssuance: totalIssuancePerAssetMap.get(asset.id)?.toString(),
      existentialDeposit: storageDataAllAssetsMap
        .get(asset.id)!
        .data!.existentialDeposit.toString(),
      dynamicFee: assetDynamicFee
        ? MinifiedDataStructuresManager.getMinifiedDataStructure(
            assetDynamicFee,
            DataStructureTypeName.AssetDynamicFee
          )
        : null,
      paraBlockHeight: currentBlockHeader.height,
    });
    ctx.batchState.state.assetHistoricalDataItems.set(
      newAssetHistoricalData.id,
      newAssetHistoricalData
    );
    allAssetHistoricalData.push(newAssetHistoricalData);
  }

  if (!ctx.appConfig.PERSIST_HIST_DATA_ONLY_ON_CHANGE)
    await ctx.store.upsert(allAssetHistoricalData);
}

export async function prefetchAllAssetHistDataRecordsForBlocksRangeToEnsureMissedBlocks(
  ctx: ProcessorContext<Store>,
  orderedBlockNumbers: number[]
) {
  if (
    !ctx.appConfig.PROCESS_ONLY_MISSED_BLOCKS ||
    !ctx.appConfig.PROCESS_GENERIC_HIST_DATA
  )
    return;

  const records = await ctx.store.find(AssetHistoricalData, {
    where: {
      paraBlockHeight: Between(
        orderedBlockNumbers[0],
        orderedBlockNumbers[orderedBlockNumbers.length - 1]
      ),
    },
    relations: { asset: true },
  });

  ctx.batchState.state.assetHistoricalDataItems = new Map(
    records.map((r) => [r.id, r])
  );
  ctx.batchState.state.assetHistoricalDataProcessedBlocks = new Set(
    records.map((r) => r.paraBlockHeight)
  );
  console.log(
    `AssetHistoricalData :: Blocks range: ${orderedBlockNumbers[0]}/${orderedBlockNumbers[orderedBlockNumbers.length - 1]}. 
    Number of missed blocks: ${orderedBlockNumbers.filter((b) => !ctx.batchState.state.assetHistoricalDataProcessedBlocks.has(b)).length}/${orderedBlockNumbers.length}`
  );
}

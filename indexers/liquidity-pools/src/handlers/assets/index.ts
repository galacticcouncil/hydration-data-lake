import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { Asset, AssetVolumeHistoricalData } from '../../model';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { getOrderedListByBlockNumber } from '../../utils/helpers';
import { EventName } from '../../parsers/types/events';
import { In } from 'typeorm';
import {
  assetLocationSet,
  assetRegistered,
  assetUpdated,
} from './assetRegistry';

export async function handleAssetRegistry(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents
      .getSectionByEventName(EventName.AssetRegistry_Registered)
      .values(),
  ])) {
    await assetRegistered(ctx, eventData, parsedEvents);
  }

  const updatedAssetsList = [
    ...parsedEvents
      .getSectionByEventName(EventName.AssetRegistry_Updated)
      .values(),
  ];

  if (updatedAssetsList.length > 0) {
    const assetsAllBatch = ctx.batchState.state.assetsAll;
    const existingAssets = await ctx.storeUtils.findWithLogs(
      Asset,
      {
        where: {
          id: In(
            updatedAssetsList.map((asset) => asset.eventData.params.assetId)
          ),
        },
      },
      { className: 'Asset' }
    );

    existingAssets.forEach((asset) => assetsAllBatch.set(asset.id, asset));
  }

  for (const eventData of getOrderedListByBlockNumber(updatedAssetsList)) {
    await assetUpdated(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents
      .getSectionByEventName(EventName.AssetRegistry_LocationSet)
      .values(),
  ])) {
    await assetLocationSet(ctx, eventData);
  }

  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.assetsAll.values()).filter((asset) =>
      ctx.batchState.state.assetIdsToSave.has(asset.id)
    )
  );
  ctx.batchState.state.assetIdsToSave = new Set();
}

export function initAssetVolume({
  ctx,
  asset,
  totalVolumeIn,
  totalVolumeOut,
  volumeOut,
  volumeIn,
  paraBlockHeight,
  relayBlockHeight,
  totalVolumeInNorm = '0',
  totalVolumeOutNorm = '0',
}: {
  ctx: SqdProcessorContext<Store>;
  asset: Asset;
  paraBlockHeight: number;
  relayBlockHeight: number;
  volumeIn: bigint;
  volumeOut: bigint;
  totalVolumeIn: bigint;
  totalVolumeOut: bigint;
  totalVolumeInNorm?: string;
  totalVolumeOutNorm?: string;
}) {
  const block = ctx.batchState.getParaBlockFromCacheByHeight(paraBlockHeight);
  if (!block) {
    throw new Error(`Block not found in cache for height ${paraBlockHeight}`);
  }

  return new AssetVolumeHistoricalData({
    id: asset.id + '-' + paraBlockHeight,
    asset,
    volumeIn,
    volumeOut,
    totalVolumeIn,
    totalVolumeOut,
    relayBlockHeight,
    paraBlockHeight,
    totalVolumeInNorm,
    totalVolumeOutNorm,
    blockId: block.id,
  });
}

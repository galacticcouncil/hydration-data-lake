import { In } from 'typeorm';

import { Store } from '@subsquid/typeorm-store';

import {
  Asset,
  AssetVolumeHistoricalData,
} from '../../model';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { EventName } from '../../parsers/types/events';
import { SqdProcessorContext } from '../../processor';
import { getOrderedListByBlockNumber } from '../../utils/helpers';
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
      { className: 'Asset', originCallFn: 'handleAssetRegistry' }
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
  assetId,
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
  assetId: string;
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
    id: assetId + '-' + paraBlockHeight,
    assetId: assetId,
    volumeIn,
    volumeOut,
    totalVolumeIn,
    totalVolumeOut,
    paraBlockHeight,
    totalVolumeInNorm,
    totalVolumeOutNorm,
  });
}

import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { Asset, HistoricalAssetVolume } from '../../model';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { getOrderedListByBlockNumber } from '../../utils/helpers';
import { EventName } from '../../parsers/types/events';
import { assetRegistered, assetUpdated } from './assetRegistry';
import { In } from 'typeorm';

export async function handleAssetRegistry(
  ctx: ProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents
      .getSectionByEventName(EventName.AssetRegistry_Registered)
      .values(),
  ])) {
    await assetRegistered(ctx, eventData);
  }

  const updatedAssetsList = [
    ...parsedEvents
      .getSectionByEventName(EventName.AssetRegistry_Updated)
      .values(),
  ];

  if (updatedAssetsList.length > 0) {
    const assetsAllBatch = ctx.batchState.state.assetsAllBatch;
    const existingAssets = await ctx.store.find(Asset, {
      where: {
        id: In(
          updatedAssetsList.map((asset) => asset.eventData.params.assetId)
        ),
      },
    });

    existingAssets.forEach((asset) => assetsAllBatch.set(asset.id, asset));
    ctx.batchState.state = {
      assetsAllBatch
    }
  }

  for (const eventData of getOrderedListByBlockNumber(updatedAssetsList)) {
    await assetUpdated(ctx, eventData);
  }

  await ctx.store.save(
    [...ctx.batchState.state.assetsAllBatch.values()].filter((asset) =>
      ctx.batchState.state.assetIdsToSave.has(asset.id)
    )
  );
  ctx.batchState.state = { assetIdsToSave: new Set() };
}

export function initAssetVolume(
  asset: Asset,
  paraChainBlockHeight: number,
  relayChainBlockHeight: number,
  volumeIn: bigint,
  volumeOut: bigint,
  totalVolumeIn: bigint,
  totalVolumeOut: bigint
) {
  return new HistoricalAssetVolume({
    id: asset.id + '-' + paraChainBlockHeight,
    asset,
    volumeIn,
    volumeOut,
    totalVolumeIn,
    totalVolumeOut,
    relayChainBlockHeight,
    paraChainBlockHeight,
  });
}

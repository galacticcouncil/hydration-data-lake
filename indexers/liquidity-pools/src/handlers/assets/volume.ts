import { Asset, AssetVolumeHistoricalData } from '../../model';
import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { initAssetVolume } from './index';

export async function handleAssetVolumeUpdates(
  ctx: SqdProcessorContext<Store>,
  swapDetails: {
    paraBlockHeight: number;
    relayBlockHeight: number;
    assetIn: Asset;
    assetOut: Asset;
    assetInAmount: bigint;
    assetOutAmount: bigint;
  }
) {
  const assetVolumesState = ctx.batchState.state.assetVolumes;

  // Find current block volume
  const currentAssetInVolume = assetVolumesState.get(
    swapDetails.assetIn.id + '-' + swapDetails.paraBlockHeight
  );
  const currentAssetOutVolume = assetVolumesState.get(
    swapDetails.assetOut.id + '-' + swapDetails.paraBlockHeight
  );

  // If not found find last volume in cache
  const cachedVolumeIn = ctx.batchState.getPreviousHistDataEntity({
    entitiesMap: ctx.batchState.state.assetVolumes,
    entityId: swapDetails.assetIn.id,
    currentBlockHeight: swapDetails.paraBlockHeight,
    blockHeightValPosition: 1,
  });
  const cachedVolumeOut = ctx.batchState.getPreviousHistDataEntity({
    entitiesMap: ctx.batchState.state.assetVolumes,
    entityId: swapDetails.assetOut.id,
    currentBlockHeight: swapDetails.paraBlockHeight,
    blockHeightValPosition: 1,
  });

  // Last known volume for total volume
  const oldAssetInVolume =
    currentAssetInVolume ||
    cachedVolumeIn ||
    (await ctx.storeUtils.findOneWithLogs(
      AssetVolumeHistoricalData,
      {
        where: {
          asset: { id: swapDetails.assetIn.id },
        },
        relations: { asset: true },
        order: {
          paraBlockHeight: 'DESC',
        },
      },
      { className: 'AssetVolumeHistoricalData' }
    ));

  // Last known volume for total volume
  const oldAssetOutVolume =
    currentAssetOutVolume ||
    cachedVolumeOut ||
    (await ctx.storeUtils.findOneWithLogs(
      AssetVolumeHistoricalData,
      {
        where: {
          asset: { id: swapDetails.assetOut.id },
        },
        relations: { asset: true },
        order: {
          paraBlockHeight: 'DESC',
        },
      },
      { className: 'AssetVolumeHistoricalData' }
    ));

  // Create new entry
  const assetInVolume = initAssetVolume({
    asset: swapDetails.assetIn,
    paraBlockHeight: swapDetails.paraBlockHeight,
    relayBlockHeight: swapDetails.relayBlockHeight,
    volumeIn: currentAssetInVolume?.volumeIn || BigInt(0),
    volumeOut: currentAssetInVolume?.volumeOut || BigInt(0),
    totalVolumeIn: oldAssetInVolume?.totalVolumeIn || BigInt(0),
    totalVolumeOut: oldAssetInVolume?.totalVolumeOut || BigInt(0),
    totalVolumeInNorm: oldAssetInVolume?.totalVolumeInNorm ?? '0',
    totalVolumeOutNorm: oldAssetInVolume?.totalVolumeOutNorm ?? '0',
  });

  const assetOutVolume = initAssetVolume({
    asset: swapDetails.assetOut,
    paraBlockHeight: swapDetails.paraBlockHeight,
    relayBlockHeight: swapDetails.relayBlockHeight,
    volumeIn: currentAssetOutVolume?.volumeIn || BigInt(0),
    volumeOut: currentAssetOutVolume?.volumeOut || BigInt(0),
    totalVolumeIn: oldAssetOutVolume?.totalVolumeIn || BigInt(0),
    totalVolumeOut: oldAssetOutVolume?.totalVolumeOut || BigInt(0),
    totalVolumeInNorm: oldAssetOutVolume?.totalVolumeInNorm ?? '0',
    totalVolumeOutNorm: oldAssetOutVolume?.totalVolumeOutNorm ?? '0',
  });

  // Update new entry
  assetInVolume.volumeIn += swapDetails.assetInAmount;
  assetInVolume.totalVolumeIn += swapDetails.assetInAmount;

  assetOutVolume.volumeOut += swapDetails.assetOutAmount;
  assetOutVolume.totalVolumeOut += swapDetails.assetOutAmount;

  ctx.batchState.state.assetVolumes.set(assetInVolume.id, assetInVolume);
  ctx.batchState.state.assetVolumes.set(assetOutVolume.id, assetOutVolume);
}

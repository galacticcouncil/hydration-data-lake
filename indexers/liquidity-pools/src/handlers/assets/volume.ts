import { Asset, HistoricalAssetVolume } from '../../model';
import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { initAssetVolume } from './index';

export async function handleAssetVolumeUpdates(
  ctx: ProcessorContext<Store>,
  swapDetails: {
    paraChainBlockHeight: number;
    relayChainBlockHeight: number;
    assetIn: Asset;
    assetOut: Asset;
    assetInAmount: bigint;
    assetOutAmount: bigint;
  }
) {
  const assetVolumesState = ctx.batchState.state.assetVolumes;

  // Find current block volume
  const currentAssetInVolume = assetVolumesState.get(
    swapDetails.assetIn.id + '-' + swapDetails.paraChainBlockHeight
  );
  const currentAssetOutVolume = assetVolumesState.get(
    swapDetails.assetOut.id + '-' + swapDetails.paraChainBlockHeight
  );

  // If not found find last volume in cache
  const cachedVolumeIn = getLastAssetVolumeFromCache(
    assetVolumesState,
    swapDetails.assetIn.id
  );
  const cachedVolumeOut = getLastAssetVolumeFromCache(
    assetVolumesState,
    swapDetails.assetOut.id
  );

  // Last known volume for total volume
  const oldAssetInVolume =
    currentAssetInVolume ||
    cachedVolumeIn ||
    (await ctx.store.findOne(HistoricalAssetVolume, {
      where: {
        asset: { id: swapDetails.assetIn.id },
      },
      relations: { asset: true },
      order: {
        paraChainBlockHeight: 'DESC',
      },
    }));

  // Last known volume for total volume
  const oldAssetOutVolume =
    currentAssetOutVolume ||
    cachedVolumeOut ||
    (await ctx.store.findOne(HistoricalAssetVolume, {
      where: {
        asset: { id: swapDetails.assetOut.id },
      },
      relations: { asset: true },
      order: {
        paraChainBlockHeight: 'DESC',
      },
    }));

  // Create new entry
  const assetInVolume = initAssetVolume(
    swapDetails.assetIn,
    swapDetails.paraChainBlockHeight,
    swapDetails.relayChainBlockHeight,
    currentAssetInVolume?.volumeIn || BigInt(0),
    BigInt(0),
    oldAssetInVolume?.totalVolumeIn || BigInt(0),
    BigInt(0)
  );

  const assetOutVolume = initAssetVolume(
    swapDetails.assetOut,
    swapDetails.paraChainBlockHeight,
    swapDetails.relayChainBlockHeight,
    BigInt(0),
    currentAssetOutVolume?.volumeOut || BigInt(0),
    BigInt(0),
    oldAssetOutVolume?.totalVolumeOut || BigInt(0)
  );

  // Update new entry
  assetInVolume.volumeIn += swapDetails.assetInAmount;
  assetInVolume.totalVolumeIn += swapDetails.assetInAmount;
  assetOutVolume.volumeOut += swapDetails.assetOutAmount;
  assetOutVolume.totalVolumeOut += swapDetails.assetOutAmount;

  assetVolumesState.set(assetInVolume.id, assetInVolume);
  assetVolumesState.set(assetOutVolume.id, assetOutVolume);
}

export function getLastAssetVolumeFromCache(
  volume: Map<string, HistoricalAssetVolume>,
  assetId: string
) {
  return volume.get(
    Array.from(volume.keys())
      .filter((k) => {
        return k.startsWith(assetId + '-');
      })
      .sort((a, b) => {
        return parseInt(b.split('-')[1]) - parseInt(a.split('-')[1]);
      })[0]
  );
}

import { Asset, HistoricalAssetVolume, LbpPoolOperation } from '../../model';
import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { initAssetVolume } from './index';

export async function handleAssetVolumeUpdates(
  ctx: ProcessorContext<Store>,
  operationDetails: {
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
    operationDetails.assetIn.id + '-' + operationDetails.paraChainBlockHeight
  );
  const currentAssetOutVolume = assetVolumesState.get(
    operationDetails.assetOut.id + '-' + operationDetails.paraChainBlockHeight
  );

  // If not found find last volume in cache
  const cachedVolumeIn = getLastAssetVolumeFromCache(
    assetVolumesState,
    operationDetails.assetIn.id
  );
  const cachedVolumeOut = getLastAssetVolumeFromCache(
    assetVolumesState,
    operationDetails.assetOut.id
  );

  // Last known volume for total volume
  const oldAssetInVolume =
    currentAssetInVolume ||
    cachedVolumeIn ||
    (await ctx.store.findOne(HistoricalAssetVolume, {
      where: {
        asset: { id: operationDetails.assetIn.id },
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
        asset: { id: operationDetails.assetOut.id },
      },
      relations: { asset: true },
      order: {
        paraChainBlockHeight: 'DESC',
      },
    }));

  // Create new entry
  const assetInVolume = initAssetVolume(
    operationDetails.assetIn,
    operationDetails.paraChainBlockHeight,
    operationDetails.relayChainBlockHeight,
    currentAssetInVolume?.volumeIn || BigInt(0),
    BigInt(0),
    oldAssetInVolume?.totalVolumeIn || BigInt(0),
    BigInt(0)
  );

  const assetOutVolume = initAssetVolume(
    operationDetails.assetOut,
    operationDetails.paraChainBlockHeight,
    operationDetails.relayChainBlockHeight,
    BigInt(0),
    currentAssetOutVolume?.volumeOut || BigInt(0),
    BigInt(0),
    oldAssetOutVolume?.totalVolumeOut || BigInt(0)
  );

  // Update new entry
  assetInVolume.volumeIn += operationDetails.assetInAmount;
  assetInVolume.totalVolumeIn += operationDetails.assetInAmount;
  assetOutVolume.volumeOut += operationDetails.assetOutAmount;
  assetOutVolume.totalVolumeOut += operationDetails.assetOutAmount;

  assetVolumesState.set(assetInVolume.id, assetInVolume);
  assetVolumesState.set(assetOutVolume.id, assetOutVolume);

  ctx.batchState.state = { assetVolumes: assetVolumesState };
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

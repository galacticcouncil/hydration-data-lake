import {
  OmnipoolAsset,
  OmnipoolAssetHistoricalVolume,
  OmnipoolAssetOperation,
} from '../../model';
import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  getOldOmnipoolAssetVolume,
  getPoolAssetLastVolumeFromCache,
} from './index';

export function initOmnipoolAssetVolume({
  swap,
  currentVolume,
  oldVolume,
  omnipoolAsset,
}: {
  swap: OmnipoolAssetOperation;
  omnipoolAsset: OmnipoolAsset;
  currentVolume?: OmnipoolAssetHistoricalVolume | undefined;
  oldVolume?: OmnipoolAssetHistoricalVolume | undefined;
}) {
  const newVolume = new OmnipoolAssetHistoricalVolume({
    id: omnipoolAsset.id + '-' + swap.paraChainBlockHeight,
    omnipoolAsset: omnipoolAsset,
    assetVolumeIn: currentVolume?.assetVolumeIn || BigInt(0),
    assetVolumeOut: currentVolume?.assetVolumeOut || BigInt(0),
    assetFee: currentVolume?.assetFee || BigInt(0),
    assetTotalFees:
      currentVolume?.assetTotalFees || oldVolume?.assetTotalFees || BigInt(0),
    assetTotalVolumeIn:
      currentVolume?.assetTotalVolumeIn ||
      oldVolume?.assetTotalVolumeIn ||
      BigInt(0),
    assetTotalVolumeOut:
      currentVolume?.assetTotalVolumeOut ||
      oldVolume?.assetTotalVolumeOut ||
      BigInt(0),
    relayChainBlockHeight: swap.relayChainBlockHeight,
    paraChainBlockHeight: swap.paraChainBlockHeight,
  });

  const assetVolumeIn =
    swap.assetIn.id === newVolume.omnipoolAsset.id
      ? swap.assetInAmount
      : BigInt(0);

  const assetVolumeOut =
    swap.assetOut.id === newVolume.omnipoolAsset.id
      ? swap.assetOutAmount
      : BigInt(0);

  const assetFee =
    swap.assetOut.id === newVolume.omnipoolAsset.id
      ? swap.assetFeeAmount
      : BigInt(0);

  // Block volumes
  newVolume.assetVolumeIn += assetVolumeIn;
  newVolume.assetVolumeOut += assetVolumeOut;
  newVolume.assetFee += assetFee;

  // Total volumes
  newVolume.assetTotalVolumeIn += assetVolumeIn;
  newVolume.assetTotalVolumeOut += assetVolumeOut;
  newVolume.assetTotalFees += assetFee;

  return newVolume;
}

export async function handleOmnipoolAssetVolumeUpdates({
  ctx,
  assetOperation,
}: {
  ctx: ProcessorContext<Store>;
  assetOperation: OmnipoolAssetOperation;
}) {
  const omnipoolAssetVolumes = ctx.batchState.state.omnipoolAssetVolumes;
  const assetsToProcess = [assetOperation.assetIn, assetOperation.assetOut];

  for (const omnipoolAsset of assetsToProcess) {
    const currentVolume = omnipoolAssetVolumes.get(
      `${omnipoolAsset.id}-${assetOperation.paraChainBlockHeight}`
    );

    const oldVolume =
      currentVolume ||
      (getPoolAssetLastVolumeFromCache(
        omnipoolAssetVolumes,
        omnipoolAsset.id
      ) as OmnipoolAssetHistoricalVolume | undefined) ||
      (await getOldOmnipoolAssetVolume(ctx, omnipoolAsset.id));

    const newVolume = initOmnipoolAssetVolume({
      swap: assetOperation,
      currentVolume,
      oldVolume,
      omnipoolAsset,
    });

    omnipoolAssetVolumes.set(newVolume.id, newVolume);
  }

  ctx.batchState.state = { omnipoolAssetVolumes };
}

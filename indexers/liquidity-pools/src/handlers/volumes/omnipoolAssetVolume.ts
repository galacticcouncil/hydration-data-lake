import {
  OmnipoolAsset,
  OmnipoolAssetHistoricalVolume,
  Swap,
} from '../../model';
import { SqdBlock, SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  getOldOmnipoolAssetVolume,
  getPoolAssetLastVolumeFromCache,
} from './index';
import { getOrCreateOmnipoolAsset } from '../pools/omnipool/omnipoolAssets';

export function initOmnipoolAssetVolume({
  swap,
  currentVolume,
  oldVolume,
  omnipoolAsset,
}: {
  swap: Swap;
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
    block: swap.event.block,
  });

  const assetVolumeIn =
    swap.inputs[0].asset.id === newVolume.omnipoolAsset.asset.id
      ? swap.inputs[0].amount
      : BigInt(0);

  const assetVolumeOut =
    swap.outputs[0].asset.id === newVolume.omnipoolAsset.asset.id
      ? swap.outputs[0].amount
      : BigInt(0);

  const assetFee =
    swap.outputs[0].asset.id === newVolume.omnipoolAsset.asset.id
      ? swap.outputs[0].amount
      : BigInt(0);

  // SqdBlock volumes
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
  swap,
  blockHeader,
}: {
  ctx: SqdProcessorContext<Store>;
  swap: Swap;
  blockHeader: SqdBlock;
}) {
  const omnipoolAssetVolumes = ctx.batchState.state.omnipoolAssetVolumes;

  const omnipoolAssetInEntity = await getOrCreateOmnipoolAsset({
    ctx,
    assetId: swap.inputs[0].asset.id,
    ensure: true,
    blockHeader,
  });

  const omnipoolAssetOutEntity = await getOrCreateOmnipoolAsset({
    ctx,
    assetId: swap.outputs[0].asset.id,
    ensure: true,
    blockHeader,
  });

  if (!omnipoolAssetInEntity || !omnipoolAssetOutEntity) {
    console.log(
      `Omnipool asset with assetId: ${!omnipoolAssetInEntity ? swap.inputs[0].asset.id : swap.outputs[0].asset.id} has not been found`
    );
    return;
  }

  for (const omnipoolAsset of [omnipoolAssetInEntity, omnipoolAssetOutEntity]) {
    const currentVolume = omnipoolAssetVolumes.get(
      `${omnipoolAsset.id}-${swap.paraChainBlockHeight}`
    );

    const oldVolume =
      currentVolume ||
      (getPoolAssetLastVolumeFromCache(
        omnipoolAssetVolumes,
        omnipoolAsset.id
      ) as OmnipoolAssetHistoricalVolume | undefined) ||
      (await getOldOmnipoolAssetVolume(ctx, omnipoolAsset.id));

    const newVolume = initOmnipoolAssetVolume({
      swap,
      currentVolume,
      oldVolume,
      omnipoolAsset,
    });

    omnipoolAssetVolumes.set(newVolume.id, newVolume);
  }
}

import { Store } from '@subsquid/typeorm-store';

import {
  OmnipoolAsset,
  OmnipoolAssetVolumeHistoricalData,
  Swap,
} from '../../../model';
import {
  SqdBlock,
  SqdProcessorContext,
} from '../../../processor';
import { getOrCreateOmnipoolAsset } from '../pools/omnipool/omnipoolAssets';
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
  swap: Swap;
  omnipoolAsset: OmnipoolAsset;
  currentVolume?: OmnipoolAssetVolumeHistoricalData | undefined;
  oldVolume?: OmnipoolAssetVolumeHistoricalData | undefined;
}) {
  const newVolume = new OmnipoolAssetVolumeHistoricalData({
    id: omnipoolAsset.id + '-' + swap.paraBlockHeight,
    omnipoolAsset: omnipoolAsset,
    assetVolIn: currentVolume?.assetVolIn || BigInt(0),
    assetVolOut: currentVolume?.assetVolOut || BigInt(0),
    assetFeeVol: currentVolume?.assetFeeVol || BigInt(0),
    assetTotalFeesVol:
      currentVolume?.assetTotalFeesVol ||
      oldVolume?.assetTotalFeesVol ||
      BigInt(0),
    assetTotalVolIn:
      currentVolume?.assetTotalVolIn || oldVolume?.assetTotalVolIn || BigInt(0),
    assetTotalVolOut:
      currentVolume?.assetTotalVolOut ||
      oldVolume?.assetTotalVolOut ||
      BigInt(0),

    assetVolInNorm: currentVolume?.assetVolInNorm || '0',
    assetVolOutNorm: currentVolume?.assetVolOutNorm || '0',
    assetFeeVolNorm: currentVolume?.assetFeeVolNorm || '0',

    assetTotalVolInNorm:
      currentVolume?.assetTotalVolInNorm ||
      oldVolume?.assetTotalVolInNorm ||
      '0',
    assetTotalVolOutNorm:
      currentVolume?.assetTotalVolOutNorm ||
      oldVolume?.assetTotalVolOutNorm ||
      '0',
    assetTotalFeesVolNorm:
      currentVolume?.assetTotalFeesVolNorm ||
      oldVolume?.assetTotalFeesVolNorm ||
      '0',

    // assetVolInNorm: '0',
    // assetVolOutNorm: '0',
    // assetFeeVolNorm: '0',
    //
    // assetTotalVolInNorm: '0',
    // assetTotalVolOutNorm: '0',
    // assetTotalFeesVolNorm: '0',

    paraBlockHeight: swap.paraBlockHeight,
  });

  const assetVolIn =
    swap.inputs.find(
      (input) => input.assetId === newVolume.omnipoolAsset.assetId
    )?.amount || BigInt(0);

  const assetVolOut =
    swap.outputs.find(
      (output) => output.assetId === newVolume.omnipoolAsset.assetId
    )?.amount || BigInt(0);

  const assetFeeVol = swap.fees.reduce((acc, feeData) => {
    if (
      feeData.assetId !== newVolume.omnipoolAsset.assetId ||
      !feeData.recipientId
    )
      return acc;
    return acc + feeData.amount;
  }, 0n);

  // SqdBlock volumes
  newVolume.assetVolIn += assetVolIn;
  newVolume.assetVolOut += assetVolOut;
  newVolume.assetFeeVol += assetFeeVol;

  // Total volumes
  newVolume.assetTotalVolIn += assetVolIn;
  newVolume.assetTotalVolOut += assetVolOut;
  newVolume.assetTotalFeesVol += assetFeeVol;

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
    assetId: swap.inputs[0].assetId,
    ensure: true,
    blockHeader,
  });

  const omnipoolAssetOutEntity = await getOrCreateOmnipoolAsset({
    ctx,
    assetId: swap.outputs[0].assetId,
    ensure: true,
    blockHeader,
  });

  if (!omnipoolAssetInEntity || !omnipoolAssetOutEntity) {
    console.log(
      `Omnipool asset with assetId: ${!omnipoolAssetInEntity ? swap.inputs[0].assetId : swap.outputs[0].assetId} has not been found`
    );
    return;
  }

  for (const omnipoolAsset of [omnipoolAssetInEntity, omnipoolAssetOutEntity]) {
    const currentVolume = omnipoolAssetVolumes.get(
      `${omnipoolAsset.id}-${swap.paraBlockHeight}`
    );

    const oldVolume =
      currentVolume ||
      (getPoolAssetLastVolumeFromCache(
        omnipoolAssetVolumes,
        omnipoolAsset.id
      ) as OmnipoolAssetVolumeHistoricalData | undefined) ||
      (await getOldOmnipoolAssetVolume({
        ctx,
        omnipoolAssetId: omnipoolAsset.id,
      }));

    const newVolume = initOmnipoolAssetVolume({
      swap,
      currentVolume,
      oldVolume,
      omnipoolAsset,
    });

    omnipoolAssetVolumes.set(newVolume.id, newVolume);
  }
}

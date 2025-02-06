import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { Asset, Block, HistoricalAssetSwapFee } from '../../../model';

export async function handleAssetSwapFee({
  block,
  asset,
  feeAmount,
  ctx,
}: {
  ctx: SqdProcessorContext<Store>;
  block: Block;
  asset: Asset;
  feeAmount: bigint;
}) {
  const state = ctx.batchState.state;

  const currentBlockAssetFeeAmount = state.historicalAssetSwapFees.get(
    `${asset.id}-${block.height}`
  );

  // If not found find last volume in cache
  const lastCachedAssetFeeAmount = getLastAssetSwapFeeAmountFromCache(
    state.historicalAssetSwapFees,
    asset.id
  );

  // Last known volume for total volume
  const persistentAssetFeeAmount =
    currentBlockAssetFeeAmount ||
    lastCachedAssetFeeAmount ||
    (await ctx.store.findOne(HistoricalAssetSwapFee, {
      where: {
        asset: { id: asset.id },
      },
      relations: { asset: true, block: true },
      order: {
        paraBlockHeight: 'DESC',
      },
    }));

  const assetSwapFee = new HistoricalAssetSwapFee({
    id: `${asset.id}-${block.height}`,
    asset,
    amount: currentBlockAssetFeeAmount?.amount || BigInt(0),
    totalAmount: persistentAssetFeeAmount?.totalAmount || BigInt(0),
    paraBlockHeight: block.height,
    relayBlockHeight: block.relayBlockHeight,
    block,
  });

  assetSwapFee.amount += feeAmount;
  assetSwapFee.totalAmount += feeAmount;

  ctx.batchState.state.historicalAssetSwapFees.set(
    assetSwapFee.id,
    assetSwapFee
  );
}

export function getLastAssetSwapFeeAmountFromCache(
  fees: Map<string, HistoricalAssetSwapFee>,
  assetId: string
) {
  return fees.get(
    Array.from(fees.keys())
      .filter((k) => {
        return k.startsWith(`${assetId}`);
      })
      .sort((a, b) => {
        return parseInt(b.split('-')[1]) - parseInt(a.split('-')[1]);
      })[0]
  );
}

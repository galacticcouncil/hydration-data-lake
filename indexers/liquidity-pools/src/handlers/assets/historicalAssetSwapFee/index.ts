import { Store } from '@subsquid/typeorm-store';

import { AssetSwapFeeHistoricalData, Block } from '../../../model';
import { SqdProcessorContext } from '../../../processor';

export async function handleAssetSwapFee({
  block,
  assetId,
  feeAmount,
  ctx,
}: {
  ctx: SqdProcessorContext<Store>;
  block: Block;
  assetId: string;
  feeAmount: bigint;
}) {
  const state = ctx.batchState.state;

  const currentBlockAssetFeeAmount = state.historicalAssetSwapFees.get(
    `${assetId}-${block.height}`
  );

  // If not found, find last volume in cache
  const lastCachedAssetFeeAmount = getLastAssetSwapFeeAmountFromCache(
    state.historicalAssetSwapFees,
    assetId
  );

  // Last known volume for total volume
  const persistentAssetFeeAmount =
    currentBlockAssetFeeAmount ||
    lastCachedAssetFeeAmount ||
    (await ctx.storeUtils.findOneWithLogs(
      AssetSwapFeeHistoricalData,
      {
        where: {
          assetId,
        },
        relations: {},
        order: {
          paraBlockHeight: 'DESC',
        },
      },
      {
        className: 'AssetSwapFeeHistoricalData',
        originCallFn: 'handleAssetSwapFee',
      }
    ));

  const assetSwapFee = new AssetSwapFeeHistoricalData({
    id: `${assetId}-${block.height}`,
    assetId,
    amount: currentBlockAssetFeeAmount?.amount || BigInt(0),
    totalAmount: persistentAssetFeeAmount?.totalAmount || BigInt(0),
    paraBlockHeight: block.height,
  });

  assetSwapFee.amount += feeAmount;
  assetSwapFee.totalAmount += feeAmount;

  ctx.batchState.state.historicalAssetSwapFees.set(
    assetSwapFee.id,
    assetSwapFee
  );
}

export function getLastAssetSwapFeeAmountFromCache(
  fees: Map<string, AssetSwapFeeHistoricalData>,
  assetId: string
) {
  return fees.get(
    Array.from(fees.keys())
      .filter((k) => {
        return k.startsWith(`${assetId}-`);
      })
      .sort((a, b) => {
        return parseInt(b.split('-')[1]) - parseInt(a.split('-')[1]);
      })[0]
  );
}

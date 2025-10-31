import { Store } from '@subsquid/typeorm-store';

import {
  Account,
  AccountAssetSwapFeeHistoricalData,
  AccountSwapFeeHistoricalData,
  Asset,
  Block,
} from '../../../model';
import { SqdProcessorContext } from '../../../processor';

export async function handleAccountAssetSwapFee({
  block,
  account,
  asset,
  feeAmount,
  ctx,
}: {
  ctx: SqdProcessorContext<Store>;
  block: Block;
  account: Account;
  asset: Asset;
  feeAmount: bigint;
}) {
  const state = ctx.batchState.state;

  const currentBlockAccAssetFeeAmount =
    state.historicalAccountAssetSwapFees.get(
      `${account.id}-${asset.id}-${block.height}`
    );

  // If not found find last volume in cache
  const lastCachedAccAssetFeeAmount = getLastAccAssetSwapFeeAmountFromCache(
    state.historicalAccountAssetSwapFees,
    account.id,
    asset.id
  );

  // Last known volume for total volume
  const persistentAccAssetFeeAmount =
    currentBlockAccAssetFeeAmount ||
    lastCachedAccAssetFeeAmount ||
    (await ctx.storeUtils.findOneWithLogs(AccountAssetSwapFeeHistoricalData, {
      where: {
        asset: { id: asset.id },
        account: { id: account.id },
      },
      relations: { asset: true, account: true, collection: true },
      order: {
        paraBlockHeight: 'DESC',
      },
    }, { className: 'AccountAssetSwapFeeHistoricalData' }));

  const accountSwapFeesCollection = getAccountSwapFeesCollection({
    account,
    block,
    ctx,
  });

  const accountAssetSwapFee = new AccountAssetSwapFeeHistoricalData({
    id: `${account.id}-${asset.id}-${block.height}`,
    account,
    asset,
    collection: accountSwapFeesCollection,
    amount: currentBlockAccAssetFeeAmount?.amount || BigInt(0),
    totalAmount: persistentAccAssetFeeAmount?.totalAmount || BigInt(0),
    paraBlockHeight: block.height,
    relayBlockHeight: block.relayBlockHeight,
    blockId: block.id,
  });

  accountAssetSwapFee.amount += feeAmount;
  accountAssetSwapFee.totalAmount += feeAmount;

  ctx.batchState.state.historicalAccountAssetSwapFees.set(
    accountAssetSwapFee.id,
    accountAssetSwapFee
  );
  ctx.batchState.state.historicalAccountSwapFees.set(
    accountSwapFeesCollection.id,
    accountSwapFeesCollection
  );
}

export function getLastAccAssetSwapFeeAmountFromCache(
  fees: Map<string, AccountAssetSwapFeeHistoricalData>,
  accountId: string,
  assetId: string
) {
  return fees.get(
    Array.from(fees.keys())
      .filter((k) => {
        return k.startsWith(`${accountId}-${assetId}`);
      })
      .sort((a, b) => {
        return parseInt(b.split('-')[2]) - parseInt(a.split('-')[2]);
      })[0]
  );
}

export function getAccountSwapFeesCollection({
  account,
  block,
  ctx,
}: {
  block: Block;
  account: Account;
  ctx: SqdProcessorContext<Store>;
}) {
  let collection = ctx.batchState.state.historicalAccountSwapFees.get(
    `${account.id}-${block.height}`
  );

  if (collection) return collection;

  collection = new AccountSwapFeeHistoricalData({
    id: `${account.id}-${block.height}`,
    paraBlockHeight: block.height,
    relayBlockHeight: block.relayBlockHeight,
    account,
    blockId: block.id,
  });

  ctx.batchState.state.historicalAccountSwapFees.set(collection.id, collection);

  return collection;
}

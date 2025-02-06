import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  Account,
  Asset,
  Block,
  HistoricalAccountAssetSwapFee,
  HistoricalAccountSwapFee,
} from '../../../model';

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
    (await ctx.store.findOne(HistoricalAccountAssetSwapFee, {
      where: {
        asset: { id: asset.id },
        account: { id: account.id },
      },
      relations: { asset: true, account: true, collection: true, block: true },
      order: {
        paraBlockHeight: 'DESC',
      },
    }));

  const accountSwapFeesCollection = getAccountSwapFeesCollection({
    account,
    block,
    ctx,
  });

  const accountAssetSwapFee = new HistoricalAccountAssetSwapFee({
    id: `${account.id}-${asset.id}-${block.height}`,
    account,
    asset,
    collection: accountSwapFeesCollection,
    amount: currentBlockAccAssetFeeAmount?.amount || BigInt(0),
    totalAmount: persistentAccAssetFeeAmount?.totalAmount || BigInt(0),
    paraBlockHeight: block.height,
    relayBlockHeight: block.relayBlockHeight,
    block,
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
  fees: Map<string, HistoricalAccountAssetSwapFee>,
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

  collection = new HistoricalAccountSwapFee({
    id: `${account.id}-${block.height}`,
    paraBlockHeight: block.height,
    relayBlockHeight: block.relayBlockHeight,
    account,
    block,
  });

  ctx.batchState.state.historicalAccountSwapFees.set(collection.id, collection);

  return collection;
}

import { In } from 'typeorm';

import { Store } from '@subsquid/typeorm-store';

import { AccountOwnedAsset } from '../../model';
import { SqdProcessorContext } from '../../processor';

const buildId = (accountId: string, assetId: string) =>
  `${accountId}-${assetId}`;

// Persists across batches. Prevents re-querying the DB for the same account's
// ownership set in a later batch. Mirrors the cross-batch lifetime of
// LatestProcessedDataCacheManager.
const prefetchedAccountIds = new Set<string>();

export async function getOrCreateAccountOwnedAsset({
  ctx,
  accountId,
  assetId,
  firstSeenParaBlockHeight,
  fetchFromDb = false,
}: {
  ctx: SqdProcessorContext<Store>;
  accountId: string;
  assetId: string;
  firstSeenParaBlockHeight: number;
  fetchFromDb?: boolean;
}): Promise<AccountOwnedAsset> {
  const batchState = ctx.batchState.state;
  const entityId = buildId(accountId, assetId);

  let entity = batchState.accountOwnedAssets.get(entityId);
  if (entity) return entity;

  if (fetchFromDb) {
    entity = await ctx.storeUtils.findOneWithLogs(
      AccountOwnedAsset,
      { where: { id: entityId } },
      {
        className: 'AccountOwnedAsset',
        originCallFn: 'getOrCreateAccountOwnedAsset',
      }
    );
    if (entity) {
      batchState.accountOwnedAssets.set(entity.id, entity);
      return entity;
    }
  }

  entity = new AccountOwnedAsset({
    id: entityId,
    accountId,
    assetId,
    firstSeenParaBlockHeight,
  });

  batchState.accountOwnedAssets.set(entity.id, entity);
  return entity;
}

export async function prefetchAccountOwnedAssetsByAccountIds({
  ctx,
  accountIds,
}: {
  ctx: SqdProcessorContext<Store>;
  accountIds: string[];
}): Promise<void> {
  if (accountIds.length === 0) return;

  const batchState = ctx.batchState.state;

  const accountIdsToFetch = accountIds.filter(
    (id) => !prefetchedAccountIds.has(id)
  );
  if (accountIdsToFetch.length === 0) return;

  const records = await ctx.storeUtils.findWithLogs(
    AccountOwnedAsset,
    { where: { accountId: In(accountIdsToFetch) } },
    { className: 'AccountOwnedAsset' }
  );

  for (const record of records) {
    if (!batchState.accountOwnedAssets.has(record.id)) {
      batchState.accountOwnedAssets.set(record.id, record);
    }
  }

  for (const id of accountIdsToFetch) {
    prefetchedAccountIds.add(id);
  }
}

export function getAccountOwnedAssetIdsFromBatchState({
  ctx,
  accountId,
}: {
  ctx: SqdProcessorContext<Store>;
  accountId: string;
}): string[] {
  const result: string[] = [];
  const prefix = `${accountId}-`;
  for (const [key, entity] of ctx.batchState.state.accountOwnedAssets) {
    if (key.startsWith(prefix)) result.push(entity.assetId);
  }
  return result;
}

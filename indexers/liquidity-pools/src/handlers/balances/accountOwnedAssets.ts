/**
 * account_owned_asset — thin lookup table mapping (accountId, assetId) pairs.
 *
 * Purpose: avoid scanning account_asset_balance_historical_data to discover
 * which assets an account holds. The historical table has hundreds of
 * thousands of rows per (account, asset) pair on prod; a discovery query
 * over it dominated batch time (measured at ~9 minutes for ~500 accounts).
 * This table holds one row per pair (~5–10 per account), so the same
 * discovery becomes a millisecond indexed lookup.
 *
 * Semantics:
 *  - Tracks ownership ("ever held"), not current balance. A pair returning
 *    to zero is NOT removed — the account may receive the asset again, and
 *    the historical lookup chain must remain intact.
 *  - Deterministic id `<accountId>-<assetId>` makes upserts idempotent across
 *    reorg re-runs and works the same in head and reaggregation modes.
 *  - `firstSeenParaBlockHeight` is informational only. Set on creation and
 *    never overwritten; no read path depends on its exact value.
 *
 * Write path: every snapshot in `processBalanceEventsSequentially` and every
 * pair created by `initManyAccountAssetBalancesFromOnChainData` calls
 * `getOrCreateAccountOwnedAsset`. The batchState map is flushed via
 * `HistoricalDataManager.saveAccountBalancesRelatedDataBulk`.
 *
 * Read path: `prefetchAccountOwnedAssetsByAccountIds` loads ownership for the
 * batch's involved accounts; the resulting pair set feeds the LATERAL-join
 * query in `prefetchLastAccountAssetBalances`.
 *
 * Reaggregation safety: ownership returned for a given account is a superset
 * of what existed at any historical block being reaggregated. The downstream
 * LATERAL lookup with `para_block_height < $reaggBlock` returns zero rows for
 * pairs not yet owned at that block, and the snapshot logic already handles
 * "no prior history" by starting from 0n.
 */
import { In } from 'typeorm';

import { Store } from '@subsquid/typeorm-store';

import { AccountOwnedAsset } from '../../model';
import { SqdProcessorContext } from '../../processor';
import { batchArray } from '../../utils/helpers';

// Postgres caps bind parameters at 65535 per query. Each id in IN(...) costs
// one placeholder, and the refresh path can pass tens of thousands of account
// ids. Chunk well below the limit to leave headroom for any other params the
// query builder adds.
const PREFETCH_ACCOUNT_IDS_CHUNK_SIZE = 1000;

const buildId = (accountId: string, assetId: string) =>
  `${accountId}-${assetId}`;

// Persists across batches. Prevents re-querying the DB for the same account's
// ownership set in a later batch. Mirrors the cross-batch lifetime of
// LatestProcessedDataCacheManager — and MUST be reset whenever that cache is
// invalidated (reorg), otherwise prefetchAccountOwnedAssetsByAccountIds will
// skip the account and prefetchLastAccountAssetBalances will leave the wiped
// balance cache empty for it, breaking total balance composition.
const prefetchedAccountIds = new Set<string>();

export function resetPrefetchedAccountIds(): void {
  prefetchedAccountIds.clear();
}

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

  // Chunk the IN(...) list so we never exceed Postgres' 65535-parameter
  // bind limit. Refresh mode can pass tens of thousands of account ids in
  // a single call.
  for (const chunk of batchArray(
    accountIdsToFetch,
    PREFETCH_ACCOUNT_IDS_CHUNK_SIZE
  )) {
    const records = await ctx.storeUtils.findWithLogs(
      AccountOwnedAsset,
      { where: { accountId: In(chunk) } },
      {
        className: 'AccountOwnedAsset',
        originCallFn: 'prefetchAccountOwnedAssetsByAccountIds',
      }
    );

    for (const record of records) {
      if (!batchState.accountOwnedAssets.has(record.id)) {
        batchState.accountOwnedAssets.set(record.id, record);
      }
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

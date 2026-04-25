import { Store } from '@subsquid/typeorm-store';
import { SqdBlock, SqdProcessorContext } from '../../processor';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import {
  EventName,
  TokensTransferEventParams,
  TokensDepositedEventParams,
  TokensWithdrawnEventParams,
  TokensReservedEventParams,
  TokensUnreservedEventParams,
  BalancesTransferEventParams,
  BalancesDepositEventParams,
  BalancesWithdrawEventParams,
  BalancesReservedEventParams,
  BalancesUnreservedEventParams,
} from '../../parsers/types/events';
import {
  AccountAssetBalanceHistoricalData,
  AssetResourceType,
  EvmEventName,
} from '../../model';
import { EvmLogEventParams } from '../../parsers/types/events/evm';
import { getOrCreateAccountAssetBalanceHistoricalData } from './accountAssetBalance';
import {
  getOrCreateAccount,
  getOrCreateAccountByBoundEvmAddress,
} from '../accounts';
import { getOrCreateAsset, getOrCreateMoneyMarketAsset } from '../assets/asset';
import { EvmLogDecoder } from '../../utils/evmTools/evmLogDecoder';
import { MoneyMarketContractsManager } from '../../utils/evmTools/moneyMarketContractsManager';
import { getAssetsPairPrice } from '../assets/assetHistoricalData/assetSpotPrices';
import { calcPriceNormalized } from '../../utils/helpers';
import { LatestProcessedDataCacheManager } from '../../utils/latestProcessedDataCacheManager';
import parsers from '../../parsers';
import { ParsedEventsCallsData } from '../../parsers/batchBlocksParser/types';
import {
  handleManyAccountBalancesInitCore,
  initManyAccountAssetBalancesFromOnChainData,
} from './allAccountBalancesInit';
import pMap from 'p-map';
import { ZERO_ADDRESS_PK } from '../../utils/types';

export type BalanceEvent = {
  blockHeight: number;
  indexInBlock: number;
  accountId: string;
  assetId: string;
  isEvmAsset: boolean;
  transferableDelta: bigint;
  totalLockedDelta: bigint;
  blockHeader: SqdBlock;
};

export type AccountBalanceBlockSnapshot = {
  accountId: string;
  assetId: string;
  isEvmAsset: boolean;
  blockHeight: number;
  blockHeader: SqdBlock;
  transferable: bigint;
  totalLocked: bigint;
};

/** Safely convert any numeric value (bigint, BigNumber, string, number) to native bigint */
function toBigInt(value: any): bigint {
  if (typeof value === 'bigint') return value;
  return BigInt(value.toString());
}

/**
 * Collect all balance-mutating events from parsed events and convert to
 * unified BalanceEvent format. Transfer events produce two items (one per account).
 */
export async function collectBalanceEvents(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
): Promise<BalanceEvent[]> {
  let events: BalanceEvent[] = [];

  // Sidecar source tagging for Tokens.Transfer vs EVM.Log Transfer events.
  // Used post-collection to detect tuple-matching duplicates that would have
  // doubled the receiver's balance if not already deduped.
  const eventSource = new WeakMap<BalanceEvent, 'tokens' | 'evm'>();

  const getBlockHeader = (eventData: ParsedEventsCallsData): SqdBlock =>
    eventData.eventData.metadata.blockHeader;
  const getBlockHeight = (eventData: ParsedEventsCallsData): number =>
    eventData.eventData.metadata.blockHeader.height;
  const getIndexInBlock = (eventData: ParsedEventsCallsData): number =>
    eventData.eventData.metadata.indexInBlock;
  const getAssetEntityFromEventAssetId = async (eventAssetId: number) => {
    const asset = await getOrCreateAsset({
      ctx,
      assetRegistryId: String(eventAssetId),
    });
    if (!asset)
      throw new Error(`Unable to find asset with eventAssetId ${eventAssetId}`);
    return asset.id;
  };

  // Tokens.Transfer: sender -amount, receiver +amount
  for (const eventData of parsedEvents
    .getSectionByEventName(EventName.Tokens_Transfer)
    .values()) {
    const params = eventData.eventData.params as TokensTransferEventParams;
    const assetId = await getAssetEntityFromEventAssetId(params.currencyId);
    const fromEvent: BalanceEvent = {
      blockHeight: getBlockHeight(eventData),
      indexInBlock: getIndexInBlock(eventData),
      accountId: params.from,
      assetId,
      isEvmAsset: false,
      transferableDelta: -toBigInt(params.amount),
      totalLockedDelta: 0n,
      blockHeader: getBlockHeader(eventData),
    };
    const toEvent: BalanceEvent = {
      blockHeight: getBlockHeight(eventData),
      indexInBlock: getIndexInBlock(eventData),
      accountId: params.to,
      assetId,
      isEvmAsset: false,
      transferableDelta: toBigInt(params.amount),
      totalLockedDelta: 0n,
      blockHeader: getBlockHeader(eventData),
    };
    eventSource.set(fromEvent, 'tokens');
    eventSource.set(toEvent, 'tokens');
    events.push(fromEvent, toEvent);
  }

  // Tokens.Deposited: +transferable
  for (const eventData of parsedEvents
    .getSectionByEventName(EventName.Tokens_Deposited)
    .values()) {
    const params = eventData.eventData.params as TokensDepositedEventParams;
    const assetId = await getAssetEntityFromEventAssetId(params.currencyId);
    events.push({
      blockHeight: getBlockHeight(eventData),
      indexInBlock: getIndexInBlock(eventData),
      accountId: params.who,
      assetId,
      isEvmAsset: false,
      transferableDelta: toBigInt(params.amount),
      totalLockedDelta: 0n,
      blockHeader: getBlockHeader(eventData),
    });
  }

  // Tokens.Withdrawn: -transferable
  for (const eventData of parsedEvents
    .getSectionByEventName(EventName.Tokens_Withdrawn)
    .values()) {
    const params = eventData.eventData.params as TokensWithdrawnEventParams;
    const assetId = await getAssetEntityFromEventAssetId(params.currencyId);

    events.push({
      blockHeight: getBlockHeight(eventData),
      indexInBlock: getIndexInBlock(eventData),
      accountId: params.who,
      assetId,
      isEvmAsset: false,
      transferableDelta: -toBigInt(params.amount),
      totalLockedDelta: 0n,
      blockHeader: getBlockHeader(eventData),
    });
  }

  // Tokens.Reserved: transferable -> totalLocked
  for (const eventData of parsedEvents
    .getSectionByEventName(EventName.Tokens_Reserved)
    .values()) {
    const params = eventData.eventData.params as TokensReservedEventParams;
    const amount = toBigInt(params.amount);
    const assetId = await getAssetEntityFromEventAssetId(params.currencyId);

    events.push({
      blockHeight: getBlockHeight(eventData),
      indexInBlock: getIndexInBlock(eventData),
      accountId: params.who,
      assetId,
      isEvmAsset: false,
      transferableDelta: -amount,
      totalLockedDelta: amount,
      blockHeader: getBlockHeader(eventData),
    });
  }

  // Tokens.Unreserved: totalLocked -> transferable
  for (const eventData of parsedEvents
    .getSectionByEventName(EventName.Tokens_Unreserved)
    .values()) {
    const params = eventData.eventData.params as TokensUnreservedEventParams;
    const amount = toBigInt(params.amount);
    const assetId = await getAssetEntityFromEventAssetId(params.currencyId);

    events.push({
      blockHeight: getBlockHeight(eventData),
      indexInBlock: getIndexInBlock(eventData),
      accountId: params.who,
      assetId,
      isEvmAsset: false,
      transferableDelta: amount,
      totalLockedDelta: -amount,
      blockHeader: getBlockHeader(eventData),
    });
  }

  // Balances.Transfer: native asset "0"
  for (const eventData of parsedEvents
    .getSectionByEventName(EventName.Balances_Transfer)
    .values()) {
    const params = eventData.eventData.params as BalancesTransferEventParams;
    const amount = toBigInt(params.amount);

    events.push(
      {
        blockHeight: getBlockHeight(eventData),
        indexInBlock: getIndexInBlock(eventData),
        accountId: params.from,
        assetId: '0',
        isEvmAsset: false,
        transferableDelta: -amount,
        totalLockedDelta: 0n,
        blockHeader: getBlockHeader(eventData),
      },
      {
        blockHeight: getBlockHeight(eventData),
        indexInBlock: getIndexInBlock(eventData),
        accountId: params.to,
        assetId: '0',
        isEvmAsset: false,
        transferableDelta: amount,
        totalLockedDelta: 0n,
        blockHeader: getBlockHeader(eventData),
      }
    );
  }

  // Balances.Deposit: +transferable, native
  for (const eventData of parsedEvents
    .getSectionByEventName(EventName.Balances_Deposit)
    .values()) {
    const params = eventData.eventData.params as BalancesDepositEventParams;
    events.push({
      blockHeight: getBlockHeight(eventData),
      indexInBlock: getIndexInBlock(eventData),
      accountId: params.who,
      assetId: '0',
      isEvmAsset: false,
      transferableDelta: toBigInt(params.amount),
      totalLockedDelta: 0n,
      blockHeader: getBlockHeader(eventData),
    });
  }

  // Balances.Withdraw: -transferable, native
  for (const eventData of parsedEvents
    .getSectionByEventName(EventName.Balances_Withdraw)
    .values()) {
    const params = eventData.eventData.params as BalancesWithdrawEventParams;
    events.push({
      blockHeight: getBlockHeight(eventData),
      indexInBlock: getIndexInBlock(eventData),
      accountId: params.who,
      assetId: '0',
      isEvmAsset: false,
      transferableDelta: -toBigInt(params.amount),
      totalLockedDelta: 0n,
      blockHeader: getBlockHeader(eventData),
    });
  }

  // Balances.Reserved: transferable -> totalLocked, native
  for (const eventData of parsedEvents
    .getSectionByEventName(EventName.Balances_Reserved)
    .values()) {
    const params = eventData.eventData.params as BalancesReservedEventParams;
    const amount = toBigInt(params.amount);
    events.push({
      blockHeight: getBlockHeight(eventData),
      indexInBlock: getIndexInBlock(eventData),
      accountId: params.who,
      assetId: '0',
      isEvmAsset: false,
      transferableDelta: -amount,
      totalLockedDelta: amount,
      blockHeader: getBlockHeader(eventData),
    });
  }

  // Balances.Unreserved: totalLocked -> transferable, native
  for (const eventData of parsedEvents
    .getSectionByEventName(EventName.Balances_Unreserved)
    .values()) {
    const params = eventData.eventData.params as BalancesUnreservedEventParams;
    const amount = toBigInt(params.amount);
    events.push({
      blockHeight: getBlockHeight(eventData),
      indexInBlock: getIndexInBlock(eventData),
      accountId: params.who,
      assetId: '0',
      isEvmAsset: false,
      transferableDelta: amount,
      totalLockedDelta: -amount,
      blockHeader: getBlockHeader(eventData),
    });
  }

  // EVM.Log Transfer: MM token transfers (aTokens, debtTokens)
  for (const eventData of parsedEvents
    .getSectionByEventName(EventName.EVM_Log)
    .values()) {
    const evmParams = eventData.eventData.params as EvmLogEventParams | null;
    if (!evmParams || evmParams.eventName !== EvmEventName.Transfer) continue;

    const parsedTransfer =
      EvmLogDecoder.getInstance().getEvmEventFromLog<EvmEventName.Transfer>(
        evmParams
      );
    if (!parsedTransfer) continue;

    const blockHeader = getBlockHeader(eventData);
    const accountFrom = await getOrCreateAccountByBoundEvmAddress({
      ctx,
      evmAddress: parsedTransfer.fromAddress,
      blockHeader,
    });
    const accountTo = await getOrCreateAccountByBoundEvmAddress({
      ctx,
      evmAddress: parsedTransfer.toAddress,
      blockHeader,
    });

    if (!accountFrom || !accountTo) continue;

    const asset = await getOrCreateMoneyMarketAsset({
      ctx,
      evmAddress: parsedTransfer.reserveAddress,
      ensure: true,
    });
    if (!asset) continue;

    const evmAssetId = asset.id;
    const evmAmount = BigInt(parsedTransfer.amount.toString());

    const fromEvent: BalanceEvent = {
      blockHeight: getBlockHeight(eventData),
      indexInBlock: getIndexInBlock(eventData),
      accountId: accountFrom.id,
      assetId: evmAssetId,
      isEvmAsset: true,
      transferableDelta: -evmAmount,
      totalLockedDelta: 0n,
      blockHeader,
    };
    const toEvent: BalanceEvent = {
      blockHeight: getBlockHeight(eventData),
      indexInBlock: getIndexInBlock(eventData),
      accountId: accountTo.id,
      assetId: evmAssetId,
      isEvmAsset: true,
      transferableDelta: evmAmount,
      totalLockedDelta: 0n,
      blockHeader,
    };
    eventSource.set(fromEvent, 'evm');
    eventSource.set(toEvent, 'evm');
    events.push(fromEvent, toEvent);
  }

  // Diagnostic: detect tuple-matching duplicates between Tokens.Transfer and
  // EVM.Log Transfer events that the assetRegistryId-based dedup did NOT catch.
  // If this fires in prod, the dedup rule is too narrow and we need to widen it
  // (e.g., per-extrinsic pair matching). Logs only — does not mutate events.
  const tupleGroups = new Map<
    string,
    { tokens: BalanceEvent[]; evm: BalanceEvent[] }
  >();
  for (const ev of events) {
    const src = eventSource.get(ev);
    if (!src) continue;
    const key = `${ev.accountId}|${ev.assetId}|${ev.blockHeight}|${ev.transferableDelta}|${ev.totalLockedDelta}`;
    let group = tupleGroups.get(key);
    if (!group) {
      group = { tokens: [], evm: [] };
      tupleGroups.set(key, group);
    }
    group[src].push(ev);
  }
  for (const [key, group] of tupleGroups.entries()) {
    if (group.tokens.length > 0 && group.evm.length > 0) {
      console.warn(
        `[balance-event-dup] tuple match across Tokens.Transfer and EVM.Log Transfer ` +
          `not removed by assetRegistryId dedup. key=${key} ` +
          `tokensCount=${group.tokens.length} evmCount=${group.evm.length} ` +
          `tokensIndexInBlock=[${group.tokens.map((e) => e.indexInBlock).join(',')}] ` +
          `evmIndexInBlock=[${group.evm.map((e) => e.indexInBlock).join(',')}]`
      );
    }
  }

  // Sort by block height, then indexInBlock (same as getOrderedListByBlockNumber)
  events = events
    .filter((e) => e.accountId !== ZERO_ADDRESS_PK)
    .sort((a, b) => {
      if (a.blockHeight !== b.blockHeight) return a.blockHeight - b.blockHeight;
      return a.indexInBlock - b.indexInBlock;
    });

  return events;
}

/**
 * Prefetch previous balances for ALL assets of accounts involved in balance
 * events. Fetches from account_asset_balance_historical_data (not _latest).
 * Skips accounts already present in cacheManager (loaded in previous batch).
 */
async function prefetchPreviousBalances({
  ctx,
  balanceEvents,
}: {
  ctx: SqdProcessorContext<Store>;
  balanceEvents: BalanceEvent[];
}): Promise<void> {
  const uniqueAccountIds = new Set<string>();

  for (const event of balanceEvents) {
    uniqueAccountIds.add(event.accountId);
  }

  if (uniqueAccountIds.size === 0) return;

  const batchStartBlockHeight = ctx.blocks[0].header.height;

  await LatestProcessedDataCacheManager.getInstance().prefetchAllAccountAssetBalances(
    {
      ctx,
      accountIds: Array.from(uniqueAccountIds),
      maxBlockHeight: batchStartBlockHeight,
    }
  );
}

/**
 * Find the latest balance state for a given account+asset pair.
 *
 * Checks two sources:
 * 1. accountAssetBalanceHistoricalData in batchState (current batch entities)
 * 2. LatestProcessedDataCacheManager (DB cache from previous batches)
 *
 * Returns the one with the newer blockHeight, looking for records at or before
 * the given processingBlockHeight.
 */
function findLatestBalanceState({
  accountId,
  assetId,
  processingBlockHeight,
  balanceSnapshotsAccumulator,
  ctx,
}: {
  accountId: string;
  assetId: string;
  processingBlockHeight: number;
  balanceSnapshotsAccumulator: Map<string, AccountBalanceBlockSnapshot>;
  ctx: SqdProcessorContext<Store>;
}): { transferable: bigint; totalLocked: bigint; blockHeight: number } | null {
  const cacheManager = LatestProcessedDataCacheManager.getInstance();

  // Source 0: events loop snapshots accumulator
  let latestSnapshot: AccountBalanceBlockSnapshot | null = null;
  let latestSnapshotHeight = -1;

  for (const snapshot of balanceSnapshotsAccumulator.values()) {
    if (
      snapshot.accountId === accountId &&
      snapshot.assetId === assetId &&
      snapshot.blockHeight <= processingBlockHeight
    ) {
      if (snapshot.blockHeight > latestSnapshotHeight) {
        latestSnapshot = snapshot;
        latestSnapshotHeight = snapshot.blockHeight;
      }
    }
  }

  if (latestSnapshot) return latestSnapshot;

  // Source 1: batchState - find latest record for this account+asset at or before processingBlockHeight
  let batchStateRecord: AccountAssetBalanceHistoricalData | null = null;
  let batchStateBlockHeight = -1;

  for (const entity of ctx.batchState.state.accountAssetBalanceHistoricalData.values()) {
    if (
      entity.accountId === accountId &&
      entity.assetId === assetId &&
      entity.paraBlockHeight <= processingBlockHeight
    ) {
      if (entity.paraBlockHeight > batchStateBlockHeight) {
        batchStateRecord = entity;
        batchStateBlockHeight = entity.paraBlockHeight;
      }
    }
  }

  // Source 2: cache manager
  const cachedRecord = cacheManager.getLastAccountAssetBalance(
    accountId,
    assetId
  );
  const cacheBlockHeight = cachedRecord?.paraBlockHeight ?? -1;

  // Pick the one with newer blockHeight
  if (batchStateRecord && batchStateBlockHeight >= cacheBlockHeight) {
    return {
      transferable: BigInt(batchStateRecord.transferable),
      totalLocked: BigInt(batchStateRecord.totalLocked),
      blockHeight: batchStateBlockHeight,
    };
  }

  if (cachedRecord && cacheBlockHeight >= 0) {
    return {
      transferable: BigInt(cachedRecord.transferable),
      totalLocked: BigInt(cachedRecord.totalLocked),
      blockHeight: cacheBlockHeight,
    };
  }

  return null;
}

/**
 * Process all balance events sequentially in on-chain order.
 *
 * Flow per the plan:
 * 1. Prefetch latest balances from DB into cache (blocks[0].height - 1)
 * 2. Collect all involved accounts, find those with no history (first activity)
 * 3. Init all balances for first-activity accounts via handleManyAccountBalancesInitCore
 * 4. Process events: skip delta at first-activity block, apply delta otherwise
 * 5. For balance lookup: check both batchState and cacheManager, prefer newer
 */
export async function processBalanceEventsSequentially({
  ctx,
  balanceEvents,
  preProcessedTotalBalancesOnGlobalInit,
  accountsForScheduledReaggregation,
}: {
  ctx: SqdProcessorContext<Store>;
  balanceEvents: BalanceEvent[];
  preProcessedTotalBalancesOnGlobalInit?: Set<string> | null;
  accountsForScheduledReaggregation?: Set<string>;
}): Promise<{
  allProcessedAccountsPerBlock: Map<number, Set<string>>;
}> {
  accountsForScheduledReaggregation =
    ctx.appConfig.ACCOUNTS_FOR_BALANCES_REFRESH || new Set();

  // Reorg/rollback safety: SQD's in-memory account-asset balance cache survives
  // across batches but is NOT invalidated when SQD rolls back DB state for a
  // re-orged block range. If the incoming batch starts at or before the highest
  // block height we have cached, those cached entries reflect a now-rolled-back
  // future — using them as "previous balance" would double-apply the deltas
  // when the same blocks are re-processed. Wipe and let prefetch refill from DB.
  LatestProcessedDataCacheManager.getInstance().invalidateAccountAssetBalanceCacheOnReorg(
    ctx.blocks[0].header.height
  );

  if (balanceEvents.length === 0) {
    return { allProcessedAccountsPerBlock: new Map() };
  }

  // Step 1: Prefetch previous balances from DB
  await prefetchPreviousBalances({ ctx, balanceEvents });

  const cacheManager = LatestProcessedDataCacheManager.getInstance();
  const allProcessedAccountsPerBlock = new Map<number, Set<string>>();

  // Step 2: Collect all involved accounts and find first activity block per account
  // accountsFirstActivityAtBlock: Map<AccountId, BlockNumber> - earliest block where account has activity
  const accountsFirstActivityAtBlock = new Map<string, number>();

  // Inject accounts for reaggregation.
  const firstBatchBlockHeight = ctx.blocks[0].header.height;
  for (const accountId of accountsForScheduledReaggregation.values()) {
    accountsFirstActivityAtBlock.set(accountId, firstBatchBlockHeight);
  }

  for (const event of balanceEvents) {
    if (
      !accountsFirstActivityAtBlock.has(event.accountId) ||
      (accountsFirstActivityAtBlock.has(event.accountId) &&
        accountsFirstActivityAtBlock.get(event.accountId)! > event.blockHeight)
    ) {
      accountsFirstActivityAtBlock.set(event.accountId, event.blockHeight);
    }
  }

  // Step 3: Identify accounts with NO prior DB history (check cache manager)
  // These need full RPC init via handleManyAccountBalancesInitCore.
  // Inject accounts for reaggregation.
  const firstEncounterAccountIdsSet: Set<string> = new Set(
    Array.from(accountsForScheduledReaggregation.values())
  );

  for (const [
    accountId,
    firstBlockHeight,
  ] of accountsFirstActivityAtBlock.entries()) {
    let hasAnyHistory = false;

    // Check if this account has any cached balance from previous batches
    for (const event of balanceEvents) {
      if (event.accountId !== accountId) continue;
      if (cacheManager.getLastAccountAssetBalance(accountId, event.assetId)) {
        hasAnyHistory = true;
        break;
      }
    }

    // Also check batchState (e.g., from handleAllAccountBalancesInit on cold start)
    if (!hasAnyHistory) {
      for (const entity of ctx.batchState.state.accountAssetBalanceHistoricalData.values()) {
        if (
          entity.accountId === accountId &&
          entity.paraBlockHeight <= firstBlockHeight
        ) {
          hasAnyHistory = true;
          break;
        }
      }
    }

    if (!hasAnyHistory) {
      firstEncounterAccountIdsSet.add(accountId);
    }
  }

  // Step 4: Init balances for first-encounter accounts using handleManyAccountBalancesInitCore
  // with forceFetch=true to bypass the hasAnyRecord guard (which skips init when DB has data).

  const accountsWithFirstBalancesInitPerBlock: Map<
    number,
    Set<string>
  > = new Map();

  if (firstEncounterAccountIdsSet.size > 0) {
    const accountsByBlock = new Map<number, string[]>();
    for (const accountId of firstEncounterAccountIdsSet.values()) {
      const blockHeight = accountsFirstActivityAtBlock.get(accountId)!;
      if (!accountsByBlock.has(blockHeight)) {
        accountsByBlock.set(blockHeight, []);
      }
      accountsByBlock.get(blockHeight)!.push(accountId);
    }

    console.time(
      'handleAssetAccountBalances:: eventsDriven:: initFirstEncounterAccounts'
    );
    await pMap(
      Array.from(accountsByBlock.entries()),
      async ([blockHeight, accountIds]) => {
        const processedAccountsToIgnoreInDeltaCalcFlow =
          await initManyAccountAssetBalancesFromOnChainData({
            ctx,
            blockHeight,
            whitelistedAccountIds: accountIds,
            forceFetch: true,
          });
        accountsWithFirstBalancesInitPerBlock.set(
          blockHeight,
          processedAccountsToIgnoreInDeltaCalcFlow?.get(blockHeight) ||
            new Set()
        );
      },
      {
        concurrency: ctx.appConfig.concurrency.RUNTIME_API_CALLS_CONCURRENCY,
      }
    );
    console.timeEnd(
      'handleAssetAccountBalances:: eventsDriven:: initFirstEncounterAccounts'
    );
  }

  // In case of indexer cold start, includes all initialized accounts to ignore
  // them in delta-based calculations.
  if (
    preProcessedTotalBalancesOnGlobalInit &&
    preProcessedTotalBalancesOnGlobalInit.size > 0
  ) {
    const accumulator =
      accountsWithFirstBalancesInitPerBlock.get(ctx.blocks[0].header.height) ||
      new Set();

    accountsWithFirstBalancesInitPerBlock.set(
      ctx.blocks[0].header.height,
      new Set([
        ...Array.from(accumulator.values()),
        ...Array.from(preProcessedTotalBalancesOnGlobalInit.values()),
      ])
    );
  }

  // Step 5: Process balance events sequentially
  // Track snapshots to create: key = `${accountId}-${assetId}-${blockHeight}`
  const snapshotsToCreate = new Map<string, AccountBalanceBlockSnapshot>();

  for (const event of balanceEvents) {
    if (event.accountId === ZERO_ADDRESS_PK) continue;

    if (!allProcessedAccountsPerBlock.has(event.blockHeight)) {
      allProcessedAccountsPerBlock.set(event.blockHeight, new Set());
    }
    allProcessedAccountsPerBlock.get(event.blockHeight)!.add(event.accountId);

    if (
      accountsWithFirstBalancesInitPerBlock.has(event.blockHeight) &&
      accountsWithFirstBalancesInitPerBlock
        .get(event.blockHeight)!
        .has(event.accountId)
    ) {
      // Balance already fetched from storage via handleManyAccountBalancesInitCore
      // and has final state (snapshot for whole block). Skip delta mutation.
      continue;
    }

    // DELTA MODE: find latest balance state and apply delta
    const snapshotKey = `${event.accountId}-${event.assetId}-${event.blockHeight}`;

    // Check if we already have a snapshot being built for this (account, asset, block)
    let currentBalance = snapshotsToCreate.get(snapshotKey);

    if (!currentBalance) {
      // Find latest balance from both sources
      const previousBalance = findLatestBalanceState({
        accountId: event.accountId,
        assetId: event.assetId,
        processingBlockHeight: event.blockHeight,
        balanceSnapshotsAccumulator: snapshotsToCreate,
        ctx,
      });

      if (previousBalance) {
        currentBalance = {
          accountId: event.accountId,
          assetId: event.assetId,
          isEvmAsset: event.isEvmAsset,
          blockHeight: event.blockHeight,
          blockHeader: event.blockHeader,
          transferable: previousBalance.transferable,
          totalLocked: previousBalance.totalLocked,
        };
      } else {
        // No prior history at all - new asset for this account, start from zero
        currentBalance = {
          accountId: event.accountId,
          assetId: event.assetId,
          isEvmAsset: event.isEvmAsset,
          blockHeight: event.blockHeight,
          blockHeader: event.blockHeader,
          transferable: 0n,
          totalLocked: 0n,
        };
      }
      snapshotsToCreate.set(snapshotKey, currentBalance);
    }

    // Apply delta
    currentBalance.transferable += event.transferableDelta;
    currentBalance.totalLocked += event.totalLockedDelta;

    // Safety: negative balance -> fall back to RPC
    if (currentBalance.transferable < 0n || currentBalance.totalLocked < 0n) {
      console.warn(
        `[events-driven-balances] Negative balance detected for ` +
          `${event.accountId}-${event.assetId} at block ${event.blockHeight}. ` +
          `transferable=${currentBalance.transferable}, totalLocked=${currentBalance.totalLocked}. ` +
          `event.transferableDelta=${event.transferableDelta.toString()}, event.totalLockedDelta=${event.totalLockedDelta}. ` +
          `Falling back to RPC.`
      );
      const rpcBalance = await fetchSingleBalanceFromRpc({
        ctx,
        accountId: event.accountId,
        assetId: event.assetId,
        isEvmAsset: event.isEvmAsset,
        blockHeader: event.blockHeader,
      });
      currentBalance.transferable = rpcBalance.transferable;
      currentBalance.totalLocked = rpcBalance.totalLocked;
    }
  }

  // Step 6: Create AccountAssetBalanceHistoricalData entities from snapshots
  for (const snapshot of snapshotsToCreate.values()) {
    const account = await getOrCreateAccount({
      ctx,
      id: snapshot.accountId,
    });

    const asset = await getOrCreateAsset({
      id: snapshot.assetId,
      ctx,
      ensure: false,
    });

    const assetId = asset?.id ?? snapshot.assetId;

    const entity = await getOrCreateAccountAssetBalanceHistoricalData({
      ctx,
      assetId,
      account,
      blockHeader: snapshot.blockHeader,
      fetchFromDb: false,
    });

    entity.transferable = snapshot.transferable;
    entity.totalLocked = snapshot.totalLocked;

    const assetSpotPrice = getAssetsPairPrice({
      ctx,
      assetInId: assetId,
      blockHeight: snapshot.blockHeight,
    });

    entity.transferableInRefAssetNorm =
      assetSpotPrice && asset?.decimals
        ? calcPriceNormalized({
            amount: snapshot.transferable,
            assetDecimals: asset.decimals,
            spotPrice: assetSpotPrice,
          })
        : '0';

    entity.totalLockedInRefAssetNorm =
      assetSpotPrice && asset?.decimals
        ? calcPriceNormalized({
            amount: snapshot.totalLocked,
            assetDecimals: asset.decimals,
            spotPrice: assetSpotPrice,
          })
        : '0';

    ctx.batchState.state.accountAssetBalanceHistoricalData.set(
      entity.id,
      entity
    );
  }

  return { allProcessedAccountsPerBlock };
}

/**
 * Fetch a single account+asset balance from RPC.
 * Used as negative-balance safety fallback.
 */
async function fetchSingleBalanceFromRpc({
  ctx,
  accountId,
  assetId,
  isEvmAsset,
  blockHeader,
}: {
  ctx: SqdProcessorContext<Store>;
  accountId: string;
  assetId: string;
  isEvmAsset: boolean;
  blockHeader: SqdBlock;
}): Promise<{ transferable: bigint; totalLocked: bigint }> {
  if (assetId === '0') {
    const nativeBalance = await parsers.storage.system.getSystemAccount(
      accountId,
      blockHeader
    );
    return {
      transferable: nativeBalance?.data?.free ?? 0n,
      totalLocked: nativeBalance?.data?.reserved ?? 0n,
    };
  }

  const asset = await getOrCreateAsset({ id: assetId, ctx, ensure: false });

  if (!asset) throw new Error(`Asset with id ${assetId} not found`);
  if (!asset?.evmAddress)
    throw new Error(`Asset with id ${assetId} doesn't have evmAddress`);

  const account = await getOrCreateAccount({ ctx, id: accountId });

  if (asset.resourceType === AssetResourceType.Debt || !asset.assetRegistryId) {
    const balance =
      await MoneyMarketContractsManager.getInstance().getAccountTokenBalanceWithLogs(
        {
          contractAddress: asset.evmAddress,
          accountAddress: account.boundEvmAddress!,
          blockNumber: blockHeader.height,
        }
      );
    return { transferable: balance ?? 0n, totalLocked: 0n };
  }

  const tokenBalance =
    await parsers.storage.tokens.getTokensAccountsAssetBalances(
      accountId,
      +asset.assetRegistryId,
      blockHeader
    );

  if (tokenBalance)
    return {
      transferable: tokenBalance?.free ?? 0n,
      totalLocked: tokenBalance?.reserved ?? 0n,
    };

  const balance =
    await MoneyMarketContractsManager.getInstance().getAccountTokenBalanceWithLogs(
      {
        contractAddress: asset.evmAddress,
        accountAddress: account.boundEvmAddress!,
        blockNumber: blockHeader.height,
      }
    );

  return { transferable: balance ?? 0n, totalLocked: 0n };
}

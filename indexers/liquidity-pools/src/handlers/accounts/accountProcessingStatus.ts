import { Account, AccountProcessingStatus } from '../../model';
import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { CommonPgPool } from '../../utils/pgConnectionManagers/pgPool';
import {
  getAccountProcessingStatusesToProcess,
  getWhitelistedAccountProcessingStatusesToProcess,
} from '../../utils/pgConnectionManagers/queries/getAccountProcessingStatusesToProcess';
import { In } from 'typeorm';
import { splitIntoBatches } from '../../utils/helpers';
import pMap from 'p-map';

export type RawAccountProcessingStatus = {
  id: string;
  balances_aggregated_at_para_block: number | null;
  mm_reserve_balances_initialized_at_para_block: number | null;
};

export function getNewAccountProcessingStatus({ id }: { id: string }) {
  return new AccountProcessingStatus({
    id,
    balancesAggregatedAtParaBlock: null,
    mmReserveBalancesInitializedAtParaBlock: null,
  });
}

export async function getOrCreateAccountProcessingStatus({
  ctx,
  id,
}: {
  ctx: SqdProcessorContext<Store>;
  id: string;
}): Promise<AccountProcessingStatus> {
  let accountProcessingStatus =
    ctx.batchState.state.accountProcessingStatuses.get(id);
  if (accountProcessingStatus) return accountProcessingStatus;

  accountProcessingStatus = await ctx.storeUtils.findOneWithLogs(
    AccountProcessingStatus,
    { where: { id } }
  );

  if (accountProcessingStatus) {
    ctx.batchState.state.accountProcessingStatuses.set(
      id,
      accountProcessingStatus
    );
    return accountProcessingStatus;
  }

  accountProcessingStatus = getNewAccountProcessingStatus({ id });

  ctx.batchState.state.accountProcessingStatuses.set(
    id,
    accountProcessingStatus
  );

  return accountProcessingStatus;
}

export async function updateAccountProcessingStatusOnTotalBalanceChange({
  ctx,
}: {
  ctx: SqdProcessorContext<Store>;
}) {
  for (const accountTotalBalance of ctx.batchState.state.accountTotalBalanceHistoricalData.values()) {
    const accountProcessingStatus = await getOrCreateAccountProcessingStatus({
      id: accountTotalBalance.accountId,
      ctx,
    });
    accountProcessingStatus.balancesAggregatedAtParaBlock =
      accountTotalBalance.paraBlockHeight;

    ctx.batchState.state.accountProcessingStatuses.set(
      accountProcessingStatus.id,
      accountProcessingStatus
    );
  }

  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.accountProcessingStatuses.values())
  );
}

/**
 * Mutates accountsFromSubstrateEventsPerBlock and allProcessedAccountsPerBlock
 * maps provided as arguments.
 */
// TODO refactor - remove redundancy
export async function addAccountsToPeriodicalBalancesAggregation({
  involvedAccountsAccumulators: {
    accountsFromSubstrateEventsPerBlock,
    allProcessedAccountsPerBlock,
  } = {
    accountsFromSubstrateEventsPerBlock: new Map(),
    allProcessedAccountsPerBlock: new Map(),
  },
  whitelistedAccountIds,
  ctx,
}: {
  involvedAccountsAccumulators: {
    accountsFromSubstrateEventsPerBlock: Map<number, Set<string>>;
    allProcessedAccountsPerBlock: Map<number, Set<string>>;
  };
  whitelistedAccountIds?: string[];
  ctx: SqdProcessorContext<Store>;
}) {
  if (!ctx.appConfig.ACCOUNT_BALANCES_REAGGREGATION_ENABLED) {
    console.log(`Periodical balances aggregation is disabled.`);
    return;
  }

  const allAccountsInBatch = new Set<string>();
  for (const accounts of allProcessedAccountsPerBlock.values()) {
    for (const accountId of accounts) {
      allAccountsInBatch.add(accountId);
    }
  }
  const pgPool = CommonPgPool.getInstance();

  let accountStatusesToProcess: RawAccountProcessingStatus[] = [];

  try {
    if (whitelistedAccountIds && whitelistedAccountIds.length > 0) {
      accountStatusesToProcess = (
        await pgPool.query<RawAccountProcessingStatus>(
          getWhitelistedAccountProcessingStatusesToProcess,
          [
            whitelistedAccountIds,
            ctx.appConfig.ACCOUNT_BALANCES_REAGGREGATION_MIN_PERIOD_BLOCKS,
            ctx.blocks[0].header.height,
          ]
        )
      ).rows;
    } else {
      accountStatusesToProcess = (
        await pgPool.query<RawAccountProcessingStatus>(
          getAccountProcessingStatusesToProcess,
          [
            Array.from(allAccountsInBatch.values()),
            ctx.appConfig.ACCOUNT_BALANCES_REAGGREGATION_BATCH_SIZE,
            ctx.appConfig.ACCOUNT_BALANCES_REAGGREGATION_MIN_PERIOD_BLOCKS,
            ctx.blocks[0].header.height,
          ]
        )
      ).rows;
    }
  } catch (e) {
    console.log(e);
  }

  if (accountStatusesToProcess.length === 0) return;

  /**
   * In case no accounts are involved in the current batch, we need to initialize
   * block slot for reaggregation process.
   */
  if (allProcessedAccountsPerBlock.size === 0) {
    allProcessedAccountsPerBlock.set(ctx.blocks[0].header.height, new Set());
  }
  if (accountsFromSubstrateEventsPerBlock.size === 0) {
    accountsFromSubstrateEventsPerBlock.set(
      ctx.blocks[0].header.height,
      new Set()
    );
  }

  const blockNumbers = Array.from(allProcessedAccountsPerBlock.keys());
  const lowestBlockToProcess =
    blockNumbers.length > 0
      ? Math.min(...blockNumbers)
      : ctx.blocks[0].header.height;

  if (lowestBlockToProcess === null) return;

  const accountProcessingStatusesToSave: AccountProcessingStatus[] = [];

  /**
   * We gonna reaggregate all scheduled account balances at first block of
   * the batch.
   */
  const blockSlotToReaggregateBalances =
    allProcessedAccountsPerBlock.get(lowestBlockToProcess);

  const substrateEventsBlockSlotToReaggregateBalances =
    accountsFromSubstrateEventsPerBlock.get(lowestBlockToProcess);

  if (
    !blockSlotToReaggregateBalances ||
    !substrateEventsBlockSlotToReaggregateBalances
  )
    return;

  const accountsToProcessInSchedule: Set<string> = new Set();

  for (const accStatus of accountStatusesToProcess) {
    blockSlotToReaggregateBalances.add(accStatus.id);
    substrateEventsBlockSlotToReaggregateBalances.add(accStatus.id);
    accountsToProcessInSchedule.add(accStatus.id);

    const accountProcessingStatus = await getOrCreateAccountProcessingStatus({
      id: accStatus.id,
      ctx,
    });

    accountProcessingStatus.balancesAggregatedAtParaBlock =
      lowestBlockToProcess;

    ctx.batchState.state.accountProcessingStatuses.set(
      accountProcessingStatus.id,
      accountProcessingStatus
    );

    accountProcessingStatusesToSave.push(accountProcessingStatus);
  }

  /**
   * Update aggregation status BEFORE performing the actual balance aggregation.
   *
   * This prevents infinite reaggregation loops for accounts with zero balances:
   * - Accounts with no balances don't generate assetBalanceHistoricalData records
   * - Without balance data, no totalBalance snapshot is created
   * - If we don't update the status here, these accounts would be reselected
   *   for reaggregation in every subsequent batch iteration
   *
   * By updating the status upfront, we ensure all accounts are marked as processed,
   * regardless of whether they have balances or not.
   */
  await ctx.storeUtils.upsertWithBatches(accountProcessingStatusesToSave);

  return accountsToProcessInSchedule;
}

export async function addAccountsToPeriodicalBalancesAggregationInDeltaFlow({
  involvedAccountsInBatch,
  whitelistedAccountIds,
  ctx,
}: {
  involvedAccountsInBatch: Set<string>;
  whitelistedAccountIds?: string[];
  ctx: SqdProcessorContext<Store>;
}) {
  if (!ctx.appConfig.ACCOUNT_BALANCES_REAGGREGATION_ENABLED) {
    console.log(`Periodical balances aggregation is disabled.`);
    return;
  }

  const pgPool = CommonPgPool.getInstance();

  let accountStatusesToProcess: RawAccountProcessingStatus[] = [];

  try {
    if (whitelistedAccountIds && whitelistedAccountIds.length > 0) {
      accountStatusesToProcess = (
        await pgPool.query<RawAccountProcessingStatus>(
          getWhitelistedAccountProcessingStatusesToProcess,
          [
            whitelistedAccountIds,
            ctx.appConfig.ACCOUNT_BALANCES_REAGGREGATION_MIN_PERIOD_BLOCKS,
            ctx.blocks[0].header.height,
          ]
        )
      ).rows;
    } else {
      accountStatusesToProcess = (
        await pgPool.query<RawAccountProcessingStatus>(
          getAccountProcessingStatusesToProcess,
          [
            Array.from(involvedAccountsInBatch.values()),
            ctx.appConfig.ACCOUNT_BALANCES_REAGGREGATION_BATCH_SIZE,
            ctx.appConfig.ACCOUNT_BALANCES_REAGGREGATION_MIN_PERIOD_BLOCKS,
            ctx.blocks[0].header.height,
          ]
        )
      ).rows;
    }
  } catch (e) {
    console.log(e);
  }

  if (accountStatusesToProcess.length === 0) return new Set<string>();

  const accountsToProcessInSchedule: Set<string> = new Set();

  const blockNumberOfStatusUpdate = ctx.blocks[0].header.height;

  const accountProcessingStatusesToSave: AccountProcessingStatus[] = [];

  for (const accStatus of accountStatusesToProcess) {
    accountsToProcessInSchedule.add(accStatus.id);

    const accountProcessingStatus = await getOrCreateAccountProcessingStatus({
      id: accStatus.id,
      ctx,
    });

    accountProcessingStatus.balancesAggregatedAtParaBlock =
      blockNumberOfStatusUpdate;

    ctx.batchState.state.accountProcessingStatuses.set(
      accountProcessingStatus.id,
      accountProcessingStatus
    );

    accountProcessingStatusesToSave.push(accountProcessingStatus);
  }

  /**
   * Update aggregation status BEFORE performing the actual balance aggregation.
   *
   * This prevents infinite reaggregation loops for accounts with zero balances:
   * - Accounts with no balances don't generate assetBalanceHistoricalData records
   * - Without balance data, no totalBalance snapshot is created
   * - If we don't update the status here, these accounts would be reselected
   *   for reaggregation in every subsequent batch iteration
   *
   * By updating the status upfront, we ensure all accounts are marked as processed,
   * regardless of whether they have balances or not.
   */
  await ctx.storeUtils.upsertWithBatches(accountProcessingStatusesToSave);

  return accountsToProcessInSchedule;
}

export async function prefetchOrInitAllAccountProcessingStatuses(
  ctx: SqdProcessorContext<Store>
) {
  for (const batch of splitIntoBatches(
    Array.from(ctx.batchState.state.accounts.keys()),
    ctx.appConfig.concurrency.BD_FETCH_BATCH_SIZE
  )) {
    const existingAccountStatuses = await ctx.storeUtils.findWithLogs(
      AccountProcessingStatus,
      {
        where: {
          id: In(batch),
        },
      },
      {
        className: 'AccountProcessingStatus',
      }
    );

    for (const accStatus of existingAccountStatuses)
      ctx.batchState.state.accountProcessingStatuses.set(
        accStatus.id,
        accStatus
      );
  }
}

export async function initAllAccountProcessingStatusesOnColdStart({
  ctx,
  keepExistingStatuses = false,
}: {
  ctx: SqdProcessorContext<Store>;
  keepExistingStatuses?: boolean;
}) {
  const hasAnyRecord = await ctx.storeUtils.findOneWithLogs(
    AccountProcessingStatus,
    {
      where: {},
    },
    { className: 'AccountProcessingStatus' }
  );

  if (!keepExistingStatuses && hasAnyRecord) return;

  const allPersistentAccounts = await ctx.storeUtils.findWithLogs(
    Account,
    {
      where: {},
    },
    { className: 'Account' }
  );

  const allExistingStatusIdsMap = keepExistingStatuses
    ? new Map(
        (
          await ctx.storeUtils.findWithLogs(
            AccountProcessingStatus,
            {
              where: {},
            },
            { className: 'AccountProcessingStatus' }
          )
        ).map((r) => [r.id, r])
      )
    : new Map();

  if (!allPersistentAccounts) return null;

  await pMap(
    allPersistentAccounts,
    async (account) => {
      if (allExistingStatusIdsMap.has(account.id)) {
        ctx.batchState.state.accountProcessingStatuses.set(
          account.id,
          allExistingStatusIdsMap.get(account.id)
        );
        return;
      }

      ctx.batchState.state.accountProcessingStatuses.set(
        account.id,
        getNewAccountProcessingStatus({ id: account.id })
      );
    },
    {
      concurrency:
        ctx.appConfig.concurrency.ASYNC_OPERATIONS_CONCURRENCY_COMMON,
    }
  );

  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.accountProcessingStatuses.values())
  );
}

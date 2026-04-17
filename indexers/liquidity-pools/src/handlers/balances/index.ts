import { SqdBlock, SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  collectAccountsAndAssetsInvolvedToSubstrateEvents,
  handleCommonAssetAccountBalances,
} from './commonAssetBalances';
import {
  collectAccountsAndAssetsInvolvedToMmEvents,
  handleMoneyMarketAssetBalancesForAccounts,
  handleMmAssetAccountBalancesPerBlock,
} from './moneyMarketAssetBalances';
import { EventName } from '../../parsers/types/events';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { EvmEventName } from '../../model';
import { handleAllAccountsMmPositionDataUpdate } from '../accounts/moneyMarketPosition';
import parsers from '../../parsers';
import {
  handleUnchangedAccountAssetBalances,
  handleAccountTotalBalance,
  handleLiquidityBalancesInTotalBalances,
} from './accountTotalBalance';
import {
  addAccountsToPeriodicalBalancesAggregation,
  updateAccountProcessingStatusOnTotalBalanceChange,
} from '../accounts/accountProcessingStatus';
import { prefetchBalancesForAccountsInvolvedToMmEvents } from './utils';
import { handleAllAccountBalancesInit } from './allAccountBalancesInit';
import {
  collectBalanceEvents,
  processBalanceEventsSequentially,
} from './eventsDrivenBalances';
import {
  handleAccountTotalBalanceEventsDriven,
} from './eventsDrivenTotalBalance';

/**
 * This function requires the following data, so it should be executed only after
 * execution appropriate aggregations:
 * - asset spot prices
 * - omnipool liquidity positions
 * - xyk liquidity mining deposits
 * @param ctx
 * @param parsedEvents
 */
export async function handleAssetAccountBalances(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  if (!ctx.appConfig.ENABLE_ACCOUNT_BALANCES_AGGREGATION) return;
  /**
   * IMPORTANT
   * Account Asset Balances are aggregated based on the following triggers/events:
   * - account's activity - if an account is involved to any event from a list of
   *    trigger events defined in ACCOUNT_BALANCE_AGGREGATION_TRIGGERS variable.
   *    If activity happened only in EMV environment, only involved accounts and
   *    only involved assets will be aggregated.
   * - [TODO] periodical balances check for all accounts for all previously
   *    tracked assets
   * - indexer cold start debt balances initialization - if indexer launched
   *    from not deep history, some accounts may already have balances of
   *    debt tokens. As indexer tracks debt token balance only in case debt token
   *    has been involved into EMV activity, we checks all accounts MM reserves
   *    and aggregate balances event without activity.
   *    (Check function "handleMoneyMarketAssetBalancesForAccounts")
   */

  let preProcessedTotalBalances = null;
  let allProcessedAccountsPerBlock: Map<number, Set<string>> = new Map();

  if (ctx.appConfig.ENABLE_ALL_ACCOUNT_BALANCES_INIT) {
    console.time('handleAllAccountBalancesInit');
    preProcessedTotalBalances = await handleAllAccountBalancesInit({ ctx });
    console.timeEnd('handleAllAccountBalancesInit');
  }

  if (ctx.appConfig.USE_EVENTS_DRIVEN_BALANCE_TRACKING) {
    /**
     * NEW: Events-driven delta-based balance tracking.
     * Uses Tokens/Balances events to compute balance changes instead of
     * fetching all balances from RPC.
     */
    console.time('handleAssetAccountBalances:: eventsDriven:: collect');
    const balanceEvents = await collectBalanceEvents(ctx, parsedEvents);
    console.timeEnd('handleAssetAccountBalances:: eventsDriven:: collect');

    console.time('handleAssetAccountBalances:: eventsDriven:: process');
    const result = await processBalanceEventsSequentially(ctx, balanceEvents);
    allProcessedAccountsPerBlock = result.allProcessedAccountsPerBlock;
    console.timeEnd('handleAssetAccountBalances:: eventsDriven:: process');

    /**
     * handleMoneyMarketAssetBalancesForAccounts is still needed because it
     * tracks balances for MM-related assets (underlying tokens like EWT)
     * that may not appear in Tokens pallet storage via getPairsPaged but
     * are accessible via MM contract calls. It skips pairs already processed
     * by the delta flow (checks batchState cache at line 426).
     */
    console.time(
      'handleAssetAccountBalances:: eventsDriven:: handleMoneyMarketAssetBalancesForAccounts'
    );
    // await handleMoneyMarketAssetBalancesForAccounts({
    //   allProcessedAccountsPerBlock,
    //   ctx,
    // });
    console.timeEnd(
      'handleAssetAccountBalances:: eventsDriven:: handleMoneyMarketAssetBalancesForAccounts'
    );
  } else {
    /**
     * OLD: RPC-based balance tracking flow (unchanged).
     */
    console.time('handleAssetAccountBalances:: collect');
    const mmEventsInvolvedAccountsAndAssets =
      await collectAccountsAndAssetsInvolvedToMmEvents(ctx);

    const involvedAccountsAccumulators =
      await collectAccountsAndAssetsInvolvedToSubstrateEvents({
        ctx,
        ...mmEventsInvolvedAccountsAndAssets,
      });
    console.timeEnd('handleAssetAccountBalances:: collect');

    allProcessedAccountsPerBlock =
      involvedAccountsAccumulators.allProcessedAccountsPerBlock;

    await addAccountsToPeriodicalBalancesAggregation({
      involvedAccountsAccumulators,
      ctx,
    });

    console.time(
      'handleAssetAccountBalances:: prefetchBalancesForAccountsInvolvedToMmEvents'
    );
    const prefetchedBalancesForAccountsInvolvedToMmEvents =
      await prefetchBalancesForAccountsInvolvedToMmEvents({
        ctx,
        involvedAccountsAndAssetsInMmEventsPerBlockMap:
          mmEventsInvolvedAccountsAndAssets.involvedAccountsAndAssetsInMmEventsPerBlockMap,
      });
    console.timeEnd(
      'handleAssetAccountBalances:: prefetchBalancesForAccountsInvolvedToMmEvents'
    );

    console.time(
      'handleAssetAccountBalances:: handleMmAssetAccountBalancesPerBlock'
    );
    await handleMmAssetAccountBalancesPerBlock({
      ctx,
      involvedAccountsAssetsPerBlockMap:
        mmEventsInvolvedAccountsAndAssets.involvedAccountsAndAssetsInMmEventsPerBlockMap,
      prefetchedBalancesForAccountsInvolvedToMmEvents,
    });
    console.timeEnd(
      'handleAssetAccountBalances:: handleMmAssetAccountBalancesPerBlock'
    );

    console.time(
      'handleAssetAccountBalances:: handleCommonAssetAccountBalances'
    );
    await handleCommonAssetAccountBalances({
      accountIdsToProcess: { ...involvedAccountsAccumulators },
      prefetchedBalancesForAccountsInvolvedToMmEvents,
      ctx,
    });
    console.timeEnd(
      'handleAssetAccountBalances:: handleCommonAssetAccountBalances'
    );

    console.time(
      'handleAssetAccountBalances:: handleMoneyMarketAssetBalancesForAccounts'
    );
    await handleMoneyMarketAssetBalancesForAccounts({
      allProcessedAccountsPerBlock,
      ctx,
    });
    console.timeEnd(
      'handleAssetAccountBalances:: handleMoneyMarketAssetBalancesForAccounts'
    );
  }

  if (ctx.appConfig.USE_EVENTS_DRIVEN_BALANCE_TRACKING) {
    /**
     * Events-driven flow: new total balance aggregation that includes
     * unchanged assets from cacheManager/DB in one pass.
     * Replaces both handleAccountTotalBalance and handleUnchangedAccountAssetBalances.
     */
    console.time(
      'handleAssetAccountBalances:: eventsDriven:: handleAccountTotalBalance'
    );
    await handleAccountTotalBalanceEventsDriven({
      ctx,
      preProcessedTotalBalances,
    });
    console.timeEnd(
      'handleAssetAccountBalances:: eventsDriven:: handleAccountTotalBalance'
    );
  } else {
    /**
     * OLD flow: original total balance + unchanged balances backfill.
     */
    console.time('handleAssetAccountBalances:: handleAccountTotalBalance');
    await handleAccountTotalBalance({
      ctx,
      preProcessedTotalBalances,
    });
    console.timeEnd('handleAssetAccountBalances:: handleAccountTotalBalance');
  }

  console.time(
    'handleAssetAccountBalances:: handleLiquidityBalancesInTotalBalances'
  );
  await handleLiquidityBalancesInTotalBalances({
    ctx,
    allProcessedAccountsPerBlock,
    preProcessedTotalBalances,
  });
  console.timeEnd(
    'handleAssetAccountBalances:: handleLiquidityBalancesInTotalBalances'
  );

  if (!ctx.appConfig.USE_EVENTS_DRIVEN_BALANCE_TRACKING) {
    console.time(
      'handleAssetAccountBalances:: handleUnchangedAccountAssetBalances'
    );
    await handleUnchangedAccountAssetBalances({ ctx });
    console.timeEnd(
      'handleAssetAccountBalances:: handleUnchangedAccountAssetBalances'
    );
  }

  console.time(
    'handleAssetAccountBalances:: updateAccountProcessingStatusOnTotalBalanceChange'
  );
  await updateAccountProcessingStatusOnTotalBalanceChange({ ctx });
  console.timeEnd(
    'handleAssetAccountBalances:: updateAccountProcessingStatusOnTotalBalanceChange'
  );
}

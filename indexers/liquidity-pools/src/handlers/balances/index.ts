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

  if (ctx.appConfig.ENABLE_ALL_ACCOUNT_BALANCES_INIT) {
    console.time('handleAllAccountBalancesInit');
    preProcessedTotalBalances = await handleAllAccountBalancesInit({ ctx });
    console.timeEnd('handleAllAccountBalancesInit');
  }

  /**
   * Aggregate accounts and assets involved to Money Market and Substrate events.
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

  /**
   * Add accounts to periodical balances aggregation.
   */
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

  /**
   * Handle Money Market events.
   *
   * Aggregate balances only for involved accounts and only for involved assets.
   */
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

  /**
   * Handle All Substrate events.
   *
   * Aggregate balances for all involved accounts and all account's assets.
   */
  console.time('handleAssetAccountBalances:: handleCommonAssetAccountBalances');
  await handleCommonAssetAccountBalances({
    accountIdsToProcess: { ...involvedAccountsAccumulators },
    prefetchedBalancesForAccountsInvolvedToMmEvents,
    ctx,
  });
  console.timeEnd(
    'handleAssetAccountBalances:: handleCommonAssetAccountBalances'
  );

  /**
   * Handle Money Market Assets balances
   */
  console.time(
    'handleAssetAccountBalances:: handleMoneyMarketAssetBalancesForAccounts'
  );
  await handleMoneyMarketAssetBalancesForAccounts({
    allProcessedAccountsPerBlock:
      involvedAccountsAccumulators.allProcessedAccountsPerBlock,
    ctx,
  });
  console.timeEnd(
    'handleAssetAccountBalances:: handleMoneyMarketAssetBalancesForAccounts'
  );

  /**
   * Aggregate Account Total Balances
   */
  console.time('handleAssetAccountBalances:: handleAccountTotalBalance');
  await handleAccountTotalBalance({
    ctx,
    preProcessedTotalBalances,
  });
  console.timeEnd('handleAssetAccountBalances:: handleAccountTotalBalance');

  /**
   * Include Liquidity Balances in Total Balances.
   */
  console.time(
    'handleAssetAccountBalances:: handleLiquidityBalancesInTotalBalances'
  );
  await handleLiquidityBalancesInTotalBalances({
    ctx,
    allProcessedAccountsPerBlock:
      involvedAccountsAccumulators.allProcessedAccountsPerBlock,
    preProcessedTotalBalances,
  });
  console.timeEnd(
    'handleAssetAccountBalances:: handleLiquidityBalancesInTotalBalances'
  );
  /**
   * Includes Asset Balances unchanged in the current block but existing in the
   * previous block.
   * IMPORTANT: Can mutate AccountTotalBalanceHistoricalData
   */
  console.time(
    'handleAssetAccountBalances:: handleUnchangedAccountAssetBalances'
  );
  await handleUnchangedAccountAssetBalances({ ctx });
  console.timeEnd(
    'handleAssetAccountBalances:: handleUnchangedAccountAssetBalances'
  );

  console.time(
    'handleAssetAccountBalances:: updateAccountProcessingStatusOnTotalBalanceChange'
  );
  await updateAccountProcessingStatusOnTotalBalanceChange({ ctx });
  console.timeEnd(
    'handleAssetAccountBalances:: updateAccountProcessingStatusOnTotalBalanceChange'
  );
}

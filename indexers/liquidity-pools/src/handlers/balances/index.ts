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
    preProcessedTotalBalances = await handleAllAccountBalancesInit(ctx);
    console.timeEnd('handleAllAccountBalancesInit');
  }

  /**
   * Aggregate accounts and assets involved to Money Market and Substrate events.
   */
  const mmEventsInvolvedAccountsAndAssets =
    await collectAccountsAndAssetsInvolvedToMmEvents(ctx);

  const involvedAccountsAccumulators =
    await collectAccountsAndAssetsInvolvedToSubstrateEvents({
      ctx,
      ...mmEventsInvolvedAccountsAndAssets,
    });

  /**
   * Add accounts to periodical balances aggregation.
   */
  await addAccountsToPeriodicalBalancesAggregation({
    involvedAccountsAccumulators,
    ctx,
  });

  const prefetchedBalancesForAccountsInvolvedToMmEvents =
    await prefetchBalancesForAccountsInvolvedToMmEvents({
      ctx,
      involvedAccountsAndAssetsInMmEventsPerBlockMap:
        mmEventsInvolvedAccountsAndAssets.involvedAccountsAndAssetsInMmEventsPerBlockMap,
    });

  /**
   * Handle Money Market events.
   *
   * Aggregate balances only for involved accounts and only for involved assets.
   */
  await handleMmAssetAccountBalancesPerBlock({
    ctx,
    involvedAccountsAssetsPerBlockMap:
      mmEventsInvolvedAccountsAndAssets.involvedAccountsAndAssetsInMmEventsPerBlockMap,
    prefetchedBalancesForAccountsInvolvedToMmEvents,
  });

  /**
   * Handle All Substrate events.
   *
   * Aggregate balances for all involved accounts and all account's assets.
   */
  await handleCommonAssetAccountBalances({
    accountIdsToProcess: { ...involvedAccountsAccumulators },
    prefetchedBalancesForAccountsInvolvedToMmEvents,
    ctx,
  });

  /**
   * Handle Money Market Assets balances
   */
  await handleMoneyMarketAssetBalancesForAccounts({
    allProcessedAccountsPerBlock:
      involvedAccountsAccumulators.allProcessedAccountsPerBlock,
    ctx,
  });

  /**
   * Aggregate Account Total Balances
   */
  await handleAccountTotalBalance({
    ctx,
    preProcessedTotalBalances,
  });

  /**
   * Include Liquidity Balances in Total Balances.
   */
  await handleLiquidityBalancesInTotalBalances({
    ctx,
    allProcessedAccountsPerBlock:
      involvedAccountsAccumulators.allProcessedAccountsPerBlock,
    preProcessedTotalBalances,
  });

  /**
   * Includes Asset Balances unchanged in the current block but existing in the
   * previous block.
   * IMPORTANT: Can mutate AccountTotalBalanceHistoricalData
   */
  await handleUnchangedAccountAssetBalances({ ctx });

  await updateAccountProcessingStatusOnTotalBalanceChange({ ctx });

  /**
   * Handle Oracle Updates.
   */

  const blocksWithOracleUpdate: Map<number, SqdBlock> = new Map();

  for (const event of Array.from(
    parsedEvents.getSectionByEventName(EventName.EVM_Log).values()
  )) {
    if (event.eventData.params?.eventName === EvmEventName.OracleUpdate)
      blocksWithOracleUpdate.set(
        event.eventData.metadata.blockHeader.height,
        event.eventData.metadata.blockHeader
      );
  }

  if (blocksWithOracleUpdate.size === 0) return;

  const latestBlockWithOracleUpdate = Array.from(
    blocksWithOracleUpdate.keys()
  ).sort((a, b) => b - a)[0];

  const allEvmAccounts =
    await parsers.storage.evmAccounts.getAllAccountsExtensions({
      block: blocksWithOracleUpdate.get(latestBlockWithOracleUpdate)!,
    });

  if (!allEvmAccounts) return;

  for (const blockHeader of blocksWithOracleUpdate.values()) {
    await handleAllAccountsMmPositionDataUpdate({
      allEvmAccounts,
      blockHeader,
      ctx,
    });
  }
}

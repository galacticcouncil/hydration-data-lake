import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { initAllAccountsOnColdStart } from '../../handlers/accounts/allAccountsInit';
import { handleRelayChainBlocks } from '../../handlers/relayChain';
import { ChainActivityTraceManager } from '../../chainActivityTracingManagers';
import {
  BatchBlocksParsedDataManager,
  getParsedEventsData,
} from '../../parsers/batchBlocksParser';
import { StorageResolver } from '../../parsers/storageResolver';
import {
  prefetchOrInitAllBatchAccounts,
  saveAllBatchAccounts,
} from '../../handlers/accounts';
import {
  addAccountsToPeriodicalBalancesAggregation,
  prefetchOrInitAllAccountProcessingStatuses,
  updateAccountProcessingStatusOnTotalBalanceChange,
} from '../../handlers/accounts/accountProcessingStatus';
import { MoneyMarketContractsManager } from '../../utils/evmTools/moneyMarketContractsManager';
import { prefetchGenericPersistentDataWithLogs } from '../prefetchHelpers';
import {
  actualiseAssets,
  ensureNativeToken,
} from '../../handlers/assets/utils';
import { initAllXykPools } from '../../handlers/pools/pools/xykPool/xykPool';
import { initAllXykLiquidityMiningDeposits } from '../../handlers/liquidity/xykpool/liquidityMining/depositsHandlers';
import { handleAssetRegistry } from '../../handlers/assets';
import { actualizeMoneyMarketReserves } from '../../handlers/moneyMarket/reserves/moneyMarketReserve';
import { handleMmReservesConfigsHistoricalData } from '../../handlers/moneyMarket/reserves';
import { handleLbpPools } from '../../handlers/pools/pools/lbpPool';
import { handleXykPools } from '../../handlers/pools/pools/xykPool';
import { ensureOmnipool } from '../../handlers/pools/pools/omnipool/omnipool';
import { handleOmnipoolAssets } from '../../handlers/pools/pools/omnipool';
import { initAllOmnipoolLiquidityPositions } from '../../handlers/liquidity/omnipool/liquidityPositions/liquidityPositionHandlers';
import { handleOmnipoolLiquidityPositions } from '../../handlers/liquidity/omnipool/liquidityPositions';
import { initAllOmnipoolLiquidityMiningDeposits } from '../../handlers/liquidity/omnipool/liquidityMining/depositHandlers';
import { handleOmnipoolLiquidityMiningEvents } from '../../handlers/liquidity/omnipool/liquidityMining';
import { handleXykPoolLiquidityMiningEvents } from '../../handlers/liquidity/xykpool/liquidityMining';
import { handleUniquesEvents } from '../../handlers/uniques';
import { handleStablepools } from '../../handlers/pools/pools/stableswap';
import { ensureAaveFacilitators } from '../../handlers/facilitator';
import { ensureHsmpool } from '../../handlers/pools/pools/hsmpool/hsmPool';
import { ensureHsmCollaterals } from '../../handlers/pools/pools/hsmpool/collaterals/hsmCollateral';
import { handleHsmCollateralEvents } from '../../handlers/pools/pools/hsmpool/collaterals';
import {
  handleAssetHistoricalData,
  handleAssetSpotPricesHistoricalData,
} from '../../handlers/assets/assetHistoricalData';
import { handleAavepoolHistoricalData } from '../../handlers/pools/pools/aavepool/historicalData';
import { handleStableswapHistoricalData } from '../../handlers/pools/pools/stableswap/historicalData';
import { handleOmnipoolHistoricalData } from '../../handlers/pools/pools/omnipool/historicalData';
import { handleXykPoolHistoricalData } from '../../handlers/pools/pools/xykPool/historicalData';
import { handleLbppoolHistoricalData } from '../../handlers/pools/pools/lbpPool/historicalData';
import { handleConstantsHistoricalData } from '../../handlers/constants/constantsHistoricalData';
import { handleTransactionPaymentHistoricalData } from '../../handlers/transactionPayment/historicalData';
import { handleOracles } from '../../handlers/oracles/emaOracle';
import { createMoneyMarketEventsFromRoutedTrades } from '../../handlers/moneyMarket/routedTradeToMmEventHandler';
import { handleBroadcastSwappedEvents } from '../../handlers/swap';
import { handleBuySellOperations } from '../../handlers/buySellOperations';
import { handleStablepoolLiquidityEvents } from '../../handlers/pools/pools/stableswap/liquidity';
import { handleEvm } from '../../handlers/evmLog';
import { handleLiquidationEvents } from '../../handlers/liquidation';
import { handleTransfers } from '../../handlers/transfers';
import { saveAllMoneyMarketEvents } from '../../handlers/moneyMarket';
import { HistoricalDataManager } from '../../handlers/historicalData';
import { ensurePoolsDestroyedStatus } from '../../handlers/pools/support';
import { handleEvmAccounts } from '../../handlers/evmAccounts';
import { handleAssetAccountBalances } from '../../handlers/balances';
import { processHsmpoolAssetBalanceHistoricalData } from '../../handlers/pools/pools/hsmpool/hsmpoolAssetHistData';
import { ProcessorStatusManager } from '../../processorStatusManager';
import { handleAllAccountBalancesInit } from '../../handlers/balances/allAccountBalancesInit';
import {
  collectAccountsAndAssetsInvolvedToMmEvents,
  handleMmAssetAccountBalancesPerBlock,
  handleMoneyMarketAssetBalancesForAccounts,
} from '../../handlers/balances/moneyMarketAssetBalances';
import {
  collectAccountsAndAssetsInvolvedToSubstrateEvents,
  handleCommonAssetAccountBalances,
} from '../../handlers/balances/commonAssetBalances';
import { prefetchBalancesForAccountsInvolvedToMmEvents } from '../../handlers/balances/utils';
import {
  handleAccountTotalBalance,
  handleLiquidityBalancesInTotalBalances,
  handleUnchangedAccountAssetBalances,
} from '../../handlers/balances/accountTotalBalance';
import { Account, Asset, AssetSpotPriceHistoricalData } from '../../model';
import { Pool } from 'pg';
import { CommonPgPool } from '../../utils/pgConnectionManagers/pgPool';
import { AppConfig } from '../../appConfig';
import { correlateAssetSpotPrices } from '../utils';
import { LatestProcessedDataCacheManager } from '../../utils/latestProcessedDataCacheManager';

const appConfig = AppConfig.getInstance();

export async function whitelistedAccountBalancesTrackingProcessor(
  ctx: SqdProcessorContext<Store>
) {
  if (!ctx.appConfig.processingMode.ALL_IN_ONE_PROCESSOR_MODE) return;

  let parsedData = null;

  console.time('initAllAccountsOnColdStart');
  await initAllAccountsOnColdStart({ ctx });
  console.timeEnd('initAllAccountsOnColdStart');

  await Promise.all([
    (async () => {
      await handleRelayChainBlocks(ctx);

      console.time('processExtrinsics');
      await ChainActivityTraceManager.processExtrinsics(ctx);
      console.timeEnd('processExtrinsics');

      console.time('saveActivityTraceEntities');
      await ChainActivityTraceManager.saveActivityTraceEntities(ctx);
      console.timeEnd('saveActivityTraceEntities');

      console.time('getParsedEventsData');
      /**
       * getParsedEventsData must be executed ONLY after
       * ChainActivityTraceManager.processExtrinsics method execution, because
       * getParsedEventsData needs already compiled traceIds.
       */
      parsedData = await getParsedEventsData(ctx);
      console.timeEnd('getParsedEventsData');

      await StorageResolver.getInstance().init({
        ctx: ctx,
        blockNumberFrom: ctx.blocks[0].header.height,
        blockNumberTo: ctx.blocks[ctx.blocks.length - 1].header.height,
      });

      await prefetchOrInitAllBatchAccounts(ctx);
      await prefetchOrInitAllAccountProcessingStatuses(ctx);
    })(),
    (async () => {
      console.time('initContractInstances');
      await MoneyMarketContractsManager.getInstance().initContractInstances({
        ctx: ctx,
        blockNumber: ctx.blocks[ctx.blocks.length - 1].header.height,
      });
      console.timeEnd('initContractInstances');
      return null;
    })(),
    prefetchGenericPersistentDataWithLogs(ctx, false),
  ]);

  if (!parsedData) throw new Error('parsedData is null');

  await ensureNativeToken(ctx);

  console.time('actualiseAssets');
  await actualiseAssets(ctx);
  console.timeEnd('actualiseAssets');

  console.time('initAllXykPools');
  await initAllXykPools({
    ctx,
    blockHeader: ctx.blocks[ctx.blocks.length - 1].header,
  });
  console.timeEnd('initAllXykPools');

  console.time('initAllXykLiquidityMiningDeposits');
  await initAllXykLiquidityMiningDeposits(ctx);
  console.timeEnd('initAllXykLiquidityMiningDeposits');

  console.time('handleAssetRegistry');
  await handleAssetRegistry(ctx, parsedData);
  console.timeEnd('handleAssetRegistry');

  console.time('actualizeMoneyMarketReserves');
  await actualizeMoneyMarketReserves({
    ctx,
  });
  console.timeEnd('actualizeMoneyMarketReserves');

  // console.time('handleMmReservesConfigsHistoricalData');
  // await handleMmReservesConfigsHistoricalData(ctx, parsedData);
  // console.timeEnd('handleMmReservesConfigsHistoricalData');

  console.time('handleLbpPools');
  await handleLbpPools(ctx, parsedData);
  console.timeEnd('handleLbpPools');

  console.time('handleXykPools');
  await handleXykPools(ctx, parsedData);
  console.timeEnd('handleXykPools');

  console.time('handleOmnipoolAssets');
  await ensureOmnipool(ctx);
  await handleOmnipoolAssets(ctx, parsedData);
  console.timeEnd('handleOmnipoolAssets');

  console.time('initAllOmnipoolLiquidityPositions');
  await initAllOmnipoolLiquidityPositions(ctx);
  console.timeEnd('initAllOmnipoolLiquidityPositions');

  console.time('handleOmnipoolLiquidityPositions');
  await handleOmnipoolLiquidityPositions(ctx, parsedData);
  console.timeEnd('handleOmnipoolLiquidityPositions');

  console.time('initAllOmnipoolLiquidityMiningDeposits');
  await initAllOmnipoolLiquidityMiningDeposits(ctx);
  console.timeEnd('initAllOmnipoolLiquidityMiningDeposits');

  console.time('handleOmnipoolLiquidityMiningEvents');
  await handleOmnipoolLiquidityMiningEvents(ctx, parsedData);
  console.timeEnd('handleOmnipoolLiquidityMiningEvents');

  console.time('handleXykPoolLiquidityMiningEvents');
  await handleXykPoolLiquidityMiningEvents(ctx, parsedData);
  console.timeEnd('handleXykPoolLiquidityMiningEvents');

  console.time('handleUniquesEvents');
  await handleUniquesEvents(ctx, parsedData);
  console.timeEnd('handleUniquesEvents');

  console.time('handleStablepools');
  await handleStablepools(ctx, parsedData);
  console.timeEnd('handleStablepools');

  console.time('ensureAaveFacilitators');
  await ensureAaveFacilitators(ctx);
  console.timeEnd('ensureAaveFacilitators');

  console.time('ensureHsmpool && ensureHsmCollaterals');
  await ensureHsmpool(ctx);
  await ensureHsmCollaterals(ctx);
  console.timeEnd('ensureHsmpool && ensureHsmCollaterals');

  console.time('handleHsmCollateralEvents');
  await handleHsmCollateralEvents(ctx, parsedData);
  console.timeEnd('handleHsmCollateralEvents');

  /**
   * functions handleConstantsHistoricalData, handleAssetHistoricalData,
   * handleAssetSpotPricesHistoricalData must be executed in strict order.
   */
  // console.time('handleAssetHistoricalData');
  // await handleAssetHistoricalData({ ctx });
  // console.timeEnd('handleAssetHistoricalData');
  //
  // console.time('handleAavepoolHistoricalData');
  // await handleAavepoolHistoricalData(ctx, parsedData);
  // console.timeEnd('handleAavepoolHistoricalData');
  //
  // console.time('handleStableswapHistoricalData');
  // await handleStableswapHistoricalData(ctx, parsedData);
  // console.timeEnd('handleStableswapHistoricalData');
  //
  // console.time('handleOmnipoolHistoricalData');
  // await handleOmnipoolHistoricalData(ctx, parsedData);
  // console.timeEnd('handleOmnipoolHistoricalData');
  //
  // console.time('handleXykPoolHistoricalData');
  // await handleXykPoolHistoricalData(ctx, parsedData);
  // console.timeEnd('handleXykPoolHistoricalData');
  //
  // console.time('handleLbppoolHistoricalData');
  // await handleLbppoolHistoricalData(ctx, parsedData);
  // console.timeEnd('handleLbppoolHistoricalData');
  //
  // console.time('handleConstantsHistoricalData');
  // await handleConstantsHistoricalData(ctx);
  // console.timeEnd('handleConstantsHistoricalData');
  //
  // console.time('handleTransactionPaymentHistoricalData');
  // await handleTransactionPaymentHistoricalData(ctx);
  // console.timeEnd('handleTransactionPaymentHistoricalData');
  //
  // console.time('handleOracles');
  // await handleOracles(ctx);
  // console.timeEnd('handleOracles');
  //
  // console.time('handleAssetSpotPricesHistoricalData');
  // await handleAssetSpotPricesHistoricalData({ ctx });
  // console.timeEnd('handleAssetSpotPricesHistoricalData');

  ctx.batchState.state.assetsSpotPriceHistoricalDataBatch =
    await RemoteSpotPricesDictionary.getInstance().getAssetSpotPriceHistoricalDataForBlocksRange(
      {
        fromBlock: ctx.blocks[0].header.height,
        toBlock: ctx.blocks[ctx.blocks.length - 1].header.height,
        ctx,
      }
    );

  if (ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.size === 0)
    throw new Error('Spot prices not found in remote dictionary.');

  correlateAssetSpotPrices(ctx);

  // console.time('handleBroadcastSwappedEvents');
  // await handleBroadcastSwappedEvents(ctx, parsedData);
  // console.timeEnd('handleBroadcastSwappedEvents');
  //
  // console.time('handleBuySellOperations');
  // await handleBuySellOperations(ctx, parsedData);
  // console.timeEnd('handleBuySellOperations');

  console.time('handleStablepoolLiquidityEvents');
  await handleStablepoolLiquidityEvents(ctx, parsedData);
  console.timeEnd('handleStablepoolLiquidityEvents');
  //
  // console.time('handleDcaSchedules');
  // await handleDcaSchedules(ctx, parsedData);
  // console.timeEnd('handleDcaSchedules');
  //
  // console.time('handleOtcOrders');
  // await handleOtcOrders(ctx, parsedData);
  // console.timeEnd('handleOtcOrders');

  // if (ctx.isHead)
  //   await handlePoolPrices(ctx);

  console.time('createMmWithdrawalEventsFromRoutedTrades');
  await createMoneyMarketEventsFromRoutedTrades(ctx, [
    ...ctx.batchState.state.routeTrades.values(),
  ]);
  console.timeEnd('createMmWithdrawalEventsFromRoutedTrades');

  console.time('handleEvm');
  await handleEvm(ctx, parsedData);
  console.timeEnd('handleEvm');

  console.time('handleLiquidationEvents');
  await handleLiquidationEvents(ctx, parsedData);
  console.timeEnd('handleLiquidationEvents');

  // console.time('handleAccountMmPositionData');
  // await handleAccountMmPositionData(ctx, parsedData);
  // console.timeEnd('handleAccountMmPositionData');

  console.time('handleTransfers');
  await handleTransfers(ctx, parsedData);
  console.timeEnd('handleTransfers');

  // await saveAllMoneyMarketEvents(ctx);

  // await HistoricalDataManager.saveAccountMoneyMarketDataBulk(ctx);

  console.time('ensurePoolsDestroyedStatus');
  await ensurePoolsDestroyedStatus(ctx);
  console.timeEnd('ensurePoolsDestroyedStatus');

  console.time('handleEvmAccounts');
  await handleEvmAccounts(ctx, parsedData);
  console.timeEnd('handleEvmAccounts');

  // console.time('handleAssetPairVolumesHistoricalData');
  // await handleAssetPairVolumesHistoricalData({ ctx });
  // console.timeEnd('handleAssetPairVolumesHistoricalData');

  console.time('handleWhitelistedAssetAccountBalances');
  await handleWhitelistedAssetAccountBalances(ctx, parsedData);
  console.timeEnd('handleWhitelistedAssetAccountBalances');

  // console.time('processAssetNormalizedVolumes');
  // await processAssetNormalizedVolumes({ ctx });
  // console.timeEnd('processAssetNormalizedVolumes');

  // console.time('processPoolsNormalizedVolumes');
  // await processPoolsNormalizedVolumes({ ctx });
  // console.timeEnd('processPoolsNormalizedVolumes');

  // console.time('processHsmpoolAssetBalanceHistoricalData');
  // await processHsmpoolAssetBalanceHistoricalData({ ctx });
  // console.timeEnd('processHsmpoolAssetBalanceHistoricalData');

  // console.time('processPoolsTvlNormalized');
  // processPoolsTvlNormalized({ ctx });
  // console.timeEnd('processPoolsTvlNormalized');

  console.time('saveAllBatchAccounts');
  await saveAllBatchAccounts(ctx);
  console.timeEnd('saveAllBatchAccounts');
  //
  // console.time('saveHistoricalDataBulk');
  // await HistoricalDataManager.saveHistoricalDataBulk(ctx);
  // console.timeEnd('saveHistoricalDataBulk');

  // console.time('saveActivityTraceEntities');
  // await ChainActivityTraceManager.saveActivityTraceEntities(ctx);
  // console.timeEnd('saveActivityTraceEntities');

  // console.time('saveDcaEntities');
  // await saveDcaEntities(ctx);
  // console.timeEnd('saveDcaEntities');
  //
  // console.time('handleHistoricalVolumesBatchEntriesLists');
  // await HistoricalDataManager.handleHistoricalVolumesBatchEntriesLists(ctx);
  // console.timeEnd('handleHistoricalVolumesBatchEntriesLists');

  console.time('saveAccountBalancesRelatedDataBulk');
  await HistoricalDataManager.saveAccountBalancesRelatedDataBulk(ctx);
  console.timeEnd('saveAccountBalancesRelatedDataBulk');

  LatestProcessedDataCacheManager.getInstance().setLastAssetSpotPriceHistoricalDataItem(
    Array.from(ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.values())
  );

  console.time('updateInitialIndexingFinishedAtTime');
  await ProcessorStatusManager.updateInitialIndexingFinishedAtTime(ctx);
  console.timeEnd('updateInitialIndexingFinishedAtTime');

  await ProcessorStatusManager.getInstance(ctx).updateProcessorStatus({
    latestProcessedBlock: ctx.blocks[ctx.blocks.length - 1].header.height,
  });
}

async function handleWhitelistedAssetAccountBalances(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  const whitelistedAccountIdsSet =
    appConfig.WHITELISTED_ACCOUNTS_TO_TRACK_BALANCES;

  let preProcessedTotalBalances = null;

  if (ctx.appConfig.ENABLE_ALL_ACCOUNT_BALANCES_INIT) {
    console.time('handleAllAccountBalancesInit');
    preProcessedTotalBalances = await handleAllAccountBalancesInit({
      ctx,
      whitelistedAccountIds: Array.from(whitelistedAccountIdsSet.values()),
    });
    console.timeEnd('handleAllAccountBalancesInit');
  }

  /**
   * Aggregate accounts and assets involved to Money Market and Substrate events.
   */
  console.time('handleAssetAccountBalances:: collect');
  const mmEventsInvolvedAccountsAndAssets =
    await collectAccountsAndAssetsInvolvedToMmEvents(ctx);

  for (const item of mmEventsInvolvedAccountsAndAssets.involvedAccountsAndAssetsInMmEventsPerBlockMap.values()) {
    const accumulator: Map<
      string,
      {
        account: Account;
        assets: Map<string, Asset>;
      }
    > = new Map();

    inLoop: for (const accData of item.accountsAssetsMap.values()) {
      const accountId = accData.account.id;
      if (!whitelistedAccountIdsSet.has(accountId)) continue inLoop;
      accumulator.set(accountId, accData);
    }
    item.accountsAssetsMap = accumulator;
  }

  for (const [
    blockHeight,
    idsSet,
  ] of mmEventsInvolvedAccountsAndAssets.allProcessedAccountsPerBlock.entries()) {
    const accumulator: Set<string> = new Set();

    innerLoop: for (const id of idsSet.values()) {
      if (!whitelistedAccountIdsSet.has(id)) continue innerLoop;
      accumulator.add(id);
    }
    mmEventsInvolvedAccountsAndAssets.allProcessedAccountsPerBlock.set(
      blockHeight,
      accumulator
    );
  }

  for (const [
    blockHeight,
    idsSet,
  ] of mmEventsInvolvedAccountsAndAssets.accountIdsWithCommonAssetBalanceChanges.entries()) {
    const accumulator: Set<string> = new Set();

    innerLoop: for (const id of idsSet.values()) {
      if (!whitelistedAccountIdsSet.has(id)) continue innerLoop;
      accumulator.add(id);
    }
    mmEventsInvolvedAccountsAndAssets.accountIdsWithCommonAssetBalanceChanges.set(
      blockHeight,
      accumulator
    );
  }

  const involvedAccountsAccumulators =
    await collectAccountsAndAssetsInvolvedToSubstrateEvents({
      ctx,
      ...mmEventsInvolvedAccountsAndAssets,
    });
  console.timeEnd('handleAssetAccountBalances:: collect');

  for (const [
    blockHeight,
    idsSet,
  ] of involvedAccountsAccumulators.allProcessedAccountsPerBlock.entries()) {
    const accumulator: Set<string> = new Set();

    for (const id of idsSet.values()) {
      if (!whitelistedAccountIdsSet.has(id)) continue;
      accumulator.add(id);
    }
    involvedAccountsAccumulators.allProcessedAccountsPerBlock.set(
      blockHeight,
      accumulator
    );
  }

  for (const [
    blockHeight,
    idsSet,
  ] of involvedAccountsAccumulators.accountsFromSubstrateEventsPerBlock.entries()) {
    const accumulator: Set<string> = new Set();

    for (const id of idsSet.values()) {
      if (!whitelistedAccountIdsSet.has(id)) continue;
      accumulator.add(id);
    }
    involvedAccountsAccumulators.accountsFromSubstrateEventsPerBlock.set(
      blockHeight,
      accumulator
    );
  }

  /**
   * Add accounts to periodical balances aggregation.
   */
  await addAccountsToPeriodicalBalancesAggregation({
    involvedAccountsAccumulators,
    whitelistedAccountIds: Array.from(whitelistedAccountIdsSet.values()),
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

class RemoteSpotPricesDictionary {
  private static instance: RemoteSpotPricesDictionary;

  public pool: CommonPgPool;

  private getAssetSpotPricesByBlockRangeQuery = `
        SELECT id,
               asset_in_id,
               asset_out_id,
               price,
               price_normalised,
               para_block_height
        FROM public.asset_spot_price_historical_data 
        WHERE para_block_height >= $1 AND para_block_height <= $2
        ORDER BY para_block_height ASC;`;

  static getInstance(): RemoteSpotPricesDictionary {
    if (!RemoteSpotPricesDictionary.instance) {
      RemoteSpotPricesDictionary.instance = new RemoteSpotPricesDictionary();
    }
    return RemoteSpotPricesDictionary.instance;
  }

  private constructor() {
    if (
      !appConfig.REMOTE_ASSET_SPOT_PRICES_DICTIONARY_DB_CON_STRING ||
      appConfig.REMOTE_ASSET_SPOT_PRICES_DICTIONARY_DB_CON_STRING.length === 0
    )
      throw new Error(
        'Remote spot prices dictionary DB connection string is not set'
      );

    this.pool = new CommonPgPool({
      connectionString:
        appConfig.REMOTE_ASSET_SPOT_PRICES_DICTIONARY_DB_CON_STRING,
      readOnly: true,
      maxPoolSize: 1,
    });
  }

  async getAssetSpotPriceHistoricalDataForBlocksRange({
    fromBlock,
    toBlock,
    ctx,
  }: {
    fromBlock: number;
    toBlock: number;
    ctx: SqdProcessorContext<Store>;
  }) {
    const spotPricesAccumulatorMap: Map<string, AssetSpotPriceHistoricalData> =
      new Map();

    console.log();
    const result = await this.pool.query(
      this.getAssetSpotPricesByBlockRangeQuery,
      [fromBlock, toBlock]
    );

    if (!result || result.rows.length === 0) {
      throw new Error('Spot prices not found in remote dictionary.');
    }

    await LatestProcessedDataCacheManager.getInstance().prefetchLastAssetSpotPriceHistDataItem(
      {
        ctx,
        blockHeader: ctx.batchState.getBlockHeaderByBlockHeight(fromBlock),
        dbPool: this.pool,
        enforcePrefetch: true,
      }
    );

    for (const price of LatestProcessedDataCacheManager.getInstance()
      .getAllCachedLastAssetSpotPriceHistoricalDataItems()
      .values()) {
      spotPricesAccumulatorMap.set(price.id, price);
    }

    for (const {
      id,
      asset_in_id,
      asset_out_id,
      price,
      price_normalised,
      para_block_height,
    } of result.rows) {
      spotPricesAccumulatorMap.set(
        id,
        new AssetSpotPriceHistoricalData({
          id: id,
          assetInId: asset_in_id,
          assetOutId: asset_out_id,
          price: BigInt(price),
          priceNormalised: price_normalised,
          paraBlockHeight: para_block_height,
          priceRoute: null,
        })
      );
    }

    return spotPricesAccumulatorMap;
  }
}

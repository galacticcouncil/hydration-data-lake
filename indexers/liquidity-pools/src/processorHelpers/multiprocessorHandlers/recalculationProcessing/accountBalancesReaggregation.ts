import { Between } from 'typeorm/find-options/operator/Between';

import { Store } from '@subsquid/typeorm-store';

import {
  AccountAssetBalanceHistoricalData,
  Asset,
  AssetsPairVolumeHistoricalData,
  AssetSpotPriceHistoricalData,
  AssetVolumeHistoricalData,
  Block,
  HsmpoolAssetHistoricalData,
  LbppoolVolumeHistoricalData,
  MoneyMarketEvent,
  OmnipoolAssetVolumeHistoricalData,
  RoutedTrade,
  StableswapAssetVolumeHistoricalData,
  StableswapVolumeHistoricalData,
  Swap,
  SwapAssetBalanceType,
  XykpoolVolumeHistoricalData,
} from '../../../model';
import { SqdProcessorContext } from '../../../processor';
import { ProcessorStatusManager } from '../../../processorStatusManager';
import {
  prefetchGenericPersistentData,
  prefetchGenericPersistentDataWithLogs,
} from '../../prefetchHelpers';
import {
  getOldAssetVolume,
  handleAssetVolumeUpdates,
  processAssetNormalizedVolumes,
} from '../../../handlers/assets/volume';
import { BigNumber } from '@galacticcouncil/sdk';
import {
  getOldLbpVolume,
  getOldOmnipoolAssetVolume,
  getOldStablepoolAssetVolume,
  getOldStablepoolVolume,
  getOldXykVolume,
  getPoolAssetPreviousVolumeFromCache,
  getPoolPreviousVolumeFromCache,
} from '../../../handlers/pools/volumes';
import { getOldHsmAssetHistDataEntity } from '../../../handlers/pools/pools/hsmpool/hsmpoolAssetHistData';
import { HistoricalDataManager } from '../../../handlers/historicalData';
import { LatestProcessedDataCacheManager } from '../../../utils/latestProcessedDataCacheManager';
import { handleRelayChainBlocks } from '../../../handlers/relayChain';
import { ChainActivityTraceManager } from '../../../chainActivityTracingManagers';
import { getParsedEventsData } from '../../../parsers/batchBlocksParser';
import { StorageResolver } from '../../../parsers/storageResolver';
import { prefetchOrInitAllBatchAccounts } from '../../../handlers/accounts';
import { MoneyMarketContractsManager } from '../../../utils/evmTools/moneyMarketContractsManager';
import {
  addAccountsToPeriodicalBalancesAggregation,
  initAllAccountProcessingStatusesOnColdStart,
  prefetchOrInitAllAccountProcessingStatuses,
  updateAccountProcessingStatusOnTotalBalanceChange,
} from '../../../handlers/accounts/accountProcessingStatus';
import { handleEvm } from '../../../handlers/evmLog';
import { saveAllMoneyMarketEvents } from '../../../handlers/moneyMarket';
import { createMoneyMarketEventsFromRoutedTrades } from '../../../handlers/moneyMarket/routedTradeToMmEventHandler';
import {
  collectAccountsAndAssetsInvolvedToMmEvents,
  handleMmAssetAccountBalancesPerBlock,
  handleMoneyMarketAssetBalancesForAccounts,
} from '../../../handlers/balances/moneyMarketAssetBalances';
import {
  collectAccountsAndAssetsInvolvedToSubstrateEvents,
  handleCommonAssetAccountBalances,
} from '../../../handlers/balances/commonAssetBalances';
import { prefetchBalancesForAccountsInvolvedToMmEvents } from '../../../handlers/balances/utils';
import {
  handleAccountTotalBalance,
  handleLiquidityBalancesInTotalBalances,
  handleUnchangedAccountAssetBalances,
} from '../../../handlers/balances/accountTotalBalance';

export async function handleAccountBalancesReaggregation(
  ctx: SqdProcessorContext<Store>
) {
  if (!ctx.appConfig.processingMode.ALL_IN_ONE_PROCESSOR_MODE) return;

  /**
   * Before reaggregation start following tables must be truncated:
   *  - account_processing_status
   *  - account_total_balance_historical_data
   *  - account_asset_balance_latest
   *
   */

  console.log('handleAccountBalancesReaggregation');

  let parsedData = null;

  await Promise.all([
    (async () => {
      await handleRelayChainBlocks(ctx);

      console.time('processExtrinsics');
      await ChainActivityTraceManager.processExtrinsics(ctx);
      console.timeEnd('processExtrinsics');

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

  ctx.batchState.state.moneyMarketEvents = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        MoneyMarketEvent,
        {
          where: {
            paraBlockHeight: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          relations: {
            event: {
              block: true,
            },
          },
          order: {
            paraBlockHeight: 'ASC',
          },
        },
        { className: 'AssetSpotPriceHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.assetsSpotPriceHistoricalDataBatch = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        AssetSpotPriceHistoricalData,
        {
          where: {
            paraBlockHeight: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          order: {
            paraBlockHeight: 'ASC',
          },
        },
        { className: 'AssetSpotPriceHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );

  console.time('prefetchLastAssetSpotPriceHistDataItem');

  await LatestProcessedDataCacheManager.getInstance().prefetchLastAssetSpotPriceHistDataItem(
    ctx,
    ctx.blocks[0].header
  );

  const spotPricesFromPreviousBatch =
    LatestProcessedDataCacheManager.getInstance().getAllCachedLastAssetSpotPriceHistoricalDataItems();

  for (const prevBatchSpotPrice of spotPricesFromPreviousBatch.values()) {
    ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.set(
      prevBatchSpotPrice.id,
      prevBatchSpotPrice
    );
  }

  correlateAssetSpotPrices(ctx);

  console.timeEnd('prefetchLastAssetSpotPriceHistDataItem');

  /**
   * ===========================================================================
   * =================== Account  balances reaggregation =======================
   * ===========================================================================
   */

  console.time('initAllAccountProcessingStatusesOnColdStart');
  await initAllAccountProcessingStatusesOnColdStart({
    ctx,
    keepExistingStatuses: true,
  });
  console.timeEnd('initAllAccountProcessingStatusesOnColdStart');

  /**
   * ===========================================================================
   * =================== Account  balances reaggregation =======================
   * ===========================================================================
   */

  console.time('Account_balances_reaggregation');

  console.time('Account_balances_reaggregation::collect ids');

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
  console.timeEnd('Account_balances_reaggregation::collect ids');

  /**
   * Add accounts to periodical balances aggregation.
   */
  await addAccountsToPeriodicalBalancesAggregation({
    involvedAccountsAccumulators,
    ctx,
  });

  console.time(
    'Account_balances_reaggregation::prefetchBalancesForAccountsInvolvedToMmEvents'
  );
  const prefetchedBalancesForAccountsInvolvedToMmEvents =
    await prefetchBalancesForAccountsInvolvedToMmEvents({
      ctx,
      involvedAccountsAndAssetsInMmEventsPerBlockMap:
        mmEventsInvolvedAccountsAndAssets.involvedAccountsAndAssetsInMmEventsPerBlockMap,
    });

  console.timeEnd(
    'Account_balances_reaggregation::prefetchBalancesForAccountsInvolvedToMmEvents'
  );

  /**
   * Handle Money Market events.
   *
   * Aggregate balances only for involved accounts and only for involved assets.
   */
  console.time(
    'Account_balances_reaggregation::handleMmAssetAccountBalancesPerBlock'
  );
  await handleMmAssetAccountBalancesPerBlock({
    ctx,
    involvedAccountsAssetsPerBlockMap:
      mmEventsInvolvedAccountsAndAssets.involvedAccountsAndAssetsInMmEventsPerBlockMap,
    prefetchedBalancesForAccountsInvolvedToMmEvents,
  });
  console.timeEnd(
    'Account_balances_reaggregation::handleMmAssetAccountBalancesPerBlock'
  );
  /**
   * Handle All Substrate events.
   *
   * Aggregate balances for all involved accounts and all account's assets.
   */
  console.time(
    'Account_balances_reaggregation::handleCommonAssetAccountBalances'
  );
  await handleCommonAssetAccountBalances({
    accountIdsToProcess: { ...involvedAccountsAccumulators },
    prefetchedBalancesForAccountsInvolvedToMmEvents,
    ctx,
  });
  console.timeEnd(
    'Account_balances_reaggregation::handleCommonAssetAccountBalances'
  );
  /**
   * Handle Money Market Assets balances
   */
  console.time(
    'Account_balances_reaggregation::handleMoneyMarketAssetBalancesForAccounts'
  );
  await handleMoneyMarketAssetBalancesForAccounts({
    allProcessedAccountsPerBlock:
      involvedAccountsAccumulators.allProcessedAccountsPerBlock,
    ctx,
  });
  console.timeEnd(
    'Account_balances_reaggregation::handleMoneyMarketAssetBalancesForAccounts'
  );
  /**
   * Aggregate Account Total Balances
   */
  console.time('Account_balances_reaggregation::handleAccountTotalBalance');
  await handleAccountTotalBalance({ ctx });
  console.timeEnd('Account_balances_reaggregation::handleAccountTotalBalance');
  /**
   * Include Liquidity Balances in Total Balances.
   */
  console.time(
    'Account_balances_reaggregation::handleLiquidityBalancesInTotalBalances'
  );
  await handleLiquidityBalancesInTotalBalances({
    ctx,
    allProcessedAccountsPerBlock:
      involvedAccountsAccumulators.allProcessedAccountsPerBlock,
  });
  console.timeEnd(
    'Account_balances_reaggregation::handleLiquidityBalancesInTotalBalances'
  );
  /**
   * Includes Asset Balances unchanged in the current block but existing in the
   * previous block.
   * IMPORTANT: Can mutate AccountTotalBalanceHistoricalData
   */
  console.time(
    'Account_balances_reaggregation::handleUnchangedAccountAssetBalances'
  );
  await handleUnchangedAccountAssetBalances({ ctx });
  console.timeEnd(
    'Account_balances_reaggregation::handleUnchangedAccountAssetBalances'
  );
  await updateAccountProcessingStatusOnTotalBalanceChange({ ctx });

  console.time(
    'Account_balances_reaggregation::saveAccountBalancesRelatedDataBulk'
  );
  await HistoricalDataManager.saveAccountBalancesRelatedDataBulk(ctx);
  console.timeEnd(
    'Account_balances_reaggregation::saveAccountBalancesRelatedDataBulk'
  );
  console.timeEnd('Account_balances_reaggregation');

  /**
   * ===========================================================================
   * ===========================================================================
   */

  LatestProcessedDataCacheManager.getInstance().setLastAssetSpotPriceHistoricalDataItem(
    Array.from(ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.values())
  );

  /**
   * ===========================================================================
   * ===========================================================================
   */
  console.time('updateInitialIndexingFinishedAtTime');
  await ProcessorStatusManager.updateInitialIndexingFinishedAtTime(ctx);
  console.timeEnd('updateInitialIndexingFinishedAtTime');

  await ProcessorStatusManager.getInstance(ctx).updateProcessorStatus({
    latestProcessedBlock: ctx.blocks[ctx.blocks.length - 1].header.height,
  });
}

function correlateAssetSpotPrices(ctx: SqdProcessorContext<Store>) {
  const spotPricesMap = ctx.batchState.state.assetsSpotPriceHistoricalDataBatch;

  // Group spot prices by asset pair (assetInId-assetOutId)
  const spotPricesByAssetPair = new Map<
    string,
    AssetSpotPriceHistoricalData[]
  >();

  for (const spotPrice of spotPricesMap.values()) {
    const pairKey = `${spotPrice.assetInId}-${spotPrice.assetOutId}`;
    if (!spotPricesByAssetPair.has(pairKey)) {
      spotPricesByAssetPair.set(pairKey, []);
    }
    spotPricesByAssetPair.get(pairKey)!.push(spotPrice);
  }

  // Sort spot prices by block height for each asset pair
  for (const prices of spotPricesByAssetPair.values()) {
    prices.sort((a, b) => a.paraBlockHeight - b.paraBlockHeight);
  }

  // Get the block range being processed
  const blocks = ctx.blocks;

  // For each asset pair, backfill gaps
  for (const prices of spotPricesByAssetPair.values()) {
    if (prices.length === 0) continue;

    // Create a map of block height to price for fast lookups
    const pricesByBlockHeight = new Map<number, AssetSpotPriceHistoricalData>();
    for (const price of prices) {
      pricesByBlockHeight.set(price.paraBlockHeight, price);
    }

    // Track the last known price as we iterate through blocks
    let lastKnownPrice: AssetSpotPriceHistoricalData | null = null;

    // Find the most recent price before the first block in the range
    for (let i = prices.length - 1; i >= 0; i--) {
      if (prices[i].paraBlockHeight < blocks[0].header.height) {
        lastKnownPrice = prices[i];
        break;
      }
    }

    // For each block in the processing range (assuming blocks are sorted by height)
    for (const block of blocks) {
      const blockHeight = block.header.height;

      // Check if there's already a price for this block
      if (pricesByBlockHeight.has(blockHeight)) {
        // Update lastKnownPrice to this existing price
        lastKnownPrice = pricesByBlockHeight.get(blockHeight)!;
      } else if (lastKnownPrice) {
        // Create a new spot price entry for this block using the last known price
        const newId = `${lastKnownPrice.assetInId}-${lastKnownPrice.assetOutId}-${blockHeight}`;

        const newSpotPrice = new AssetSpotPriceHistoricalData({
          id: newId,
          assetInId: lastKnownPrice.assetInId,
          assetOutId: lastKnownPrice.assetOutId,
          price: lastKnownPrice.price,
          priceNormalised: lastKnownPrice.priceNormalised,
          priceRoute: lastKnownPrice.priceRoute,
          paraBlockHeight: blockHeight,
        });

        // Add to the global map
        spotPricesMap.set(newSpotPrice.id, newSpotPrice);
        // Update the lookup map (though we won't need it since we use lastKnownPrice)
        pricesByBlockHeight.set(blockHeight, newSpotPrice);
      }
    }
  }
}

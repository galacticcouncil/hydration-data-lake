import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
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
import { AaveMoneyMarketManager } from '../../utils/evmTools/aave/aaveMoneyMarketManager';
import {
  actualiseAssets,
  ensureNativeToken,
} from '../../handlers/assets/utils';
import { handleAssetRegistry } from '../../handlers/assets';
import { handleLbpPools } from '../../handlers/pools/pools/lbpPool';
import { handleXykPools } from '../../handlers/pools/pools/xykPool';
import { ensureOmnipool } from '../../handlers/pools/pools/omnipool/omnipool';
import { handleOmnipoolAssets } from '../../handlers/pools/pools/omnipool';
import { handleStablepools } from '../../handlers/pools/pools/stableswap';
import { handleBroadcastSwappedEvents } from '../../handlers/swap';
import { handleBuySellOperations } from '../../handlers/buySellOperations';
import { handleStablepoolLiquidityEvents } from '../../handlers/pools/pools/stableswap/liquidity';
import { handleDcaSchedules, saveDcaEntities } from '../../handlers/dca';
import { handleOtcOrders } from '../../handlers/otc';
import { createMoneyMarketEventsFromRoutedTrades } from '../../handlers/moneyMarket/routedTradeToMmEventHandler';
import { saveAllMoneyMarketEvents } from '../../handlers/moneyMarket';
import { handleTransfers } from '../../handlers/transfers';
import { handleConstantsHistoricalData } from '../../handlers/constants/constantsHistoricalData';
import { handleStableswapHistoricalData } from '../../handlers/pools/pools/stableswap/historicalData';
import { handleOmnipoolHistoricalData } from '../../handlers/pools/pools/omnipool/historicalData';
import { handleXykPoolHistoricalData } from '../../handlers/pools/pools/xykPool/historicalData';
import { handleLbppoolHistoricalData } from '../../handlers/pools/pools/lbpPool/historicalData';
import { handleAavepoolHistoricalData } from '../../handlers/pools/pools/aavepool/historicalData';
import { ensurePoolsDestroyedStatus } from '../../handlers/pools/support';
import { handleEvmAccounts } from '../../handlers/evmAccounts';
import { handleOracles } from '../../handlers/oracles/emaOracle';
import {
  handleAssetHistoricalData,
  handleAssetPairVolumesHistoricalData,
  handleAssetSpotPricesHistoricalData,
} from '../../handlers/assets/assetHistoricalData';
import { processPoolsNormalizedVolumes } from '../../handlers/pools/normalizedVolumesInBaseAsset';
import { HistoricalDataManager } from '../../handlers/historicalData';
import { ProcessorStatusManager } from '../../processorStatusManager';
import { processPoolsTvlNormalized } from '../../handlers/pools/normalizedTvlBaseAsset';
import { prefetchGenericPersistentDataWithLogs } from '../prefetchHelpers';
import { handleAssetAccountBalances } from '../../handlers/balances';
import { handleAccountMmPositionData } from '../../handlers/accounts/moneyMarketPosition';
import { actualizeMoneyMarketReserves } from '../../handlers/moneyMarket/reserves/moneyMarketReserve';
import { handleMmReservesConfigsHistoricalData } from '../../handlers/moneyMarket/reserves';
import { ensureHsmpool } from '../../handlers/pools/pools/hsmpool/hsmPool';
import { ensureHsmCollaterals } from '../../handlers/pools/pools/hsmpool/collaterals/hsmCollateral';
import { handleEvm } from '../../handlers/evmLog';
import { ensureAaveFacilitators } from '../../handlers/facilitator';
import { handleHsmCollateralEvents } from '../../handlers/pools/pools/hsmpool/collaterals';
import { processHsmpoolAssetBalanceHistoricalData } from '../../handlers/pools/pools/hsmpool/hsmpoolAssetHistData';
import { handleTransactionPaymentHistoricalData } from '../../handlers/transactionPayment/historicalData';
import { handleOmnipoolLiquidityPositions } from '../../handlers/liquidity/omnipool/liquidityPositions';
import { initAllXykPools } from '../../handlers/pools/pools/xykPool/xykPool';
import { processAssetNormalizedVolumes } from '../../handlers/assets/volume';
import { handleXykPoolLiquidityMiningEvents } from '../../handlers/liquidity/xykpool/liquidityMining';
import { initAllXykLiquidityMiningDeposits } from '../../handlers/liquidity/xykpool/liquidityMining/depositsHandlers';
import { initAllOmnipoolLiquidityPositions } from '../../handlers/liquidity/omnipool/liquidityPositions/liquidityPositionHandlers';
import { initAllOmnipoolLiquidityMiningDeposits } from '../../handlers/liquidity/omnipool/liquidityMining/depositHandlers';
import { handleOmnipoolLiquidityMiningEvents } from '../../handlers/liquidity/omnipool/liquidityMining';
import { handleUniquesEvents } from '../../handlers/uniques';
import { prefetchOrInitAllAccountProcessingStatuses } from '../../handlers/accounts/accountProcessingStatus';
import { handleLiquidationEvents } from '../../handlers/liquidation';
import { initAllAccountsOnColdStart } from '../../handlers/accounts/allAccountsInit';
import { MultiProcPoolManager } from '../../utils/multiProcPoolManager';
import { CoreProcPoolManager } from '../../utils/multiProcPoolManager/subProcessors/coreProcPoolManager';
import { SpotPriceProcPoolManager } from '../../utils/multiProcPoolManager/subProcessors/spotPriceProcPoolManager';
import {
  Block,
  MoneyMarketEvent,
  OmnipoolAssetHistoricalData,
  RoutedTrade,
  Swap,
  SwapAssetBalanceType,
} from '../../model';
import { Between } from 'typeorm/find-options/operator/Between';
import { BalancesProcPoolManager } from '../../utils/multiProcPoolManager/subProcessors/balancesProcPoolManager';
import { fetchAndCorrelateAssetSpotPrices } from '../utils';
import { handleHsmAssetHistoricalDataOnAllSwaps } from '../../handlers/pools/pools/hsmpool';
import { createMetricsTracker } from '../../utils/prometheusMetrics';
import { PoolVolumesCacheManager } from '../../handlers/pools/volumes/poolVolumesCacheManager';
import { AaveMoneyMarketsRegistry } from '../../utils/evmTools/aave/aaveMoneyMarketsRegistry/aaveMoneyMarketsRegistry';

export async function balancesProcessorHandler(
  ctx: SqdProcessorContext<Store>
) {
  let parsedData: BatchBlocksParsedDataManager | null = null;
  const mt = createMetricsTracker('balances');
  const endBatch = mt.startBatch();

  await MultiProcPoolManager.getInstance().start();

  await mt.track('changeJobsStatusFromPreviousBatch', () =>
    BalancesProcPoolManager.changeJobsStatusFromPreviousBatch({
      batchStartBlockHeight: ctx.blocks[0].header.height,
    })
  );

  await BalancesProcPoolManager.waitAndGetJobsToProcess({
    fromBlock: ctx.blocks[0].header.height,
    toBlock: ctx.blocks[ctx.blocks.length - 1].header.height,
  });
  // console.time('initAllAccountsOnColdStart');
  // await initAllAccountsOnColdStart({ ctx });
  // console.timeEnd('initAllAccountsOnColdStart');

  await Promise.all([
    (async () => {
      await handleRelayChainBlocks(ctx);

      await mt.track('processExtrinsics', () =>
        ChainActivityTraceManager.processExtrinsics(ctx)
      );

      // console.time('saveActivityTraceEntities');
      // await ChainActivityTraceManager.saveActivityTraceEntities(ctx);
      // console.timeEnd('saveActivityTraceEntities');

      /**
       * getParsedEventsData must be executed ONLY after
       * ChainActivityTraceManager.processExtrinsics method execution, because
       * getParsedEventsData needs already compiled traceIds.
       */
      parsedData = await mt.track('getParsedEventsData', () =>
        getParsedEventsData(ctx)
      );

      await mt.track('initContractInstances', () =>
        AaveMoneyMarketsRegistry.getInstance().initContractInstances({
          ctx: ctx,
          blockNumber: ctx.blocks[ctx.blocks.length - 1].header.height,
          invalidateReservesCache:
            AaveMoneyMarketsRegistry.getInstance().isMmReservesCacheInvalidationRequired(
              parsedData
            ),
        })
      );

      await StorageResolver.getInstance().init({
        ctx: ctx,
        blockNumberFrom: ctx.blocks[0].header.height,
        blockNumberTo: ctx.blocks[ctx.blocks.length - 1].header.height,
      });

      await prefetchOrInitAllBatchAccounts(ctx);
      await prefetchOrInitAllAccountProcessingStatuses(ctx);
    })(),
    prefetchGenericPersistentDataWithLogs(ctx, false),
    fetchAndCorrelateAssetSpotPrices(ctx),
  ]);

  if (!parsedData) throw new Error('parsedData is null');
  const parsed = parsedData;

  PoolVolumesCacheManager.getInstance().wipeCache(ctx);

  await mt.track('custom prefetch', async () => {
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
          {
            className: 'MoneyMarketEvent',
            originCallFn: 'balancesProcessorHandler',
          }
        )
      ).map((p) => [p.id, p])
    );

    ctx.batchState.state.omnipoolAssetAllHistoricalData = new Map(
      (
        await ctx.storeUtils.findWithLogs(
          OmnipoolAssetHistoricalData,
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
          {
            className: 'OmnipoolAssetHistoricalData',
            originCallFn: 'balancesProcessorHandler',
          }
        )
      ).map((p) => [p.id, p])
    );
  });

  // await ensureNativeToken(ctx);

  // console.time('actualiseAssets');
  // await actualiseAssets(ctx);
  // console.timeEnd('actualiseAssets');

  // console.time('initAllXykPools');
  // await initAllXykPools({
  //   ctx,
  //   blockHeader: ctx.blocks[ctx.blocks.length - 1].header,
  // });
  // console.timeEnd('initAllXykPools');

  // console.time('initAllXykLiquidityMiningDeposits');
  // await initAllXykLiquidityMiningDeposits(ctx);
  // console.timeEnd('initAllXykLiquidityMiningDeposits');
  //
  // console.time('handleAssetRegistry');
  // await handleAssetRegistry(ctx, parsed);
  // console.timeEnd('handleAssetRegistry');
  //
  // console.time('actualizeMoneyMarketReserves');
  // await actualizeMoneyMarketReserves({
  //   ctx,
  // });
  // console.timeEnd('actualizeMoneyMarketReserves');
  //
  // console.time('handleMmReservesConfigsHistoricalData');
  // await handleMmReservesConfigsHistoricalData(ctx, parsed);
  // console.timeEnd('handleMmReservesConfigsHistoricalData');

  // console.time('handleLbpPools');
  // await handleLbpPools(ctx, parsed);
  // console.timeEnd('handleLbpPools');
  //
  // console.time('handleXykPools');
  // await handleXykPools(ctx, parsed);
  // console.timeEnd('handleXykPools');
  //
  // console.time('handleOmnipoolAssets');
  // await ensureOmnipool(ctx);
  // await handleOmnipoolAssets(ctx, parsed);
  // console.timeEnd('handleOmnipoolAssets');
  //
  // console.time('initAllOmnipoolLiquidityPositions');
  // await initAllOmnipoolLiquidityPositions(ctx);
  // console.timeEnd('initAllOmnipoolLiquidityPositions');
  //
  // console.time('handleOmnipoolLiquidityPositions');
  // await handleOmnipoolLiquidityPositions(ctx, parsed);
  // console.timeEnd('handleOmnipoolLiquidityPositions');
  //
  // console.time('initAllOmnipoolLiquidityMiningDeposits');
  // await initAllOmnipoolLiquidityMiningDeposits(ctx);
  // console.timeEnd('initAllOmnipoolLiquidityMiningDeposits');
  //
  // console.time('handleOmnipoolLiquidityMiningEvents');
  // await handleOmnipoolLiquidityMiningEvents(ctx, parsed);
  // console.timeEnd('handleOmnipoolLiquidityMiningEvents');
  //
  // console.time('handleXykPoolLiquidityMiningEvents');
  // await handleXykPoolLiquidityMiningEvents(ctx, parsed);
  // console.timeEnd('handleXykPoolLiquidityMiningEvents');
  //
  // console.time('handleUniquesEvents');
  // await handleUniquesEvents(ctx, parsed);
  // console.timeEnd('handleUniquesEvents');
  //
  // console.time('handleStablepools');
  // await handleStablepools(ctx, parsed);
  // console.timeEnd('handleStablepools');
  //
  // console.time('ensureAaveFacilitators');
  // await ensureAaveFacilitators(ctx);
  // console.timeEnd('ensureAaveFacilitators');
  //
  // console.time('ensureHsmpool && ensureHsmCollaterals');
  // await ensureHsmpool(ctx);
  // await ensureHsmCollaterals(ctx);
  // console.timeEnd('ensureHsmpool && ensureHsmCollaterals');
  //
  // console.time('handleHsmCollateralEvents');
  // await handleHsmCollateralEvents(ctx, parsed);
  // console.timeEnd('handleHsmCollateralEvents');

  /**
   * functions handleConstantsHistoricalData, handleAssetHistoricalData,
   * handleAssetSpotPricesHistoricalData must be executed in strict order.
   */
  // console.time('handleAssetHistoricalData');
  // await handleAssetHistoricalData({ ctx });
  // console.timeEnd('handleAssetHistoricalData');
  //
  // console.time('handleAavepoolHistoricalData');
  // await handleAavepoolHistoricalData(ctx, parsed);
  // console.timeEnd('handleAavepoolHistoricalData');
  //
  // console.time('handleStableswapHistoricalData');
  // await handleStableswapHistoricalData(ctx, parsed);
  // console.timeEnd('handleStableswapHistoricalData');
  //
  // console.time('handleOmnipoolHistoricalData');
  // await handleOmnipoolHistoricalData(ctx, parsed);
  // console.timeEnd('handleOmnipoolHistoricalData');
  //
  // console.time('handleXykPoolHistoricalData');
  // await handleXykPoolHistoricalData(ctx, parsed);
  // console.timeEnd('handleXykPoolHistoricalData');
  //
  // console.time('handleLbppoolHistoricalData');
  // await handleLbppoolHistoricalData(ctx, parsed);
  // console.timeEnd('handleLbppoolHistoricalData');
  //
  // console.time('handleConstantsHistoricalData');
  // await handleConstantsHistoricalData(ctx);
  // console.timeEnd('handleConstantsHistoricalData');

  // console.time('handleTransactionPaymentHistoricalData');
  // await handleTransactionPaymentHistoricalData(ctx);
  // console.timeEnd('handleTransactionPaymentHistoricalData');

  // console.time('handleOracles');
  // await handleOracles(ctx);
  // console.timeEnd('handleOracles');
  //
  // console.time('handleAssetSpotPricesHistoricalData');
  // await handleAssetSpotPricesHistoricalData({ ctx });
  // console.timeEnd('handleAssetSpotPricesHistoricalData');

  // console.time('handleBroadcastSwappedEvents');
  // await handleBroadcastSwappedEvents(ctx, parsed);
  // console.timeEnd('handleBroadcastSwappedEvents');
  //
  // console.time('handleBuySellOperations');
  // await handleBuySellOperations(ctx, parsed);
  // console.timeEnd('handleBuySellOperations');
  //
  // console.time('handleStablepoolLiquidityEvents');
  // await handleStablepoolLiquidityEvents(ctx, parsed);
  // console.timeEnd('handleStablepoolLiquidityEvents');

  // console.time('saveSwapRelatedDataBulk');
  // await HistoricalDataManager.saveSwapRelatedDataBulk(ctx);
  // console.timeEnd('saveSwapRelatedDataBulk');

  // console.time('handleDcaSchedules');
  // await handleDcaSchedules(ctx, parsed);
  // console.timeEnd('handleDcaSchedules');
  //
  // console.time('saveDcaEntities');
  // await saveDcaEntities(ctx);
  // console.timeEnd('saveDcaEntities');
  //
  // console.time('handleOtcOrders');
  // await handleOtcOrders(ctx, parsed);
  // console.timeEnd('handleOtcOrders');

  // console.time('createMmWithdrawalEventsFromRoutedTrades');
  // await createMoneyMarketEventsFromRoutedTrades(ctx, [
  //   ...ctx.batchState.state.routeTrades.values(),
  // ]);
  // console.timeEnd('createMmWithdrawalEventsFromRoutedTrades');
  //
  // console.time('handleEvm');
  // await handleEvm(ctx, parsed);
  // console.timeEnd('handleEvm');
  //
  // console.time('handleLiquidationEvents');
  // await handleLiquidationEvents(ctx, parsed);
  // console.timeEnd('handleLiquidationEvents');

  // console.time('handleAccountMmPositionData');
  // await handleAccountMmPositionData(ctx, parsed);
  // console.timeEnd('handleAccountMmPositionData');
  //
  // console.time('handleTransfers');
  // await handleTransfers(ctx, parsed);
  // console.timeEnd('handleTransfers');
  //
  // await saveAllMoneyMarketEvents(ctx);
  //
  // await HistoricalDataManager.saveAccountMoneyMarketDataBulk(ctx);
  //
  // console.time('ensurePoolsDestroyedStatus');
  // await ensurePoolsDestroyedStatus(ctx);
  // console.timeEnd('ensurePoolsDestroyedStatus');
  //
  // console.time('handleEvmAccounts');
  // await handleEvmAccounts(ctx, parsed);
  // console.timeEnd('handleEvmAccounts');

  // console.time('handleAssetPairVolumesHistoricalData');
  // await handleAssetPairVolumesHistoricalData({ ctx });
  // console.timeEnd('handleAssetPairVolumesHistoricalData');

  await mt.track('handleAssetAccountBalances', () =>
    handleAssetAccountBalances(ctx, parsed)
  );

  /**
   * Must be executed here because it requires account asset balances
   */
  await mt.track('handleHsmAssetHistoricalDataOnAllSwaps', () =>
    handleHsmAssetHistoricalDataOnAllSwaps(ctx)
  );

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

  // console.time('saveAllBatchAccounts');
  // await saveAllBatchAccounts(ctx);
  // console.timeEnd('saveAllBatchAccounts');

  // console.time('saveHistoricalDataBulk');
  // await HistoricalDataManager.saveHistoricalDataBulk(ctx);
  // console.timeEnd('saveHistoricalDataBulk');

  // console.time('saveActivityTraceEntities');
  // await ChainActivityTraceManager.saveActivityTraceEntities(ctx);
  // console.timeEnd('saveActivityTraceEntities');

  // console.time('saveDcaEntities');
  // await saveDcaEntities(ctx);
  // console.timeEnd('saveDcaEntities');

  // console.time('handleHistoricalVolumesBatchEntriesLists');
  // await HistoricalDataManager.handleHistoricalVolumesBatchEntriesLists(ctx);
  // console.timeEnd('handleHistoricalVolumesBatchEntriesLists');

  await mt.track('saveAccountBalancesRelatedDataBulk', () =>
    HistoricalDataManager.saveAccountBalancesRelatedDataBulk(ctx)
  );

  await mt.track('updateInitialIndexingFinishedAtTime', () =>
    ProcessorStatusManager.updateInitialIndexingFinishedAtTime(ctx)
  );

  await ProcessorStatusManager.getInstance(ctx).updateProcessorStatus({
    latestProcessedBlock: ctx.blocks[ctx.blocks.length - 1].header.height,
  });

  PoolVolumesCacheManager.getInstance().addLatestRecordsToCache(ctx);

  endBatch();

  await BalancesProcPoolManager.checkNextAvailableBatchToProcess({
    currentHeadBlockNumber: ctx.blocks[ctx.blocks.length - 1].header.height,
  });
}

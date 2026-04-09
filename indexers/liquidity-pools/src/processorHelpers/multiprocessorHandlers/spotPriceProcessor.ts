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
import { MoneyMarketContractsManager } from '../../utils/evmTools/moneyMarketContractsManager';
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
import { Block, RoutedTrade, Swap, SwapAssetBalanceType } from '../../model';
import { Between } from 'typeorm/find-options/operator/Between';
import { handleHsmAssetHistoricalDataOnAllSwaps } from '../../handlers/pools/pools/hsmpool';
import { createMetricsTracker } from '../../utils/processorMetrics';

export async function spotPriceProcessorHandler(
  ctx: SqdProcessorContext<Store>
) {
  let parsedData: BatchBlocksParsedDataManager | null = null;
  const mt = createMetricsTracker('spot_price');
  const endBatch = mt.startBatch();

  await MultiProcPoolManager.getInstance().start();

  await mt.track('changeJobsStatusFromPreviousBatch', () =>
    SpotPriceProcPoolManager.changeJobsStatusFromPreviousBatch({
      batchStartBlockHeight: ctx.blocks[0].header.height,
    })
  );

  await SpotPriceProcPoolManager.waitAndGetJobsToProcess({
    fromBlock: ctx.blocks[0].header.height,
    toBlock: ctx.blocks[ctx.blocks.length - 1].header.height,
  });

  await mt.track('custom prefetch', async () => {
    ctx.batchState.state.batchBlocks = new Map(
      (
        await ctx.storeUtils.findWithLogs(
          Block,
          {
            where: {
              height: Between(
                ctx.blocks[0].header.height,
                ctx.blocks[ctx.blocks.length - 1].header.height
              ),
            },
            order: {
              height: 'ASC',
            },
          },
          { className: 'Block' }
        )
      ).map((p) => [p.id, p])
    );

    ctx.batchState.state.swaps = new Map(
      (
        await ctx.storeUtils.findWithLogs(
          Swap,
          {
            where: {
              paraBlockHeight: Between(
                ctx.blocks[0].header.height,
                ctx.blocks[ctx.blocks.length - 1].header.height
              ),
            },
            relations: {
              inputs: true,
              outputs: true,
              fees: true,
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
    for (const swap of ctx.batchState.state.swaps.values()) {
      const inputs = swap.inputs.filter(
        (i) => i.assetBalanceType === SwapAssetBalanceType.Input
      );
      const outputs = swap.outputs.filter(
        (i) => i.assetBalanceType === SwapAssetBalanceType.Output
      );
      swap.inputs = inputs;
      swap.outputs = outputs;
      ctx.batchState.state.swaps.set(swap.id, swap);
    }

    ctx.batchState.state.routeTrades = new Map(
      (
        await ctx.storeUtils.findWithLogs(
          RoutedTrade,
          {
            where: {
              paraBlockHeight: Between(
                ctx.blocks[0].header.height,
                ctx.blocks[ctx.blocks.length - 1].header.height
              ),
            },
            relations: {
              swaps: {
                inputs: true,
                outputs: true,
                fees: true,
                event: {
                  block: true,
                },
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

    for (const routedTrade of ctx.batchState.state.routeTrades.values()) {
      for (const swap of routedTrade.swaps) {
        const inputs = swap.inputs.filter(
          (i) => i.assetBalanceType === SwapAssetBalanceType.Input
        );
        const outputs = swap.outputs.filter(
          (i) => i.assetBalanceType === SwapAssetBalanceType.Output
        );
        swap.inputs = inputs;
        swap.outputs = outputs;
      }
    }
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

      await StorageResolver.getInstance().init({
        ctx: ctx,
        blockNumberFrom: ctx.blocks[0].header.height,
        blockNumberTo: ctx.blocks[ctx.blocks.length - 1].header.height,
      });

      await prefetchOrInitAllBatchAccounts(ctx);
      await prefetchOrInitAllAccountProcessingStatuses(ctx);
    })(),
    (async () => {
      await mt.track('initContractInstances', () =>
        MoneyMarketContractsManager.getInstance().initContractInstances({
          ctx: ctx,
          blockNumber: ctx.blocks[ctx.blocks.length - 1].header.height,
        })
      );
      return null;
    })(),
    prefetchGenericPersistentDataWithLogs(ctx, false),
  ]);

  if (!parsedData) throw new Error('parsedData is null');
  const parsed = parsedData;

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
  await mt.track('handleAssetHistoricalData', () =>
    handleAssetHistoricalData({ ctx })
  );

  await mt.track('handleAavepoolHistoricalData', () =>
    handleAavepoolHistoricalData(ctx, parsed)
  );

  await mt.track('handleStableswapHistoricalData', () =>
    handleStableswapHistoricalData(ctx, parsed)
  );

  await mt.track('handleOmnipoolHistoricalData', () =>
    handleOmnipoolHistoricalData(ctx, parsed)
  );

  await mt.track('handleXykPoolHistoricalData', () =>
    handleXykPoolHistoricalData(ctx, parsed)
  );

  await mt.track('handleLbppoolHistoricalData', () =>
    handleLbppoolHistoricalData(ctx, parsed)
  );

  await mt.track('handleConstantsHistoricalData', () =>
    handleConstantsHistoricalData(ctx)
  );

  await mt.track('handleTransactionPaymentHistoricalData', () =>
    handleTransactionPaymentHistoricalData(ctx)
  );

  await mt.track('handleOracles', () => handleOracles(ctx));

  await mt.track('handleAssetSpotPricesHistoricalData', () =>
    handleAssetSpotPricesHistoricalData({ ctx })
  );

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

  // console.time('handleHsmAssetHistoricalDataOnAllSwaps');
  // await handleHsmAssetHistoricalDataOnAllSwaps(ctx);
  // console.timeEnd('handleHsmAssetHistoricalDataOnAllSwaps');

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

  await mt.track('handleAssetPairVolumesHistoricalData', () =>
    handleAssetPairVolumesHistoricalData({ ctx })
  );

  // console.time('handleAssetAccountBalances');
  // await handleAssetAccountBalances(ctx, parsed);
  // console.timeEnd('handleAssetAccountBalances');

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

  await mt.track('saveHistoricalDataBulk', () =>
    HistoricalDataManager.saveHistoricalDataBulk(ctx)
  );

  // console.time('saveActivityTraceEntities');
  // await ChainActivityTraceManager.saveActivityTraceEntities(ctx);
  // console.timeEnd('saveActivityTraceEntities');

  // console.time('saveDcaEntities');
  // await saveDcaEntities(ctx);
  // console.timeEnd('saveDcaEntities');

  // console.time('handleHistoricalVolumesBatchEntriesLists');
  // await HistoricalDataManager.handleHistoricalVolumesBatchEntriesLists(ctx);
  // console.timeEnd('handleHistoricalVolumesBatchEntriesLists');

  // console.time('saveAccountBalancesRelatedDataBulk');
  // await HistoricalDataManager.saveAccountBalancesRelatedDataBulk(ctx);
  // console.timeEnd('saveAccountBalancesRelatedDataBulk');

  await mt.track('updateInitialIndexingFinishedAtTime', () =>
    ProcessorStatusManager.updateInitialIndexingFinishedAtTime(ctx)
  );

  await ProcessorStatusManager.getInstance(ctx).updateProcessorStatus({
    latestProcessedBlock: ctx.blocks[ctx.blocks.length - 1].header.height,
  });

  await mt.track('publishPendingJobs', () =>
    SpotPriceProcPoolManager.publishPendingJobs({
      processedBlocksRange: [
        ctx.blocks[0].header.height,
        ctx.blocks[ctx.blocks.length - 1].header.height,
      ],
    })
  );

  endBatch();

  await SpotPriceProcPoolManager.checkNextAvailableBatchToProcess({
    currentHeadBlockNumber: ctx.blocks[ctx.blocks.length - 1].header.height,
  });
}

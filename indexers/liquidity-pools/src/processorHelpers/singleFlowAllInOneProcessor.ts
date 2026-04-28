import { SqdProcessorContext } from '../processor';
import { Store } from '@subsquid/typeorm-store';
import { handleRelayChainBlocks } from '../handlers/relayChain';
import { ChainActivityTraceManager } from '../chainActivityTracingManagers';
import {
  BatchBlocksParsedDataManager,
  getParsedEventsData,
} from '../parsers/batchBlocksParser';
import { StorageResolver } from '../parsers/storageResolver';
import {
  prefetchOrInitAllBatchAccounts,
  saveAllBatchAccounts,
} from '../handlers/accounts';
import { AaveMoneyMarketManager } from '../utils/evmTools/aave/aaveMoneyMarketManager';
import { actualiseAssets, ensureNativeToken } from '../handlers/assets/utils';
import { handleAssetRegistry } from '../handlers/assets';
import { handleLbpPools } from '../handlers/pools/pools/lbpPool';
import { handleXykPools } from '../handlers/pools/pools/xykPool';
import { ensureOmnipool } from '../handlers/pools/pools/omnipool/omnipool';
import { handleOmnipoolAssets } from '../handlers/pools/pools/omnipool';
import { handleStablepools } from '../handlers/pools/pools/stableswap';
import { handleBroadcastSwappedEvents } from '../handlers/swap';
import { handleBuySellOperations } from '../handlers/buySellOperations';
import { handleStablepoolLiquidityEvents } from '../handlers/pools/pools/stableswap/liquidity';
import { handleDcaSchedules, saveDcaEntities } from '../handlers/dca';
import { handleOtcOrders } from '../handlers/otc';
import { createMoneyMarketEventsFromRoutedTrades } from '../handlers/moneyMarket/routedTradeToMmEventHandler';
import { saveAllMoneyMarketEvents } from '../handlers/moneyMarket';
import { handleTransfers } from '../handlers/transfers';
import { handleConstantsHistoricalData } from '../handlers/constants/constantsHistoricalData';
import { handleStableswapHistoricalData } from '../handlers/pools/pools/stableswap/historicalData';
import { handleOmnipoolHistoricalData } from '../handlers/pools/pools/omnipool/historicalData';
import { handleXykPoolHistoricalData } from '../handlers/pools/pools/xykPool/historicalData';
import { handleLbppoolHistoricalData } from '../handlers/pools/pools/lbpPool/historicalData';
import { handleAavepoolHistoricalData } from '../handlers/pools/pools/aavepool/historicalData';
import { ensurePoolsDestroyedStatus } from '../handlers/pools/support';
import { handleEvmAccounts } from '../handlers/evmAccounts';
import { handleOracles } from '../handlers/oracles/emaOracle';
import {
  handleAssetHistoricalData,
  handleAssetPairVolumesHistoricalData,
  handleAssetSpotPricesHistoricalData,
} from '../handlers/assets/assetHistoricalData';
import { processPoolsNormalizedVolumes } from '../handlers/pools/normalizedVolumesInBaseAsset';
import { HistoricalDataManager } from '../handlers/historicalData';
import { ProcessorStatusManager } from '../processorStatusManager';
import { processPoolsTvlNormalized } from '../handlers/pools/normalizedTvlBaseAsset';
import { prefetchGenericPersistentDataWithLogs } from './prefetchHelpers';
import { handleAssetAccountBalances } from '../handlers/balances';
import { handleAccountMmPositionData } from '../handlers/accounts/moneyMarketPosition';
import { actualizeMoneyMarketReserves } from '../handlers/moneyMarket/reserves/moneyMarketReserve';
import { handleMmReservesConfigsHistoricalData } from '../handlers/moneyMarket/reserves';
import { ensureHsmpool } from '../handlers/pools/pools/hsmpool/hsmPool';
import { ensureHsmCollaterals } from '../handlers/pools/pools/hsmpool/collaterals/hsmCollateral';
import { handleEvm } from '../handlers/evmLog';
import { ensureAaveFacilitators } from '../handlers/facilitator';
import { handleHsmCollateralEvents } from '../handlers/pools/pools/hsmpool/collaterals';
import { processHsmpoolAssetBalanceHistoricalData } from '../handlers/pools/pools/hsmpool/hsmpoolAssetHistData';
import { handleTransactionPaymentHistoricalData } from '../handlers/transactionPayment/historicalData';
import { handleOmnipoolLiquidityPositions } from '../handlers/liquidity/omnipool/liquidityPositions';
import { initAllXykPools } from '../handlers/pools/pools/xykPool/xykPool';
import { processAssetNormalizedVolumes } from '../handlers/assets/volume';
import { handleXykPoolLiquidityMiningEvents } from '../handlers/liquidity/xykpool/liquidityMining';
import { initAllXykLiquidityMiningDeposits } from '../handlers/liquidity/xykpool/liquidityMining/depositsHandlers';
import { initAllOmnipoolLiquidityPositions } from '../handlers/liquidity/omnipool/liquidityPositions/liquidityPositionHandlers';
import { initAllOmnipoolLiquidityMiningDeposits } from '../handlers/liquidity/omnipool/liquidityMining/depositHandlers';
import { handleOmnipoolLiquidityMiningEvents } from '../handlers/liquidity/omnipool/liquidityMining';
import { handleUniquesEvents } from '../handlers/uniques';
import { prefetchOrInitAllAccountProcessingStatuses } from '../handlers/accounts/accountProcessingStatus';
import { handleLiquidationEvents } from '../handlers/liquidation';
import { initAllAccountsOnColdStart } from '../handlers/accounts/allAccountsInit';
import { handleHsmAssetHistoricalDataOnAllSwaps } from '../handlers/pools/pools/hsmpool';
import { createMetricsTracker } from '../utils/prometheusMetrics';
import { AccountEvmExtensionsCacheManager } from '../utils/accountEvmExtensionsCacheManager';
import { PoolVolumesCacheManager } from '../handlers/pools/volumes/poolVolumesCacheManager';
import { LatestProcessedDataCacheManager } from '../utils/latestProcessedDataCacheManager';
import { AaveMoneyMarketsRegistry } from '../utils/evmTools/aave/aaveMoneyMarketsRegistry/aaveMoneyMarketsRegistry';

export async function singleFlowAllInOneProcessor(
  ctx: SqdProcessorContext<Store>
) {
  let parsedData: BatchBlocksParsedDataManager | null = null;
  const mt = createMetricsTracker('single_flow');
  const endBatch = mt.startBatch();

  await mt.track('initAllAccountsOnColdStart', () =>
    initAllAccountsOnColdStart({ ctx })
  );

  await Promise.all([
    (async () => {
      await handleRelayChainBlocks(ctx);

      await mt.track('processExtrinsics', () =>
        ChainActivityTraceManager.processExtrinsics(ctx)
      );

      await mt.track('saveActivityTraceEntities', () =>
        ChainActivityTraceManager.saveActivityTraceEntities(ctx)
      );

      await mt.track('AccountEvmExtensionsCacheManager.initCache', () =>
        AccountEvmExtensionsCacheManager.getInstance().initCache(ctx)
      );

      /**
       * getParsedEventsData must be executed ONLY after
       * ChainActivityTraceManager.processExtrinsics method execution, because
       * getParsedEventsData needs already compiled traceIds.
       */
      parsedData = await mt.track('getParsedEventsData', () =>
        getParsedEventsData(ctx)
      );

      await mt.track('AaveMoneyMarketManager.initContractInstances', () =>
        AaveMoneyMarketManager.getInstance().initContractInstances({
          ctx: ctx,
          blockNumber: ctx.blocks[ctx.blocks.length - 1].header.height,
          invalidateReservesCache:
            AaveMoneyMarketManager.getInstance().isMmReservesCacheInvalidationRequired(
              parsedData
            ),
        })
      );
      await mt.track('AaveMoneyMarketsRegistry.initContractInstances', () =>
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
  ]);

  if (!parsedData) throw new Error('parsedData is null');
  const parsed = parsedData;

  PoolVolumesCacheManager.getInstance().wipeCache(ctx);

  await ensureNativeToken(ctx);

  await mt.track('actualiseAssets', () => actualiseAssets(ctx));

  await mt.track(
    'LatestProcessedDataCacheManager.prefetchLastAssetHistDataItem',
    () =>
      LatestProcessedDataCacheManager.getInstance().prefetchLastAssetHistDataItem(
        ctx
      )
  );
  await mt.track(
    'LatestProcessedDataCacheManager.prefetchLastAssetSpotPriceHistDataItem',
    () =>
      LatestProcessedDataCacheManager.getInstance().prefetchLastAssetSpotPriceHistDataItem(
        { ctx }
      )
  );
  await mt.track(
    'LatestProcessedDataCacheManager.prefetchLastXykpoolHistDataItem',
    () =>
      LatestProcessedDataCacheManager.getInstance().prefetchLastXykpoolHistDataItem(
        ctx
      )
  );

  await mt.track('initAllXykPools', () =>
    initAllXykPools({
      ctx,
      blockHeader: ctx.blocks[ctx.blocks.length - 1].header,
    })
  );

  await mt.track('initAllXykLiquidityMiningDeposits', () =>
    initAllXykLiquidityMiningDeposits(ctx)
  );

  await mt.track('handleAssetRegistry', () => handleAssetRegistry(ctx, parsed));

  await mt.track('actualizeMoneyMarketReserves', () =>
    actualizeMoneyMarketReserves({ ctx })
  );

  await mt.track('handleMmReservesConfigsHistoricalData', () =>
    handleMmReservesConfigsHistoricalData(ctx, parsed)
  );

  await mt.track('handleLbpPools', () => handleLbpPools(ctx, parsed));

  await mt.track('handleXykPools', () => handleXykPools(ctx, parsed));

  await mt.track('handleOmnipoolAssets', async () => {
    await ensureOmnipool(ctx);
    await handleOmnipoolAssets(ctx, parsed);
  });

  await mt.track('initAllOmnipoolLiquidityPositions', () =>
    initAllOmnipoolLiquidityPositions(ctx)
  );

  await mt.track('handleOmnipoolLiquidityPositions', () =>
    handleOmnipoolLiquidityPositions(ctx, parsed)
  );

  await mt.track('initAllOmnipoolLiquidityMiningDeposits', () =>
    initAllOmnipoolLiquidityMiningDeposits(ctx)
  );

  await mt.track('handleOmnipoolLiquidityMiningEvents', () =>
    handleOmnipoolLiquidityMiningEvents(ctx, parsed)
  );

  await mt.track('handleXykPoolLiquidityMiningEvents', () =>
    handleXykPoolLiquidityMiningEvents(ctx, parsed)
  );

  await mt.track('handleUniquesEvents', () => handleUniquesEvents(ctx, parsed));

  await mt.track('handleStablepools', () => handleStablepools(ctx, parsed));

  await mt.track('ensureAaveFacilitators', () => ensureAaveFacilitators(ctx));

  await mt.track('ensureHsmpool && ensureHsmCollaterals', async () => {
    await ensureHsmpool(ctx);
    await ensureHsmCollaterals(ctx);
  });

  await mt.track('handleHsmCollateralEvents', () =>
    handleHsmCollateralEvents(ctx, parsed)
  );

  /**
   * functions handleConstantsHistoricalData, handleAssetHistoricalData,
   * handleAssetSpotPricesHistoricalData must be executed in strict order.
   */
  await mt.track('handleAssetHistoricalData', () =>
    handleAssetHistoricalData({ ctx })
  );

  await mt.track('Historical data Promise.all', () =>
    Promise.all([
      (async () => {
        await mt.track('handleAavepoolHistoricalData', () =>
          handleAavepoolHistoricalData(ctx, parsed)
        );

        await mt.track('handleOmnipoolHistoricalData', () =>
          handleOmnipoolHistoricalData(ctx, parsed)
        );

        await mt.track('handleLbppoolHistoricalData', () =>
          handleLbppoolHistoricalData(ctx, parsed)
        );

        await mt.track('handleConstantsHistoricalData', () =>
          handleConstantsHistoricalData(ctx)
        );

        await mt.track('handleStableswapHistoricalData', () =>
          handleStableswapHistoricalData(ctx, parsed)
        );
      })(),
      mt.track('handleXykPoolHistoricalData', () =>
        handleXykPoolHistoricalData(ctx, parsed)
      ),
      mt.track('handleOracles', () => handleOracles(ctx)),
    ])
  );

  await mt.track('handleTransactionPaymentHistoricalData', () =>
    handleTransactionPaymentHistoricalData(ctx)
  );

  await mt.track('handleAssetSpotPricesHistoricalData', () =>
    handleAssetSpotPricesHistoricalData({ ctx })
  );

  await mt.track('handleBroadcastSwappedEvents', () =>
    handleBroadcastSwappedEvents(ctx, parsed)
  );

  await mt.track('handleBuySellOperations', () =>
    handleBuySellOperations(ctx, parsed)
  );

  await mt.track('handleStablepoolLiquidityEvents', () =>
    handleStablepoolLiquidityEvents(ctx, parsed)
  );

  await mt.track('handleHsmAssetHistoricalDataOnAllSwaps', () =>
    handleHsmAssetHistoricalDataOnAllSwaps(ctx)
  );

  await mt.track('saveSwapRelatedDataBulk', () =>
    HistoricalDataManager.saveSwapRelatedDataBulk(ctx)
  );

  await mt.track('handleDcaSchedules', () => handleDcaSchedules(ctx, parsed));

  await mt.track('saveDcaEntities', () => saveDcaEntities(ctx));

  await mt.track('handleOtcOrders', () => handleOtcOrders(ctx, parsed));

  // if (ctx.isHead)
  //   await handlePoolPrices(ctx);

  await mt.track('createMmWithdrawalEventsFromRoutedTrades', () =>
    createMoneyMarketEventsFromRoutedTrades(ctx, [
      ...ctx.batchState.state.routeTrades.values(),
    ])
  );

  await mt.track('handleEvm', () => handleEvm(ctx, parsed));

  await mt.track('handleLiquidationEvents', () =>
    handleLiquidationEvents(ctx, parsed)
  );

  await mt.track('handleAccountMmPositionData', () =>
    handleAccountMmPositionData(ctx, parsed)
  );

  await mt.track('handleTransfers', () => handleTransfers(ctx, parsed));

  await saveAllMoneyMarketEvents(ctx);

  await HistoricalDataManager.saveAccountMoneyMarketDataBulk(ctx);

  await mt.track('ensurePoolsDestroyedStatus', () =>
    ensurePoolsDestroyedStatus(ctx)
  );

  await mt.track('handleEvmAccounts', () => handleEvmAccounts(ctx, parsed));

  await mt.track('handleAssetPairVolumesHistoricalData', () =>
    handleAssetPairVolumesHistoricalData({ ctx })
  );

  await mt.track('handleAssetAccountBalances', () =>
    handleAssetAccountBalances(ctx, parsed)
  );

  await mt.track('processAssetNormalizedVolumes', () =>
    processAssetNormalizedVolumes({ ctx })
  );

  await mt.track('processPoolsNormalizedVolumes', () =>
    processPoolsNormalizedVolumes({ ctx })
  );

  await mt.track('processHsmpoolAssetBalanceHistoricalData', () =>
    processHsmpoolAssetBalanceHistoricalData({ ctx })
  );

  mt.trackSync('processPoolsTvlNormalized', () =>
    processPoolsTvlNormalized({ ctx })
  );

  await mt.track('saveAllBatchAccounts', () => saveAllBatchAccounts(ctx));

  await mt.track('saveHistoricalDataBulk', () =>
    HistoricalDataManager.saveHistoricalDataBulk(ctx)
  );

  await mt.track('saveActivityTraceEntities', () =>
    ChainActivityTraceManager.saveActivityTraceEntities(ctx)
  );

  await mt.track('saveDcaEntities', () => saveDcaEntities(ctx));

  await mt.track('handleHistoricalVolumesBatchEntriesLists', () =>
    HistoricalDataManager.handleHistoricalVolumesBatchEntriesLists(ctx)
  );

  await mt.track('saveAccountBalancesRelatedDataBulk', () =>
    HistoricalDataManager.saveAccountBalancesRelatedDataBulk(ctx)
  );

  PoolVolumesCacheManager.getInstance().addLatestRecordsToCache(ctx);

  await mt.track('updateInitialIndexingFinishedAtTime', () =>
    ProcessorStatusManager.updateInitialIndexingFinishedAtTime(ctx)
  );

  await ProcessorStatusManager.getInstance(ctx).updateProcessorStatus({
    latestProcessedBlock: ctx.blocks[ctx.blocks.length - 1].header.height,
  });

  endBatch();
}

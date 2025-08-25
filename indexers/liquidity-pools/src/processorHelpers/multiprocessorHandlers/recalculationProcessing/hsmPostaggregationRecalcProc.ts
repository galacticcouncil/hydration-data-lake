import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { processPoolsNormalizedVolumes } from '../../../handlers/pools/normalizedVolumesInBaseAsset';
import { ProcessorStatusManager } from '../../../processorStatusManager';
import { prefetchPersistentData } from '../../prefetchHelpers';
import {
  AccountAssetBalanceHistoricalData,
  Asset,
  AssetSpotPriceHistoricalData,
  Block,
  OmnipoolAssetVolumeHistoricalData,
  StableswapAssetVolumeHistoricalData,
  StableswapVolumeHistoricalData,
  Xykpool,
  XykpoolVolumeHistoricalData,
} from '../../../model';
import { Between } from 'typeorm/find-options/operator/Between';
import { handleRelayChainBlocks } from '../../../handlers/relayChain';
import { ChainActivityTraceManager } from '../../../chainActivityTracingManagers';
import { getParsedEventsData } from '../../../parsers/batchBlocksParser';
import { StorageResolver } from '../../../parsers/storageResolver';
import { MoneyMarketContractsManager } from '../../../utils/evmTools/moneyMarketContractsManager';
import {
  actualiseAssets,
  ensureNativeToken,
} from '../../../handlers/assets/utils';
import { handleAssetRegistry } from '../../../handlers/assets';
import { actualizeMoneyMarketReserves } from '../../../handlers/moneyMarket/reserves/moneyMarketReserve';
import { handleMmReservesConfigsHistoricalData } from '../../../handlers/moneyMarket/reserves';
import { handleLbpPools } from '../../../handlers/pools/pools/lbpPool';
import { handleXykPools } from '../../../handlers/pools/pools/xykPool';
import { ensureOmnipool } from '../../../handlers/pools/pools/omnipool/omnipool';
import { handleOmnipoolAssets } from '../../../handlers/pools/pools/omnipool';
import { handleStablepools } from '../../../handlers/pools/pools/stableswap';
import { ensureAaveFacilitators } from '../../../handlers/facilitator';
import { ensureHsmpool } from '../../../handlers/pools/pools/hsmpool/hsmPool';
import { ensureHsmCollaterals } from '../../../handlers/pools/pools/hsmpool/collaterals/hsmCollateral';
import { handleHsmCollateralEvents } from '../../../handlers/pools/pools/hsmpool/collaterals';
import {
  handleAssetHistoricalData,
  handleAssetPairVolumesHistoricalData,
  handleAssetSpotPricesHistoricalData,
} from '../../../handlers/assets/assetHistoricalData';
import { handleAavepoolHistoricalData } from '../../../handlers/pools/pools/aavepool/historicalData';
import { handleStableswapHistoricalData } from '../../../handlers/pools/pools/stableswap/historicalData';
import { handleOmnipoolHistoricalData } from '../../../handlers/pools/pools/omnipool/historicalData';
import { handleXykPoolHistoricalData } from '../../../handlers/pools/pools/xykPool/historicalData';
import { handleLbppoolHistoricalData } from '../../../handlers/pools/pools/lbpPool/historicalData';
import { handleConstantsHistoricalData } from '../../../handlers/constants/constantsHistoricalData';
import { handleOracles } from '../../../handlers/oracles/emaOracle';
import { handleBroadcastSwappedEvents } from '../../../handlers/swap';
import { handleBuySellOperations } from '../../../handlers/buySellOperations';
import { handleStablepoolLiquidityEvents } from '../../../handlers/pools/pools/stableswap/liquidity';
import { handleDcaSchedules, saveDcaEntities } from '../../../handlers/dca';
import { handleOtcOrders } from '../../../handlers/otc';
import { createMoneyMarketEventsFromRoutedTrades } from '../../../handlers/moneyMarket/routedTradeToMmEventHandler';
import { handleEvm } from '../../../handlers/evmLog';
import { handleAccountMmPositionData } from '../../../handlers/accounts/moneyMarketPosition';
import { handleTransfers } from '../../../handlers/transfers';
import { saveAllMoneyMarketEvents } from '../../../handlers/moneyMarket';
import { HistoricalDataManager } from '../../../handlers/historicalData';
import { ensurePoolsDestroyedStatus } from '../../../handlers/pools/support';
import { handleEvmAccounts } from '../../../handlers/evmAccounts';
import { saveAllBatchAccounts } from '../../../handlers/accounts';
import { handleAssetAccountBalances } from '../../../handlers/balances';
import { processHsmpoolAssetBalanceHistoricalData } from '../../../handlers/pools/pools/hsmpool/hsmpoolAssetHistData';
import { processPoolsTvlNormalized } from '../../../handlers/pools/normalizedTvlBaseAsset';
import { processHsmpoolAssetNormalizedVolumes } from '../../../handlers/pools/normalizedVolumesInBaseAsset/hsmpoolAssetVolumesNormalized';

export async function aggregateHsmRelatedDataOnPostAggregationMode(
  ctx: SqdProcessorContext<Store>
) {
  if (!ctx.appConfig.ALL_IN_ONE_PROCESSOR_MODE) return;

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
  const parsedData = await getParsedEventsData(ctx);
  console.timeEnd('getParsedEventsData');

  await StorageResolver.getInstance().init({
    ctx: ctx,
    blockNumberFrom: ctx.blocks[0].header.height,
    blockNumberTo: ctx.blocks[ctx.blocks.length - 1].header.height,
  });

  console.time('prefetchPersistentData');
  await prefetchPersistentData(ctx);
  console.timeEnd('prefetchPersistentData');

  console.time('initContractInstances');
  await MoneyMarketContractsManager.getInstance().initContractInstances({
    ctx: ctx,
    blockNumber: ctx.blocks[ctx.blocks.length - 1].header.height,
  });
  console.timeEnd('initContractInstances');

  // await ensureNativeToken(ctx);
  //
  // console.time('actualiseAssets');
  // await actualiseAssets(ctx);
  // console.timeEnd('actualiseAssets');

  ctx.batchState.state.assetsAllBatch = new Map(
    (
      await ctx.store.find(Asset, {
        where: {},
        relations: {
          underlyingAsset: true,
          aToken: true,
          variableDebtToken: true,
          bondUnderlyingAsset: true,
        },
      })
    ).map((p) => [p.id, p])
  );
  ctx.batchState.state.assetsSpotPriceHistoricalDataBatch = new Map(
    (
      await ctx.store.find(AssetSpotPriceHistoricalData, {
        where: {
          paraBlockHeight: Between(
            ctx.blocks[0].header.height,
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
        },
        relations: {
          assetInHistData: true,
          assetIn: true,
          assetOut: true,
          block: true,
        },
      })
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.accountAssetBalanceHistoricalData = new Map(
    (
      await ctx.store.find(AccountAssetBalanceHistoricalData, {
        where: {
          paraBlockHeight: Between(
            ctx.blocks[0].header.height,
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
        },
        relations: {
          account: true,
          asset: true,
          block: true,
        },
      })
    ).map((p) => [p.id, p])
  );

  // console.time('handleAssetRegistry');
  // await handleAssetRegistry(ctx, parsedData);
  // console.timeEnd('handleAssetRegistry');

  // console.time('actualizeMoneyMarketReserves');
  // await actualizeMoneyMarketReserves({
  //   ctx,
  // });
  // console.timeEnd('actualizeMoneyMarketReserves');

  // console.time('handleMmReservesConfigsHistoricalData');
  // await handleMmReservesConfigsHistoricalData(ctx, parsedData);
  // console.timeEnd('handleMmReservesConfigsHistoricalData');

  // console.time('handleLbpPools');
  // await handleLbpPools(ctx, parsedData);
  // console.timeEnd('handleLbpPools');
  //
  // console.time('handleXykPools');
  // await handleXykPools(ctx, parsedData);
  // console.timeEnd('handleXykPools');
  //
  // console.time('handleOmnipoolAssets');
  // await ensureOmnipool(ctx);
  // await handleOmnipoolAssets(ctx, parsedData);
  // console.timeEnd('handleOmnipoolAssets');
  //
  // console.time('handleStablepools');
  // await handleStablepools(ctx, parsedData);
  // console.timeEnd('handleStablepools');

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
  // console.time('handleOracles');
  // await handleOracles(ctx);
  // console.timeEnd('handleOracles');
  //
  // console.time('handleAssetSpotPricesHistoricalData');
  // await handleAssetSpotPricesHistoricalData({ ctx });
  // console.timeEnd('handleAssetSpotPricesHistoricalData');

  console.time('handleBroadcastSwappedEvents');
  await handleBroadcastSwappedEvents(ctx, parsedData);
  console.timeEnd('handleBroadcastSwappedEvents');

  console.time('handleBuySellOperations');
  await handleBuySellOperations(ctx, parsedData);
  console.timeEnd('handleBuySellOperations');

  // console.time('handleStablepoolLiquidityEvents');
  // await handleStablepoolLiquidityEvents(ctx, parsedData);
  // console.timeEnd('handleStablepoolLiquidityEvents');

  // console.time('handleDcaSchedules');
  // await handleDcaSchedules(ctx, parsedData);
  // console.timeEnd('handleDcaSchedules');
  //
  // console.time('handleOtcOrders');
  // await handleOtcOrders(ctx, parsedData);
  // console.timeEnd('handleOtcOrders');

  // console.time('createMmWithdrawalEventsFromRoutedTrades');
  // await createMoneyMarketEventsFromRoutedTrades(ctx, [
  //   ...ctx.batchState.state.routeTrades.values(),
  // ]);
  // console.timeEnd('createMmWithdrawalEventsFromRoutedTrades');

  console.time('handleEvm');
  await handleEvm(ctx, parsedData);
  console.timeEnd('handleEvm');

  // console.time('handleAccountMmPositionData');
  // await handleAccountMmPositionData(ctx, parsedData);
  // console.timeEnd('handleAccountMmPositionData');

  // console.time('handleTransfers');
  // await handleTransfers(ctx, parsedData);
  // console.timeEnd('handleTransfers');

  // await saveAllMoneyMarketEvents(ctx);

  // await HistoricalDataManager.saveAccountMoneyMarketDataBulk(ctx);

  // console.time('ensurePoolsDestroyedStatus');
  // await ensurePoolsDestroyedStatus(ctx);
  // console.timeEnd('ensurePoolsDestroyedStatus');

  // console.time('handleEvmAccounts');
  // await handleEvmAccounts(ctx, parsedData);
  // console.timeEnd('handleEvmAccounts');

  console.time('saveAllBatchAccounts');
  await saveAllBatchAccounts(ctx);
  console.timeEnd('saveAllBatchAccounts');

  // console.time('handleAssetPairVolumesHistoricalData');
  // await handleAssetPairVolumesHistoricalData({ ctx });
  // console.timeEnd('handleAssetPairVolumesHistoricalData');

  // console.time('handleAssetAccountBalances');
  // await handleAssetAccountBalances(ctx, parsedData);
  // console.timeEnd('handleAssetAccountBalances');

  // console.time('processPoolsNormalizedVolumes');
  // await processPoolsNormalizedVolumes({ ctx });
  // console.timeEnd('processPoolsNormalizedVolumes');
  await processHsmpoolAssetNormalizedVolumes({ ctx });

  console.time('processHsmpoolAssetBalanceHistoricalData');
  await processHsmpoolAssetBalanceHistoricalData({ ctx });
  console.timeEnd('processHsmpoolAssetBalanceHistoricalData');

  // console.time('processPoolsTvlNormalized');
  // processPoolsTvlNormalized({ ctx });
  // console.timeEnd('processPoolsTvlNormalized');

  console.time('saveHistoricalDataBulk');
  await HistoricalDataManager.saveHistoricalDataBulk(ctx);
  console.timeEnd('saveHistoricalDataBulk');

  console.time('saveActivityTraceEntities');
  await ChainActivityTraceManager.saveActivityTraceEntities(ctx);
  console.timeEnd('saveActivityTraceEntities');

  // console.time('saveDcaEntities');
  // await saveDcaEntities(ctx);
  // console.timeEnd('saveDcaEntities');

  console.time('handleHistoricalVolumesBatchEntriesLists');
  await HistoricalDataManager.handleHistoricalVolumesBatchEntriesLists(ctx);
  console.timeEnd('handleHistoricalVolumesBatchEntriesLists');

  // console.time('saveAccountBalancesRelatedDataBulk');
  // await HistoricalDataManager.saveAccountBalancesRelatedDataBulk(ctx);
  // console.timeEnd('saveAccountBalancesRelatedDataBulk');

  console.time('updateInitialIndexingFinishedAtTime');
  await ProcessorStatusManager.updateInitialIndexingFinishedAtTime(ctx);
  console.timeEnd('updateInitialIndexingFinishedAtTime');

  await ProcessorStatusManager.getInstance(ctx).updateProcessorStatus({
    latestProcessedBlock: ctx.blocks[ctx.blocks.length - 1].header.height,
  });
}

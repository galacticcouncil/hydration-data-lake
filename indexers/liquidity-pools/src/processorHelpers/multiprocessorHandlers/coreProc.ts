import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { handleRelayChainBlocks } from '../../handlers/relayChain';
import { ChainActivityTraceManager } from '../../chainActivityTracingManagers';
import { getParsedEventsData } from '../../parsers/batchBlocksParser';
import { StorageResolver } from '../../parsers/storageResolver';
import {
  prefetchOrInitAllBatchAccounts,
  saveAllBatchAccounts,
} from '../../handlers/accounts';
import { MoneyMarketContractsManager } from '../../utils/evmTools/moneyMarketContractsManager';
import {
  actualiseAssets,
  ensureNativeToken,
  prefetchAllAssets,
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
import { handleEvm, saveAllMoneyMarketEvents } from '../../handlers/moneyMarket';
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
import { handleAssetHistoricalData } from '../../handlers/assets/assetHistoricalData';
import { processPoolsNormalizedVolumes } from '../../handlers/pools/normalizedVolumesInBaseAsset';
import { HistoricalDataManager } from '../../handlers/historicalData';
import { ProcessorStatusManager } from '../../processorStatusManager';
import { ProcessingPoolManager } from '../../utils/processingPoolManager';
import { processPreprocessedDataBuckets } from '../../handlers/preprocessedDataBucket';

export async function execCoreProcessorHandlers(
  ctx: SqdProcessorContext<Store>
) {
  if (
    ctx.appConfig.ALL_IN_ONE_PROCESSOR_MODE ||
    !ctx.appConfig.IS_CORE_PROCESSOR
  )
    return;

  console.log('execCoreProcessorHandlers');

  console.time('processPreprocessedDataBuckets');
  await processPreprocessedDataBuckets(ctx);
  console.timeEnd('processPreprocessedDataBuckets');

  await ProcessingPoolManager.getInstance().commitBlocksForProcessing(
    ctx.blocks.map((b) => b.header.height)
  );

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

  console.time('prefetchOrInitAllBatchAccounts');
  await prefetchOrInitAllBatchAccounts(ctx);
  console.timeEnd('prefetchOrInitAllBatchAccounts');

  console.time('initContractInstances');
  await MoneyMarketContractsManager.getInstance().initContractInstances({
    ctx: ctx,
    blockNumber: ctx.blocks[ctx.blocks.length - 1].header.height,
  });
  console.timeEnd('initContractInstances');

  console.time('prefetchAllAssets');
  await prefetchAllAssets(ctx);
  console.timeEnd('prefetchAllAssets');

  await ensureNativeToken(ctx);

  console.time('actualiseAssets');
  await actualiseAssets(ctx);
  console.timeEnd('actualiseAssets');

  console.time('handleAssetRegistry');
  await handleAssetRegistry(ctx, parsedData);
  console.timeEnd('handleAssetRegistry');

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

  console.time('handleStablepools');
  await handleStablepools(ctx, parsedData);
  console.timeEnd('handleStablepools');

  console.time('handleBroadcastSwappedEvents');
  await handleBroadcastSwappedEvents(ctx, parsedData);
  console.timeEnd('handleBroadcastSwappedEvents');

  console.time('handleBuySellOperations');
  await handleBuySellOperations(ctx, parsedData);
  console.timeEnd('handleBuySellOperations');

  console.time('handleStablepoolLiquidityEvents');
  await handleStablepoolLiquidityEvents(ctx, parsedData);
  console.timeEnd('handleStablepoolLiquidityEvents');

  console.time('handleDcaSchedules');
  await handleDcaSchedules(ctx, parsedData);
  console.timeEnd('handleDcaSchedules');

  console.time('handleOtcOrders');
  await handleOtcOrders(ctx, parsedData);
  console.timeEnd('handleOtcOrders');

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

  console.time('handleTransfers');
  await handleTransfers(ctx, parsedData);
  console.timeEnd('handleTransfers');

  await saveAllMoneyMarketEvents(ctx);

  console.time('pools hist data Promise.all');
  await Promise.all([
    (async () => {
      console.time('handleConstantsHistoricalData');
      await handleConstantsHistoricalData(ctx);
      console.timeEnd('handleConstantsHistoricalData');
    })(),
    (async () => {
      console.time('handleStableswapHistoricalData');
      await handleStableswapHistoricalData(ctx, parsedData);
      console.timeEnd('handleStableswapHistoricalData');
    })(),
    (async () => {
      console.time('handleOmnipoolHistoricalData');
      await handleOmnipoolHistoricalData(ctx, parsedData);
      console.timeEnd('handleOmnipoolHistoricalData');
    })(),
    (async () => {
      console.time('handleXykPoolHistoricalData');
      await handleXykPoolHistoricalData(ctx, parsedData);
      console.timeEnd('handleXykPoolHistoricalData');
    })(),
    (async () => {
      console.time('handleLbppoolHistoricalData');
      await handleLbppoolHistoricalData(ctx, parsedData);
      console.timeEnd('handleLbppoolHistoricalData');
    })(),
    (async () => {
      console.time('handleAavepoolHistoricalData');
      await handleAavepoolHistoricalData(ctx, parsedData);
      console.timeEnd('handleAavepoolHistoricalData');
    })(),
  ]);
  console.timeEnd('pools hist data Promise.all');
  //
  // console.time('handleConstantsHistoricalData');
  // await handleConstantsHistoricalData(ctx);
  // console.timeEnd('handleConstantsHistoricalData');
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
  // console.time('handleAavepoolHistoricalData');
  // await handleAavepoolHistoricalData(ctx, parsedData);
  // console.timeEnd('handleAavepoolHistoricalData');

  console.time('ensurePoolsDestroyedStatus');
  await ensurePoolsDestroyedStatus(ctx);
  console.timeEnd('ensurePoolsDestroyedStatus');

  console.time('handleEvmAccounts');
  await handleEvmAccounts(ctx, parsedData);
  console.timeEnd('handleEvmAccounts');

  console.time('saveAllBatchAccounts');
  await saveAllBatchAccounts(ctx);
  console.timeEnd('saveAllBatchAccounts');

  console.time('handleOracles');
  await handleOracles(ctx);
  console.timeEnd('handleOracles');

  // console.time('handleAssetHistoricalData');
  // await handleAssetHistoricalData(ctx);
  // console.timeEnd('handleAssetHistoricalData');

  // console.time('processPoolsNormalizedVolumes');
  // processPoolsNormalizedVolumes(ctx);
  // console.timeEnd('processPoolsNormalizedVolumes');

  console.time('saveHistoricalDataBulk');
  await HistoricalDataManager.saveHistoricalDataBulk(ctx);
  console.timeEnd('saveHistoricalDataBulk');

  console.time('saveActivityTraceEntities');
  await ChainActivityTraceManager.saveActivityTraceEntities(ctx);
  console.timeEnd('saveActivityTraceEntities');

  console.time('saveDcaEntities');
  await saveDcaEntities(ctx);
  console.timeEnd('saveDcaEntities');

  console.time('handleHistoricalVolumesBatchEntriesLists');
  await HistoricalDataManager.handleHistoricalVolumesBatchEntriesLists(ctx);
  console.timeEnd('handleHistoricalVolumesBatchEntriesLists');

  // console.time('handleAssetAccountBalances');
  // await handleAssetAccountBalances(
  //   ctx
  // );
  // console.timeEnd('handleAssetAccountBalances');

  console.time('updateInitialIndexingFinishedAtTime');
  await ProcessorStatusManager.updateInitialIndexingFinishedAtTime(ctx);
  console.timeEnd('updateInitialIndexingFinishedAtTime');

  await ProcessorStatusManager.getInstance(ctx).updateProcessorStatus({
    latestProcessedBlock: ctx.blocks[ctx.blocks.length - 1].header.height,
  });
}

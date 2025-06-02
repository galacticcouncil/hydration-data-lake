import { TypeormDatabase, Store } from '@subsquid/typeorm-store';

import { processor, SqdProcessorContext } from './processor';
import { BatchState } from './utils/batchState';
import { handleTransfers } from './handlers/transfers';
import { getParsedEventsData } from './parsers/batchBlocksParser';
import { AppConfig } from './appConfig';
import { handleOmnipoolAssets } from './handlers/pools/omnipool';
import { ensureOmnipool } from './handlers/pools/omnipool/omnipool';
import { handleBuySellOperations } from './handlers/buySellOperations';
import { handleStablepools } from './handlers/pools/stableswap';
import { handleAssetRegistry } from './handlers/assets';
import { StorageResolver } from './parsers/storageResolver';
import { handleStableswapHistoricalData } from './handlers/pools/stableswap/historicalData';
import { handleOmnipoolHistoricalData } from './handlers/pools/omnipool/historicalData';
import { handleXykPoolHistoricalData } from './handlers/pools/xykPool/historicalData';
import { handleLbppoolHistoricalData } from './handlers/pools/lbpPool/historicalData';
import { handleXykPools } from './handlers/pools/xykPool';
import { handleLbpPools } from './handlers/pools/lbpPool';
import { ProcessorStatusManager } from './processorStatusManager';
import { ensurePoolsDestroyedStatus } from './handlers/pools/support';
import {
  prefetchOrInitAllBatchAccounts,
  saveAllBatchAccounts,
} from './handlers/accounts';
import { ChainActivityTraceManager } from './chainActivityTracingManagers';
import { handleDcaSchedules, saveDcaEntities } from './handlers/dca';
import { printV8MemoryHeap } from './utils/helpers';
import { handleOtcOrders } from './handlers/otc';
import { handleBroadcastSwappedEvents } from './handlers/swap';
import { handleStablepoolLiquidityEvents } from './handlers/pools/stableswap/liquidity';
import { handleRelayChainBlocks } from './handlers/relayChain';
import { HistoricalDataManager } from './handlers/historicalData';
import { handleEvm, saveAllMoneyMarketEvents } from './handlers/moneyMarket';
import { handleEvmAccounts } from './handlers/evmAccounts';
import { MoneyMarketContractsManager } from './utils/evmTools/moneyMarketContractsManager';
import {
  actualiseAssets,
  ensureNativeToken,
  prefetchAllAssets,
} from './handlers/assets/utils';
import { handleAssetHistoricalData } from './handlers/assets/assetHistoricalData';
import { createMoneyMarketEventsFromRoutedTrades } from './handlers/moneyMarket/routedTradeToMmEventHandler';
import { handleAavepoolHistoricalData } from './handlers/pools/aavepool/historicalData';
import { handleConstantsHistoricalData } from './handlers/constants/constantsHistoricalData';
import { handleOracles } from './handlers/oracles/emaOracle';
import { processPoolsNormalizedVolumes } from './handlers/volumes/normalizedVolumesInBaseAsset';

console.log(
  `Indexer is staring for CHAIN - ${process.env.CHAIN} in ${process.env.NODE_ENV} environment`
);

if (process.env.INDEXING_IS_PAUSED === 'true') {
  console.log('Indexing is paused. Waiting...');
  while (true) {}
}

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
  printV8MemoryHeap();

  console.time('TOTAL BATCH EXECUTION TIME');

  const ctxWithBatchState: Omit<
    SqdProcessorContext<Store>,
    'batchState' | 'appConfig'
  > = ctx;
  (ctxWithBatchState as SqdProcessorContext<Store>).batchState =
    new BatchState();
  (ctxWithBatchState as SqdProcessorContext<Store>).appConfig =
    AppConfig.getInstance();

  // if (
  //   (ctxWithBatchState as SqdProcessorContext<Store>).appConfig.INDEXING_IS_PAUSED
  // ) {
  //   await new Promise((res) => console.log('Indexing is paused. Waiting...'));
  // }

  await handleRelayChainBlocks(ctxWithBatchState as SqdProcessorContext<Store>);

  console.time('processExtrinsics');
  await ChainActivityTraceManager.processExtrinsics(
    ctxWithBatchState as SqdProcessorContext<Store>
  );
  console.timeEnd('processExtrinsics');

  console.time('saveActivityTraceEntities');
  await ChainActivityTraceManager.saveActivityTraceEntities(
    ctxWithBatchState as SqdProcessorContext<Store>
  );
  console.timeEnd('saveActivityTraceEntities');

  console.time('getParsedEventsData');
  /**
   * getParsedEventsData must be executed ONLY after
   * ChainActivityTraceManager.processExtrinsics method execution, because
   * getParsedEventsData needs already compiled traceIds.
   */
  const parsedData = await getParsedEventsData(
    ctxWithBatchState as SqdProcessorContext<Store>
  );
  console.timeEnd('getParsedEventsData');

  await StorageResolver.getInstance().init({
    ctx: ctxWithBatchState as SqdProcessorContext<Store>,
    blockNumberFrom: ctx.blocks[0].header.height,
    blockNumberTo: ctx.blocks[ctx.blocks.length - 1].header.height,
  });

  console.time('prefetchOrInitAllBatchAccounts');
  await prefetchOrInitAllBatchAccounts(
    ctxWithBatchState as SqdProcessorContext<Store>
  );
  console.timeEnd('prefetchOrInitAllBatchAccounts');

  console.time('initContractInstances');
  await MoneyMarketContractsManager.getInstance().initContractInstances({
    ctx: ctxWithBatchState as SqdProcessorContext<Store>,
    blockNumber: ctx.blocks[ctx.blocks.length - 1].header.height,
  });
  console.timeEnd('initContractInstances');

  console.time('prefetchAllAssets');
  await prefetchAllAssets(ctxWithBatchState as SqdProcessorContext<Store>);
  console.timeEnd('prefetchAllAssets');

  await ensureNativeToken(ctxWithBatchState as SqdProcessorContext<Store>);

  console.time('actualiseAssets');
  await actualiseAssets(ctxWithBatchState as SqdProcessorContext<Store>);
  console.timeEnd('actualiseAssets');

  console.time('handleAssetRegistry');
  await handleAssetRegistry(
    ctxWithBatchState as SqdProcessorContext<Store>,
    parsedData
  );
  console.timeEnd('handleAssetRegistry');

  console.time('handleLbpPools');
  await handleLbpPools(
    ctxWithBatchState as SqdProcessorContext<Store>,
    parsedData
  );
  console.timeEnd('handleLbpPools');

  console.time('handleXykPools');
  await handleXykPools(
    ctxWithBatchState as SqdProcessorContext<Store>,
    parsedData
  );
  console.timeEnd('handleXykPools');

  console.time('handleOmnipoolAssets');
  await ensureOmnipool(ctxWithBatchState as SqdProcessorContext<Store>);
  await handleOmnipoolAssets(
    ctxWithBatchState as SqdProcessorContext<Store>,
    parsedData
  );
  console.timeEnd('handleOmnipoolAssets');

  console.time('handleStablepools');
  await handleStablepools(
    ctxWithBatchState as SqdProcessorContext<Store>,
    parsedData
  );
  console.timeEnd('handleStablepools');

  console.time('handleBroadcastSwappedEvents');
  await handleBroadcastSwappedEvents(
    ctxWithBatchState as SqdProcessorContext<Store>,
    parsedData
  );
  console.timeEnd('handleBroadcastSwappedEvents');

  console.time('handleBuySellOperations');
  await handleBuySellOperations(
    ctxWithBatchState as SqdProcessorContext<Store>,
    parsedData
  );
  console.timeEnd('handleBuySellOperations');

  console.time('handleStablepoolLiquidityEvents');
  await handleStablepoolLiquidityEvents(
    ctxWithBatchState as SqdProcessorContext<Store>,
    parsedData
  );
  console.timeEnd('handleStablepoolLiquidityEvents');

  console.time('handleDcaSchedules');
  await handleDcaSchedules(
    ctxWithBatchState as SqdProcessorContext<Store>,
    parsedData
  );
  console.timeEnd('handleDcaSchedules');

  console.time('handleOtcOrders');
  await handleOtcOrders(
    ctxWithBatchState as SqdProcessorContext<Store>,
    parsedData
  );
  console.timeEnd('handleOtcOrders');

  // if (ctx.isHead)
  //   await handlePoolPrices(ctxWithBatchState as SqdProcessorContext<Store>);

  console.time('createMmWithdrawalEventsFromRoutedTrades');
  await createMoneyMarketEventsFromRoutedTrades(
    ctxWithBatchState as SqdProcessorContext<Store>,
    [
      ...(
        ctxWithBatchState as SqdProcessorContext<Store>
      ).batchState.state.routeTrades.values(),
    ]
  );
  console.timeEnd('createMmWithdrawalEventsFromRoutedTrades');

  console.time('handleEvm');
  await handleEvm(ctxWithBatchState as SqdProcessorContext<Store>, parsedData);
  console.timeEnd('handleEvm');

  console.time('handleTransfers');
  await handleTransfers(
    ctxWithBatchState as SqdProcessorContext<Store>,
    parsedData
  );
  console.timeEnd('handleTransfers');

  await saveAllMoneyMarketEvents(
    ctxWithBatchState as SqdProcessorContext<Store>
  );

  console.time('pools hist data Promise.all');
  await Promise.all([
    (async () => {
      console.time('handleConstantsHistoricalData');
      await handleConstantsHistoricalData(
        ctxWithBatchState as SqdProcessorContext<Store>
      );
      console.timeEnd('handleConstantsHistoricalData');
    })(),
    (async () => {
      console.time('handleStableswapHistoricalData');
      await handleStableswapHistoricalData(
        ctxWithBatchState as SqdProcessorContext<Store>,
        parsedData
      );
      console.timeEnd('handleStableswapHistoricalData');
    })(),
    (async () => {
      console.time('handleOmnipoolHistoricalData');
      await handleOmnipoolHistoricalData(
        ctxWithBatchState as SqdProcessorContext<Store>,
        parsedData
      );
      console.timeEnd('handleOmnipoolHistoricalData');
    })(),
    (async () => {
      console.time('handleXykPoolHistoricalData');
      await handleXykPoolHistoricalData(
        ctxWithBatchState as SqdProcessorContext<Store>,
        parsedData
      );
      console.timeEnd('handleXykPoolHistoricalData');
    })(),
    (async () => {
      console.time('handleLbppoolHistoricalData');
      await handleLbppoolHistoricalData(
        ctxWithBatchState as SqdProcessorContext<Store>,
        parsedData
      );
      console.timeEnd('handleLbppoolHistoricalData');
    })(),
    (async () => {
      console.time('handleAavepoolHistoricalData');
      await handleAavepoolHistoricalData(
        ctxWithBatchState as SqdProcessorContext<Store>,
        parsedData
      );
      console.timeEnd('handleAavepoolHistoricalData');
    })(),
  ]);
  console.timeEnd('pools hist data Promise.all');

  console.time('ensurePoolsDestroyedStatus');
  await ensurePoolsDestroyedStatus(
    ctxWithBatchState as SqdProcessorContext<Store>
  );
  console.timeEnd('ensurePoolsDestroyedStatus');

  console.time('handleEvmAccounts');
  await handleEvmAccounts(
    ctxWithBatchState as SqdProcessorContext<Store>,
    parsedData
  );
  console.timeEnd('handleEvmAccounts');

  console.time('saveAllBatchAccounts');
  await saveAllBatchAccounts(ctxWithBatchState as SqdProcessorContext<Store>);
  console.timeEnd('saveAllBatchAccounts');

  console.time('handleOracles');
  await handleOracles(ctxWithBatchState as SqdProcessorContext<Store>);
  console.timeEnd('handleOracles');

  console.time('handleAssetHistoricalData');
  await handleAssetHistoricalData(
    ctxWithBatchState as SqdProcessorContext<Store>
  );
  console.timeEnd('handleAssetHistoricalData');

  console.time('processPoolsNormalizedVolumes');
  processPoolsNormalizedVolumes(
    ctxWithBatchState as SqdProcessorContext<Store>
  );
  console.timeEnd('processPoolsNormalizedVolumes');

  console.time('saveHistoricalDataBulk');
  await HistoricalDataManager.saveHistoricalDataBulk(
    ctxWithBatchState as SqdProcessorContext<Store>
  );
  console.timeEnd('saveHistoricalDataBulk');

  console.time('saveActivityTraceEntities');
  await ChainActivityTraceManager.saveActivityTraceEntities(
    ctxWithBatchState as SqdProcessorContext<Store>
  );
  console.timeEnd('saveActivityTraceEntities');

  console.time('saveDcaEntities');
  await saveDcaEntities(ctxWithBatchState as SqdProcessorContext<Store>);
  console.timeEnd('saveDcaEntities');

  console.time('handleHistoricalVolumesBatchEntriesLists');
  await HistoricalDataManager.handleHistoricalVolumesBatchEntriesLists(
    ctxWithBatchState as SqdProcessorContext<Store>
  );
  console.timeEnd('handleHistoricalVolumesBatchEntriesLists');

  // console.time('handleAssetAccountBalancesPerBlock');
  // await handleAssetAccountBalancesPerBlock(
  //   ctxWithBatchState as SqdProcessorContext<Store>
  // );
  // console.timeEnd('handleAssetAccountBalancesPerBlock');

  console.time('updateInitialIndexingFinishedAtTime');
  await ProcessorStatusManager.updateInitialIndexingFinishedAtTime(
    ctxWithBatchState as SqdProcessorContext<Store>
  );
  console.timeEnd('updateInitialIndexingFinishedAtTime');

  await ProcessorStatusManager.getInstance(
    ctxWithBatchState as SqdProcessorContext<Store>
  ).updateProcessorStatus({
    latestProcessedBlock: ctx.blocks[ctx.blocks.length - 1].header.height,
  });

  console.timeEnd('TOTAL BATCH EXECUTION TIME');
});

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
import { handleOmnipoolAssetHistoricalData } from './handlers/pools/omnipool/historicalData';
import { handleXykPoolHistoricalData } from './handlers/pools/xykPool/xykPoolHistoricalData';
import { handleLbppoolHistoricalData } from './handlers/pools/lbpPool/lbpPoolHistoricalData';
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
import { handleSupportSwappedEvents } from './handlers/swap';
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
import { ethers } from 'ethers';

console.log(
  `Indexer is staring for CHAIN - ${process.env.CHAIN} in ${process.env.NODE_ENV} environment`
);

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
  printV8MemoryHeap();

  // console.log(
  //   ethers.utils.getAddress('0xf006621efdc155f5996c3afa23f5a6379c578010')
  // );
  // console.log(
  //   ethers.utils.getAddress('0xf006621eFdc155f5996C3Afa23F5a6379C578010')
  // );
  // console.log(
  //   '0xc64980e4eaf9a1151bd21712b9946b81e41e2b92',
  //   ethers.utils.getAddress('0xc64980e4eaf9a1151bd21712b9946b81e41e2b92'),
  //   ethers.utils.getIcapAddress('0xc64980e4eaf9a1151bd21712b9946b81e41e2b92')
  // );

  const ctxWithBatchState: Omit<
    SqdProcessorContext<Store>,
    'batchState' | 'appConfig'
  > = ctx;
  (ctxWithBatchState as SqdProcessorContext<Store>).batchState =
    new BatchState();
  (ctxWithBatchState as SqdProcessorContext<Store>).appConfig =
    AppConfig.getInstance();

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
    blockNumber: ctx.blocks[0].header.height,
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

  console.time('handleSupportSwappedEvents');
  await handleSupportSwappedEvents(
    ctxWithBatchState as SqdProcessorContext<Store>,
    parsedData
  );
  console.timeEnd('handleSupportSwappedEvents');

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

  console.time('handleStableswapHistoricalData');
  await handleStableswapHistoricalData(
    ctxWithBatchState as SqdProcessorContext<Store>,
    parsedData
  );
  console.timeEnd('handleStableswapHistoricalData');

  console.time('handleOmnipoolAssetHistoricalData');
  await handleOmnipoolAssetHistoricalData(
    ctxWithBatchState as SqdProcessorContext<Store>,
    parsedData
  );
  console.timeEnd('handleOmnipoolAssetHistoricalData');

  console.time('handleXykPoolHistoricalData');
  await handleXykPoolHistoricalData(
    ctxWithBatchState as SqdProcessorContext<Store>,
    parsedData
  );
  console.timeEnd('handleXykPoolHistoricalData');

  console.time('handleLbppoolHistoricalData');
  await handleLbppoolHistoricalData(
    ctxWithBatchState as SqdProcessorContext<Store>,
    parsedData
  );
  console.timeEnd('handleLbppoolHistoricalData');

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

  console.time('updateInitialIndexingFinishedAtTime');
  await ProcessorStatusManager.updateInitialIndexingFinishedAtTime(
    ctxWithBatchState as SqdProcessorContext<Store>
  );
  console.timeEnd('updateInitialIndexingFinishedAtTime');
});

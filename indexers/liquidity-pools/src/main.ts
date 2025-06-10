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
import {
  execAllInOneProcessorHandlers,
  execCoreProcessorHandlers,
} from './multiprocessorHandlers';
import { execSpotPricesProcessorHandlers } from './multiprocessorHandlers/spotPricesProc';
import { ProcessingPoolManager } from './utils/processingPoolManager';

console.log(
  `Indexer is staring for CHAIN - ${process.env.CHAIN} in ${process.env.NODE_ENV} environment`
);

if (process.env.INDEXING_IS_PAUSED === 'true') {
  console.log('Indexing is paused. Waiting...');
  while (true) {}
}

const appConfig = AppConfig.getInstance();

processor.run(
  new TypeormDatabase({
    supportHotBlocks: true,
    stateSchema: appConfig.STATE_SCHEMA_NAME,
    isolationLevel: 'READ COMMITTED',
  }),
  async (ctx) => {

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

    await execAllInOneProcessorHandlers(
      ctxWithBatchState as SqdProcessorContext<Store>
    );

    await execCoreProcessorHandlers(
      ctxWithBatchState as SqdProcessorContext<Store>
    );

    await execSpotPricesProcessorHandlers(
      ctxWithBatchState as SqdProcessorContext<Store>
    );

    (ctxWithBatchState as SqdProcessorContext<Store>).batchState.wipeState();

    console.timeEnd('TOTAL BATCH EXECUTION TIME');

    // await new Promise((res) => setTimeout(res, 30_000));
  }
);

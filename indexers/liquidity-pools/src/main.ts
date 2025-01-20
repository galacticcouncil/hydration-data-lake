import { TypeormDatabase, Store } from '@subsquid/typeorm-store';

import { processor, ProcessorContext } from './processor';
import { BatchState } from './utils/batchState';
import { handleTransfers } from './handlers/transfers';
import { getParsedEventsData } from './parsers/batchBlocksParser';
import { AppConfig } from './appConfig';
import { handleOmnipoolAssets } from './handlers/pools/omnipool';
import { ensureOmnipool } from './handlers/pools/omnipool/omnipool';
import { handleBuySellOperations } from './handlers/buySellOperations';
import { handleStablepools } from './handlers/pools/stablepool';
import { handleAssetRegistry } from './handlers/assets';
import { StorageResolver } from './parsers/storageResolver';
import { handleStablepoolHistoricalData } from './handlers/pools/stablepool/historicalData';
import { handleOmnipoolAssetHistoricalData } from './handlers/pools/omnipool/historicalData';
import {
  actualiseAssets,
  ensureNativeToken,
  prefetchAllAssets,
} from './handlers/assets/assetRegistry';
import { handleXykPoolHistoricalData } from './handlers/pools/xykPool/xykPoolHistoricalData';
import { handleLbpPoolHistoricalData } from './handlers/pools/lbpPool/lbpPoolHistoricalData';
import { handleXykPools } from './handlers/pools/xykPool';
import { handleLbpPools } from './handlers/pools/lbpPool';
import { ProcessorStatusManager } from './processorStatusManager';
import { ensurePoolsDestroyedStatus } from './handlers/pools/support';
import { saveAllBatchAccounts } from './handlers/accounts';
import { ChainActivityTraceManager } from './chainActivityTraceManager';
import { handleDcaSchedules, saveDcaEntities } from './handlers/dca';
import { printV8MemoryHeap } from './utils/helpers';
import { handleOtcOrders } from './handlers/otc';
import { handleSupportSwappedEvents } from './handlers/swap';

console.log(
  `Indexer is staring for CHAIN - ${process.env.CHAIN} in ${process.env.NODE_ENV} environment`
);

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
  printV8MemoryHeap();

  const ctxWithBatchState: Omit<
    ProcessorContext<Store>,
    'batchState' | 'appConfig'
  > = ctx;
  (ctxWithBatchState as ProcessorContext<Store>).batchState = new BatchState();
  (ctxWithBatchState as ProcessorContext<Store>).appConfig =
    AppConfig.getInstance();

  await ChainActivityTraceManager.processExtrinsics(
    ctxWithBatchState as ProcessorContext<Store>
  );

  const parsedData = await getParsedEventsData(
    ctxWithBatchState as ProcessorContext<Store>
  );

  await StorageResolver.getInstance().init({
    ctx: ctxWithBatchState as ProcessorContext<Store>,
    blockNumberFrom: ctx.blocks[0].header.height,
    blockNumberTo: ctx.blocks[ctx.blocks.length - 1].header.height,
  });

  // console.time('prefetchAllAssets');
  await prefetchAllAssets(ctxWithBatchState as ProcessorContext<Store>);
  // console.timeEnd('prefetchAllAssets');

  await ensureNativeToken(ctxWithBatchState as ProcessorContext<Store>);

  // console.time('actualiseAssets');
  await actualiseAssets(ctxWithBatchState as ProcessorContext<Store>);
  // console.timeEnd('actualiseAssets');

  // console.time('handleAssetRegistry');
  await handleAssetRegistry(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );
  // console.timeEnd('handleAssetRegistry');

  // console.time('handleLbpPools');
  await handleLbpPools(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );
  // console.timeEnd('handleLbpPools');

  // console.time('handleXykPools');
  await handleXykPools(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );
  // console.timeEnd('handleXykPools');

  // console.time('handleOmnipoolAssets');
  await ensureOmnipool(ctxWithBatchState as ProcessorContext<Store>);
  await handleOmnipoolAssets(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );
  // console.timeEnd('handleOmnipoolAssets');

  // console.time('handleStablepools');
  await handleStablepools(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );
  // console.timeEnd('handleStablepools');

  // console.time('handleSupportSwappedEvents');
  await handleSupportSwappedEvents(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );
  // console.timeEnd('handleSupportSwappedEvents');

  // console.time('handleBuySellOperations');
  await handleBuySellOperations(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );
  // console.timeEnd('handleBuySellOperations');

  // console.time('handleDcaSchedules');
  await handleDcaSchedules(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );
  // console.timeEnd('handleDcaSchedules');

  // console.time('handleOtcOrders');
  await handleOtcOrders(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );
  // console.timeEnd('handleOtcOrders');

  // if (ctx.isHead)
  //   await handlePoolPrices(ctxWithBatchState as ProcessorContext<Store>);

  // console.time('handleTransfers');
  await handleTransfers(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );
  // console.timeEnd('handleTransfers');

  // console.time('handleStablepoolHistoricalData');
  await handleStablepoolHistoricalData(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );
  // console.timeEnd('handleStablepoolHistoricalData');

  // console.time('handleOmnipoolAssetHistoricalData');
  await handleOmnipoolAssetHistoricalData(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );
  // console.timeEnd('handleOmnipoolAssetHistoricalData');

  // console.time('handleXykPoolHistoricalData');
  await handleXykPoolHistoricalData(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );
  // console.timeEnd('handleXykPoolHistoricalData');

  // console.time('handleLbpPoolHistoricalData');
  await handleLbpPoolHistoricalData(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );
  // console.timeEnd('handleLbpPoolHistoricalData');

  await ensurePoolsDestroyedStatus(
    ctxWithBatchState as ProcessorContext<Store>
  );

  await saveAllBatchAccounts(ctxWithBatchState as ProcessorContext<Store>);

  await ChainActivityTraceManager.saveActivityTraceEntities(
    ctxWithBatchState as ProcessorContext<Store>
  );

  await saveDcaEntities(ctxWithBatchState as ProcessorContext<Store>);

  await ProcessorStatusManager.updateInitialIndexingFinishedAtTime(
    ctxWithBatchState as ProcessorContext<Store>
  );
});

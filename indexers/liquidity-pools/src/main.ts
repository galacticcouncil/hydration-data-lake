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
import { ProcessorStatusManager } from './utils/processorStatusManager';
import { ensurePoolsDestroyedStatus } from './handlers/pools/support';

console.log(
  `Indexer is staring for CHAIN - ${process.env.CHAIN} in ${process.env.NODE_ENV} environment`
);

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
  const ctxWithBatchState: Omit<
    ProcessorContext<Store>,
    'batchState' | 'appConfig'
  > = ctx;
  (ctxWithBatchState as ProcessorContext<Store>).batchState = new BatchState();
  (ctxWithBatchState as ProcessorContext<Store>).appConfig =
    AppConfig.getInstance();

  const parsedData = await getParsedEventsData(
    ctxWithBatchState as ProcessorContext<Store>
  );

  await StorageResolver.getInstance().init({
    ctx: ctxWithBatchState as ProcessorContext<Store>,
    blockNumberFrom: ctx.blocks[0].header.height,
    blockNumberTo: ctx.blocks[ctx.blocks.length - 1].header.height,
  });

  await prefetchAllAssets(ctxWithBatchState as ProcessorContext<Store>);

  await ensureNativeToken(ctxWithBatchState as ProcessorContext<Store>);

  await actualiseAssets(ctxWithBatchState as ProcessorContext<Store>);

  await handleAssetRegistry(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );

  await handleLbpPools(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );
  await handleXykPools(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );

  await ensureOmnipool(ctxWithBatchState as ProcessorContext<Store>);
  await handleOmnipoolAssets(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );

  await handleStablepools(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );

  await handleBuySellOperations(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );

  // if (ctx.isHead)
  //   await handlePoolPrices(ctxWithBatchState as ProcessorContext<Store>);

  await handleTransfers(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );

  console.time('handleStablepoolHistoricalData');
  await handleStablepoolHistoricalData(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );
  console.timeEnd('handleStablepoolHistoricalData');

  console.time('handleOmnipoolAssetHistoricalData');
  await handleOmnipoolAssetHistoricalData(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );
  console.timeEnd('handleOmnipoolAssetHistoricalData');

  console.time('handleXykPoolHistoricalData');
  await handleXykPoolHistoricalData(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );
  console.timeEnd('handleXykPoolHistoricalData');

  console.time('handleLbpPoolHistoricalData');
  await handleLbpPoolHistoricalData(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );
  console.timeEnd('handleLbpPoolHistoricalData');

  await ensurePoolsDestroyedStatus(
    ctxWithBatchState as ProcessorContext<Store>
  );

  const statusManager = ProcessorStatusManager.getInstance(
    ctxWithBatchState as ProcessorContext<Store>
  );
  const currentStatus = await statusManager.getStatus();

  if (ctx.isHead && !currentStatus.initialIndexingFinishedAtTime)
    await statusManager.updateProcessorStatus({
      initialIndexingFinishedAtTime: new Date(),
    });
});

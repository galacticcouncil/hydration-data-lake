import { TypeormDatabase, Store } from '@subsquid/typeorm-store';

import { processor, ProcessorContext } from './processor';
import { BatchState } from './utils/batchState';
import { handlePools } from './handlers/isolatedPool';
import { handleTransfers } from './handlers/transfers';
import { getParsedEventsData } from './parsers/batchBlocksParser';
import { AppConfig } from './appConfig';
import { handlePoolPrices } from './handlers/prices';
import { handleOmnipoolAssets } from './handlers/omnipool';
import { ensureOmnipool } from './handlers/omnipool/omnipool';
import { handleOperations } from './handlers/operations';
import { handleStablepools } from './handlers/stablepool';
import { handleAssetRegistry } from './handlers/assets';
import { StorageResolver } from './parsers/storageResolver';
import { handleStablepoolHistoricalData } from './handlers/stablepool/historicalData';
import { handleOmnipoolAssetHistoricalData } from './handlers/omnipool/historicalData';
import { handleXykPoolHistoricalData } from './handlers/isolatedPool/xykPoolHistoricalData';
import { handleLbpPoolHistoricalData } from './handlers/isolatedPool/lbpPoolHistoricalData';
import {
  actualiseAssets,
  ensureNativeToken,
  prefetchAllAssets,
} from './handlers/assets/assetRegistry';

const timeMes = { start: Date.now(), end: Date.now() };

console.log('Indexer is staring for CHAIN - ', process.env.CHAIN);

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

  await handlePools(ctxWithBatchState as ProcessorContext<Store>, parsedData);

  await ensureOmnipool(ctxWithBatchState as ProcessorContext<Store>);
  await handleOmnipoolAssets(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );

  await handleStablepools(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );

  await handleOperations(
    ctxWithBatchState as ProcessorContext<Store>,
    parsedData
  );

  if (ctx.isHead)
    await handlePoolPrices(ctxWithBatchState as ProcessorContext<Store>);

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

  timeMes.end = Date.now();
  console.log('Batch complete - ', timeMes);
});

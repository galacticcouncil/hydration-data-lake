import { Between } from 'typeorm/find-options/operator/Between';

import { Store } from '@subsquid/typeorm-store';

import {
  AssetHistoricalData,
  ConstantsHistoricalData,
  EmaOracleEntryHistoricalData,
  ProcessorStatus,
  XykpoolHistoricalData,
} from '../../../../model';
import { SqdProcessorContext } from '../../../../processor';
import {
  prefetchAllAvailableLbppoolHistDataForBlocksRange,
  prefetchAllAvailableLbppoolVolumesForBlocksRange,
  prefetchAllAvailableOmnipoolAssetHistDataForBlocksRange,
  prefetchAllAvailableOmnipoolAssetVolumesForBlocksRange,
  prefetchAllAvailableRoutedTradesForBlocksRange,
  prefetchAllAvailableStableswapHistDataForBlocksRange,
  prefetchAllAvailableStableswapVolumesForBlocksRange,
  prefetchAllAvailableXykpoolHistDataForBlocksRange,
  prefetchAllAvailableXykpoolVolumesForBlocksRange,
} from './prefetchHelpers';

export async function waitForSpotPricesRelatedHistoricalData(
  blocksToProcess: number[],
  ctx: SqdProcessorContext<Store>
) {
  const prefetchConstantsHistoricalData = async (
    fromBlockNumber: number,
    toBlockNumber: number
  ) => {
    const records = await ctx.storeUtils.findWithLogs(
      ConstantsHistoricalData,
      {
        where: {
          paraBlockHeight: Between(fromBlockNumber, toBlockNumber),
        },
      },
      { className: 'ConstantsHistoricalData' }
    );

    ctx.batchState.state.constantsHistoricalData = new Map(
      records.map((r) => [r.id, r])
    );

    const processedBlockNumbers = new Set(
      records.map((r) => r.paraBlockHeight)
    );
    return processedBlockNumbers;
  };

  const prefetchAssetHistoricalData = async (
    fromBlockNumber: number,
    toBlockNumber: number
  ) => {
    const records = await ctx.storeUtils.findWithLogs(
      AssetHistoricalData,
      {
        where: {
          paraBlockHeight: Between(fromBlockNumber, toBlockNumber),
        },
      },
      { className: 'AssetHistoricalData' }
    );

    ctx.batchState.state.assetsHistoricalDataBatch = new Map(
      records.map((r) => [r.id, r])
    );

    const processedBlockNumbers = new Set(
      records.map((r) => r.paraBlockHeight)
    );
    return processedBlockNumbers;
  };

  const prefetchEmaOracleHistoricalData = async (
    fromBlockNumber: number,
    toBlockNumber: number
  ) => {
    const records = await ctx.storeUtils.findWithLogs(
      EmaOracleEntryHistoricalData,
      {
        where: {
          paraBlockHeight: Between(fromBlockNumber, toBlockNumber),
        },
        relations: {},
      },
      { className: 'EmaOracleEntryHistoricalData' }
    );

    ctx.batchState.state.emaOracleEntriesHistoricalData = new Map(
      records.map((r) => [r.id, r])
    );

    const processedBlockNumbers = new Set(
      records.map((r) => r.paraBlockHeight)
    );
    return processedBlockNumbers;
  };

  const prefetchXykpoolsHistoricalData = async (
    fromBlockNumber: number,
    toBlockNumber: number
  ) => {
    const records = await ctx.storeUtils.findWithLogs(
      XykpoolHistoricalData,
      {
        where: {
          paraBlockHeight: Between(fromBlockNumber, toBlockNumber),
        },
        relations: {
          pool: true,
        },
      },
      { className: 'XykpoolHistoricalData' }
    );

    ctx.batchState.state.xykPoolAllHistoricalData = new Map(
      records.map((r) => [r.id, r])
    );

    const processedBlockNumbers = new Set(
      records.map((r) => r.paraBlockHeight)
    );
    return processedBlockNumbers;
  };

  const checkAndWaitForData = async (
    fetchFn: (
      fromBlockNumber: number,
      toBlockNumber: number
    ) => Promise<Set<number>>
  ) => {
    const processedBlockNumbers = await fetchFn(
      blocksToProcess[0],
      blocksToProcess[blocksToProcess.length - 1]
    );

    const missingBlockNumbers = blocksToProcess.filter(
      (bn) => !processedBlockNumbers.has(bn)
    );
    if (missingBlockNumbers.length > 0) {
      console.log(
        `Waiting for historical data for ${missingBlockNumbers.length} blocks `
      );
      await new Promise((resolve) => setTimeout(resolve, 4_000));
      await checkAndWaitForData(fetchFn);
    }
  };

  // await Promise.all([
  //   checkAndWaitForData(prefetchConstantsHistoricalData),
  //   checkAndWaitForData(prefetchEmaOracleHistoricalData),
  //   checkAndWaitForData(prefetchXykpoolsHistoricalData),
  // ]);

  await checkAndWaitForData(prefetchConstantsHistoricalData);
  await checkAndWaitForData(prefetchEmaOracleHistoricalData);
  await checkAndWaitForData(prefetchXykpoolsHistoricalData);

  await Promise.all([
    prefetchAllAvailableRoutedTradesForBlocksRange({
      fromBlockNumber: blocksToProcess[0],
      toBlockNumber: blocksToProcess[blocksToProcess.length - 1],
      ctx,
    }),
    prefetchAllAvailableXykpoolVolumesForBlocksRange({
      fromBlockNumber: blocksToProcess[0],
      toBlockNumber: blocksToProcess[blocksToProcess.length - 1],
      ctx,
    }),
    prefetchAllAvailableStableswapVolumesForBlocksRange({
      fromBlockNumber: blocksToProcess[0],
      toBlockNumber: blocksToProcess[blocksToProcess.length - 1],
      ctx,
    }),
    prefetchAllAvailableOmnipoolAssetVolumesForBlocksRange({
      fromBlockNumber: blocksToProcess[0],
      toBlockNumber: blocksToProcess[blocksToProcess.length - 1],
      ctx,
    }),
    prefetchAllAvailableLbppoolVolumesForBlocksRange({
      fromBlockNumber: blocksToProcess[0],
      toBlockNumber: blocksToProcess[blocksToProcess.length - 1],
      ctx,
    }),
    prefetchAllAvailableXykpoolHistDataForBlocksRange({
      fromBlockNumber: blocksToProcess[0],
      toBlockNumber: blocksToProcess[blocksToProcess.length - 1],
      ctx,
    }),
    prefetchAllAvailableLbppoolHistDataForBlocksRange({
      fromBlockNumber: blocksToProcess[0],
      toBlockNumber: blocksToProcess[blocksToProcess.length - 1],
      ctx,
    }),
    prefetchAllAvailableOmnipoolAssetHistDataForBlocksRange({
      fromBlockNumber: blocksToProcess[0],
      toBlockNumber: blocksToProcess[blocksToProcess.length - 1],
      ctx,
    }),
    prefetchAllAvailableStableswapHistDataForBlocksRange({
      fromBlockNumber: blocksToProcess[0],
      toBlockNumber: blocksToProcess[blocksToProcess.length - 1],
      ctx,
    }),
  ]);

  console.log('All historical data ready for spot prices processing');
}

export async function checkAndWaitForCoreProcStatus(
  ctx: SqdProcessorContext<Store>
) {
  const coreProcStatus = await ctx.storeUtils.findOneWithLogs(
    ProcessorStatus,
    {
      where: {
        id: 'squid_processor',
      },
    },
    { className: 'ProcessorStatus' }
  );

  const coreProcLatestProcessedBlock = coreProcStatus?.latestProcessedBlock;

  if (
    !coreProcLatestProcessedBlock ||
    coreProcLatestProcessedBlock <
      ctx.blocks[ctx.blocks.length - 1].header.height
  ) {
    console.log(`Waiting for core processor state`);
    await new Promise((resolve) => setTimeout(resolve, 4_000));
    await checkAndWaitForCoreProcStatus(ctx);
  }
}

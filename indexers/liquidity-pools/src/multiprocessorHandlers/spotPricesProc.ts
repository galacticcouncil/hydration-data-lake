import { SqdProcessorContext } from '../processor';
import { Store } from '@subsquid/typeorm-store';
import { handleRelayChainBlocks } from '../handlers/relayChain';
import {
  actualiseAssets,
  ensureNativeToken,
  prefetchAllAssets,
} from '../handlers/assets/utils';
import {
  handleAssetHistoricalData,
  handleAssetSpotPriceRelatedHistoricalData,
} from '../handlers/assets/assetHistoricalData';
import { processPoolsNormalizedVolumes } from '../handlers/volumes/normalizedVolumesInBaseAsset';
import { HistoricalDataManager } from '../handlers/historicalData';
import { Between } from 'typeorm/find-options/operator/Between';
import {
  AssetHistoricalData,
  ConstantsHistoricalData,
  EmaOracleEntryHistoricalData,
  Lbppool,
  LbppoolHistoricalData,
  LbppoolVolumeHistoricalData,
  OmnipoolAssetVolumeHistoricalData,
  ProcessorStatus,
  RoutedTrade,
  StableswapAssetVolumeHistoricalData,
  StableswapVolumeHistoricalData,
  SwapAssetBalanceType,
  XykpoolHistoricalData,
  XykpoolVolumeHistoricalData,
} from '../model';
import { ProcessorStatusManager } from '../processorStatusManager';
import { ChainActivityTraceManager } from '../chainActivityTracingManagers';
import { ProcessingPoolManager } from '../utils/processingPoolManager';
import { StorageResolver } from '../parsers/storageResolver';

export async function execSpotPricesProcessorHandlers(
  ctx: SqdProcessorContext<Store>
) {
  if (
    ctx.appConfig.ALL_IN_ONE_PROCESSOR_MODE ||
    !ctx.appConfig.IS_SPOT_PRICES_PROCESSOR
  )
    return;

  console.log('execSpotPricesProcessorHandlers');

  console.time('prefetchAllAssets');
  await prefetchAllAssets(ctx);
  console.timeEnd('prefetchAllAssets');

  await checkAndWaitForCoreProcStatus(ctx);

  await ProcessingPoolManager.getInstance().releaseCompletedJobs();

  const batchBlockNumbers = ctx.blocks.map((b) => b.header.height);

  while (true) {
    const blockNumbersToProcess =
      await ProcessingPoolManager.getInstance().takeJobsToProcessing(
        batchBlockNumbers
      );

    console.log('blockNumbersToProcess - ', blockNumbersToProcess);
    if (blockNumbersToProcess.length === 0) break;

    await processLockedBlocksBatch(blockNumbersToProcess, ctx);

    ProcessingPoolManager.getInstance().completeProcessedJobs(
      batchBlockNumbers
    );
  }

  console.time('updateInitialIndexingFinishedAtTime');
  await ProcessorStatusManager.updateInitialIndexingFinishedAtTime(ctx);
  console.timeEnd('updateInitialIndexingFinishedAtTime');

  await ProcessorStatusManager.getInstance(ctx).updateProcessorStatus({
    latestProcessedBlock: ctx.blocks[ctx.blocks.length - 1].header.height,
  });
}

async function processLockedBlocksBatch(
  blockNumbersToProcess: number[],
  ctx: SqdProcessorContext<Store>
) {
  await StorageResolver.getInstance().init({
    ctx: ctx,
    blockNumberFrom: blockNumbersToProcess[0],
    blockNumberTo: blockNumbersToProcess[blockNumbersToProcess.length - 1],
  });

  console.time('waitForSpotPricesRelatedHistoricalData');
  await waitForSpotPricesRelatedHistoricalData(blockNumbersToProcess, ctx);
  console.timeEnd('waitForSpotPricesRelatedHistoricalData');

  await ChainActivityTraceManager.prefetchBlockToCache({
    ctx,
    blockHeights: blockNumbersToProcess,
  });

  await handleRelayChainBlocks(ctx);

  console.time('prefetchAllAssets');
  await prefetchAllAssets(ctx);
  console.timeEnd('prefetchAllAssets');

  // await ensureNativeToken(ctx);
  //
  // console.time('actualiseAssets');
  // await actualiseAssets(ctx);
  // console.timeEnd('actualiseAssets');

  console.time('handleAssetHistoricalData');
  await handleAssetHistoricalData({
    ctx,
    blockNumbersToProcess,
  });
  console.timeEnd('handleAssetHistoricalData');

  console.time('handleAssetSpotPricesHistoricalData');
  await handleAssetSpotPriceRelatedHistoricalData({
    ctx,
    blockNumbersToProcess,
  });
  console.timeEnd('handleAssetSpotPricesHistoricalData');

  console.time('processPoolsNormalizedVolumes');
  processPoolsNormalizedVolumes({ ctx });
  console.timeEnd('processPoolsNormalizedVolumes');

  console.time('saveHistoricalDataBulk');
  await HistoricalDataManager.saveHistoricalDataBulk(ctx);
  console.timeEnd('saveHistoricalDataBulk');
}

async function waitForSpotPricesRelatedHistoricalData(
  blocksToProcess: number[],
  ctx: SqdProcessorContext<Store>
) {
  // const orderedBlockNumbers = ctx.blocks
  //   .map((b) => b.header.height)
  //   .sort((a, b) => a - b);

  const prefetchConstantsHistoricalData = async (
    fromBlockNumber: number,
    toBlockNumber: number
  ) => {
    const records = await ctx.store.find(ConstantsHistoricalData, {
      where: {
        paraBlockHeight: Between(fromBlockNumber, toBlockNumber),
      },
      relations: {
        block: true,
      },
    });

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
    const records = await ctx.store.find(AssetHistoricalData, {
      where: {
        paraBlockHeight: Between(fromBlockNumber, toBlockNumber),
      },
      relations: {
        asset: true,
        block: true,
      },
    });

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
    const records = await ctx.store.find(EmaOracleEntryHistoricalData, {
      where: {
        paraBlockHeight: Between(fromBlockNumber, toBlockNumber),
      },
      relations: {
        assetA: true,
        assetB: true,
        block: true,
      },
    });

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
    const records = await ctx.store.find(XykpoolHistoricalData, {
      where: {
        paraBlockHeight: Between(fromBlockNumber, toBlockNumber),
      },
      relations: {
        pool: { account: true, shareToken: true },
        assetA: true,
        assetB: true,
        block: true,
      },
    });

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

  await Promise.all([
    // checkAndWaitForData(prefetchAssetHistoricalData),
    checkAndWaitForData(prefetchConstantsHistoricalData),
    checkAndWaitForData(prefetchEmaOracleHistoricalData),
    checkAndWaitForData(prefetchXykpoolsHistoricalData),
  ]);

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
  ]);

  console.log('All historical data ready for spot prices processing');
}

async function prefetchAllAvailableRoutedTradesForBlocksRange({
  fromBlockNumber,
  toBlockNumber,
  ctx,
}: {
  fromBlockNumber: number;
  toBlockNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  const routes = await ctx.store.find(RoutedTrade, {
    where: {
      paraBlockHeight: Between(fromBlockNumber, toBlockNumber),
    },
    relations: {
      swaps: {
        swapper: true,
        filler: true,
        event: true,
        inputs: {
          asset: true,
        },
        outputs: {
          asset: true,
        },
        fees: {
          asset: true,
          recipient: true,
        },
      },
      block: true,
    },
  });

  for (const route of routes) {
    for (const swap of route.swaps) {
      swap.inputs = swap.inputs.filter(
        (i) => i.assetBalanceType === SwapAssetBalanceType.Input
      );
      swap.outputs = swap.outputs.filter(
        (i) => i.assetBalanceType === SwapAssetBalanceType.Output
      );
    }
  }

  ctx.batchState.state.routeTrades = new Map(routes.map((r) => [r.id, r]));
}

async function prefetchAllAvailableXykpoolVolumesForBlocksRange({
  fromBlockNumber,
  toBlockNumber,
  ctx,
}: {
  fromBlockNumber: number;
  toBlockNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  const records = await ctx.store.find(XykpoolVolumeHistoricalData, {
    where: {
      paraBlockHeight: Between(fromBlockNumber, toBlockNumber),
    },
    relations: {
      assetA: true,
      assetB: true,
      pool: true,
      block: true,
    },
  });

  ctx.batchState.state.xykPoolVolumes = new Map(records.map((r) => [r.id, r]));
}

async function prefetchAllAvailableLbppoolVolumesForBlocksRange({
  fromBlockNumber,
  toBlockNumber,
  ctx,
}: {
  fromBlockNumber: number;
  toBlockNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  const records = await ctx.store.find(LbppoolVolumeHistoricalData, {
    where: {
      paraBlockHeight: Between(fromBlockNumber, toBlockNumber),
    },
    relations: {
      assetA: true,
      assetB: true,
      pool: true,
      block: true,
    },
  });

  ctx.batchState.state.lbpPoolVolumes = new Map(records.map((r) => [r.id, r]));
}

async function prefetchAllAvailableOmnipoolAssetVolumesForBlocksRange({
  fromBlockNumber,
  toBlockNumber,
  ctx,
}: {
  fromBlockNumber: number;
  toBlockNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  const records = await ctx.store.find(OmnipoolAssetVolumeHistoricalData, {
    where: {
      paraBlockHeight: Between(fromBlockNumber, toBlockNumber),
    },
    relations: {
      omnipoolAsset: {
        asset: true,
      },
      block: true,
    },
  });

  ctx.batchState.state.omnipoolAssetVolumes = new Map(
    records.map((r) => [r.id, r])
  );
}

async function prefetchAllAvailableStableswapVolumesForBlocksRange({
  fromBlockNumber,
  toBlockNumber,
  ctx,
}: {
  fromBlockNumber: number;
  toBlockNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  const records = await ctx.store.find(StableswapVolumeHistoricalData, {
    where: {
      paraBlockHeight: Between(fromBlockNumber, toBlockNumber),
    },
    relations: {
      pool: true,
      assetVolumes: {
        asset: true,
        block: true,
        volumesCollection: true,
      },
      block: true,
    },
  });

  ctx.batchState.state.stablepoolAssetVolumes = new Map(
    records
      .map((r) =>
        r.assetVolumes.map(
          (av): [string, StableswapAssetVolumeHistoricalData] => [av.id, av]
        )
      )
      .flat()
  );
  ctx.batchState.state.stablepoolVolumeCollections = new Map(
    records.map((r) => [r.id, r])
  );
}

const checkAndWaitForCoreProcStatus = async (
  ctx: SqdProcessorContext<Store>
) => {
  const coreProcStatus = await ctx.store.findOne(ProcessorStatus, {
    where: {
      id: 'squid_processor',
    },
  });

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
};

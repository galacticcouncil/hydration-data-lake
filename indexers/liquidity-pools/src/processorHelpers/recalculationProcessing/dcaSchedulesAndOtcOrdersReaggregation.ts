import { Between } from 'typeorm/find-options/operator/Between';

import { Store } from '@subsquid/typeorm-store';
import { SqdProcessorContext } from '../../processor';
import { ProcessorStatusManager } from '../../processorStatusManager';
import { prefetchGenericPersistentDataWithLogs } from '../prefetchHelpers';
import { handleRelayChainBlocks } from '../../handlers/relayChain';
import { ChainActivityTraceManager } from '../../chainActivityTracingManagers';
import {
  BatchBlocksParsedDataManager,
  getParsedEventsData,
} from '../../parsers/batchBlocksParser';
import { StorageResolver } from '../../parsers/storageResolver';
import { prefetchOrInitAllBatchAccounts } from '../../handlers/accounts';
import { AaveMoneyMarketManager } from '../../utils/evmTools/aave/aaveMoneyMarketManager';
import { handleDcaSchedules, saveDcaEntities } from '../../handlers/dca';
import { handleOtcOrders } from '../../handlers/otc';
import { Swap, SwapAssetBalanceType } from '../../model';
import { handleAssetVolumeUpdates } from '../../handlers/assets/volume';
import {
  getOrderedListByBlockNumber,
  isUnifiedEventsSupportSpecVersion,
} from '../../utils/helpers';
import { EventName } from '../../parsers/types/events';
import { handleBroadcastSwappedEvent } from '../../handlers/swap/swap';
import { getFillerContextData } from '../../handlers/swap/helpers';

export async function handleDcaSchedulesAndOtcOrders(
  ctx: SqdProcessorContext<Store>
) {
  if (!ctx.appConfig.processingMode.ALL_IN_ONE_PROCESSOR_MODE) return;

  let parsedData: BatchBlocksParsedDataManager | null = null;

  await Promise.all([
    (async () => {
      await handleRelayChainBlocks(ctx);

      console.time('processExtrinsics');
      await ChainActivityTraceManager.processExtrinsics(ctx);
      console.timeEnd('processExtrinsics');

      console.time('getParsedEventsData');
      /**
       * getParsedEventsData must be executed ONLY after
       * ChainActivityTraceManager.processExtrinsics method execution, because
       * getParsedEventsData needs already compiled traceIds.
       */
      parsedData = (await getParsedEventsData(
        ctx
      )) as BatchBlocksParsedDataManager;
      console.timeEnd('getParsedEventsData');

      await StorageResolver.getInstance().init({
        ctx: ctx,
        blockNumberFrom: ctx.blocks[0].header.height,
        blockNumberTo: ctx.blocks[ctx.blocks.length - 1].header.height,
      });

      await prefetchOrInitAllBatchAccounts(ctx);
    })(),
    // (async () => {
    //   console.time('initContractInstances');
    //   await AaveMoneyMarketManager.getInstance().initContractInstances({
    //     ctx: ctx,
    //     blockNumber: ctx.blocks[ctx.blocks.length - 1].header.height,
    //   });
    //   console.timeEnd('initContractInstances');
    //   return null;
    // })(),
    prefetchGenericPersistentDataWithLogs(ctx, false),
  ]);

  if (!parsedData) throw new Error('parsedData is null');

  console.time('prefetchSpecificData');

  ctx.batchState.state.swaps = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        Swap,
        {
          where: {
            paraBlockHeight: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          relations: {
            inputs: true,
            outputs: true,
            fees: true,
            event: {
              block: true,
            },
          },
          order: {
            paraBlockHeight: 'ASC',
          },
        },
        { className: 'AssetSpotPriceHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );
  for (const swap of ctx.batchState.state.swaps.values()) {
    const inputs = swap.inputs.filter(
      (i) => i.assetBalanceType === SwapAssetBalanceType.Input
    );
    const outputs = swap.outputs.filter(
      (i) => i.assetBalanceType === SwapAssetBalanceType.Output
    );
    swap.inputs = inputs;
    swap.outputs = outputs;
    ctx.batchState.state.swaps.set(swap.id, swap);
  }

  for (const eventData of getOrderedListByBlockNumber([
    ...(parsedData as BatchBlocksParsedDataManager)
      .getSectionByEventName(EventName.Broadcast_Swapped)
      .values(),
    ...(parsedData as BatchBlocksParsedDataManager)
      .getSectionByEventName(EventName.Broadcast_Swapped2)
      .values(),
    ...(parsedData as BatchBlocksParsedDataManager)
      .getSectionByEventName(EventName.Broadcast_Swapped3)
      .values(),
  ]).filter((event) =>
    isUnifiedEventsSupportSpecVersion(
      event.eventData.metadata.blockHeader.specVersion,
      ctx.appConfig.UNIFIED_EVENTS_GENESIS_SPEC_VERSION
    )
  )) {
    const fillerContextData = await getFillerContextData(ctx, eventData);

    if (fillerContextData)
      ctx.batchState.state.swapFillerContexts.set(
        eventData.eventData.metadata.id,
        fillerContextData
      );
  }

  console.timeEnd('prefetchSpecificData');

  /**
   * ===========================================================================
   * ==================== DCA Schedules reaggregation =========================
   * ===========================================================================
   */

  console.time('handleDcaSchedules');
  await handleDcaSchedules(ctx, parsedData);
  console.timeEnd('handleDcaSchedules');

  console.time('saveDcaEntities');
  await saveDcaEntities(ctx);
  console.timeEnd('saveDcaEntities');

  /**
   * ===========================================================================
   * ==================== OTC orders reaggregation =========================
   * ===========================================================================
   */

  console.time('handleOtcOrders');
  await handleOtcOrders(ctx, parsedData);
  console.timeEnd('handleOtcOrders');

  /**
   * ===========================================================================
   * ===========================================================================
   */
  console.time('updateInitialIndexingFinishedAtTime');
  await ProcessorStatusManager.updateInitialIndexingFinishedAtTime(ctx);
  console.timeEnd('updateInitialIndexingFinishedAtTime');

  await ProcessorStatusManager.getInstance(ctx).updateProcessorStatus({
    latestProcessedBlock: ctx.blocks[ctx.blocks.length - 1].header.height,
  });
}

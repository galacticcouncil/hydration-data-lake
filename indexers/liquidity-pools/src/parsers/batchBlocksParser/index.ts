import {
  BatchBlocksParsedDataScope,
  EventId,
  EventMetadata,
  ParsedEventsCallsData,
  EventDataType,
  CallMetadata,
  StoragePrefetchIdsGroup,
} from './types';
import { EventName, RelayChainInfo } from '../types/events';
import {
  SqdBlock,
  SqdCall,
  SqdEvent,
  SqdExtrinsic,
  SqdProcessorContext,
} from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import parsers from '../';
// import { calls, events } from '../chains/hydration/typegenTypes'; // TODO fix for different CHAIN env value
// import { calls, events } from '../chains/hydration-paseo-next/typegenTypes';

import {
  calls as hydrationCalls,
  events as hydrationEvents,
} from '../chains/hydration/typegenTypes';
import {
  calls as hydrationPaseoCalls,
  events as hydrationPaseoEvents,
} from '../chains/hydration-paseo/typegenTypes';
// import {
//   calls as hydrationPaseoNextCalls,
//   events as hydrationPaseoNextEvents,
// } from '../chains/hydration-paseo-next/typegenTypes';

import { ChainActivityTraceManager } from '../../chainActivityTracingManagers';
import { EventDataParserHelper } from './eventDataParserHelper';
import { ChainName } from '../../utils/types';
import { SwapFillerType } from '../../model';

export class BatchBlocksParsedDataManager {
  private scope: BatchBlocksParsedDataScope;

  constructor() {
    this.scope = new Map();
  }

  set(section: EventName, value: ParsedEventsCallsData): void {
    this.scope.set(
      section,
      (this.scope.get(section) || new Map()).set(value.id, value)
    );
  }

  get<T>(section: EventName): Map<EventId, T> {
    return (
      (this.scope.get(section) as Map<EventId, T>) || new Map<EventId, T>()
    );
  }

  getSectionByEventName<T extends EventName>(
    section: T
  ): Map<EventId, EventDataType<T>> {
    return (
      (this.scope.get(section) as Map<EventId, EventDataType<T>>) ||
      new Map<EventId, EventDataType<T>>()
    );
  }

  getAllSectionsData() {
    const allValues: ParsedEventsCallsData[][] = [];

    this.scope.forEach((sectionDataMap) => {
      allValues.push([...sectionDataMap.values()]);
    });

    return allValues.flat();
  }

  entries(): IterableIterator<
    [EventName, Map<EventId, ParsedEventsCallsData>]
  > {
    return this.scope.entries();
  }
}

function getEventMetadata({
  event,
  blockHeader,
  extrinsic,
  traceId,
}: {
  event: SqdEvent;
  blockHeader: SqdBlock;
  extrinsic?: SqdExtrinsic;
  traceId: string;
}): EventMetadata {
  return {
    id: event.id,
    indexInBlock: event.index,
    name: event.name,
    traceId,
    blockHeader,
    extrinsic,
  };
}

export async function getParsedEventsData(
  ctx: SqdProcessorContext<Store>
): Promise<BatchBlocksParsedDataManager> {
  let events = null;
  let calls = null;

  switch (ctx.appConfig.CHAIN) {
    case ChainName.hydration:
      events = hydrationEvents;
      calls = hydrationCalls;
      break;
    case ChainName.hydration_paseo:
      events = hydrationPaseoEvents;
      calls = hydrationPaseoCalls;
      break;

    // case ChainName.hydration_paseo_next:
    //   events = hydrationPaseoNextEvents;
    //   calls = hydrationPaseoNextCalls;
    //   break;
  }

  const parsedDataManager = new BatchBlocksParsedDataManager();
  let totalEventsNumber = 0;

  for (const block of ctx.blocks) {
    const relayChainInfo = ctx.batchState.state.relayChainInfo.get(
      block.header.height
    )!;

    for (const event of block.events) {
      let call: SqdCall | null = null;

      try {
        call = event.getCall();
      } catch (e) {}

      const callMetadata: CallMetadata = {
        name: call?.name ?? '_system',
        id: call?.id,
        traceId: call
          ? await ChainActivityTraceManager.getTraceIdByCallId(call.id, ctx)
          : undefined,
      };

      const eventMetadata = getEventMetadata({
        event,
        blockHeader: block.header,
        extrinsic: event.extrinsic,
        traceId: await ChainActivityTraceManager.getTraceIdByEventId(
          event.id,
          ctx
        ),
      });

      const parserHelper = new EventDataParserHelper({
        batchState: ctx.batchState.state,
        relayChainInfo,
        callMetadata,
        eventMetadata,
        call,
        event,
      });

      totalEventsNumber++;
      switch (event.name) {
        /**
         * ============================= L B P =================================
         */

        /**
         * ==== LBP Poll Created ====
         */
        case events.lbp.poolCreated.name: {
          const preparedData = parserHelper.parseLbpPoolCreatedData();
          parsedDataManager.set(EventName.LBP_PoolCreated, preparedData);

          parserHelper.addIdsForStoragePrefetch(
            'lbppoolAssetIdsForStoragePrefetch',
            `${preparedData.eventData.params.data.assets[0]}-${preparedData.eventData.params.data.assets[1]}`
          );
          parserHelper.addAccountIdsForPrefetch([
            preparedData.eventData.params.data.owner,
            preparedData.eventData.params.data.feeCollector,
          ]);
          break;
        }
        /**
         * ==== LBP Poll Updated ====
         */
        case events.lbp.poolUpdated.name: {
          const preparedData = parserHelper.parseLbpPoolUpdatedData();
          parsedDataManager.set(EventName.LBP_PoolUpdated, preparedData);

          parserHelper.addIdsForStoragePrefetch(
            'lbppoolAssetIdsForStoragePrefetch',
            `${preparedData.eventData.params.data.assets[0]}-${preparedData.eventData.params.data.assets[1]}`
          );
          parserHelper.addAccountIdsForPrefetch([
            preparedData.eventData.params.pool,
            preparedData.eventData.params.data.owner,
            preparedData.eventData.params.data.feeCollector,
          ]);
          break;
        }
        /**
         * ==== LBP Buy Executed ====
         */
        case events.lbp.buyExecuted.name: {
          const preparedData = parserHelper.parseLbpBuyExecutedData();
          parsedDataManager.set(EventName.LBP_BuyExecuted, preparedData);

          parserHelper.addIdsForStoragePrefetch(
            'lbppoolAssetIdsForStoragePrefetch',
            `${preparedData.eventData.params.assetIn}-${preparedData.eventData.params.assetOut}`
          );
          parserHelper.addAccountIdsForPrefetch([
            preparedData.eventData.params.who,
          ]);
          break;
        }
        /**
         * ==== LBP Sell Executed ====
         */
        case events.lbp.sellExecuted.name: {
          const preparedData = parserHelper.parseLbpSellExecutedData();
          parsedDataManager.set(EventName.LBP_SellExecuted, preparedData);

          parserHelper.addIdsForStoragePrefetch(
            'lbppoolAssetIdsForStoragePrefetch',
            `${preparedData.eventData.params.assetIn}-${preparedData.eventData.params.assetOut}`
          );
          parserHelper.addAccountIdsForPrefetch([
            preparedData.eventData.params.who,
          ]);
          break;
        }

        /**
         * ============================= X Y K =================================
         */

        /**
         * ==== XYK Pool Created ====
         */
        case events.xyk.poolCreated.name: {
          const preparedData = parserHelper.parseXykPoolCreatedData();
          parsedDataManager.set(EventName.XYK_PoolCreated, preparedData);

          parserHelper.addIdsForStoragePrefetch(
            'xykPoolIdsForStoragePrefetch',
            preparedData.eventData.params.pool
          );
          parserHelper.addAccountIdsForPrefetch([
            preparedData.eventData.params.who,
            preparedData.eventData.params.pool,
          ]);
          break;
        }
        /**
         * ==== XYK Pool Destroyed ====
         */
        case events.xyk.poolDestroyed.name: {
          const preparedData = parserHelper.parseXykPoolDestroyedData();
          parsedDataManager.set(EventName.XYK_PoolDestroyed, preparedData);

          parserHelper.addIdsForStoragePrefetch(
            'xykPoolIdsForStoragePrefetch',
            preparedData.eventData.params.pool
          );
          parserHelper.addAccountIdsForPrefetch([
            preparedData.eventData.params.who,
            preparedData.eventData.params.pool,
          ]);
          break;
        }
        /**
         * ==== XYK Buy Executed ====
         */
        case events.xyk.buyExecuted.name: {
          const preparedData = parserHelper.parseXykBuyExecutedData();
          parsedDataManager.set(EventName.XYK_BuyExecuted, preparedData);

          parserHelper.addIdsForStoragePrefetch(
            'xykPoolIdsForStoragePrefetch',
            preparedData.eventData.params.pool
          );
          parserHelper.addAccountIdsForPrefetch([
            preparedData.eventData.params.who,
            preparedData.eventData.params.pool,
          ]);
          break;
        }
        /**
         * ==== XYK Sell Executed ====
         */
        case events.xyk.sellExecuted.name: {
          const preparedData = parserHelper.parseXykSellExecutedData();
          parsedDataManager.set(EventName.XYK_SellExecuted, preparedData);

          parserHelper.addIdsForStoragePrefetch(
            'xykPoolIdsForStoragePrefetch',
            preparedData.eventData.params.pool
          );
          parserHelper.addAccountIdsForPrefetch([
            preparedData.eventData.params.who,
            preparedData.eventData.params.pool,
          ]);
          break;
        }

        /**
         * ======================== O M N I P O O L ============================
         */

        /**
         * ==== Omnipool Token Added ====
         */
        case events.omnipool.tokenAdded.name: {
          const preparedData = parserHelper.parseOmnipoolTokenAddedData();
          parsedDataManager.set(EventName.Omnipool_TokenAdded, preparedData);

          parserHelper.addIdsForStoragePrefetch(
            'omnipoolAssetIdsForStoragePrefetch',
            preparedData.eventData.params.assetId
          );
          break;
        }
        /**
         * ==== Omnipool Token Removed ====
         */
        case events.omnipool.tokenRemoved.name: {
          const preparedData = parserHelper.parseOmnipoolTokenRemovedData();
          parsedDataManager.set(EventName.Omnipool_TokenRemoved, preparedData);

          parserHelper.addIdsForStoragePrefetch(
            'omnipoolAssetIdsForStoragePrefetch',
            preparedData.eventData.params.assetId
          );
          break;
        }
        /**
         * ==== Omnipool Buy Executed ====
         */
        case events.omnipool.buyExecuted.name: {
          const preparedData = parserHelper.parseOmnipoolBuyExecutedData();
          parsedDataManager.set(EventName.Omnipool_BuyExecuted, preparedData);

          parserHelper.addIdsForStoragePrefetch(
            'omnipoolAssetIdsForStoragePrefetch',
            preparedData.eventData.params.assetIn
          );
          parserHelper.addIdsForStoragePrefetch(
            'omnipoolAssetIdsForStoragePrefetch',
            preparedData.eventData.params.assetOut
          );
          parserHelper.addAccountIdsForPrefetch([
            preparedData.eventData.params.who,
          ]);
          break;
        }
        /**
         * ==== Omnipool Sell Executed ====
         */
        case events.omnipool.sellExecuted.name: {
          const preparedData = parserHelper.parseOmnipoolSellExecutedData();
          parsedDataManager.set(EventName.Omnipool_SellExecuted, preparedData);

          parserHelper.addIdsForStoragePrefetch(
            'omnipoolAssetIdsForStoragePrefetch',
            preparedData.eventData.params.assetIn
          );
          parserHelper.addIdsForStoragePrefetch(
            'omnipoolAssetIdsForStoragePrefetch',
            preparedData.eventData.params.assetOut
          );
          parserHelper.addAccountIdsForPrefetch([
            preparedData.eventData.params.who,
          ]);
          break;
        }

        /**
         * ====================== S T A B L E S W A P ==========================
         */

        /**
         * ==== Stableswap Pool Created ====
         */
        case events.stableswap.poolCreated.name: {
          const preparedData = parserHelper.parseStableswapPoolCreatedData();
          parsedDataManager.set(EventName.Stableswap_PoolCreated, preparedData);

          parserHelper.addIdsForStoragePrefetch(
            'stableswapIdsForStoragePrefetch',
            preparedData.eventData.params.poolId
          );
          break;
        }
        /**
         * ==== Stableswap Buy Executed ====
         */
        case events.stableswap.buyExecuted.name: {
          const preparedData = parserHelper.parseStableswapBuyExecutedData();
          parsedDataManager.set(EventName.Stableswap_BuyExecuted, preparedData);

          parserHelper.addIdsForStoragePrefetch(
            'stableswapIdsForStoragePrefetch',
            preparedData.eventData.params.poolId
          );
          parserHelper.addAccountIdsForPrefetch([
            preparedData.eventData.params.who,
          ]);
          break;
        }
        /**
         * ==== Stableswap Sell Executed ====
         */
        case events.stableswap.sellExecuted.name: {
          const preparedData = parserHelper.parseStableswapSellExecutedData();
          parsedDataManager.set(
            EventName.Stableswap_SellExecuted,
            preparedData
          );

          parserHelper.addIdsForStoragePrefetch(
            'stableswapIdsForStoragePrefetch',
            preparedData.eventData.params.poolId
          );
          parserHelper.addAccountIdsForPrefetch([
            preparedData.eventData.params.who,
          ]);
          break;
        }
        /**
         * ==== Stableswap Liquidity Added ====
         */
        case events.stableswap.liquidityAdded.name: {
          const preparedData = parserHelper.parseStableswapLiquidityAddedData();
          parsedDataManager.set(
            EventName.Stableswap_LiquidityAdded,
            preparedData
          );
          parserHelper.addIdsForStoragePrefetch(
            'stableswapIdsForStoragePrefetch',
            preparedData.eventData.params.poolId
          );
          parserHelper.addAccountIdsForPrefetch([
            preparedData.eventData.params.who,
          ]);
          break;
        }
        /**
         * ==== Stableswap Liquidity Removed ====
         */
        case events.stableswap.liquidityRemoved.name: {
          const preparedData =
            parserHelper.parseStableswapLiquidityRemovedData();
          parsedDataManager.set(
            EventName.Stableswap_LiquidityRemoved,
            preparedData
          );

          parserHelper.addIdsForStoragePrefetch(
            'stableswapIdsForStoragePrefetch',
            preparedData.eventData.params.poolId
          );

          parserHelper.addAccountIdsForPrefetch([
            preparedData.eventData.params.who,
          ]);
          break;
        }

        /**
         * ============================= D C A =================================
         */

        /**
         * ==== DCA Scheduled ====
         */
        case events.dca.scheduled.name: {
          const preparedData = parserHelper.parseDcaScheduledData();
          parsedDataManager.set(EventName.DCA_Scheduled, preparedData);

          parserHelper.addAccountIdsForPrefetch([
            preparedData.eventData.params.who,
          ]);

          break;
        }
        /**
         * ==== DCA Completed ====
         */
        case events.dca.completed.name: {
          const preparedData = parserHelper.parseDcaCompletedData();
          parsedDataManager.set(EventName.DCA_Completed, preparedData);

          parserHelper.addAccountIdsForPrefetch([
            preparedData.eventData.params.who,
          ]);
          break;
        }
        /**
         * ==== DCA Terminated ====
         */
        case events.dca.terminated.name: {
          const preparedData = parserHelper.parseDcaTerminatedData();
          parsedDataManager.set(EventName.DCA_Terminated, preparedData);

          parserHelper.addAccountIdsForPrefetch([
            preparedData.eventData.params.who,
          ]);
          break;
        }
        /**
         * ==== DCA Trade Executed ====
         */
        case events.dca.tradeExecuted.name: {
          const preparedData = parserHelper.parseDcaTradeExecutedData();
          parsedDataManager.set(EventName.DCA_TradeExecuted, preparedData);

          parserHelper.addAccountIdsForPrefetch([
            preparedData.eventData.params.who,
          ]);
          break;
        }
        /**
         * ==== DCA Trade Failed ====
         */
        case events.dca.tradeFailed.name: {
          const preparedData = parserHelper.parseDcaTradeFailedData();
          parsedDataManager.set(EventName.DCA_TradeFailed, preparedData);

          parserHelper.addAccountIdsForPrefetch([
            preparedData.eventData.params.who,
          ]);
          break;
        }
        /**
         * ==== DCA Execution Planed ====
         */
        case events.dca.executionPlanned.name: {
          const preparedData = parserHelper.parseDcaExecutionPlannedData();
          parsedDataManager.set(EventName.DCA_ExecutionPlanned, preparedData);

          parserHelper.addAccountIdsForPrefetch([
            preparedData.eventData.params.who,
          ]);
          break;
        }

        /**
         * ==== DCA Randomness Generation Failed ====
         */
        case events.dca.randomnessGenerationFailed.name: {
          const preparedData =
            parserHelper.parseDcaRandomnessGenerationFailedData();
          parsedDataManager.set(
            EventName.DCA_RandomnessGenerationFailed,
            preparedData
          );
          break;
        }

        /**
         * ============================= O T C =================================
         */

        /**
         * ==== OTC Order Placed ====
         */
        case events.otc.placed.name: {
          const preparedData = parserHelper.parseOtcOrderPlacedData();
          parsedDataManager.set(EventName.OTC_Placed, preparedData);
          break;
        }

        /**
         * ==== OTC Order Cancelled ====
         */
        case events.otc.cancelled.name: {
          const preparedData = parserHelper.parseOtcOrderCancelledData();
          parsedDataManager.set(EventName.OTC_Cancelled, preparedData);
          break;
        }
        /**
         * ==== OTC Order Filled ====
         */
        case events.otc.filled.name: {
          const preparedData = parserHelper.parseOtcOrderFilledData();
          parsedDataManager.set(EventName.OTC_Filled, preparedData);

          parserHelper.addAccountIdsForPrefetch([
            preparedData.eventData.params.who,
          ]);
          break;
        }
        /**
         * ==== OTC Order Partially Filled ====
         */
        case events.otc.partiallyFilled.name: {
          const preparedData = parserHelper.parseOtcOrderPartiallyFilledData();
          parsedDataManager.set(EventName.OTC_PartiallyFilled, preparedData);

          parserHelper.addAccountIdsForPrefetch([
            preparedData.eventData.params.who,
          ]);
          break;
        }

        /**
         * ========================== T O K E N S ==============================
         */

        /**
         * ==== Tokens Transfer ====
         */
        case events.tokens.transfer.name: {
          const preparedData = parserHelper.parseTokensTransferData();
          parsedDataManager.set(EventName.Tokens_Transfer, preparedData);
          break;
        }

        /**
         * ======================== B A L A N C E S ============================
         */

        /**
         * ==== Balances Transfer ====
         */
        case events.balances.transfer.name: {
          const preparedData = parserHelper.parseBalancesTransferData();
          parsedDataManager.set(EventName.Balances_Transfer, preparedData);

          parserHelper.addAccountIdsForPrefetch([
            preparedData.eventData.params.from,
            preparedData.eventData.params.to,
          ]);
          break;
        }

        /**
         * ====================== C U R R E N C I E S ==========================
         */

        /**
         * ==== Currencies Transferred ====
         */
        case events.currencies.transferred.name: {
          const preparedData = parserHelper.parseCurrenciesTransferredData();
          parsedDataManager.set(EventName.Currencies_Transferred, preparedData);

          parserHelper.addAccountIdsForPrefetch([
            preparedData.eventData.params.from,
            preparedData.eventData.params.to,
          ]);
          break;
        }

        /**
         * ================= A S S E T   R E G I S T R Y =======================
         */

        /**
         * ==== AssetRegistry Registered ====
         */
        case events.assetRegistry.registered.name: {
          const preparedData = parserHelper.parseAssetRegistryRegisteredData();
          parsedDataManager.set(
            EventName.AssetRegistry_Registered,
            preparedData
          );
          break;
        }
        /**
         * ==== AssetRegistry Updated ====
         */
        case events.assetRegistry.updated.name: {
          const preparedData = parserHelper.parseAssetRegistryUpdatedData();
          parsedDataManager.set(EventName.AssetRegistry_Updated, preparedData);
          break;
        }
        /**
         * ==== AssetRegistry LocationSet ====
         */
        case events.assetRegistry.locationSet.name: {
          const preparedData = parserHelper.parseAssetRegistryLocationSetData();
          parsedDataManager.set(
            EventName.AssetRegistry_LocationSet,
            preparedData
          );
          break;
        }

        /**
         * ======================= B R O A D C A S T ===========================
         */

        /**
         * ==== Swapped ====
         */
        case events.broadcast.swapped.name: {
          const preparedData = parserHelper.parseBroadcastSwappedData();
          parsedDataManager.set(EventName.Broadcast_Swapped, preparedData);

          parserHelper.addAccountIdsForPrefetch([
            preparedData.eventData.params.filler,
            preparedData.eventData.params.swapper,
            ...(preparedData.eventData.params.fees
              .map((fee) => fee.recipientId)
              .filter((id) => !!id) as string[]),
          ]);

          switch (preparedData.eventData.params.fillerType.kind) {
            case SwapFillerType.LBP:
              parserHelper.addIdsForStoragePrefetch(
                'lbppoolAssetIdsForStoragePrefetch',
                preparedData.eventData.params.filler
              );
              break;
            case SwapFillerType.XYK:
              parserHelper.addIdsForStoragePrefetch(
                'xykPoolIdsForStoragePrefetch',
                preparedData.eventData.params.filler
              );
              break;
            case SwapFillerType.Omnipool:
              for (const assetId of [
                ...preparedData.eventData.params.inputs.map(
                  (inputData) => inputData.assetId
                ),
                ...preparedData.eventData.params.outputs.map(
                  (outputData) => outputData.assetId
                ),
                ...preparedData.eventData.params.fees.map(
                  (feeData) => feeData.assetId
                ),
                1,
              ]) {
                parserHelper.addIdsForStoragePrefetch(
                  'omnipoolAssetIdsForStoragePrefetch',
                  assetId
                );
              }
              break;
            case SwapFillerType.Stableswap:
              parserHelper.addIdsForStoragePrefetch(
                'stableswapIdsForStoragePrefetch',
                preparedData.eventData.params.fillerType.value
              );
              break;
          }

          break;
        }
        /**
         * ==== Swapped2 ====
         */
        case events.broadcast.swapped2.name: {
          const preparedData = parserHelper.parseBroadcastSwapped2Data();
          parsedDataManager.set(EventName.Broadcast_Swapped2, preparedData);

          parserHelper.addAccountIdsForPrefetch([
            preparedData.eventData.params.filler,
            preparedData.eventData.params.swapper,
            ...(preparedData.eventData.params.fees
              .map((fee) => fee.recipientId)
              .filter((id) => !!id) as string[]),
          ]);

          switch (preparedData.eventData.params.fillerType.kind) {
            case SwapFillerType.LBP:
              parserHelper.addIdsForStoragePrefetch(
                'lbppoolAssetIdsForStoragePrefetch',
                preparedData.eventData.params.filler
              );
              break;
            case SwapFillerType.XYK:
              parserHelper.addIdsForStoragePrefetch(
                'xykPoolIdsForStoragePrefetch',
                preparedData.eventData.params.filler
              );
              break;
            case SwapFillerType.Omnipool:
              for (const assetId of [
                ...preparedData.eventData.params.inputs.map(
                  (inputData) => inputData.assetId
                ),
                ...preparedData.eventData.params.outputs.map(
                  (outputData) => outputData.assetId
                ),
                ...preparedData.eventData.params.fees.map(
                  (feeData) => feeData.assetId
                ),
                1,
              ]) {
                parserHelper.addIdsForStoragePrefetch(
                  'omnipoolAssetIdsForStoragePrefetch',
                  assetId
                );
              }
              break;
            case SwapFillerType.Stableswap:
              parserHelper.addIdsForStoragePrefetch(
                'stableswapIdsForStoragePrefetch',
                preparedData.eventData.params.fillerType.value
              );
              break;
          }

          break;
        }
        /**
         * ==== Swapped3 ====
         */
        case events.broadcast.swapped3.name: {
          const preparedData = parserHelper.parseBroadcastSwapped3Data();
          parsedDataManager.set(EventName.Broadcast_Swapped3, preparedData);

          parserHelper.addAccountIdsForPrefetch([
            preparedData.eventData.params.filler,
            preparedData.eventData.params.swapper,
            ...(preparedData.eventData.params.fees
              .map((fee) => fee.recipientId)
              .filter((id) => !!id) as string[]),
          ]);

          switch (preparedData.eventData.params.fillerType.kind) {
            case SwapFillerType.LBP:
              parserHelper.addIdsForStoragePrefetch(
                'lbppoolAssetIdsForStoragePrefetch',
                preparedData.eventData.params.filler
              );
              break;
            case SwapFillerType.XYK:
              parserHelper.addIdsForStoragePrefetch(
                'xykPoolIdsForStoragePrefetch',
                preparedData.eventData.params.filler
              );
              break;
            case SwapFillerType.Omnipool:
              for (const assetId of [
                ...preparedData.eventData.params.inputs.map(
                  (inputData) => inputData.assetId
                ),
                ...preparedData.eventData.params.outputs.map(
                  (outputData) => outputData.assetId
                ),
                ...preparedData.eventData.params.fees.map(
                  (feeData) => feeData.assetId
                ),
                1,
              ]) {
                parserHelper.addIdsForStoragePrefetch(
                  'omnipoolAssetIdsForStoragePrefetch',
                  assetId
                );
              }
              break;
            case SwapFillerType.Stableswap:
              parserHelper.addIdsForStoragePrefetch(
                'stableswapIdsForStoragePrefetch',
                preparedData.eventData.params.fillerType.value
              );
              break;
          }

          break;
        }
        /**
         * ================================= E V M =============================
         */

        /**
         * ==== Log ====
         */
        case events.evm.log.name: {
          const preparedData = parserHelper.parseEvmLogData();
          parsedDataManager.set(EventName.EVM_Log, preparedData);
          break;
        }

        /**
         * ====================== E V M  A C C O U N T S =======================
         */

        /**
         * ==== Bound ====
         */
        case events.evmAccounts.bound.name: {
          const preparedData = parserHelper.parseEvmAccountsBoundData();
          parsedDataManager.set(EventName.EVMAccounts_Bound, preparedData);

          parserHelper.addAccountIdsForPrefetch([
            preparedData.eventData.params.accountAddress,
          ]);
          break;
        }

        default:
          totalEventsNumber--;
      }

      parserHelper.migrateLocalState(ctx);
    }
  }

  ctx.log.info(
    `Parsed ${totalEventsNumber} events from ${ctx.blocks.length} blocks [${ctx.blocks[0].header.height} / ${ctx.blocks[ctx.blocks.length - 1].header.height}].`
  );

  return parsedDataManager;
}

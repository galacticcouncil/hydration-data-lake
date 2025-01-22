import {
  BatchBlocksParsedDataScope,
  EventId,
  EventMetadata,
  ParsedEventsCallsData,
  EventDataType,
  CallMetadata,
} from './types';
import { EventName, RelayChainInfo } from '../types/events';
import {
  Block,
  Call,
  Event,
  Extrinsic,
  ProcessorContext,
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
import {
  calls as hydrationPaseoNextCalls,
  events as hydrationPaseoNextEvents,
} from '../chains/hydration-paseo-next/typegenTypes';

import { ChainActivityTraceManager } from '../../chainActivityTracingManagers';
import { EventDataParserHelper } from './eventDataParserHelper';
import { ChainName } from '../../utils/types';

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
  event: Event;
  blockHeader: Block;
  extrinsic?: Extrinsic;
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
  ctx: ProcessorContext<Store>
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
    case ChainName.hydration_paseo_next:
      events = hydrationPaseoNextEvents;
      calls = hydrationPaseoNextCalls;
      break;
  }

  const parsedDataManager = new BatchBlocksParsedDataManager();
  let totalEventsNumber = 0;

  const batchState = ctx.batchState.state;

  for (const block of ctx.blocks) {
    const relayChainInfo: RelayChainInfo = {
      parachainBlockNumber: 0,
      relaychainBlockNumber: 0,
    };

    for (const call of block.calls) {
      switch (call.name) {
        case calls.parachainSystem.setValidationData.name: {
          const validationData =
            parsers.calls.parachainSystem.parseSetValidationDataArgs(call);
          relayChainInfo.relaychainBlockNumber =
            validationData.relayParentNumber;
          relayChainInfo.parachainBlockNumber = block.header.height;
          break;
        }
        default:
      }
    }

    ctx.batchState.state.relayChainInfo.set(
      relayChainInfo.parachainBlockNumber,
      relayChainInfo
    );

    for (const event of block.events) {
      let call: Call | null = null;

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
        relayChainInfo,
        callMetadata,
        eventMetadata,
        call,
        event,
        batchState,
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
            'lbpPoolAssetIdsForStoragePrefetch',
            `${preparedData.eventData.params.data.assets[0]}-${preparedData.eventData.params.data.assets[1]}`
          );
          break;
        }
        /**
         * ==== LBP Poll Updated ====
         */
        case events.lbp.poolUpdated.name: {
          const preparedData = parserHelper.parseLbpPoolUpdatedData();
          parsedDataManager.set(EventName.LBP_PoolUpdated, preparedData);

          parserHelper.addIdsForStoragePrefetch(
            'lbpPoolAssetIdsForStoragePrefetch',
            `${preparedData.eventData.params.data.assets[0]}-${preparedData.eventData.params.data.assets[1]}`
          );
          break;
        }
        /**
         * ==== LBP Buy Executed ====
         */
        case events.lbp.buyExecuted.name: {
          const preparedData = parserHelper.parseLbpBuyExecutedData();
          parsedDataManager.set(EventName.LBP_BuyExecuted, preparedData);

          parserHelper.addIdsForStoragePrefetch(
            'lbpPoolAssetIdsForStoragePrefetch',
            `${preparedData.eventData.params.assetIn}-${preparedData.eventData.params.assetOut}`
          );
          break;
        }
        /**
         * ==== LBP Sell Executed ====
         */
        case events.lbp.sellExecuted.name: {
          const preparedData = parserHelper.parseLbpSellExecutedData();
          parsedDataManager.set(EventName.LBP_SellExecuted, preparedData);

          parserHelper.addIdsForStoragePrefetch(
            'lbpPoolAssetIdsForStoragePrefetch',
            `${preparedData.eventData.params.assetIn}-${preparedData.eventData.params.assetOut}`
          );
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
            'stablepoolIdsForStoragePrefetch',
            preparedData.eventData.params.poolId
          );
          break;
        }
        /**
         * ==== Stableswap Buy Executed ====
         */
        case events.stableswap.buyExecuted.name: {
          console.log('Stableswap buyExecuted');
          const preparedData = parserHelper.parseStableswapBuyExecutedData();
          parsedDataManager.set(EventName.Stableswap_BuyExecuted, preparedData);

          parserHelper.addIdsForStoragePrefetch(
            'stablepoolIdsForStoragePrefetch',
            preparedData.eventData.params.poolId
          );
          break;
        }
        /**
         * ==== Stableswap Sell Executed ====
         */
        case events.stableswap.sellExecuted.name: {
          console.log('Stableswap sellExecuted');
          const preparedData = parserHelper.parseStableswapSellExecutedData();
          parsedDataManager.set(
            EventName.Stableswap_SellExecuted,
            preparedData
          );

          parserHelper.addIdsForStoragePrefetch(
            'stablepoolIdsForStoragePrefetch',
            preparedData.eventData.params.poolId
          );
          break;
        }
        /**
         * ==== Stableswap Liquidity Added ====
         */
        case events.stableswap.liquidityAdded.name: {
          console.log('Stableswap liquidityAdded');

          const preparedData = parserHelper.parseStableswapLiquidityAddedData();
          parsedDataManager.set(
            EventName.Stableswap_LiquidityAdded,
            preparedData
          );
          parserHelper.addIdsForStoragePrefetch(
            'stablepoolIdsForStoragePrefetch',
            preparedData.eventData.params.poolId
          );
          break;
        }
        /**
         * ==== Stableswap Liquidity Removed ====
         */
        case events.stableswap.liquidityRemoved.name: {
          console.log('Stableswap liquidityRemoved');

          const preparedData =
            parserHelper.parseStableswapLiquidityRemovedData();
          parsedDataManager.set(
            EventName.Stableswap_LiquidityRemoved,
            preparedData
          );

          parserHelper.addIdsForStoragePrefetch(
            'stablepoolIdsForStoragePrefetch',
            preparedData.eventData.params.poolId
          );
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
          break;
        }
        /**
         * ==== DCA Completed ====
         */
        case events.dca.completed.name: {
          const preparedData = parserHelper.parseDcaCompletedData();
          parsedDataManager.set(EventName.DCA_Completed, preparedData);
          break;
        }
        /**
         * ==== DCA Terminated ====
         */
        case events.dca.terminated.name: {
          const preparedData = parserHelper.parseDcaTerminatedData();
          parsedDataManager.set(EventName.DCA_Terminated, preparedData);
          break;
        }
        /**
         * ==== DCA Trade Executed ====
         */
        case events.dca.tradeExecuted.name: {
          const preparedData = parserHelper.parseDcaTradeExecutedData();
          parsedDataManager.set(EventName.DCA_TradeExecuted, preparedData);
          break;
        }
        /**
         * ==== DCA Trade Failed ====
         */
        case events.dca.tradeFailed.name: {
          const preparedData = parserHelper.parseDcaTradeFailedData();
          parsedDataManager.set(EventName.DCA_TradeFailed, preparedData);
          break;
        }
        /**
         * ==== DCA Execution Planed ====
         */
        case events.dca.executionPlanned.name: {
          const preparedData = parserHelper.parseDcaExecutionPlannedData();
          parsedDataManager.set(EventName.DCA_ExecutionPlanned, preparedData);
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
          break;
        }
        /**
         * ==== OTC Order Partially Filled ====
         */
        case events.otc.partiallyFilled.name: {
          const preparedData = parserHelper.parseOtcOrderPartiallyFilledData();
          parsedDataManager.set(EventName.OTC_PartiallyFilled, preparedData);
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
         * ===================== A M M   S U P P O R T =========================
         */

        /**
         * ==== Swapped ====
         */
        case hydrationPaseoNextEvents.ammSupport.swapped.name: {
          const preparedData = parserHelper.parseAmmSupportSwappedData();
          parsedDataManager.set(EventName.AmmSupport_Swapped, preparedData);
          break;
        }

        default:
          totalEventsNumber--;
      }
    }
  }

  ctx.log.info(
    `Parsed ${totalEventsNumber} events from ${ctx.blocks.length} blocks [${ctx.blocks[0].header.height} / ${ctx.blocks[ctx.blocks.length - 1].header.height}].`
  );
  return parsedDataManager;
}

import { RelayChainInfo } from '../types/events';
import { CallMetadata, EventMetadata } from './types';
import { Call, Event, ProcessorContext } from '../../processor';
import parsers from '../index';
import { BatchStatePayload } from '../../utils/batchState';
import { calls, events } from '../chains/hydration/typegenTypes'; // TODO fix for different CHAIN env value

export class EventDataParserHelper {
  private readonly relayChainInfo: RelayChainInfo;
  private readonly callMetadata: CallMetadata;
  private readonly eventMetadata: EventMetadata;
  private readonly event: Event;
  private readonly call?: Call | null;
  private readonly batchState: BatchStatePayload;

  constructor({
    relayChainInfo,
    callMetadata,
    eventMetadata,
    call,
    event,
    batchState,
  }: {
    batchState: BatchStatePayload;
    call?: Call | null;
    event: Event;
    relayChainInfo: RelayChainInfo;
    callMetadata: CallMetadata;
    eventMetadata: EventMetadata;
  }) {
    this.relayChainInfo = relayChainInfo;
    this.callMetadata = callMetadata;
    this.eventMetadata = eventMetadata;
    this.call = call;
    this.event = event;
    this.batchState = batchState;
  }

  addIdsForStoragePrefetch(
    key:
      | 'lbpPoolAssetIdsForStoragePrefetch'
      | 'xykPoolIdsForStoragePrefetch'
      | 'omnipoolAssetIdsForStoragePrefetch'
      | 'stablepoolIdsForStoragePrefetch',
    value: any // TODO fix type
  ) {
    if (!this.batchState[key].has(this.event.block.height)) {
      this.batchState[key].set(this.event.block.height, {
        blockHeader: this.event.block,
        ids: new Set([value]),
      });
      return;
    }
    this.batchState[key].get(this.event.block.height)!.ids.add(value as never); // TODO fix type
  }

  /**
   * ==== LBP Poll Created ====
   */
  parseLbpPoolCreatedData() {
    const { relayChainInfo, eventMetadata, callMetadata, call, event } = this;

    const callArgs = call
      ? parsers.calls.lbp.parseCreatePoolArgs(call)
      : undefined;
    const eventParams = parsers.events.lbp.parsePoolCreatedParams(event);

    return {
      relayChainInfo,
      id: eventMetadata.id,
      eventData: {
        name: eventMetadata.name,
        metadata: eventMetadata,
        params: eventParams,
      },
      callData: {
        ...callMetadata,
        args: callArgs,
      },
    };
  }
  /**
   * ==== LBP Poll Updated ====
   */
  parseLbpPoolUpdatedData() {
    const { relayChainInfo, eventMetadata, callMetadata, call, event } = this;
    const eventParams = parsers.events.lbp.parsePoolUpdatedParams(event);
    return {
      relayChainInfo,
      id: eventMetadata.id,
      eventData: {
        name: eventMetadata.name,
        metadata: eventMetadata,
        params: eventParams,
      },
      callData: {
        ...callMetadata,
      },
    };
  }
  /**
   * ==== LBP Buy Executed ====
   */
  parseLbpBuyExecutedData() {
    const { relayChainInfo, eventMetadata, callMetadata, call, event } = this;
    const eventParams = parsers.events.lbp.parseBuyExecutedParams(event);
    return {
      relayChainInfo,
      id: eventMetadata.id,
      eventData: {
        name: eventMetadata.name,
        metadata: eventMetadata,
        params: eventParams,
      },
      callData: {
        ...callMetadata,
      },
    };
  }
  /**
   * ==== LBP Sell Executed ====
   */
  parseLbpSellExecutedData() {
    const { relayChainInfo, eventMetadata, callMetadata, call, event } = this;
    const eventParams = parsers.events.lbp.parseSellExecutedParams(event);
    return {
      relayChainInfo,
      id: eventMetadata.id,
      eventData: {
        name: eventMetadata.name,
        metadata: eventMetadata,
        params: eventParams,
      },
      callData: {
        ...callMetadata,
      },
    };
  }
  /**
   * ==== XYK Pool Created ====
   */
  parseXykPoolCreatedData() {
    const { relayChainInfo, eventMetadata, callMetadata, call, event } = this;
    const callArgs =
      call && call.name === calls.xyk.createPool.name
        ? parsers.calls.xyk.parseCreatePoolArgs(call)
        : undefined;
    const eventParams = parsers.events.xyk.parsePoolCreatedParams(event);

    return {
      relayChainInfo,
      id: eventMetadata.id,
      eventData: {
        name: eventMetadata.name,
        metadata: eventMetadata,
        params: eventParams,
      },
      callData: {
        ...callMetadata,
        args: callArgs,
      },
    };
  }
  /**
   * ==== XYK Pool Destroyed ====
   */
  parseXykPoolDestroyedData() {
    const { relayChainInfo, eventMetadata, callMetadata, call, event } = this;
    const eventParams = parsers.events.xyk.parsePoolDestroyedParams(event);

    return {
      relayChainInfo,
      id: eventMetadata.id,
      eventData: {
        name: eventMetadata.name,
        metadata: eventMetadata,
        params: eventParams,
      },
      callData: {
        ...callMetadata,
      },
    };
  }
  /**
   * ==== XYK Buy Executed ====
   */
  parseXykBuyExecutedData() {
    const { relayChainInfo, eventMetadata, callMetadata, call, event } = this;
    const eventParams = parsers.events.xyk.parseBuyExecutedParams(event);

    return {
      relayChainInfo,
      id: eventMetadata.id,
      eventData: {
        name: eventMetadata.name,
        metadata: eventMetadata,
        params: eventParams,
      },
      callData: {
        ...callMetadata,
      },
    };
  }
  /**
   * ==== XYK Sell Executed ====
   */
  parseXykSellExecutedData() {
    const { relayChainInfo, eventMetadata, callMetadata, call, event } = this;
    const eventParams = parsers.events.xyk.parseSellExecutedParams(event);

    return {
      relayChainInfo,
      id: eventMetadata.id,
      eventData: {
        name: eventMetadata.name,
        metadata: eventMetadata,
        params: eventParams,
      },
      callData: {
        ...callMetadata,
      },
    };
  }
  /**
   * ==== Omnipool Token Added ====
   */
  parseOmnipoolTokenAddedData() {
    const { relayChainInfo, eventMetadata, callMetadata, call, event } = this;
    const eventParams = parsers.events.omnipool.parseTokenAddedParams(event);

    return {
      relayChainInfo,
      id: eventMetadata.id,
      eventData: {
        name: eventMetadata.name,
        metadata: eventMetadata,
        params: eventParams,
      },
      callData: {
        ...callMetadata,
      },
    };
  }
  /**
   * ==== Omnipool Token Removed ====
   */
  parseOmnipoolTokenRemovedData() {
    const { relayChainInfo, eventMetadata, callMetadata, call, event } = this;
    const eventParams = parsers.events.omnipool.parseTokenRemovedParams(event);

    return {
      relayChainInfo,
      id: eventMetadata.id,
      eventData: {
        name: eventMetadata.name,
        metadata: eventMetadata,
        params: eventParams,
      },
      callData: {
        ...callMetadata,
      },
    };
  }
  /**
   * ==== Omnipool Buy Executed ====
   */
  parseOmnipoolBuyExecutedData() {
    const { relayChainInfo, eventMetadata, callMetadata, call, event } = this;
    const eventParams = parsers.events.omnipool.parseBuyExecutedParams(event);

    return {
      relayChainInfo,
      id: eventMetadata.id,
      eventData: {
        name: eventMetadata.name,
        metadata: eventMetadata,
        params: eventParams,
      },
      callData: {
        ...callMetadata,
      },
    };
  }
  /**
   * ==== Omnipool Sell Executed ====
   */
  parseOmnipoolSellExecutedData() {
    const { relayChainInfo, eventMetadata, callMetadata, call, event } = this;
    const eventParams = parsers.events.omnipool.parseSellExecutedParams(event);

    return {
      relayChainInfo,
      id: eventMetadata.id,
      eventData: {
        name: eventMetadata.name,
        metadata: eventMetadata,
        params: eventParams,
      },
      callData: {
        ...callMetadata,
      },
    };
  }
  /**
   * ==== Stableswap Pool Created ====
   */
  parseStableswapPoolCreatedData() {
    const { relayChainInfo, eventMetadata, callMetadata, call, event } = this;
    const eventParams = parsers.events.stableswap.parsePoolCreatedParams(event);

    return {
      relayChainInfo,
      id: eventMetadata.id,
      eventData: {
        name: eventMetadata.name,
        metadata: eventMetadata,
        params: eventParams,
      },
      callData: {
        ...callMetadata,
      },
    };
  }
  /**
   * ==== Stableswap Buy Executed ====
   */
  parseStableswapBuyExecutedData() {
    const { relayChainInfo, eventMetadata, callMetadata, call, event } = this;
    const eventParams = parsers.events.stableswap.parseBuyExecutedParams(event);

    return {
      relayChainInfo,
      id: eventMetadata.id,
      eventData: {
        name: eventMetadata.name,
        metadata: eventMetadata,
        params: eventParams,
      },
      callData: {
        ...callMetadata,
      },
    };
  }
  /**
   * ==== Stableswap Sell Executed ====
   */
  parseStableswapSellExecutedData() {
    const { relayChainInfo, eventMetadata, callMetadata, call, event } = this;
    const eventParams =
      parsers.events.stableswap.parseSellExecutedParams(event);

    return {
      relayChainInfo,
      id: eventMetadata.id,
      eventData: {
        name: eventMetadata.name,
        metadata: eventMetadata,
        params: eventParams,
      },
      callData: {
        ...callMetadata,
      },
    };
  }
  /**
   * ==== Stableswap Liquidity Added ====
   */
  parseStableswapLiquidityAddedData() {
    const { relayChainInfo, eventMetadata, callMetadata, call, event } = this;
    const eventParams =
      parsers.events.stableswap.parseLiquidityAddedParams(event);

    return {
      relayChainInfo,
      id: eventMetadata.id,
      eventData: {
        name: eventMetadata.name,
        metadata: eventMetadata,
        params: eventParams,
      },
      callData: {
        ...callMetadata,
      },
    };
  }
  /**
   * ==== Stableswap Liquidity Removed ====
   */
  parseStableswapLiquidityRemovedData() {
    const { relayChainInfo, eventMetadata, callMetadata, call, event } = this;
    const eventParams =
      parsers.events.stableswap.parseLiquidityRemovedParams(event);

    return {
      relayChainInfo,
      id: eventMetadata.id,
      eventData: {
        name: eventMetadata.name,
        metadata: eventMetadata,
        params: eventParams,
      },
      callData: {
        ...callMetadata,
      },
    };
  }
  /**
   * ==== DCA Scheduled ====
   */
  parseDcaScheduledData() {
    const { relayChainInfo, eventMetadata, callMetadata, call, event } = this;
    const eventParams = parsers.events.dca.parseScheduledParams(event);
    const callArgs =
      call && call.name === calls.dca.schedule.name
        ? parsers.calls.dca.parseScheduleArgs(call)
        : undefined;
    return {
      relayChainInfo,
      id: eventMetadata.id,
      eventData: {
        name: eventMetadata.name,
        metadata: eventMetadata,
        params: eventParams,
      },
      callData: {
        ...callMetadata,
        args: callArgs,
      },
    };
  }
  /**
   * ==== DCA Completed ====
   */
  parseDcaCompletedData() {
    const { relayChainInfo, eventMetadata, callMetadata, call, event } = this;
    const eventParams = parsers.events.dca.parseCompletedParams(event);
    return {
      relayChainInfo,
      id: eventMetadata.id,
      eventData: {
        name: eventMetadata.name,
        metadata: eventMetadata,
        params: eventParams,
      },
      callData: {
        ...callMetadata,
      },
    };
  }
  /**
   * ==== DCA Terminated ====
   */
  parseDcaTerminatedData() {
    const { relayChainInfo, eventMetadata, callMetadata, call, event } = this;
    const eventParams = parsers.events.dca.parseTerminatedParams(event);
    return {
      relayChainInfo,
      id: eventMetadata.id,
      eventData: {
        name: eventMetadata.name,
        metadata: eventMetadata,
        params: eventParams,
      },
      callData: {
        ...callMetadata,
      },
    };
  }
  /**
   * ==== DCA Trade Executed ====
   */
  parseDcaTradeExecutedData() {
    const { relayChainInfo, eventMetadata, callMetadata, call, event } = this;
    const eventParams = parsers.events.dca.parseTradeExecutedParams(event);
    return {
      relayChainInfo,
      id: eventMetadata.id,
      eventData: {
        name: eventMetadata.name,
        metadata: eventMetadata,
        params: eventParams,
      },
      callData: {
        ...callMetadata,
      },
    };
  }
  /**
   * ==== DCA Trade Failed ====
   */
  parseDcaTradeFailedData() {
    const { relayChainInfo, eventMetadata, callMetadata, call, event } = this;
    const eventParams = parsers.events.dca.parseTradeFailedParams(event);
    return {
      relayChainInfo,
      id: eventMetadata.id,
      eventData: {
        name: eventMetadata.name,
        metadata: eventMetadata,
        params: eventParams,
      },
      callData: {
        ...callMetadata,
      },
    };
  }
  /**
   * ==== DCA Execution Planned ====
   */
  parseDcaExecutionPlannedData() {
    const { relayChainInfo, eventMetadata, callMetadata, call, event } = this;
    const eventParams = parsers.events.dca.parseExecutionPlannedParams(event);
    return {
      relayChainInfo,
      id: eventMetadata.id,
      eventData: {
        name: eventMetadata.name,
        metadata: eventMetadata,
        params: eventParams,
      },
      callData: {
        ...callMetadata,
      },
    };
  }

  /**
   * ==== DCA Randomness Generation Failed ====
   */
  parseDcaRandomnessGenerationFailedData() {
    const { relayChainInfo, eventMetadata, callMetadata, call, event } = this;
    const eventParams =
      parsers.events.dca.parseRandomnessGenerationFailedParams(event);
    return {
      relayChainInfo,
      id: eventMetadata.id,
      eventData: {
        name: eventMetadata.name,
        metadata: eventMetadata,
        params: eventParams,
      },
      callData: {
        ...callMetadata,
      },
    };
  }
  /**
   * ==== OTC Order Placed ====
   */
  parseOtcOrderPlacedData() {
    const { relayChainInfo, eventMetadata, callMetadata, event } = this;
    const eventParams = parsers.events.otc.parseOrderPlacedParams(event);
    return {
      relayChainInfo,
      id: eventMetadata.id,
      eventData: {
        name: eventMetadata.name,
        metadata: eventMetadata,
        params: eventParams,
      },
      callData: {
        ...callMetadata,
      },
    };
  }
  /**
   * ==== OTC Order Cancelled ====
   */
  parseOtcOrderCancelledData() {
    const { relayChainInfo, eventMetadata, callMetadata, event } = this;
    const eventParams = parsers.events.otc.parseOrderCancelledParams(event);
    return {
      relayChainInfo,
      id: eventMetadata.id,
      eventData: {
        name: eventMetadata.name,
        metadata: eventMetadata,
        params: eventParams,
      },
      callData: {
        ...callMetadata,
      },
    };
  }
  /**
   * ==== OTC Order Filled ====
   */
  parseOtcOrderFilledData() {
    const { relayChainInfo, eventMetadata, callMetadata, event } = this;
    const eventParams = parsers.events.otc.parseOrderFilledParams(event);
    return {
      relayChainInfo,
      id: eventMetadata.id,
      eventData: {
        name: eventMetadata.name,
        metadata: eventMetadata,
        params: eventParams,
      },
      callData: {
        ...callMetadata,
      },
    };
  }
  /**
   * ==== OTC Order Partially Filled ====
   */
  parseOtcOrderPartiallyFilledData() {
    const { relayChainInfo, eventMetadata, callMetadata, event } = this;
    const eventParams =
      parsers.events.otc.parseOrderPartiallyFilledParams(event);
    return {
      relayChainInfo,
      id: eventMetadata.id,
      eventData: {
        name: eventMetadata.name,
        metadata: eventMetadata,
        params: eventParams,
      },
      callData: {
        ...callMetadata,
      },
    };
  }
  /**
   * ==== Tokens Transfer ====
   */
  parseTokensTransferData() {
    const { relayChainInfo, eventMetadata, callMetadata, call, event } = this;
    const eventParams = parsers.events.tokens.parseTransferParams(event);

    return {
      relayChainInfo,
      id: eventMetadata.id,
      eventData: {
        name: eventMetadata.name,
        metadata: eventMetadata,
        params: eventParams,
      },
      callData: {
        ...callMetadata,
      },
    };
  }
  /**
   * ==== Balances Transfer ====
   */
  parseBalancesTransferData() {
    const { relayChainInfo, eventMetadata, callMetadata, call, event } = this;
    const eventParams = parsers.events.balances.parseTransferParams(event);

    return {
      relayChainInfo,
      id: eventMetadata.id,
      eventData: {
        name: eventMetadata.name,
        metadata: eventMetadata,
        params: eventParams,
      },
      callData: {
        ...callMetadata,
      },
    };
  }
  /**
   * ==== AssetRegistry Registered ====
   */
  parseAssetRegistryRegisteredData() {
    const { relayChainInfo, eventMetadata, callMetadata, call, event } = this;
    const eventParams =
      parsers.events.assetRegistry.parseRegisteredParams(event);

    return {
      relayChainInfo,
      id: eventMetadata.id,
      eventData: {
        name: eventMetadata.name,
        metadata: eventMetadata,
        params: eventParams,
      },
      callData: {
        ...callMetadata,
      },
    };
  }
  /**
   * ==== AssetRegistry Updated ====
   */
  parseAssetRegistryUpdatedData() {
    const { relayChainInfo, eventMetadata, callMetadata, call, event } = this;
    const eventParams = parsers.events.assetRegistry.parseUpdatedParams(event);

    return {
      relayChainInfo,
      id: eventMetadata.id,
      eventData: {
        name: eventMetadata.name,
        metadata: eventMetadata,
        params: eventParams,
      },
      callData: {
        ...callMetadata,
      },
    };
  }

  /**
   * ==== AmmSupport Swapped ====
   */
  parseAmmSupportSwappedData() {
    const { relayChainInfo, eventMetadata, callMetadata, event } = this;
    const eventParams = parsers.events.ammSupport.parseSwappedParams(event);

    return {
      relayChainInfo,
      id: eventMetadata.id,
      eventData: {
        name: eventMetadata.name,
        metadata: eventMetadata,
        params: eventParams,
      },
      callData: {
        ...callMetadata,
      },
    };
  }
}

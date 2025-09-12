import { RelayChainInfo } from '../../types/events';
import { CallMetadata, EventMetadata, StoragePrefetchIdsGroup } from '../types';
import { SqdCall, SqdEvent, SqdProcessorContext } from '../../../processor';
import parsers from '../../index';
import { BatchStatePayload } from '../../../utils/batchState';
import { calls, events } from '../../chains/hydration/typegenTypes';
import { Store } from '@subsquid/typeorm-store';
import { BroadcastEventParserHelper } from './helpers/broadcast';
import { OmnipoolEventParserHelper } from './helpers/omnipool';
import { XykEventParserHelper } from './helpers/xyk';
import { LbpEventParserHelper } from './helpers/lbp';
import { OmnipoolLiquidityMiningEventParserHelper } from './helpers/omnipoolLiquidityMining';
import { OmnipoolWarehouseLMEventParserHelper } from './helpers/omnipoolWarehouseLM';
import { XykLiquidityMiningEventParserHelper } from './helpers/xykLiquidityMining'; // TODO fix for different CHAIN env value

export class EventDataParserHelper {
  readonly relayChainInfo: RelayChainInfo;
  readonly callMetadata: CallMetadata;
  readonly eventMetadata: EventMetadata;
  readonly event: SqdEvent;
  readonly call?: SqdCall | null;
  readonly batchState: BatchStatePayload;
  readonly parsers: {
    xyk: XykEventParserHelper;
    xykLM: XykLiquidityMiningEventParserHelper;
    lbp: LbpEventParserHelper;
    broadcast: BroadcastEventParserHelper;
    omnipool: OmnipoolEventParserHelper;
    omnipoolLM: OmnipoolLiquidityMiningEventParserHelper;
    omnipoolWarehouseLM: OmnipoolWarehouseLMEventParserHelper;
  };

  constructor({
    relayChainInfo,
    callMetadata,
    eventMetadata,
    call,
    event,
    batchState,
  }: {
    batchState: BatchStatePayload;
    call?: SqdCall | null;
    event: SqdEvent;
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

    this.parsers = {
      xyk: new XykEventParserHelper(this),
      xykLM: new XykLiquidityMiningEventParserHelper(this),
      lbp: new LbpEventParserHelper(this),
      broadcast: new BroadcastEventParserHelper(this),
      omnipool: new OmnipoolEventParserHelper(this),
      omnipoolLM: new OmnipoolLiquidityMiningEventParserHelper(this),
      omnipoolWarehouseLM: new OmnipoolWarehouseLMEventParserHelper(this),
    };
  }

  addIdsForStoragePrefetch(
    key: StoragePrefetchIdsGroup,
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

  addAccountIdsForPrefetch(ids: string[]) {
    for (const id of ids) this.batchState.accountIdForPrefetch.add(id);
  }

  migrateLocalState(ctx: SqdProcessorContext<Store>) {
    ctx.batchState.state.lbppoolAssetIdsForStoragePrefetch =
      this.batchState.lbppoolAssetIdsForStoragePrefetch;
    ctx.batchState.state.xykPoolIdsForStoragePrefetch =
      this.batchState.xykPoolIdsForStoragePrefetch;
    ctx.batchState.state.omnipoolAssetIdsForStoragePrefetch =
      this.batchState.omnipoolAssetIdsForStoragePrefetch;
    ctx.batchState.state.stableswapIdsForStoragePrefetch =
      this.batchState.stableswapIdsForStoragePrefetch;
    ctx.batchState.state.accountIdForPrefetch =
      this.batchState.accountIdForPrefetch;
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
   * ==== Currencies Transferred ====
   */
  parseCurrenciesTransferredData() {
    const { relayChainInfo, eventMetadata, callMetadata, call, event } = this;
    const eventParams = parsers.events.currencies.parseTransferredParams(event);

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
   * ==== AssetRegistry LocationSet ====
   */
  parseAssetRegistryLocationSetData() {
    const { relayChainInfo, eventMetadata, callMetadata, call, event } = this;
    const eventParams =
      parsers.events.assetRegistry.parseLocationSetParams(event);

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
   * ==== EVM Log ====
   */
  parseEvmLogData() {
    const { relayChainInfo, eventMetadata, callMetadata, call, event } = this;
    const eventParams = parsers.events.evm.parseLogParams(event);

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
   * ==== EVM Accounts Bound ====
   */
  parseEvmAccountsBoundData() {
    const { relayChainInfo, eventMetadata, callMetadata, call, event } = this;
    const eventParams = parsers.events.evmAccounts.parseBoundParams(event);

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
   * ==== HSM Collateral Added ====
   */
  parseHsmCollateralAddedData() {
    const { relayChainInfo, eventMetadata, callMetadata, event } = this;
    const eventParams = parsers.events.hsm.parseCollateralAddedParams(event);

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
   * ==== HSM Collateral Added ====
   */
  parseHsmCollateralRemovedData() {
    const { relayChainInfo, eventMetadata, callMetadata, event } = this;
    const eventParams = parsers.events.hsm.parseCollateralRemovedParams(event);

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
  parseHsmCollateralUpdatedData() {
    const { relayChainInfo, eventMetadata, callMetadata, event } = this;
    const eventParams = parsers.events.hsm.parseCollateralUpdatedParams(event);

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

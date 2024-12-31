import { EventName, RelayChainInfo } from '../../types/events';
import { Block, Extrinsic } from '../../../processor';
import {
  AssetRegistryRegisteredData,
  AssetRegistryUpdatedData,
} from './assetRegistry';
import {
  LbpBuyExecutedData,
  LbpPoolCreatedData,
  LbpPoolUpdatedData,
  LbpSellExecutedData,
} from './lbp';
import { TokensTransferData } from './tokens';
import { BalancesTransferData } from './balances';
import {
  XykBuyExecutedData,
  XykPoolCreatedData,
  XykPoolDestroyedData,
  XykSellExecutedData,
} from './xyk';
import {
  OmnipoolBuyExecutedData,
  OmnipoolSellExecutedData,
  OmnipoolTokenAddedData,
  OmnipoolTokenRemovedData,
} from './omnipool';
import {
  StableswapBuyExecutedData,
  StableswapLiquidityAddedData,
  StableswapLiquidityRemovedData,
  StableswapPoolCreatedData,
  StableswapSellExecutedData,
} from './stableswap';
import {
  DcaCompletedData,
  DcaExecutionPlannedData,
  DcaRandomnessGenerationFailedData,
  DcaScheduledData,
  DcaTerminatedData,
  DcaTradeExecutedData,
  DcaTradeFailedData,
} from './dca';
import {
  OtcOrderCancelledData,
  OtcOrderFilledData,
  OtcOrderPartiallyFilledData,
  OtcOrderPlacedData,
} from './otc';

export * from './assetRegistry';
export * from './lbp';
export * from './tokens';
export * from './balances';
export * from './dca';
export * from './omnipool';
export * from './stableswap';
export * from './xyk';
export * from './otc';

export type EventId = string;

export type EventDataType<T> = T extends EventName.Tokens_Transfer
  ? TokensTransferData
  : T extends EventName.Balances_Transfer
    ? BalancesTransferData
    : T extends EventName.AssetRegistry_Registered
      ? AssetRegistryRegisteredData
      : T extends EventName.AssetRegistry_Updated
        ? AssetRegistryUpdatedData
        : T extends EventName.LBP_PoolCreated
          ? LbpPoolCreatedData
          : T extends EventName.LBP_PoolUpdated
            ? LbpPoolUpdatedData
            : T extends EventName.LBP_BuyExecuted
              ? LbpBuyExecutedData
              : T extends EventName.LBP_SellExecuted
                ? LbpSellExecutedData
                : T extends EventName.XYK_PoolCreated
                  ? XykPoolCreatedData
                  : T extends EventName.XYK_PoolDestroyed
                    ? XykPoolDestroyedData
                    : T extends EventName.XYK_BuyExecuted
                      ? XykBuyExecutedData
                      : T extends EventName.XYK_SellExecuted
                        ? XykSellExecutedData
                        : T extends EventName.Omnipool_TokenAdded
                          ? OmnipoolTokenAddedData
                          : T extends EventName.Omnipool_TokenRemoved
                            ? OmnipoolTokenRemovedData
                            : T extends EventName.Omnipool_BuyExecuted
                              ? OmnipoolBuyExecutedData
                              : T extends EventName.Omnipool_SellExecuted
                                ? OmnipoolSellExecutedData
                                : T extends EventName.Stableswap_PoolCreated
                                  ? StableswapPoolCreatedData
                                  : T extends EventName.Stableswap_BuyExecuted
                                    ? StableswapBuyExecutedData
                                    : T extends EventName.Stableswap_SellExecuted
                                      ? StableswapSellExecutedData
                                      : T extends EventName.Stableswap_LiquidityAdded
                                        ? StableswapLiquidityAddedData
                                        : T extends EventName.Stableswap_LiquidityRemoved
                                          ? StableswapLiquidityRemovedData
                                          : T extends EventName.DCA_Scheduled
                                            ? DcaScheduledData
                                            : T extends EventName.DCA_ExecutionPlanned
                                              ? DcaExecutionPlannedData
                                              : T extends EventName.DCA_TradeExecuted
                                                ? DcaTradeExecutedData
                                                : T extends EventName.DCA_TradeFailed
                                                  ? DcaTradeFailedData
                                                  : T extends EventName.DCA_Terminated
                                                    ? DcaTerminatedData
                                                    : T extends EventName.DCA_Completed
                                                      ? DcaCompletedData
                                                      : T extends EventName.DCA_RandomnessGenerationFailed
                                                        ? DcaRandomnessGenerationFailedData
                                                        : T extends EventName.OTC_Placed
                                                          ? OtcOrderPlacedData
                                                          : T extends EventName.OTC_Cancelled
                                                            ? OtcOrderCancelledData
                                                            : T extends EventName.OTC_Filled
                                                              ? OtcOrderFilledData
                                                              : T extends EventName.OTC_PartiallyFilled
                                                                ? OtcOrderPartiallyFilledData
                                                                : never;

export type BatchBlocksParsedDataScope = Map<
  EventName,
  Map<EventId, ParsedEventsCallsData>
>;

export type ParsedEventsCallsData =
  | LbpPoolCreatedData
  | LbpPoolUpdatedData
  | TokensTransferData
  | BalancesTransferData
  | LbpBuyExecutedData
  | LbpSellExecutedData
  | XykPoolCreatedData
  | XykPoolDestroyedData
  | XykBuyExecutedData
  | XykSellExecutedData
  | OmnipoolTokenAddedData
  | OmnipoolTokenRemovedData
  | OmnipoolBuyExecutedData
  | OmnipoolSellExecutedData
  | StableswapPoolCreatedData
  | StableswapBuyExecutedData
  | StableswapSellExecutedData
  | StableswapLiquidityAddedData
  | StableswapLiquidityRemovedData
  | AssetRegistryRegisteredData
  | AssetRegistryUpdatedData
  | DcaScheduledData
  | DcaExecutionPlannedData
  | DcaTradeExecutedData
  | DcaTradeFailedData
  | DcaTerminatedData
  | DcaCompletedData
  | DcaRandomnessGenerationFailedData
  | OtcOrderPlacedData
  | OtcOrderCancelledData
  | OtcOrderFilledData
  | OtcOrderPartiallyFilledData;

export interface CallMetadata {
  name: string;
  id?: string;
  traceId?: string;
  // signer: string;
}

export type CallParsedData<T = undefined> = CallMetadata & {
  args?: T;
};

export type EventParsedData<T> = {
  name: string;
  metadata: EventMetadata;
  params: T;
};

export type ParsedEventCallData<
  E extends { metadata: EventMetadata },
  C extends { name: string },
> = {
  id: string;
  relayChainInfo: RelayChainInfo;
  eventData: E;
  callData: C;
};

export interface EventMetadata {
  id: EventId;
  traceId: string;
  name: string;
  indexInBlock: number;
  blockHeader: Block;
  extrinsic?: Extrinsic;
}

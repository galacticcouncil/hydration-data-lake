import {
  AssetRegistryRegisteredEventParams,
  AssetRegistryUpdatedEventParams,
  BalancesTransferEventParams,
  EventName,
  LbpBuyExecutedEventParams,
  LbpPoolCreatedEventParams,
  LbpPoolUpdatedEventParams,
  LbpSellExecutedEventParams,
  OmnipoolBuyExecutedEventParams,
  OmnipoolSellExecutedEventParams,
  OmnipoolTokenAddedEventParams,
  OmnipoolTokenRemovedEventParams,
  RelayChainInfo,
  StableswapBuyExecutedEventParams,
  StableswapLiquidityAddedEventParams,
  StableswapLiquidityRemovedEventParams,
  StableswapPoolCreatedEventParams,
  StableswapSellExecutedEventParams,
  TokensTransferEventParams,
  XykBuyExecutedEventParams,
  XykPoolCreatedEventParams,
  XykPoolDestroyedEventParams,
  XykSellExecutedEventParams,
} from '../types/events';
import { LbpCreatePoolCallArgs, XykCreatePoolCallArgs } from '../types/calls';
import { Block, Extrinsic } from '../../processor';

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
  | AssetRegistryUpdatedData;

export type CallParsedData<T = undefined> = {
  name: string;
  // signer: string;
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
  callData?: C;
};

export interface EventMetadata {
  id: EventId;
  name: string;
  indexInBlock: number;
  blockHeader: Block;
  extrinsic?: Extrinsic;
}

/**
 *  ==== Asset Registry Registered ====
 */

export type AssetRegistryRegisteredData = ParsedEventCallData<
  AssetRegistryRegisteredEventParsedData,
  CallParsedData
>;

export type AssetRegistryRegisteredEventParsedData =
  EventParsedData<AssetRegistryRegisteredEventParams>;

/**
 *  ==== Asset Registry Updated ====
 */

export type AssetRegistryUpdatedData = ParsedEventCallData<
  AssetRegistryUpdatedEventParsedData,
  CallParsedData
>;

export type AssetRegistryUpdatedEventParsedData =
  EventParsedData<AssetRegistryUpdatedEventParams>;

/**
 *  ==== LBP Pool Created ====
 */
export type LbpPoolCreatedData = ParsedEventCallData<
  LbpPoolCreatedEventParsedData,
  LbpCreatePoolCallParsedData
>;

export type LbpPoolCreatedEventParsedData =
  EventParsedData<LbpPoolCreatedEventParams>;

export type LbpCreatePoolCallParsedData = CallParsedData<LbpCreatePoolCallArgs>;

/**
 *  ==== LBP Pool Updated ====
 */

export type LbpPoolUpdatedData = ParsedEventCallData<
  LbpPoolUpdatedEventParsedData,
  CallParsedData
>;

export type LbpPoolUpdatedEventParsedData =
  EventParsedData<LbpPoolUpdatedEventParams>;

/**
 *  ==== Tokens Transfer ====
 */

export type TokensTransferData = ParsedEventCallData<
  TokensTransferEventParsedData,
  CallParsedData
>;

export type TokensTransferEventParsedData =
  EventParsedData<TokensTransferEventParams>;

/**
 *  ==== Balances Transfer ====
 */

export type BalancesTransferData = ParsedEventCallData<
  BalancesTransferEventParsedData,
  CallParsedData
>;

export type BalancesTransferEventParsedData =
  EventParsedData<BalancesTransferEventParams>;

/**
 *  ==== LBP Buy Executed ====
 */

export type LbpBuyExecutedData = ParsedEventCallData<
  LbpBuyExecutedEventParsedData,
  CallParsedData
>;

export type LbpBuyExecutedEventParsedData =
  EventParsedData<LbpBuyExecutedEventParams>;

/**
 *  ==== LBP Sell Executed ====
 */

export type LbpSellExecutedData = ParsedEventCallData<
  LbpSellExecutedEventParsedData,
  CallParsedData
>;

export type LbpSellExecutedEventParsedData =
  EventParsedData<LbpSellExecutedEventParams>;

/**
 *  ==== XYK Pool Created ====
 */
export type XykPoolCreatedData = ParsedEventCallData<
  XykPoolCreatedEventParsedData,
  XykCreatePoolCallParsedData
>;

export type XykPoolCreatedEventParsedData =
  EventParsedData<XykPoolCreatedEventParams>;

export type XykCreatePoolCallParsedData = CallParsedData<XykCreatePoolCallArgs>;

/**
 *  ==== XYK Pool Destroyed ====
 */
export type XykPoolDestroyedData = ParsedEventCallData<
  XykPoolDestroyedEventParsedData,
  CallParsedData
>;

export type XykPoolDestroyedEventParsedData =
  EventParsedData<XykPoolDestroyedEventParams>;

/**
 *  ==== XYK Buy Executed ====
 */

export type XykBuyExecutedData = ParsedEventCallData<
  XykBuyExecutedEventParsedData,
  CallParsedData
>;

export type XykBuyExecutedEventParsedData =
  EventParsedData<XykBuyExecutedEventParams>;

/**
 *  ==== XYK Sell Executed ====
 */

export type XykSellExecutedData = ParsedEventCallData<
  XykSellExecutedEventParsedData,
  CallParsedData
>;

export type XykSellExecutedEventParsedData =
  EventParsedData<XykSellExecutedEventParams>;

/**
 *  ==== Omnipool Token Added ====
 */

export type OmnipoolTokenAddedData = ParsedEventCallData<
  OmnipoolTokenAddedEventParsedData,
  CallParsedData
>;

export type OmnipoolTokenAddedEventParsedData =
  EventParsedData<OmnipoolTokenAddedEventParams>;

/**
 *  ==== Omnipool Token Removed ====
 */

export type OmnipoolTokenRemovedData = ParsedEventCallData<
  OmnipoolTokenRemovedEventParsedData,
  CallParsedData
>;

export type OmnipoolTokenRemovedEventParsedData =
  EventParsedData<OmnipoolTokenRemovedEventParams>;

/**
 *  ==== Omnipool Buy Executed ====
 */

export type OmnipoolBuyExecutedData = ParsedEventCallData<
  OmnipoolBuyExecutedEventParsedData,
  CallParsedData
>;

export type OmnipoolBuyExecutedEventParsedData =
  EventParsedData<OmnipoolBuyExecutedEventParams>;

/**
 *  ==== Omnipool Sell Executed ====
 */

export type OmnipoolSellExecutedData = ParsedEventCallData<
  OmnipoolSellExecutedEventParsedData,
  CallParsedData
>;

export type OmnipoolSellExecutedEventParsedData =
  EventParsedData<OmnipoolSellExecutedEventParams>;

/**
 *  ==== Stableswap Pool Created ====
 */

export type StableswapPoolCreatedData = ParsedEventCallData<
  StableswapPoolCreatedEventParsedData,
  CallParsedData
>;

export type StableswapPoolCreatedEventParsedData =
  EventParsedData<StableswapPoolCreatedEventParams>;

/**
 *  ==== Stableswap Buy Executed ====
 */

export type StableswapBuyExecutedData = ParsedEventCallData<
  StableswapBuyExecutedEventParsedData,
  CallParsedData
>;

export type StableswapBuyExecutedEventParsedData =
  EventParsedData<StableswapBuyExecutedEventParams>;

/**
 *  ==== Stableswap Sell Executed ====
 */

export type StableswapSellExecutedData = ParsedEventCallData<
  StableswapSellExecutedEventParsedData,
  CallParsedData
>;

export type StableswapSellExecutedEventParsedData =
  EventParsedData<StableswapSellExecutedEventParams>;

/**
 *  ==== Stableswap Liquidity Added ====
 */

export type StableswapLiquidityAddedData = ParsedEventCallData<
  StableswapLiquidityAddedEventParsedData,
  CallParsedData
>;

export type StableswapLiquidityAddedEventParsedData =
  EventParsedData<StableswapLiquidityAddedEventParams>;

/**
 *  ==== Stableswap Liquidity Removed ====
 */

export type StableswapLiquidityRemovedData = ParsedEventCallData<
  StableswapLiquidityRemovedEventParsedData,
  CallParsedData
>;

export type StableswapLiquidityRemovedEventParsedData =
  EventParsedData<StableswapLiquidityRemovedEventParams>;

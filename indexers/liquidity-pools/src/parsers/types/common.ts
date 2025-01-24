import {
  DcaScheduleCallArgs,
  LbpCreatePoolCallArgs,
  RelaySystemSetValidationDataCallArgs,
  XykCreatePoolCallArgs,
} from './calls';
import { Call, Event } from '../../processor';
import {
  AmmSupportSwappedEventParams,
  AssetRegistryRegisteredEventParams,
  AssetRegistryUpdatedEventParams,
  BalancesTransferEventParams,
  DcaCompletedEventParams,
  DcaExecutionPlannedEventParams,
  DcaRandomnessGenerationFailedEventParams,
  DcaScheduledEventParams,
  DcaTerminatedEventParams,
  DcaTradeExecutedEventParams,
  DcaTradeFailedEventParams,
  LbpBuyExecutedEventParams,
  LbpPoolCreatedEventParams,
  LbpPoolUpdatedEventParams,
  LbpSellExecutedEventParams,
  OmnipoolBuyExecutedEventParams,
  OmnipoolSellExecutedEventParams,
  OmnipoolTokenAddedEventParams,
  OmnipoolTokenRemovedEventParams,
  OtcOrderCancelledEventParams,
  OtcOrderFilledEventParams,
  OtcOrderPartiallyFilledEventParams,
  OtcOrderPlacedEventParams,
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
} from './events';
import { BlockHeader } from '@subsquid/substrate-processor';
import {
  AccountData,
  AssetDetails,
  AssetDetailsWithId,
  DcaGetScheduleInput,
  DcaScheduleData,
  GetPoolAssetInfoInput,
  LbpGetAllPoolsDataInput,
  LbpGetPoolDataInput,
  LbpPoolData,
  OmnipoolAssetData,
  OmnipoolGetAssetDataInput,
  OtcGetOrderInput,
  OtcOrderData,
  ParachainSystemLastRelayChainBlockNumber,
  StablepoolGetPoolDataInput,
  StablepoolInfo,
  SystemAccountInfo,
  TokensAccountsAssetBalances,
  TokensGetTokenTotalIssuanceInput,
  XykGetAssetsInput,
  XykGetShareTokenInput,
  XykPoolWithAssets,
} from './storage';
import { DcaScheduleOrderType, SwapFillerType } from '../../model';
import ammSupport from '../chains/hydration-paseo-next/events/ammSupport';

export interface PoolData {
  owner: string;
  start?: number | undefined;
  end?: number | undefined;
  assets: [number, number];
  initialWeight: number;
  finalWeight: number;
  // weightCurve: WeightCurveType
  fee: [number, number];
  feeCollector: string;
  repayTarget: bigint;
}

export type CallParserMethods = {
  lbp: {
    parseCreatePoolArgs: (call: Call) => LbpCreatePoolCallArgs;
  };
  xyk: {
    parseCreatePoolArgs: (call: Call) => XykCreatePoolCallArgs;
  };
  dca: {
    parseScheduleArgs: (call: Call) => DcaScheduleCallArgs;
  };
  parachainSystem: {
    parseSetValidationDataArgs: (
      call: Call
    ) => RelaySystemSetValidationDataCallArgs;
  };
};
export type EventParserMethods = {
  lbp: {
    parsePoolCreatedParams: (event: Event) => LbpPoolCreatedEventParams;
    parsePoolUpdatedParams: (event: Event) => LbpPoolUpdatedEventParams;
    parseBuyExecutedParams: (event: Event) => LbpBuyExecutedEventParams;
    parseSellExecutedParams: (event: Event) => LbpSellExecutedEventParams;
  };
  xyk: {
    parsePoolCreatedParams: (event: Event) => XykPoolCreatedEventParams;
    parsePoolDestroyedParams: (event: Event) => XykPoolDestroyedEventParams;
    parseBuyExecutedParams: (event: Event) => XykBuyExecutedEventParams;
    parseSellExecutedParams: (event: Event) => XykSellExecutedEventParams;
  };
  omnipool: {
    parseTokenAddedParams: (event: Event) => OmnipoolTokenAddedEventParams;
    parseTokenRemovedParams: (event: Event) => OmnipoolTokenRemovedEventParams;
    parseBuyExecutedParams: (event: Event) => OmnipoolBuyExecutedEventParams;
    parseSellExecutedParams: (event: Event) => OmnipoolSellExecutedEventParams;
  };
  stableswap: {
    parsePoolCreatedParams: (event: Event) => StableswapPoolCreatedEventParams;
    parseLiquidityAddedParams: (
      event: Event
    ) => StableswapLiquidityAddedEventParams;
    parseLiquidityRemovedParams: (
      event: Event
    ) => StableswapLiquidityRemovedEventParams;
    parseBuyExecutedParams: (event: Event) => StableswapBuyExecutedEventParams;
    parseSellExecutedParams: (
      event: Event
    ) => StableswapSellExecutedEventParams;
  };
  dca: {
    parseScheduledParams: (event: Event) => DcaScheduledEventParams;
    parseExecutionPlannedParams: (
      event: Event
    ) => DcaExecutionPlannedEventParams;
    parseTradeExecutedParams: (event: Event) => DcaTradeExecutedEventParams;
    parseTradeFailedParams: (event: Event) => DcaTradeFailedEventParams;
    parseTerminatedParams: (event: Event) => DcaTerminatedEventParams;
    parseCompletedParams: (event: Event) => DcaCompletedEventParams;
    parseRandomnessGenerationFailedParams: (
      event: Event
    ) => DcaRandomnessGenerationFailedEventParams;
  };
  otc: {
    parseOrderPlacedParams: (event: Event) => OtcOrderPlacedEventParams;
    parseOrderCancelledParams: (event: Event) => OtcOrderCancelledEventParams;
    parseOrderFilledParams: (event: Event) => OtcOrderFilledEventParams;
    parseOrderPartiallyFilledParams: (
      event: Event
    ) => OtcOrderPartiallyFilledEventParams;
  };
  tokens: {
    parseTransferParams: (event: Event) => TokensTransferEventParams;
  };
  balances: {
    parseTransferParams: (event: Event) => BalancesTransferEventParams;
  };
  assetRegistry: {
    parseRegisteredParams: (event: Event) => AssetRegistryRegisteredEventParams;
    parseUpdatedParams: (event: Event) => AssetRegistryUpdatedEventParams;
  };
  ammSupport: {
    parseSwappedParams: (event: Event) => AmmSupportSwappedEventParams;
  };
};
export type StorageParserMethods = {
  system: {
    getSystemAccount: (
      account: string,
      block: BlockHeader
    ) => Promise<SystemAccountInfo | null>;
  };
  tokens: {
    getTokensAccountsAssetBalances: (
      account: string,
      assetId: number,
      block: BlockHeader
    ) => Promise<TokensAccountsAssetBalances | null>;
    getTokenTotalIssuance: (
      args: TokensGetTokenTotalIssuanceInput
    ) => Promise<bigint | null>;
  };
  assetRegistry: {
    getAsset: (
      assetId: string | number,
      block: BlockHeader
    ) => Promise<AssetDetails | null>;
    getAssetMany: (
      assetIds: Array<string | number>,
      block: BlockHeader
    ) => Promise<Array<AssetDetailsWithId>>;
  };
  parachainSystem: {
    getLastRelayChainBlockNumber: (
      block: BlockHeader
    ) => Promise<ParachainSystemLastRelayChainBlockNumber | null>;
  };
  stableswap: {
    getPoolData: (
      args: StablepoolGetPoolDataInput
    ) => Promise<StablepoolInfo | null>;
    getPoolAssetInfo: (
      args: GetPoolAssetInfoInput
    ) => Promise<AccountData | null>;
  };
  omnipool: {
    getOmnipoolAssetData: (
      args: OmnipoolGetAssetDataInput
    ) => Promise<OmnipoolAssetData | null>;
    getPoolAssetInfo: (
      args: GetPoolAssetInfoInput
    ) => Promise<AccountData | null>;
  };
  xyk: {
    getShareToken: (args: XykGetShareTokenInput) => Promise<number | null>;
    getPoolAssets: (
      args: XykGetAssetsInput
    ) => Promise<XykPoolWithAssets | null>;
    getPoolAssetInfo: (
      args: GetPoolAssetInfoInput
    ) => Promise<AccountData | null>;
  };
  lbp: {
    getPoolData: (args: LbpGetPoolDataInput) => Promise<LbpPoolData | null>;
    getAllPoolsData: (args: LbpGetAllPoolsDataInput) => Promise<LbpPoolData[]>;
    getPoolAssetInfo: (
      args: GetPoolAssetInfoInput
    ) => Promise<AccountData | null>;
  };
  dca: {
    getDcaSchedule: (
      args: DcaGetScheduleInput
    ) => Promise<DcaScheduleData | null>;
  };
  otc: {
    getOtcOrder: (args: OtcGetOrderInput) => Promise<OtcOrderData | null>;
  };
};

export type ParserMethods = {
  calls: CallParserMethods;
  events: EventParserMethods;
  storage: StorageParserMethods;
};

export type DispatchError = {
  __kind: string;
  value?: {
    index: number;
    error: string;
  };
};

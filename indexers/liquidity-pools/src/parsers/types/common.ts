import {
  DcaScheduleCallArgs,
  LbpCreatePoolCallArgs,
  RelaySystemSetValidationDataCallArgs,
  XykCreatePoolCallArgs,
} from './calls';
import { SqdCall, SqdEvent } from '../../processor';
import {
  BroadcastSwappedEventParams,
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
  EvmLogEventParams,
  EvmAccountsBoundEventParams,
  CurrenciesTransferredEventParams,
  AssetRegistryLocationSetEventParams,
} from './events';
import { BlockHeader } from '@subsquid/substrate-processor';
import {
  AccountData,
  AssetDetails,
  AssetDetailsWithId,
  DcaGetScheduleInput,
  DcaScheduleData,
  Erc20AssetContractDetails,
  EvmAccountsAccountExtension,
  EvmAccountsGetAccountExtensionInput,
  GetPoolAssetInfoInput,
  LbpGetAllPoolIdsInput,
  LbpGetAllPoolsDataInput,
  LbpGetPoolDataInput,
  LbpPoolData,
  OmnipoolAssetData,
  OmnipoolAssetTradability,
  OmnipoolData,
  OmnipoolGetAllAssetIdsInput,
  OmnipoolGetAssetDataInput,
  OmnipoolGetHubAssetTradabilityInput,
  OmnipoolGetPoolDataInput,
  OtcGetOrderInput,
  OtcOrderData,
  ParachainSystemLastRelayChainBlockNumber,
  StablepoolAssetState,
  StablepoolGetAllPoolIdsInput,
  StablepoolGetPoolDataInput,
  StablepoolInfo,
  SystemAccountInfo,
  TokensAccountsAssetBalances,
  TokensGetTokensTotalIssuanceInput,
  TokensGetTokenTotalIssuanceInput,
  TokenTotalIssuance,
  XykGetAssetsInput,
  XykGetPoolDataInput,
  XykGetPoolShareTokenPairsManyInput,
  XykGetShareTokenInput,
  XykPoolAssetIds,
  XykPoolData,
  XykPoolShareTokenPair,
} from './storage';
import {
  AaveTradeExecutorPoolDataWithPoolId,
  AaveTradeExecutorPoolsInput,
} from '../runtimeApiResolver/types';

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
    parseCreatePoolArgs: (call: SqdCall) => LbpCreatePoolCallArgs;
  };
  xyk: {
    parseCreatePoolArgs: (call: SqdCall) => XykCreatePoolCallArgs;
  };
  dca: {
    parseScheduleArgs: (call: SqdCall) => DcaScheduleCallArgs;
  };
  parachainSystem: {
    parseSetValidationDataArgs: (
      call: SqdCall
    ) => RelaySystemSetValidationDataCallArgs;
  };
};
export type EventParserMethods = {
  lbp: {
    parsePoolCreatedParams: (event: SqdEvent) => LbpPoolCreatedEventParams;
    parsePoolUpdatedParams: (event: SqdEvent) => LbpPoolUpdatedEventParams;
    parseBuyExecutedParams: (event: SqdEvent) => LbpBuyExecutedEventParams;
    parseSellExecutedParams: (event: SqdEvent) => LbpSellExecutedEventParams;
  };
  xyk: {
    parsePoolCreatedParams: (event: SqdEvent) => XykPoolCreatedEventParams;
    parsePoolDestroyedParams: (event: SqdEvent) => XykPoolDestroyedEventParams;
    parseBuyExecutedParams: (event: SqdEvent) => XykBuyExecutedEventParams;
    parseSellExecutedParams: (event: SqdEvent) => XykSellExecutedEventParams;
  };
  omnipool: {
    parseTokenAddedParams: (event: SqdEvent) => OmnipoolTokenAddedEventParams;
    parseTokenRemovedParams: (
      event: SqdEvent
    ) => OmnipoolTokenRemovedEventParams;
    parseBuyExecutedParams: (event: SqdEvent) => OmnipoolBuyExecutedEventParams;
    parseSellExecutedParams: (
      event: SqdEvent
    ) => OmnipoolSellExecutedEventParams;
  };
  stableswap: {
    parsePoolCreatedParams: (
      event: SqdEvent
    ) => StableswapPoolCreatedEventParams;
    parseLiquidityAddedParams: (
      event: SqdEvent
    ) => StableswapLiquidityAddedEventParams;
    parseLiquidityRemovedParams: (
      event: SqdEvent
    ) => StableswapLiquidityRemovedEventParams;
    parseBuyExecutedParams: (
      event: SqdEvent
    ) => StableswapBuyExecutedEventParams;
    parseSellExecutedParams: (
      event: SqdEvent
    ) => StableswapSellExecutedEventParams;
  };
  dca: {
    parseScheduledParams: (event: SqdEvent) => DcaScheduledEventParams;
    parseExecutionPlannedParams: (
      event: SqdEvent
    ) => DcaExecutionPlannedEventParams;
    parseTradeExecutedParams: (event: SqdEvent) => DcaTradeExecutedEventParams;
    parseTradeFailedParams: (event: SqdEvent) => DcaTradeFailedEventParams;
    parseTerminatedParams: (event: SqdEvent) => DcaTerminatedEventParams;
    parseCompletedParams: (event: SqdEvent) => DcaCompletedEventParams;
    parseRandomnessGenerationFailedParams: (
      event: SqdEvent
    ) => DcaRandomnessGenerationFailedEventParams;
  };
  otc: {
    parseOrderPlacedParams: (event: SqdEvent) => OtcOrderPlacedEventParams;
    parseOrderCancelledParams: (
      event: SqdEvent
    ) => OtcOrderCancelledEventParams;
    parseOrderFilledParams: (event: SqdEvent) => OtcOrderFilledEventParams;
    parseOrderPartiallyFilledParams: (
      event: SqdEvent
    ) => OtcOrderPartiallyFilledEventParams;
  };
  tokens: {
    parseTransferParams: (event: SqdEvent) => TokensTransferEventParams;
  };
  balances: {
    parseTransferParams: (event: SqdEvent) => BalancesTransferEventParams;
  };
  currencies: {
    parseTransferredParams: (
      event: SqdEvent
    ) => CurrenciesTransferredEventParams;
  };
  assetRegistry: {
    parseRegisteredParams: (
      event: SqdEvent
    ) => AssetRegistryRegisteredEventParams;
    parseUpdatedParams: (event: SqdEvent) => AssetRegistryUpdatedEventParams;
    parseLocationSetParams: (
      event: SqdEvent
    ) => AssetRegistryLocationSetEventParams;
  };
  broadcast: {
    parseSwappedParams: (event: SqdEvent) => BroadcastSwappedEventParams;
    parseSwapped2Params: (event: SqdEvent) => BroadcastSwappedEventParams;
  };
  evm: {
    parseLogParams: (event: SqdEvent) => EvmLogEventParams | null;
  };
  evmAccounts: {
    parseBoundParams: (event: SqdEvent) => EvmAccountsBoundEventParams;
  };
};
export type StorageParserMethods = {
  system: {
    getSystemAccount: (
      account: string,
      block: BlockHeader
    ) => Promise<SystemAccountInfo | null>;
  };
  balances: {
    getTotalIssuance: (block: BlockHeader) => Promise<bigint | null>;
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
    getManyTokensTotalIssuance: (
      args: TokensGetTokensTotalIssuanceInput
    ) => Promise<TokenTotalIssuance[]>;
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
    getAssetAll: (block: BlockHeader) => Promise<Array<AssetDetailsWithId>>;
    getErc20AssetContractAddress: (
      assetId: string | number,
      block: BlockHeader
    ) => Promise<Erc20AssetContractDetails | null>;
  };
  parachainSystem: {
    getLastRelayChainBlockNumber: (
      block: BlockHeader
    ) => Promise<ParachainSystemLastRelayChainBlockNumber | null>;
  };
  stableswap: {
    getAllPoolIds: (args: StablepoolGetAllPoolIdsInput) => Promise<number[]>;
    getPoolData: (
      args: StablepoolGetPoolDataInput
    ) => Promise<StablepoolInfo | null>;
    getPoolAssetInfo: (
      args: GetPoolAssetInfoInput
    ) => Promise<AccountData | null>;
    getPoolAssetStorageData: (
      args: GetPoolAssetInfoInput
    ) => Promise<StablepoolAssetState | null>;
  };
  omnipool: {
    getOmnipoolHubAssetTradability: (
      args: OmnipoolGetHubAssetTradabilityInput
    ) => Promise<OmnipoolAssetTradability | null>;
    getOmnipoolAllAssetIds: (
      args: OmnipoolGetAllAssetIdsInput
    ) => Promise<number[]>;
    getPoolData: (
      args: OmnipoolGetPoolDataInput
    ) => Promise<OmnipoolData | null>;
    getOmnipoolAssetData: (
      args: OmnipoolGetAssetDataInput
    ) => Promise<OmnipoolAssetData | null>;
    getPoolAssetInfo: (
      args: GetPoolAssetInfoInput
    ) => Promise<AccountData | null>;
  };
  xyk: {
    getShareToken: (args: XykGetShareTokenInput) => Promise<number | null>;
    getPoolShareTokenPairsMany: (
      args: XykGetPoolShareTokenPairsManyInput
    ) => Promise<XykPoolShareTokenPair[]>;
    getPoolAssets: (args: XykGetAssetsInput) => Promise<XykPoolAssetIds | null>;
    getPoolData: (args: XykGetPoolDataInput) => Promise<XykPoolData | null>;
    getPoolAssetInfo: (
      args: GetPoolAssetInfoInput
    ) => Promise<AccountData | null>;
  };
  lbp: {
    getPoolData: (args: LbpGetPoolDataInput) => Promise<LbpPoolData | null>;
    getAllPoolIds: (args: LbpGetAllPoolIdsInput) => Promise<string[]>;
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
  evmAccounts: {
    getAccountExtension: (
      args: EvmAccountsGetAccountExtensionInput
    ) => Promise<EvmAccountsAccountExtension | null>;
  };
  aaveTradeExecutor: {
    getPools: (
      args: AaveTradeExecutorPoolsInput
    ) => Promise<AaveTradeExecutorPoolDataWithPoolId[] | null>;
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

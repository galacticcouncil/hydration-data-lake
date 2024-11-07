import {
  LbpCreatePoolCallArgs,
  RelaySystemSetValidationDataCallArgs,
  XykCreatePoolCallArgs,
} from './calls';
import { Call, Event } from '../../processor';
import {
  AssetRegistryRegisteredEventParams,
  AssetRegistryUpdatedEventParams,
  BalancesTransferEventParams,
  LbpBuyExecutedEventParams,
  LbpPoolCreatedEventParams,
  LbpPoolUpdatedEventParams,
  LbpSellExecutedEventParams,
  OmnipoolBuyExecutedEventParams,
  OmnipoolSellExecutedEventParams,
  OmnipoolTokenAddedEventParams,
  OmnipoolTokenRemovedEventParams,
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
  GetPoolAssetInfoInput,
  LbpGetPoolDataInput,
  LbpPoolData,
  OmnipoolAssetData,
  OmnipoolGetAssetDataInput,
  ParachainSystemLastRelayChainBlockNumber,
  StablepoolGetPoolDataInput,
  StablepoolInfo,
  SystemAccountInfo,
  TokensAccountsAssetBalances,
  XykGetAssetsInput,
  XykPoolWithAssets,
} from './storage';

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
    getPoolAssets: (
      args: XykGetAssetsInput
    ) => Promise<XykPoolWithAssets | null>;
    getPoolAssetInfo: (
      args: GetPoolAssetInfoInput
    ) => Promise<AccountData | null>;
  };
  lbp: {
    getPoolData: (args: LbpGetPoolDataInput) => Promise<LbpPoolData | null>;
    getPoolAssetInfo: (
      args: GetPoolAssetInfoInput
    ) => Promise<AccountData | null>;
  };
};

export type ParserMethods = {
  calls: CallParserMethods;
  events: EventParserMethods;
  storage: StorageParserMethods;
};

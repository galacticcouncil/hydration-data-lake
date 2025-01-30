import { DispatchError, PoolData } from './common';
import {
  AssetType,
  SwapFeeDestinationType,
  SwapFillerType,
  TradeOperationType,
} from '../../model';
import { SwappedExecutionTypeKind } from '../../utils/types';

export enum EventName {
  'Balances_Transfer' = 'Balances.Transfer',
  'Tokens_Transfer' = 'Tokens.Transfer',

  'AssetRegistry_Registered' = 'AssetRegistry.Registered',
  'AssetRegistry_Updated' = 'AssetRegistry.Updated',

  'LBP_PoolCreated' = 'LBP.PoolCreated',
  'LBP_PoolUpdated' = 'LBP.PoolUpdated',
  'LBP_BuyExecuted' = 'LBP.BuyExecuted',
  'LBP_SellExecuted' = 'LBP.SellExecuted',

  'XYK_PoolCreated' = 'XYK.PoolCreated',
  'XYK_PoolDestroyed' = 'XYK.Destroyed',
  'XYK_BuyExecuted' = 'XYK.BuyExecuted',
  'XYK_SellExecuted' = 'XYK.SellExecuted',

  'Omnipool_TokenAdded' = 'Omnipool.TokenAdded',
  'Omnipool_TokenRemoved' = 'Omnipool.TokenRemoved',
  'Omnipool_BuyExecuted' = 'Omnipool.BuyExecuted',
  'Omnipool_SellExecuted' = 'Omnipool.SellExecuted',

  'Stableswap_PoolCreated' = 'Stableswap.PoolCreated',
  'Stableswap_BuyExecuted' = 'Stableswap.BuyExecuted',
  'Stableswap_SellExecuted' = 'Stableswap.SellExecuted',
  'Stableswap_LiquidityAdded' = 'Stableswap.LiquidityAdded',
  'Stableswap_LiquidityRemoved' = 'Stableswap.LiquidityRemoved',

  'DCA_ExecutionStarted' = 'DCA.ExecutionStarted',
  'DCA_Scheduled' = 'DCA.Scheduled',
  'DCA_ExecutionPlanned' = 'DCA.ExecutionPlanned',
  'DCA_TradeExecuted' = 'DCA.TradeExecuted',
  'DCA_TradeFailed' = 'DCA.TradeFailed',
  'DCA_Terminated' = 'DCA.Terminated',
  'DCA_Completed' = 'DCA.Completed',
  'DCA_RandomnessGenerationFailed' = 'DCA.RandomnessGenerationFailed',

  'OTC_Placed' = 'OTC.Placed',
  'OTC_Cancelled' = 'OTC.Cancelled',
  'OTC_Filled' = 'OTC.Filled',
  'OTC_PartiallyFilled' = 'OTC.PartiallyFilled',

  'AmmSupport_Swapped' = 'AmmSupport.Swapped',
  'Broadcast_Swapped' = 'Broadcast.Swapped',
}

export type RelayChainInfo = {
  parachainBlockNumber: number;
  relaychainBlockNumber: number;
};

export type LbpPoolCreatedEventParams = {
  pool: string;
  data: PoolData;
};

export type LbpPoolUpdatedEventParams = {
  pool: string;
  data: PoolData;
};

export type TokensTransferEventParams = {
  currencyId: number;
  from: string;
  to: string;
  amount: bigint;
};

export type BalancesTransferEventParams = {
  from: string;
  to: string;
  amount: bigint;
};

export type LbpBuyExecutedEventParams = {
  who: string;
  assetOut: number;
  assetIn: number;
  amount: bigint;
  buyPrice: bigint;
  feeAsset: number;
  feeAmount: bigint;
};

export type LbpSellExecutedEventParams = {
  who: string;
  assetOut: number;
  assetIn: number;
  amount: bigint;
  salePrice: bigint;
  feeAsset: number;
  feeAmount: bigint;
};

export type XykPoolCreatedEventParams = {
  pool: string;
  who: string;
  assetA: number;
  assetB: number;
  initialSharesAmount: bigint;
  shareToken: number;
};

export type XykPoolDestroyedEventParams = {
  pool: string;
  who: string;
  assetA: number;
  assetB: number;
  shareToken: number;
};

export type XykBuyExecutedEventParams = {
  pool: string;
  who: string;
  assetOut: number;
  assetIn: number;
  amount: bigint;
  buyPrice: bigint;
  feeAsset: number;
  feeAmount: bigint;
};

export type XykSellExecutedEventParams = {
  pool: string;
  who: string;
  assetIn: number;
  assetOut: number;
  amount: bigint;
  salePrice: bigint;
  feeAsset: number;
  feeAmount: bigint;
};

export type OmnipoolTokenAddedEventParams = {
  assetId: number;
  initialAmount: bigint;
  initialPrice: bigint;
};

export type OmnipoolTokenRemovedEventParams = {
  assetId: number;
  amount: bigint;
  hubWithdrawn: bigint;
};

export type OmnipoolBuyExecutedEventParams = {
  who: string;
  assetIn: number;
  assetOut: number;
  amountIn: bigint;
  amountOut: bigint;
  hubAmountIn: bigint;
  hubAmountOut: bigint;
  assetFeeAmount: bigint;
  protocolFeeAmount: bigint;
};

export type OmnipoolSellExecutedEventParams = {
  who: string;
  assetIn: number;
  assetOut: number;
  amountIn: bigint;
  amountOut: bigint;
  hubAmountIn: bigint;
  hubAmountOut: bigint;
  assetFeeAmount: bigint;
  protocolFeeAmount: bigint;
};

export type StableswapPoolCreatedEventParams = {
  poolId: number;
  assets: number[];
  amplification: number;
  fee: number;
};

export type StableswapAssetAmount = {
  assetId: number;
  amount: bigint;
};

export type StableswapLiquidityAddedEventParams = {
  poolId: number;
  who: string;
  shares: bigint;
  assets: StableswapAssetAmount[];
};

export type StableswapLiquidityRemovedEventParams = {
  poolId: number;
  who: string;
  shares: bigint;
  amounts: StableswapAssetAmount[];
  fee: bigint;
};

export type StableswapBuyExecutedEventParams = {
  who: string;
  poolId: number;
  assetIn: number;
  assetOut: number;
  amountIn: bigint;
  amountOut: bigint;
  fee: bigint;
};

export type StableswapSellExecutedEventParams = {
  who: string;
  poolId: number;
  assetIn: number;
  assetOut: number;
  amountIn: bigint;
  amountOut: bigint;
  fee: bigint;
};

export type AssetRegistryRegisteredEventParams = {
  assetId: number;
  assetName?: string;
  assetType: AssetType;
  existentialDeposit: bigint;
  xcmRateLimit?: bigint;
  symbol?: string;
  decimals?: number;
  isSufficient: boolean;
};

export type AssetRegistryUpdatedEventParams = {
  assetId: number;
  assetName?: string;
  assetType: AssetType;
  existentialDeposit: bigint;
  xcmRateLimit?: bigint;
  symbol?: string;
  decimals?: number;
  isSufficient: boolean;
};

export type DcaScheduledEventParams = {
  id: number;
  who: string;
};

export type DcaExecutionPlannedEventParams = {
  id: number;
  who: string;
  blockNumber: number;
};

export type DcaTradeExecutedEventParams = {
  id: number;
  who: string;
  amountIn: bigint;
  amountOut: bigint;
};

export type DcaTradeFailedEventParams = {
  id: number;
  who: string;
  error?: DispatchError;
};

export type DcaTerminatedEventParams = {
  id: number;
  who: string;
  error: DispatchError;
};

export type DcaCompletedEventParams = {
  id: number;
  who: string;
};
export type DcaRandomnessGenerationFailedEventParams = {
  block: number;
  error?: DispatchError;
};

export type OtcOrderPlacedEventParams = {
  orderId: number;
  assetIn: number;
  assetOut: number;
  amountIn: bigint;
  amountOut: bigint;
  partiallyFillable: boolean;
};

export type OtcOrderCancelledEventParams = {
  orderId: number;
};

export type OtcOrderFilledEventParams = {
  orderId: number;
  amountIn: bigint;
  amountOut: bigint;
  who: string;
  fee: bigint;
};

export type OtcOrderPartiallyFilledEventParams = OtcOrderFilledEventParams;

export type BroadcastSwappedAssetAmount = {
  assetId: number;
  amount: bigint;
};

export type BroadcastSwappedFee = BroadcastSwappedAssetAmount & {
  destinationType: SwapFeeDestinationType;
  recipientId?: string;
};

export type BroadcastSwappedFillerType = {
  kind: SwapFillerType;
  value: string;
};

export type BroadcastSwappedExecutionType = {
  kind: SwappedExecutionTypeKind;
  value: number | [number, number] | [string, number];
};

export type BroadcastSwappedEventParams = {
  swapper: string;
  filler: string;
  fillerType: BroadcastSwappedFillerType;
  inputs: BroadcastSwappedAssetAmount[];
  outputs: BroadcastSwappedAssetAmount[];
  fees: BroadcastSwappedFee[];
  operation: TradeOperationType;
  operationStack: BroadcastSwappedExecutionType[];
};

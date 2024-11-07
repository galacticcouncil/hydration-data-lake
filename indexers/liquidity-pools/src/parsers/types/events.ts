import { PoolData } from './common';
import { AssetType } from '../../model';

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

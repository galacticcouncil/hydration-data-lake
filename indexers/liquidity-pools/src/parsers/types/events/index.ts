import { DispatchError, PoolData } from '../common';
import {
  AssetType,
  SwapFeeDestinationType,
  SwapFillerType,
  TradeOperationType,
} from '../../../model';
import { SwappedExecutionTypeKind } from '../../../utils/types';
import { sts } from '../../chains/hydration/typegenTypes/support';
import { FixedU128 } from '../../chains/hydration/typegenTypes/v227';

export * from './xyk';
export * from './evm';
export * from './evmAccounts';
export * from './assetRegistry';
export * from './hsm';
export * from './omnipool';
export * from './omnipoolLiquidityMining';
export * from './omnipoolWarehouseLM';

export enum EventName {
  'Balances_Transfer' = 'Balances.Transfer',
  'Tokens_Transfer' = 'Tokens.Transfer',
  'Currencies_Transferred' = 'Currencies.Transferred',

  'AssetRegistry_Registered' = 'AssetRegistry.Registered',
  'AssetRegistry_Updated' = 'AssetRegistry.Updated',
  'AssetRegistry_LocationSet' = 'AssetRegistry.LocationSet',

  'LBP_PoolCreated' = 'LBP.PoolCreated',
  'LBP_PoolUpdated' = 'LBP.PoolUpdated',
  'LBP_BuyExecuted' = 'LBP.BuyExecuted',
  'LBP_SellExecuted' = 'LBP.SellExecuted',

  'XYK_PoolCreated' = 'XYK.PoolCreated',
  'XYK_PoolDestroyed' = 'XYK.Destroyed',
  'XYK_BuyExecuted' = 'XYK.BuyExecuted',
  'XYK_SellExecuted' = 'XYK.SellExecuted',
  'XYK_LiquidityAdded' = 'XYK.LiquidityAdded',
  'XYK_LiquidityRemoved' = 'XYK.LiquidityRemoved',

  'XYKLiquidityMining_GlobalFarmCreated' = 'XYKLiquidityMining.GlobalFarmCreated',
  'XYKLiquidityMining_GlobalFarmUpdated' = 'XYKLiquidityMining.GlobalFarmUpdated',
  'XYKLiquidityMining_GlobalFarmTerminated' = 'XYKLiquidityMining.GlobalFarmTerminated',
  'XYKLiquidityMining_YieldFarmCreated' = 'XYKLiquidityMining.YieldFarmCreated',
  'XYKLiquidityMining_YieldFarmStopped' = 'XYKLiquidityMining.YieldFarmStopped',
  'XYKLiquidityMining_YieldFarmTerminated' = 'XYKLiquidityMining.YieldFarmTerminated',
  'XYKLiquidityMining_YieldFarmResumed' = 'XYKLiquidityMining.YieldFarmResumed',
  'XYKLiquidityMining_YieldFarmUpdated' = 'XYKLiquidityMining.YieldFarmUpdated',
  'XYKLiquidityMining_SharesDeposited' = 'XYKLiquidityMining.SharesDeposited',
  'XYKLiquidityMining_SharesRedeposited' = 'XYKLiquidityMining.SharesRedeposited',
  'XYKLiquidityMining_SharesWithdrawn' = 'XYKLiquidityMining.SharesWithdrawn',
  'XYKLiquidityMining_DepositDestroyed' = 'XYKLiquidityMining.DepositDestroyed',
  'XYKLiquidityMining_RewardClaimed' = 'XYKLiquidityMining.RewardClaimed',

  'Omnipool_TokenAdded' = 'Omnipool.TokenAdded',
  'Omnipool_TokenRemoved' = 'Omnipool.TokenRemoved',
  'Omnipool_BuyExecuted' = 'Omnipool.BuyExecuted',
  'Omnipool_SellExecuted' = 'Omnipool.SellExecuted',
  'Omnipool_LiquidityAdded' = 'Omnipool.LiquidityAdded',
  'Omnipool_LiquidityRemoved' = 'Omnipool.LiquidityRemoved',
  'Omnipool_PositionCreated' = 'Omnipool.PositionCreated',
  'Omnipool_PositionDestroyed' = 'Omnipool.PositionDestroyed',
  'Omnipool_PositionUpdated' = 'Omnipool.PositionUpdated',

  'OmnipoolLiquidityMining_GlobalFarmCreated' = 'OmnipoolLiquidityMining.GlobalFarmCreated',
  'OmnipoolLiquidityMining_GlobalFarmUpdated' = 'OmnipoolLiquidityMining.GlobalFarmUpdated',
  'OmnipoolLiquidityMining_GlobalFarmTerminated' = 'OmnipoolLiquidityMining.GlobalFarmTerminated',
  'OmnipoolLiquidityMining_YieldFarmCreated' = 'OmnipoolLiquidityMining.YieldFarmCreated',
  'OmnipoolLiquidityMining_YieldFarmStopped' = 'OmnipoolLiquidityMining.YieldFarmStopped',
  'OmnipoolLiquidityMining_YieldFarmResumed' = 'OmnipoolLiquidityMining.YieldFarmResumed',
  'OmnipoolLiquidityMining_YieldFarmUpdated' = 'OmnipoolLiquidityMining.YieldFarmUpdated',
  'OmnipoolLiquidityMining_YieldFarmTerminated' = 'OmnipoolLiquidityMining.YieldFarmTerminated',
  'OmnipoolLiquidityMining_SharesDeposited' = 'OmnipoolLiquidityMining.SharesDeposited',
  'OmnipoolLiquidityMining_SharesRedeposited' = 'OmnipoolLiquidityMining.SharesRedeposited',
  'OmnipoolLiquidityMining_RewardClaimed' = 'OmnipoolLiquidityMining.RewardClaimed',
  'OmnipoolLiquidityMining_SharesWithdrawn' = 'OmnipoolLiquidityMining.SharesWithdrawn',
  'OmnipoolLiquidityMining_DepositDestroyed' = 'OmnipoolLiquidityMining.DepositDestroyed',

  'OmnipoolWarehouseLM_GlobalFarmAccRPZUpdated' = 'OmnipoolWarehouseLM.GlobalFarmAccRPZUpdated',
  'OmnipoolWarehouseLM_YieldFarmAccRPVSUpdated' = 'OmnipoolWarehouseLM.YieldFarmAccRPVSUpdated',
  'OmnipoolWarehouseLM_AllRewardsDistributed' = 'OmnipoolWarehouseLM.AllRewardsDistributed',

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
  'Broadcast_Swapped2' = 'Broadcast.Swapped2',
  'Broadcast_Swapped3' = 'Broadcast.Swapped3',

  'EVM_Log' = 'EVM.Log',
  'EVMAccounts_Bound' = 'EVMAccounts.Bound',

  'HSM_CollateralAdded' = 'HSM.CollateralAdded',
  'HSM_CollateralRemoved' = 'HSM.CollateralRemoved',
  'HSM_CollateralUpdated' = 'HSM.CollateralUpdated',
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

export type CurrenciesTransferredEventParams = {
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

export type BroadcastSwapped2EventParams = {
  swapper: string;
  filler: string;
  fillerType: BroadcastSwappedFillerType;
  inputs: BroadcastSwappedAssetAmount[];
  outputs: BroadcastSwappedAssetAmount[];
  fees: BroadcastSwappedFee[];
  operation: TradeOperationType;
  operationStack: BroadcastSwappedExecutionType[];
};

export type BroadcastSwapped3EventParams = BroadcastSwapped2EventParams;

export type LiquidityMiningAssetPair = {
  assetIn: number;
  assetOut: number;
};

export type LiquidityMiningLoyaltyCurve = {
  initialRewardPercentage: bigint;
  scaleCoef: number;
};

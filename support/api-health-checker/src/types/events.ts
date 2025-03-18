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
  'BestBlock' = 'BestBlock',
  MoneyMarket_Transfer = 'MoneyMarket.Transfer',
  MoneyMarket_Supply = 'MoneyMarket.Supply',
  MoneyMarket_Withdraw = 'MoneyMarket.Withdraw',
  MoneyMarket_Borrow = 'MoneyMarket.Borrow',
  MoneyMarket_Repay = 'MoneyMarket.Repay',
  MoneyMarket_UserEModeSet = 'MoneyMarket.UserEModeSet',
  MoneyMarket_LiquidationCall = 'MoneyMarket.LiquidationCall',
  MoneyMarket_ReserveUsedAsCollateralEnabled = 'MoneyMarket.ReserveUsedAsCollateralEnabled',
  MoneyMarket_ReserveUsedAsCollateralDisabled = 'MoneyMarket.ReserveUsedAsCollateralDisabled',
}

export enum SwapFeeDestinationType {
  Account = 'Account',
  Burned = 'Burned',
}

export enum SwapFillerType {
  Omnipool = 'Omnipool',
  Stableswap = 'Stableswap',
  XYK = 'XYK',
  LBP = 'LBP',
  OTC = 'OTC',
}

export enum SwappedExecutionTypeKind {
  Batch = 'Batch',
  DCA = 'DCA',
  Omnipool = 'Omnipool',
  Router = 'Router',
  Xcm = 'Xcm',
  XcmExchange = 'XcmExchange',
}

export enum TradeOperationType {
  ExactIn = 'ExactIn',
  ExactOut = 'ExactOut',
  ExactLimitIn = 'ExactLimitIn',
  ExactLimitOut = 'ExactLimitOut',
  LiquidityAdd = 'LiquidityAdd',
  LiquidityRemove = 'LiquidityRemove',
}

export type BroadcastSwappedAssetAmount = {
  assetId: number;
  amount: string;
};

export type BroadcastSwappedFee = BroadcastSwappedAssetAmount & {
  destinationType: SwapFeeDestinationType;
  recipientId?: string;
};

export type BroadcastSwappedFillerType = {
  kind: SwapFillerType;
  value: string;
};

export type BroadcastSwappedExecutionTypeValue =
  | number
  | [number, number]
  | [string, number];

export type BroadcastSwappedExecutionType = {
  kind: SwappedExecutionTypeKind;
  value: BroadcastSwappedExecutionTypeValue;
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

export type BestBlock = {
  height: number;
  hash: string;
};

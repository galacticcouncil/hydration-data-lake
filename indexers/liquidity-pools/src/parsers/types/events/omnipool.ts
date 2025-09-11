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

export type OmnipoolLiquidityAddedEventParams = {
  who: string;
  assetId: number;
  amount: bigint;
  positionId: bigint;
};

export type OmnipoolLiquidityRemovedEventParams = {
  who: string;
  assetId: number;
  sharesRemoved: bigint;
  positionId: bigint;
  fee?: bigint;
};

export type OmnipoolPositionCreatedEventParams = {
  positionId: bigint;
  owner: string;
  asset: number;
  amount: bigint;
  shares: bigint;
  price: bigint;
};

export type OmnipoolPositionDestroyedEventParams = {
  positionId: bigint;
  owner: string;
};

export type OmnipoolPositionUpdatedEventParams = {
  positionId: bigint;
  owner: string;
  asset: number;
  amount: bigint;
  shares: bigint;
  price: bigint;
};

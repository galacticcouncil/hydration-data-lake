import * as v183 from '../../chains/hydration/typegenTypes/v183';
import { sts } from '../../chains/hydration/typegenTypes/support';

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

export type XykLiquidityAddedEventParams = {
  who: string;
  assetA: number;
  assetB: number;
  amountA: bigint;
  amountB: bigint;
};

export type XykLiquidityRemovedEventParams = {
  who: string;
  assetA: number;
  assetB: number;
  shares: bigint;
};

import { DcaScheduleOrderType, SwapFillerType } from '../../model';

export type LbpCreatePoolCallArgs = {
  poolOwner: string;
  assetA: number;
  assetAAmount: bigint;
  assetB: number;
  assetBAmount: bigint;
  initialWeight: number;
  finalWeight: number;
  // weightCurve: v176.WeightCurveType,
  fee: [number, number];
  feeCollector: string;
  repayTarget: bigint;
};

export type XykCreatePoolCallArgs = {
  assetA: number;
  amountA: bigint;
  assetB: number;
  amountB: bigint;
};

export type RelaySystemSetValidationDataCallArgs = {
  relayParentNumber: number;
};

export type DcaScheduleOrderRouteData = {
  poolKind: SwapFillerType;
  assetInId: number;
  assetOutId: number;
};

export type DcaScheduleOrderData = {
  kind: DcaScheduleOrderType;
  assetInId: number;
  assetOutId: number;
  amountOut?: bigint | null;
  amountIn?: bigint | null;
  maxAmountIn?: bigint | null;
  minAmountOut?: bigint | null;
  routes: DcaScheduleOrderRouteData[];
};

export type DcaScheduleCallData = {
  owner: string;
  period?: number;
  totalAmount: bigint;
  slippage?: number;
  maxRetries?: number;
  stabilityThreshold?: number;
  order: DcaScheduleOrderData;
};

export type DcaScheduleCallArgs = {
  startExecutionBlock?: number;
  scheduleData: DcaScheduleCallData;
};

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

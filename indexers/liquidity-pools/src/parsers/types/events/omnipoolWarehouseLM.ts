export type OmnipoolWarehouseLMGlobalFarmAccRPZUpdatedEventParams = {
  globalFarmId: number;
  accumulatedRpz: bigint;
  totalSharesZ: bigint;
};

export type OmnipoolWarehouseLMYieldFarmAccRPVSUpdatedEventParams = {
  globalFarmId: number;
  yieldFarmId: number;
  accumulatedRpvs: bigint;
  totalValuedShares: bigint;
};
export type OmnipoolWarehouseLMAllRewardsDistributedEventParams = {
  globalFarmId: number;
};

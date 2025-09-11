import { LiquidityMiningLoyaltyCurve } from './index';

export type OmnipoolLMGlobalFarmCreatedEventParams = {
  id: number;
  owner: string;
  totalRewards: bigint;
  rewardCurrency: number;
  yieldPerPeriod: bigint;
  plannedYieldingPeriods: number;
  blocksPerPeriod: number;
  maxRewardPerPeriod: bigint;
  minDeposit: bigint;
  lrnaPriceAdjustment: bigint;
};

export type OmnipoolLMGlobalFarmUpdatedEventParams = {
  id: number;
  lrnaPriceAdjustment?: bigint;
  plannedYieldingPeriods?: number;
  yieldPerPeriod?: bigint;
  minDeposit?: bigint;
};

export type OmnipoolLMGlobalFarmTerminatedEventParams = {
  globalFarmId: number;
  who: string;
  rewardCurrency: number;
  undistributedRewards: bigint;
};

export type OmnipoolLMYieldFarmCreatedEventParams = {
  globalFarmId: number;
  yieldFarmId: number;
  assetId: number;
  multiplier: bigint;
  loyaltyCurve?: LiquidityMiningLoyaltyCurve;
};

export type OmnipoolLMYieldFarmStoppedEventParams = {
  globalFarmId: number;
  yieldFarmId: number;
  assetId: number;
  who: string;
};

export type OmnipoolLMYieldFarmResumedEventParams = {
  globalFarmId: number;
  yieldFarmId: number;
  assetId: number;
  who: string;
  multiplier: bigint;
};

export type OmnipoolLMYieldFarmUpdatedEventParams = {
  globalFarmId: number;
  yieldFarmId: number;
  assetId: number;
  who: string;
  multiplier: bigint;
};

export type OmnipoolLMYieldFarmTerminatedEventParams = {
  globalFarmId: number;
  yieldFarmId: number;
  assetId: number;
  who: string;
};

export type OmnipoolLMSharesDepositedEventParams = {
  globalFarmId: number;
  yieldFarmId: number;
  depositId: bigint;
  assetId: number;
  who: string;
  sharesAmount: bigint;
  positionId: bigint;
};

export type OmnipoolLMSharesRedepositedEventParams = {
  globalFarmId: number;
  yieldFarmId: number;
  depositId: bigint;
  assetId: number;
  who: string;
  sharesAmount: bigint;
  positionId: bigint;
};

export type OmnipoolLMRewardClaimedEventParams = {
  globalFarmId: number;
  yieldFarmId: number;
  who: string;
  claimed: bigint;
  rewardCurrency: number;
  depositId: bigint;
};

export type OmnipoolLMSharesWithdrawnEventParams = {
  globalFarmId: number;
  yieldFarmId: number;
  who: string;
  amount: bigint;
  depositId: bigint;
};

export type OmnipoolLMDepositDestroyedEventParams = {
  who: string;
  depositId: bigint;
};

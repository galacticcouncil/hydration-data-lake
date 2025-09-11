import { LiquidityMiningAssetPair, LiquidityMiningLoyaltyCurve } from './index';

export type XykLMGlobalFarmCreatedEventParams = {
  id: number;
  owner: string;
  totalRewards: bigint;
  rewardCurrency: number;
  yieldPerPeriod: bigint;
  plannedYieldingPeriods: number;
  blocksPerPeriod: number;
  incentivizedAsset: number;
  maxRewardPerPeriod: bigint;
  minDeposit: bigint;
  priceAdjustment: bigint;
};

export type XykLMGlobalFarmUpdatedEventParams = {
  id: number;
  priceAdjustment: bigint;
};

export type XykLMGlobalFarmTerminatedEventParams = {
  globalFarmId: number;
  who: string;
  rewardCurrency: number;
  undistributedRewards: bigint;
};

export type XykLMYieldFarmCreatedEventParams = {
  globalFarmId: number;
  yieldFarmId: number;
  multiplier: bigint;
  assetPair: LiquidityMiningAssetPair;
  loyaltyCurve?: LiquidityMiningLoyaltyCurve;
};

export type XykLMYieldFarmStoppedEventParams = {
  globalFarmId: number;
  yieldFarmId: number;
  who: string;
  assetPair: LiquidityMiningAssetPair;
};

export type XykLMYieldFarmTerminatedEventParams = {
  globalFarmId: number;
  yieldFarmId: number;
  who: string;
  assetPair: LiquidityMiningAssetPair;
};

export type XykLMYieldFarmResumedEventParams = {
  globalFarmId: number;
  yieldFarmId: number;
  who: string;
  assetPair: LiquidityMiningAssetPair;
  multiplier: bigint;
};

export type XykLMYieldFarmUpdatedEventParams = {
  globalFarmId: number;
  yieldFarmId: number;
  who: string;
  assetPair: LiquidityMiningAssetPair;
  multiplier: bigint;
};

export type XykLMSharesDepositedEventParams = {
  globalFarmId: number;
  yieldFarmId: number;
  who: string;
  amount: bigint;
  lpToken: number;
  depositId: bigint;
};

export type XykLMSharesRedepositedEventParams = {
  globalFarmId: number;
  yieldFarmId: number;
  who: string;
  amount: bigint;
  lpToken: number;
  depositId: bigint;
};

export type XykLMSharesWithdrawnEventParams = {
  globalFarmId: number;
  yieldFarmId: number;
  who: string;
  lpToken: number;
  amount: bigint;
  depositId: bigint;
};

export type XykLMDepositDestroyedEventParams = {
  who: string;
  depositId: bigint;
};

export type XykLMRewardClaimedEventParams = {
  globalFarmId: number;
  yieldFarmId: number;
  who: string;
  claimed: bigint;
  rewardCurrency: number;
  depositId: bigint;
};

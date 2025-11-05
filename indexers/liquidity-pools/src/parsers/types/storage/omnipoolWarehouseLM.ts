import { OmnipoolAssetTradability } from './index';
import { BlockHeader } from '@subsquid/substrate-processor';
import { FarmState } from '../../../model';

/**
 * =============================================================================
 * =========================== I N P U T    T Y P E S ==========================
 * =============================================================================
 */
export type OmnipoolLMGetGlobalFarmsInput = {
  block: BlockHeader;
  farmIds: Array<string | number>;
};

/**
 * =============================================================================
 * ============================= D A T A    T Y P E S ==========================
 * =============================================================================
 */

export interface OmnipoolLMGlobalFarmData {
  id: number;
  owner: string;
  updatedAt: number;
  totalSharesZ: bigint;
  accumulatedRpz: bigint;
  rewardCurrency: number;
  pendingRewards: bigint;
  accumulatedPaidRewards: bigint;
  yieldPerPeriod: bigint;
  plannedYieldingPeriods: number;
  blocksPerPeriod: number;
  incentivizedAsset: number;
  maxRewardPerPeriod: bigint;
  minDeposit: bigint;
  liveYieldFarmsCount: number;
  totalYieldFarmsCount: number;
  priceAdjustment: bigint;
  state: FarmState;
}
export interface OmnipoolLMGlobalFarmDataWithId {
  farmId: number;
  data: OmnipoolLMGlobalFarmData | null;
}

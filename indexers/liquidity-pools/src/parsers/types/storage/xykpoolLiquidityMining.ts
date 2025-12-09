/**
 * =============================================================================
 * =========================== I N P U T    T Y P E S ==========================
 * =============================================================================
 */
import { BlockHeader } from '@subsquid/substrate-processor';
import {
  AccountId32,
  FixedU128,
  Type_587,
} from '../../chains/hydration/typegenTypes/v227';

export type XykpoolLMGetDepositsInput = {
  depositIds: string[];
  block: BlockHeader;
};
/**
 * =============================================================================
 * ============================= D A T A    T Y P E S ==========================
 * =============================================================================
 */

export interface XykpoolLMDepositEntryData {
  globalFarmId: number;
  yieldFarmId: number;
  valuedShares: bigint;
  accumulatedRpvs: bigint;
  accumulatedClaimedRewards: bigint;
  enteredAt: number;
  updatedAt: number;
  stoppedAtCreation: number;
}

export interface XykpoolLMDepositData {
  shares: bigint;
  ammPoolId: string;
  yieldFarmEntries: XykpoolLMDepositEntryData[];
}

export interface XykpoolLMDepositDataWithId {
  depositId: string;
  data: XykpoolLMDepositData | null;
}

export interface XykpoolNftCollectionId {
  collectionId: string;
}

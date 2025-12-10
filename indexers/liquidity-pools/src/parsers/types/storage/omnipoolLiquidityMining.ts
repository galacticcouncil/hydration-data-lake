import { BlockHeader } from '@subsquid/substrate-processor';

/**
 * =============================================================================
 * =========================== I N P U T    T Y P E S ==========================
 * =============================================================================
 */
export type OmnipoolLiquidityMiningGetOmniPositionIdInput = {
  depositId: string;
  block: BlockHeader;
};

/**
 * =============================================================================
 * ============================= D A T A    T Y P E S ==========================
 * =============================================================================
 */

export interface OmnipoolLiquidyMiningNftCollectionId {
  collectionId: string;
}
export interface OmnipoolLiquidityMiningOmniPositionId {
  positionId: string;
}

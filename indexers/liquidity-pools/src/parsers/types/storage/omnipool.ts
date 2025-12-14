/**
 * =============================================================================
 * =========================== I N P U T    T Y P E S ==========================
 * =============================================================================
 */
import { BlockHeader } from '@subsquid/substrate-processor';

export type OmnipoolGetPoolDataInput = {
  poolAddress: string;
  block: BlockHeader;
};

export type OmnipoolGetAssetDataInput = {
  assetId: number;
  block: BlockHeader;
};
export type OmnipoolGetAllAssetIdsInput = {
  block: BlockHeader;
};
export type OmnipoolGetHubAssetTradabilityInput = {
  block: BlockHeader;
};

export type OmnipoolGetLiquidityPositionsInput = {
  block: BlockHeader;
  positionIds: string[];
};
/**
 * =============================================================================
 * ============================= D A T A    T Y P E S ==========================
 * =============================================================================
 */

export type OmnipoolAssetTradability = {
  bits: number;
};

export interface OmnipoolConstants {
  burnProtocolFee: number | null;
  hdxAssetId: number | null;
  hubAssetId: number | null;
  maxInRatio: bigint | null;
  maxOutRatio: bigint | null;
  minPoolLiquidity: bigint | null;
  minTradingLimit: bigint | null;
  minWithdrawalFee: number | null;
}

export interface OmnipoolNftCollectionId {
  collectionId: string;
}

export interface OmnipoolData extends OmnipoolConstants {
  poolAddress: string;
}

export interface OmnipoolAssetData {
  hubReserve: bigint;
  shares: bigint;
  protocolShares: bigint;
  cap: bigint;
  tradable: OmnipoolAssetTradability;
}

export interface OmnipoolLiquidityPositionData {
  assetId: number;
  amount: bigint;
  shares: bigint;
  price: bigint;
}

export interface OmnipoolLiquidityPositionDataWithId {
  positionId: string;
  data: OmnipoolLiquidityPositionData | null;
}

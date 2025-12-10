import { BlockHeader } from '@subsquid/substrate-processor';
import { AccountId32 } from '../../chains/hydration/typegenTypes/v115';

/**
 * =============================================================================
 * =========================== I N P U T    T Y P E S ==========================
 * =============================================================================
 */
export type UniquesGetAssetsDataInput = {
  collectionId: string;
  assetIds: string[];
  block: BlockHeader;
};
export type UniquesGetAllAssetsDataInput = {
  collectionId: string;
  block: BlockHeader;
};

/**
 * =============================================================================
 * ============================= D A T A    T Y P E S ==========================
 * =============================================================================
 */

export type UniquesAssetData = {
  owner: string;
  approved: string | null;
  isFrozen: boolean;
  deposit: bigint;
};

export type UniquesAssetDataWithId = {
  collectionId: string;
  assetId: string;
  data: UniquesAssetData | null;
};

import { AccountBalances, AssetType } from '../../model';
import { BlockHeader } from '@subsquid/substrate-processor';

export interface AccountData {
  free: bigint;
  reserved: bigint;
  miscFrozen: bigint;
  feeFrozen: bigint;
  flags: bigint;
  frozen: bigint;
}

export interface SystemAccountInfo {
  nonce: number;
  consumers: number;
  providers: number;
  sufficients: number;
  data: AccountData;
}
export type ParachainSystemLastRelayChainBlockNumber = number;

export interface TokensAccountsAssetBalances {
  free: bigint;
  reserved: bigint;
  frozen: bigint;
}

export type OmnipoolAssetTradability = {
  bits: number;
};

export interface OmnipoolAssetState {
  hubReserve: bigint;
  shares: bigint;
  protocolShares: bigint;
  cap: bigint;
  tradable: OmnipoolAssetTradability;
}

export interface XykPoolWithAssets {
  poolAddress: string;
  assetAId: number;
  assetBId: number;
}

export type LbpWeightCurveType = {
  __kind: string;
};

export interface LbpPoolData {
  poolAddress: string;
  owner: string;
  start?: number;
  end?: number;
  assetAId: number;
  assetBId: number;
  initialWeight: number;
  finalWeight: number;
  weightCurve: LbpWeightCurveType;
  fee: number[];
  feeCollector: string;
  repayTarget: bigint;
}

export interface PoolAssetBalances {
  poolAddress: string;
  assetId: number;
  balances: AccountBalances;
}

export interface OmnipoolAssetWithDetails {
  assetId: number;
  assetState: OmnipoolAssetState;
}

export interface StablepoolWithDetails {
  poolId: number;
  poolAddress?: string;
  assetIds: number[];
  initialAmplification: number;
  finalAmplification: number;
  initialBlock: number;
  finalBlock: number;
  fee: number;
}

export interface AssetDetails {
  assetType: AssetType;
  existentialDeposit: bigint;
  isSufficient: boolean;
  name?: string;
  symbol?: string;
  decimals?: number;
  xcmRateLimit?: bigint;
}

export type AssetDetailsWithId = {
  assetId: number;
  data: AssetDetails | null;
};

export type AccountDataMultiple = Array<{
  assetId: number;
  data: AccountData;
}>;

/**
 * =============================================================================
 * =========================== I N P U T    T Y P E S===========================
 * =============================================================================
 */

export type GetAssetBalancesInput = {
  address: string;
  assetId: number;
  block: BlockHeader;
};

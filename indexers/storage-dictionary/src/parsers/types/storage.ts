import { AccountBalances, AssetType, EmaOraclePeriod } from '../../model';
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

export interface TokenTotalIssuance {
  tokenId: string;
  amount: bigint | null;
}

export interface BondDetails {
  bondId: number;
  underlyingAsset: number;
  maturity: bigint;
}

export type DynamicFeesParams = {
  minFee: number;
  maxFee: number;
  decay: bigint;
  amplification: bigint;
};

export interface DynamicFeesConstants {
  assetFeeParameters: DynamicFeesParams | null;
  protocolFeeParameters: DynamicFeesParams | null;
}

export type EmaOracleEntryPriceRatio = {
  n: bigint;
  d: bigint;
};
export type EmaOracleEntryVolume = {
  aIn: bigint;
  bOut: bigint;
  aOut: bigint;
  bIn: bigint;
};
export type EmaOracleEntryLiquidity = {
  a: bigint;
  b: bigint;
};

export interface EmaOracleEntryData {
  source: string;
  assetIds: number[];
  period: EmaOraclePeriod;
  price: EmaOracleEntryPriceRatio;
  volume: EmaOracleEntryVolume;
  liquidity: EmaOracleEntryLiquidity;
  updatedAt: number;
}

export interface AssetDynamicFeeData {
  assetId: number;
  assetFee: number;
  protocolFee: number;
  timestamp: number;
}

export interface StablepoolAssetState {
  tradable: OmnipoolAssetTradability;
}

export type StableswapPegSource = {
  sourceKind: 'Oracle' | 'Value';
  oracleName?: string;
  oraclePeriod?: EmaOraclePeriod;
  oracleAsset?: number;
  valuePoints?: [bigint, bigint];
};

export interface StablepoolPoolPegsInfo {
  source: StableswapPegSource[];
  maxPegUpdate: number;
  current: [bigint, bigint][];
}

export interface StablepoolPoolPegsInfoWithPoolId
  extends StablepoolPoolPegsInfo {
  poolId: number;
}

export interface XykPoolShareTokenPair {
  poolId: string;
  shareTokenId: number;
}

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

export type TokensGetTokenTotalIssuanceInput = {
  tokenId: number;
  block: BlockHeader;
};

export type TokensGetTokensTotalIssuanceInput = {
  tokenIds: Array<number | string>;
  block: BlockHeader;
};

export type GetEmaOraclesInput = {
  block: BlockHeader;
};

export type GetAssetsDynamicFeesAllInput = {
  block: BlockHeader;
};

export type GetBondByIdInput = {
  bondId: number;
  block: BlockHeader;
};

export type GetBondsAllInput = {
  block: BlockHeader;
};

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

export type GetPoolAssetInfoInput = {
  poolId?: number;
  poolAddress?: string;
  assetId: number;
  block: BlockHeader;
};

export type StablepoolGetAllPoolIdsInput = {
  block: BlockHeader;
};

export type StablepoolGetPoolPegsInput = {
  poolId: number;
  block: BlockHeader;
};

export type XykGetPoolShareTokenPairsManyInput = {
  block: BlockHeader;
};

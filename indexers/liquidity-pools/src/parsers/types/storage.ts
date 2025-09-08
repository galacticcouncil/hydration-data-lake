import { AssetType, EmaOraclePeriod } from '../../model';
import { BlockHeader } from '@subsquid/substrate-processor';
import { DcaScheduleCallData } from './calls';
import { OtcOrderPlacedEventParams } from './events';
import { Bytes, sts } from '../chains/hydration/typegenTypes/support';
import { AccountId32 } from '../chains/hydration/typegenTypes/v138';
import {
  assetFeeParameters,
  protocolFeeParameters,
} from '../chains/hydration/typegenTypes/dynamic-fees/constants';
import {
  FixedU128,
  Liquidity,
  Permill,
  Ratio,
  Volume,
} from '../chains/hydration/typegenTypes/v170';
import { OraclePeriod, PegSource } from '../chains/hydration/typegenTypes/v305';
import { Perbill } from '../chains/hydration-paseo-next/typegenTypes/v324';

export interface AccountData {
  free: bigint;
  reserved: bigint;
  frozen?: bigint;
  miscFrozen: bigint;
  feeFrozen: bigint;
  flags: bigint;
}

export interface SystemAccountInfo {
  nonce: number;
  consumers: number;
  providers: number;
  sufficients: number;
  data: AccountData;
}

export interface BalancesAccountInfoWithAccountId {
  accountId: string;
  data: AccountData;
}

export interface TokenAccountBalanceWithAssetId {
  assetId: string;
  data: AccountData;
}

export interface TokenAccountBalancesWithAccountId {
  accountId: string;
  assetBalances: TokenAccountBalanceWithAssetId[];
}

export type ParachainSystemLastRelayChainBlockNumber = number;

export interface TokensAccountsAssetBalances {
  free: bigint;
  reserved: bigint;
  frozen: bigint;
}

export interface TokenTotalIssuance {
  tokenId: string;
  amount: bigint | null;
}

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

export interface StablepoolStorageData {
  assets: number[];
  initialAmplification: number;
  finalAmplification: number;
  initialBlock: number;
  finalBlock: number;
  fee: number;
}

export interface StableswapConstants {
  minTradingLimit: bigint | null;
  amplificationRange: number[] | null;
  minPoolLiquidity: bigint | null;
}

export interface StablepoolInfo extends StablepoolStorageData {}

export interface StablepoolAllPoolsInfoWithPoolId {
  poolId: number;
  data: StablepoolInfo;
}

export interface StablepoolAssetState {
  tradable: OmnipoolAssetTradability;
}

export type StableswapPegSource = {
  sourceKind: 'Oracle' | 'Value' | 'MMOracle';
  oracleName?: string;
  oraclePeriod?: EmaOraclePeriod;
  oracleAsset?: number;
  valuePoints?: [bigint, bigint];
};

export interface StablepoolPoolPegsInfo {
  source: StableswapPegSource[];
  maxPegUpdate?: number;
  current: [bigint, bigint][];
}

export interface StablepoolManyPoolsPegsInfoWithPoolId {
  poolId: number;
  data: StablepoolPoolPegsInfo;
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

export interface Erc20AssetContractDetails {
  address: string;
}

export type AssetDetailsWithId = {
  assetId: number;
  data: AssetDetails | null;
};

export type AssetExistentialDeposit = {
  assetId: string;
  existentialDeposit: bigint;
};

export interface XykPoolAssetIds {
  poolAddress: string;
  assetAId: number;
  assetBId: number;
}

export interface XykConstants {
  exchangeFee: number[] | null;
  maxInRatio: bigint | null;
  maxOutRatio: bigint | null;
  minPoolLiquidity: bigint | null;
  minTradingLimit: bigint | null;
  nativeAssetId: number | null;
  oracleSource: string | null;
}

export interface XykPoolData extends XykPoolAssetIds {}

export interface XykPoolShareTokenPair {
  poolId: string;
  shareTokenId: number;
}

export type LbpWeightCurveType = {
  __kind: string;
};

export interface LbpPoolStorageData {
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

export interface LbpConstants {
  repayFee: number[] | null;
  maxInRatio: bigint | null;
  maxOutRatio: bigint | null;
  minPoolLiquidity: bigint | null;
  minTradingLimit: bigint | null;
}

export interface LbpPoolData extends LbpPoolStorageData {}

export type AccountDataMultiple = Array<{
  assetId: number;
  data: AccountData;
}>;

export type DcaScheduleData = DcaScheduleCallData;

export type OtcOrderData = {
  owner: string;
  assetIn: number;
  assetOut: number;
  amountIn: bigint;
  amountOut: bigint;
  partiallyFillable: boolean;
};

export type EvmAccountsAccountExtension = string;

export type EvmAccountsAccountExtensionWithEvmAddress = {
  h160Address: string;
  extension: EvmAccountsAccountExtension;
};

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
  numerator: bigint;
  denominator: bigint;
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

export interface BondDetails {
  bondId: number;
  underlyingAsset: number;
  maturity: bigint;
}

export interface MmAggregatorDictionaryData {
  id: string;
  address: string;
  price: string;
  decimals: number;
  updatedAt: number;
  paraBlockHeight: number;
}

export interface HsmCollateralData {
  collateralAssetId: number;
  poolId: number;
  purchaseFee: number;
  maxBuyPriceCoefficient: bigint;
  buybackRate: number;
  buyBackFee: number;
  maxInHolding?: bigint;
}

export interface TransactionPaymentNextFeeMultiplier {
  nextFeeMultiplier: bigint;
}

/**
 * =============================================================================
 * =========================== I N P U T    T Y P E S===========================
 * =============================================================================
 */

export type GetDataAtBlockInput = {
  block: BlockHeader;
};

export type GetConstantsInput = {
  block: BlockHeader;
};

export type StablepoolGetPoolDataInput = {
  poolId: number;
  block: BlockHeader;
};

export type StablepoolGetAllPoolIdsInput = {
  block: BlockHeader;
};

export type StablepoolGetPoolPegsInput = {
  poolId: number;
  block: BlockHeader;
};

export type GetPoolAssetInfoInput = {
  poolId?: number;
  poolAddress?: string;
  assetId: number;
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

export type XykGetPoolDataInput = {
  poolAddress: string;
  block: BlockHeader;
};

export type XykGetAssetsInput = {
  poolAddress: string;
  block: BlockHeader;
};

export type XykGetShareTokenInput = {
  poolAddress: string;
  block: BlockHeader;
};

export type XykGetPoolShareTokenPairsManyInput = {
  block: BlockHeader;
};

export type LbpGetPoolDataInput = {
  poolAddress: string;
  block: BlockHeader;
};

export type LbpGetAllPoolsDataInput = {
  block: BlockHeader;
};

export type LbpGetAllPoolIdsInput = {
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

export type DcaGetScheduleInput = {
  scheduleId: number;
  block: BlockHeader;
};
export type OtcGetOrderInput = {
  orderId: number;
  block: BlockHeader;
};

export type EvmAccountsGetAccountExtensionInput = {
  evmAddress: string;
  block: BlockHeader;
};

export type EvmAccountsGetAccountExtensionManyInput = {
  evmAddresses: string[];
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

export type GetNativeTokenBalanceManyInput = {
  accountIds: string[];
  block: BlockHeader;
};

export type GetTokenBalancesManyInput = {
  accountIds: string[];
  block: BlockHeader;
};

export type GetHsmCollateralInput = {
  collateralId: string;
  block: BlockHeader;
};


export type GetAccountMmPositionDataInput = {
  accountId: string;
  block: BlockHeader;
};

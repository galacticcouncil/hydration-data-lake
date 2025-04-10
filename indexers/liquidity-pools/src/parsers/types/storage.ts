import { AssetType } from '../../model';
import { BlockHeader } from '@subsquid/substrate-processor';
import { DcaScheduleCallData } from './calls';
import { OtcOrderPlacedEventParams } from './events';
import { sts } from '../chains/hydration/typegenTypes/support';
import { AccountId32 } from '../chains/hydration/typegenTypes/v138';

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

export interface OmnipoolData {
  burnProtocolFee: number;
  hdxAssetId: number;
  hubAssetId: number;
  maxInRatio: bigint;
  maxOutRatio: bigint;
  minPoolLiquidity: bigint;
  minTradingLimit: bigint;
  minWithdrawalFee: bigint;
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

export interface StablepoolInfo extends StablepoolStorageData {
  maxInRatio: bigint;
  maxOutRatio: bigint;
  minTradingLimit: bigint;
  amplificationRange: number[];
  minPoolLiquidity: bigint;
}

export interface StablepoolAssetState {
  tradable: OmnipoolAssetTradability;
  peg: string[];
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

export interface XykPoolAssetIds {
  poolAddress: string;
  assetAId: number;
  assetBId: number;
}
export interface XykPoolData extends XykPoolAssetIds {
  exchangeFee: number[];
  maxInRatio: bigint;
  maxOutRatio: bigint;
  minPoolLiquidity: bigint;
  minTradingLimit: bigint;
  nativeAssetId: number;
  oracleSource: string;
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

export interface LbpPoolConstants {
  repayFee: number[];
  maxInRatio: bigint;
  maxOutRatio: bigint;
  minPoolLiquidity: bigint;
  minTradingLimit: bigint;
}

export interface LbpPoolData extends LbpPoolStorageData, LbpPoolConstants {}

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

/**
 * =============================================================================
 * =========================== I N P U T    T Y P E S===========================
 * =============================================================================
 */

export type StablepoolGetPoolDataInput = {
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

export type LbpGetPoolDataInput = {
  poolAddress: string;
  block: BlockHeader;
};

export type LbpGetAllPoolsDataInput = {
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

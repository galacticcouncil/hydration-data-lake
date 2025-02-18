import { Result } from 'ethers';
import { EvmEventName } from '../../../model';

export type EvmLogEventParams = {
  eventName: EvmEventName;
  address: string;
  signature: string;
  args: Result;
};

export type MmEventParamsWithEventName = {
  eventName: EvmEventName;
};

export type MmTransferEventParams = MmEventParamsWithEventName & {
  reserveAddress: string;
  fromAddress: string;
  toAddress: string;
  amount: bigint;
};

export type MmSupplyEventParams = MmEventParamsWithEventName & {
  reserveAddress: string;
  userAddress: string;
  onBehalfOfUserAddress: string;
  referralCode: number;
  amount: bigint;
};

export type MmWithdrawEventParams = MmEventParamsWithEventName & {
  reserveAddress: string;
  userAddress: string;
  toAddress: string;
  amount: bigint;
};

export type MmBorrowEventParams = MmEventParamsWithEventName & {
  reserveAddress: string;
  userAddress: string;
  onBehalfOfUserAddress: string;
  amount: bigint;
  interestRateMode: number;
  borrowRate: bigint;
  referralCode: number;
};

export type MmRepayEventParams = MmEventParamsWithEventName & {
  reserveAddress: string;
  userAddress: string;
  repayerAddress: string;
  amount: bigint;
  useATokens: boolean;
};

export type MmUserEModeSetEventParams = MmEventParamsWithEventName & {
  userAddress: string;
  categoryId: number;
};

export type MmLiquidationCallEventParams = MmEventParamsWithEventName & {
  collateralAssetAddress: string;
  debtAssetAddress: string;
  userAddress: string;
  debtToCoverAmount: bigint;
  liquidatedCollateralAmount: bigint;
  liquidatorAddress: string;
  receiveAToken: boolean;
};

export type MmReserveUsedAsCollateralEnabledEventParams =
  MmEventParamsWithEventName & {
    reserveAddress: string;
    userAddress: string;
  };

export type MmReserveUsedAsCollateralDisabledEventParams =
  MmEventParamsWithEventName & {
    reserveAddress: string;
    userAddress: string;
  };

import { Result } from 'ethers';

export enum EvmEventName {
  Transfer = 'Transfer',
  Supply = 'Supply',
  Withdraw = 'Withdraw',
  Borrow = 'Borrow',
  Repay = 'Repay',
  UserEModeSet = 'UserEModeSet',
  LiquidationCall = 'LiquidationCall',
  ReserveUsedAsCollateralEnabled = 'ReserveUsedAsCollateralEnabled',
  ReserveUsedAsCollateralDisabled = 'ReserveUsedAsCollateralDisabled',
}

export type EvmEventParamsTypeDecorated<N extends EvmEventName> =
  N extends EvmEventName.Transfer
    ? MmTransferEventParams
    : N extends EvmEventName.Supply
      ? MmSupplyEventParams
      : N extends EvmEventName.Withdraw
        ? MmWithdrawEventParams
        : N extends EvmEventName.Borrow
          ? MmBorrowEventParams
          : N extends EvmEventName.Repay
            ? MmRepayEventParams
            : N extends EvmEventName.UserEModeSet
              ? MmUserEModeSetEventParams
              : N extends EvmEventName.LiquidationCall
                ? MmLiquidationCallEventParams
                : N extends EvmEventName.ReserveUsedAsCollateralEnabled
                  ? MmReserveUsedAsCollateralEnabledEventParams
                  : N extends EvmEventName.ReserveUsedAsCollateralDisabled
                    ? MmReserveUsedAsCollateralDisabledEventParams
                    : never;

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
  referralCode: bigint;
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
  referralCode: bigint;
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

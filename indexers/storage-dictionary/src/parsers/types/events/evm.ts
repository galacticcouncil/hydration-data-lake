import { utils } from 'ethers';
import { EventMetadata, EventParsedData } from './index';

export type EvmLogEventParsedData = EventParsedData<EvmLogEventParams | null>;

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
  OracleUpdate = 'OracleUpdate',
}

export enum EvmContractName {
  AavePoolImpl = 'AavePoolImpl',
  AaveAToken = 'AaveAToken',
  DiaOracleV2 = 'DiaOracleV2',
}

export type EvmLogEventParams = {
  eventName: EvmEventName;
  address: string;
  contractName: EvmContractName;
  signature: string;
  args: utils.Result;
};

export type MmEventParamsWithEventName = {
  contractName: EvmContractName;
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

export type OracleUpdateEventParams = MmEventParamsWithEventName & {
  key: string;
  value: bigint;
  timestamp: number;
};

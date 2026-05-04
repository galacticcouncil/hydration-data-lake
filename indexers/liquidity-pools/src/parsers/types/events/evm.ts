import { utils } from 'ethers';
import { EvmContractName, EvmEventName } from '../../../model';

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

export type MmMintedToTreasuryEventParams = MmEventParamsWithEventName & {
  reserveAddress: string;
  amountMinted: bigint;
};

export type OracleUpdateEventParams = MmEventParamsWithEventName & {
  key: string;
  value: bigint;
  timestamp: number;
};

export type PoolReserveDataUpdatedEventParams = MmEventParamsWithEventName & {
  reserveAddress: string;
  liquidityRate: bigint;
  stableBorrowRate: bigint;
  variableBorrowRate: bigint;
  liquidityIndex: bigint;
  variableBorrowIndex: bigint;
};

export type PoolReserveInitialisedEventParams = MmEventParamsWithEventName & {
  reserveAddress: string;
  aTokenAddress: string;
  stableDebtTokenAddress: string;
  variableDebtTokenAddress: string;
  interestRateStrategyAddress: string;
};

export type HsmFacilitatorAddedEventParams = MmEventParamsWithEventName & {
  facilitatorAddress: string;
  label: string;
  bucketCapacity: bigint;
};

export type HsmFacilitatorRemovedEventParams = MmEventParamsWithEventName & {
  facilitatorAddress: string;
};

export type HsmFacilitatorBucketCapacityUpdatedEventParams =
  MmEventParamsWithEventName & {
    facilitatorAddress: string;
    oldCapacity: bigint;
    newCapacity: bigint;
  };

export type HsmFacilitatorBucketLevelUpdatedEventParams =
  MmEventParamsWithEventName & {
    facilitatorAddress: string;
    oldLevel: bigint;
    newLevel: bigint;
  };

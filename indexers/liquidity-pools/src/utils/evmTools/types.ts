import {
  HsmFacilitatorAddedEventParams,
  HsmFacilitatorBucketCapacityUpdatedEventParams,
  HsmFacilitatorBucketLevelUpdatedEventParams,
  HsmFacilitatorRemovedEventParams,
  MmBorrowEventParams,
  MmLiquidationCallEventParams,
  MmRepayEventParams,
  MmReserveUsedAsCollateralDisabledEventParams,
  MmReserveUsedAsCollateralEnabledEventParams,
  MmSupplyEventParams,
  MmTransferEventParams,
  MmUserEModeSetEventParams,
  MmWithdrawEventParams,
  OracleUpdateEventParams,
  PoolReserveDataUpdatedEventParams,
} from '../../parsers/types/events';
import { EvmEventName } from '../../model';

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
                    : N extends EvmEventName.OracleUpdate
                      ? OracleUpdateEventParams
                      : N extends EvmEventName.ReserveDataUpdated
                        ? PoolReserveDataUpdatedEventParams
                        : N extends EvmEventName.FacilitatorBucketCapacityUpdated
                          ? HsmFacilitatorBucketCapacityUpdatedEventParams
                          : N extends EvmEventName.FacilitatorBucketLevelUpdated
                            ? HsmFacilitatorBucketLevelUpdatedEventParams
                            : N extends EvmEventName.FacilitatorAdded
                              ? HsmFacilitatorAddedEventParams
                              : N extends EvmEventName.FacilitatorRemoved
                                ? HsmFacilitatorRemovedEventParams
                                : never;

export type AccountMmPositionDataContractData = {
  totalCollateralBase: string;
  totalDebtBase: string;
  availableBorrowsBase: string;
  currentLiquidationThreshold: string;
  ltv: string;
  healthFactor: string;
  pool: string;
};

export type UserReserveDataContractData = {
  underlyingAsset: string;
  scaledATokenBalance: string;
  usageAsCollateralEnabledOnUser: boolean;
  stableBorrowRate: string;
  scaledVariableDebt: string;
  principalStableDebt: string;
  stableBorrowLastUpdateTimestamp: string;
};

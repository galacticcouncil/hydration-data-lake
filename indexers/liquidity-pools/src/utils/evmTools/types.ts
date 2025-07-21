import {
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

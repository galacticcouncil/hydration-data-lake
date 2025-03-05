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
                    : never;

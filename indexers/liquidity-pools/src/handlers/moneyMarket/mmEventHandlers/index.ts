import { handleMmTransferEvent } from './mmTransferEventHandler';
import { handleMmSupplyEvent } from './mmSupplyEventHandler';
import { handleMmWithdrawEvent } from './mmWithdrawEventHandler';
import { handleMmBorrowEvent } from './mmBorrowEventHandler';
import { handleMmRepayEvent } from './mmRepayEventHandler';
import { handleMmLiquidationCallEvent } from './mmLiquidationCallEventHandler';
import { handleMmUserEModeSetEvent } from './mmUserEModeSetEventHandler';
import { handleMmReserveUsedAsCollateralEnabledEvent } from './mmReserveUsedAsCollateralEnabledEventHandler';
import { handleMmReserveUsedAsCollateralDisabledEvent } from './mmReserveUsedAsCollateralDisabledEventHandler';
import { handleOracleUpdatedEvent } from './mmOracleUpdatedEventHandler';

export default {
  handleMmTransferEvent,
  handleMmSupplyEvent,
  handleMmWithdrawEvent,
  handleMmBorrowEvent,
  handleMmRepayEvent,
  handleMmLiquidationCallEvent,
  handleMmUserEModeSetEvent,
  handleMmReserveUsedAsCollateralEnabledEvent,
  handleMmReserveUsedAsCollateralDisabledEvent,
  handleOracleUpdatedEvent,
};

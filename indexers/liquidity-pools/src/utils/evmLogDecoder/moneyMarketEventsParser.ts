import {
  EvmLogEventParams,
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

export class MoneyMarketEventsParser {
  parseTransferEvent(event: EvmLogEventParams): MmTransferEventParams {
    return {
      eventName: EvmEventName.Transfer,
      reserveAddress: event.address,
      fromAddress: event.args[0],
      toAddress: event.args[1],
      amount: event.args[2],
    };
  }
  parseSupplyEvent(event: EvmLogEventParams): MmSupplyEventParams {
    return {
      eventName: EvmEventName.Supply,
      reserveAddress: event.args[0],
      userAddress: event.args[1],
      onBehalfOfUserAddress: event.args[2],
      amount: event.args[3],
      referralCode: event.args[4],
    };
  }
  parseWithdrawEvent(event: EvmLogEventParams): MmWithdrawEventParams {
    return {
      eventName: EvmEventName.Withdraw,
      reserveAddress: event.args[0],
      userAddress: event.args[1],
      toAddress: event.args[2],
      amount: event.args[3],
    };
  }
  parseBorrowEvent(event: EvmLogEventParams): MmBorrowEventParams {
    return {
      eventName: EvmEventName.Borrow,
      reserveAddress: event.args[0],
      userAddress: event.args[1],
      onBehalfOfUserAddress: event.args[2],
      amount: event.args[3],
      interestRateMode: event.args[4],
      borrowRate: event.args[5],
      referralCode: event.args[6],
    };
  }
  parseUserEModeSetEvent(event: EvmLogEventParams): MmUserEModeSetEventParams {
    return {
      eventName: EvmEventName.UserEModeSet,
      userAddress: event.args[0],
      categoryId: event.args[1],
    };
  }
  parseRepayEvent(event: EvmLogEventParams): MmRepayEventParams {
    return {
      eventName: EvmEventName.Repay,
      reserveAddress: event.args[0],
      userAddress: event.args[1],
      repayerAddress: event.args[2],
      amount: event.args[3],
      useATokens: event.args[4],
    };
  }
  parseLiquidationCallEvent(
    event: EvmLogEventParams
  ): MmLiquidationCallEventParams {
    return {
      eventName: EvmEventName.LiquidationCall,
      collateralAssetAddress: event.args[0],
      debtAssetAddress: event.args[1],
      userAddress: event.args[2],
      debtToCoverAmount: event.args[3],
      liquidatedCollateralAmount: event.args[4],
      liquidatorAddress: event.args[5],
      receiveAToken: event.args[6],
    };
  }
  parseReserveUsedAsCollateralEnabledEvent(
    event: EvmLogEventParams
  ): MmReserveUsedAsCollateralEnabledEventParams {
    return {
      eventName: EvmEventName.ReserveUsedAsCollateralEnabled,
      reserveAddress: event.args[0],
      userAddress: event.args[1],
    };
  }
  parseReserveUsedAsCollateralDisabledEvent(
    event: EvmLogEventParams
  ): MmReserveUsedAsCollateralDisabledEventParams {
    return {
      eventName: EvmEventName.ReserveUsedAsCollateralDisabled,
      reserveAddress: event.args[0],
      userAddress: event.args[1],
    };
  }
}

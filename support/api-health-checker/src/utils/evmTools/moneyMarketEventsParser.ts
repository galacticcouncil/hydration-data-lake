import { ethers } from 'ethers';
import {
  EvmEventName,
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
} from './types';

export class MoneyMarketEventsParser {
  parseTransferEvent(event: EvmLogEventParams): MmTransferEventParams {
    return {
      eventName: EvmEventName.Transfer,
      reserveAddress: ethers.getAddress(event.address).toLowerCase(),
      fromAddress: ethers.getAddress(event.args[0]).toLowerCase(),
      toAddress: ethers.getAddress(event.args[1]).toLowerCase(),
      amount: event.args[2],
    };
  }
  parseSupplyEvent(event: EvmLogEventParams): MmSupplyEventParams {
    return {
      eventName: EvmEventName.Supply,
      reserveAddress: ethers.getAddress(event.args[0]).toLowerCase(),
      userAddress: ethers.getAddress(event.args[1]).toLowerCase(),
      onBehalfOfUserAddress: ethers.getAddress(event.args[2]).toLowerCase(),
      amount: event.args[3],
      referralCode: event.args[4],
    };
  }
  parseWithdrawEvent(event: EvmLogEventParams): MmWithdrawEventParams {
    return {
      eventName: EvmEventName.Withdraw,
      reserveAddress: ethers.getAddress(event.args[0]).toLowerCase(),
      userAddress: ethers.getAddress(event.args[1]).toLowerCase(),
      toAddress: ethers.getAddress(event.args[2]).toLowerCase(),
      amount: event.args[3],
    };
  }
  parseBorrowEvent(event: EvmLogEventParams): MmBorrowEventParams {
    return {
      eventName: EvmEventName.Borrow,
      reserveAddress: ethers.getAddress(event.args[0]).toLowerCase(),
      userAddress: ethers.getAddress(event.args[1]).toLowerCase(),
      onBehalfOfUserAddress: ethers.getAddress(event.args[2]).toLowerCase(),
      amount: event.args[3],
      interestRateMode: event.args[4],
      borrowRate: event.args[5],
      referralCode: event.args[6],
    };
  }
  parseUserEModeSetEvent(event: EvmLogEventParams): MmUserEModeSetEventParams {
    return {
      eventName: EvmEventName.UserEModeSet,
      userAddress: ethers.getAddress(event.args[0]).toLowerCase(),
      categoryId: event.args[1],
    };
  }
  parseRepayEvent(event: EvmLogEventParams): MmRepayEventParams {
    return {
      eventName: EvmEventName.Repay,
      reserveAddress: ethers.getAddress(event.args[0]).toLowerCase(),
      userAddress: ethers.getAddress(event.args[1]).toLowerCase(),
      repayerAddress: ethers.getAddress(event.args[2]).toLowerCase(),
      amount: event.args[3],
      useATokens: event.args[4],
    };
  }
  parseLiquidationCallEvent(
    event: EvmLogEventParams,
  ): MmLiquidationCallEventParams {
    return {
      eventName: EvmEventName.LiquidationCall,
      collateralAssetAddress: ethers.getAddress(event.args[0]).toLowerCase(),
      debtAssetAddress: ethers.getAddress(event.args[1]).toLowerCase(),
      userAddress: ethers.getAddress(event.args[2]).toLowerCase(),
      debtToCoverAmount: event.args[3],
      liquidatedCollateralAmount: event.args[4],
      liquidatorAddress: ethers.getAddress(event.args[5]).toLowerCase(),
      receiveAToken: event.args[6],
    };
  }
  parseReserveUsedAsCollateralEnabledEvent(
    event: EvmLogEventParams,
  ): MmReserveUsedAsCollateralEnabledEventParams {
    return {
      eventName: EvmEventName.ReserveUsedAsCollateralEnabled,
      reserveAddress: ethers.getAddress(event.args[0]).toLowerCase(),
      userAddress: ethers.getAddress(event.args[1]).toLowerCase(),
    };
  }
  parseReserveUsedAsCollateralDisabledEvent(
    event: EvmLogEventParams,
  ): MmReserveUsedAsCollateralDisabledEventParams {
    return {
      eventName: EvmEventName.ReserveUsedAsCollateralDisabled,
      reserveAddress: ethers.getAddress(event.args[0]).toLowerCase(),
      userAddress: ethers.getAddress(event.args[1]).toLowerCase(),
    };
  }
}

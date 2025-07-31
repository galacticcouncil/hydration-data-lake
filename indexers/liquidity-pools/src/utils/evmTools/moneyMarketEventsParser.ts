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
  OracleUpdateEventParams,
  PoolReserveDataUpdatedEventParams,
} from '../../parsers/types/events';
import { EvmEventName } from '../../model';
import { ethers } from 'ethers';

export class MoneyMarketEventsParser {
  parseTransferEvent(event: EvmLogEventParams): MmTransferEventParams {
    return {
      eventName: EvmEventName.Transfer,
      contractName: event.contractName,
      reserveAddress: ethers.utils.getAddress(event.address).toLowerCase(),
      fromAddress: ethers.utils.getAddress(event.args[0]).toLowerCase(),
      toAddress: ethers.utils.getAddress(event.args[1]).toLowerCase(),
      amount: event.args[2],
    };
  }
  parseSupplyEvent(event: EvmLogEventParams): MmSupplyEventParams {
    return {
      eventName: EvmEventName.Supply,
      contractName: event.contractName,
      reserveAddress: ethers.utils.getAddress(event.args[0]).toLowerCase(),
      userAddress: ethers.utils.getAddress(event.args[1]).toLowerCase(),
      onBehalfOfUserAddress: ethers.utils
        .getAddress(event.args[2])
        .toLowerCase(),
      amount: event.args[3],
      referralCode: event.args[4],
    };
  }
  parseWithdrawEvent(event: EvmLogEventParams): MmWithdrawEventParams {
    return {
      eventName: EvmEventName.Withdraw,
      contractName: event.contractName,
      reserveAddress: ethers.utils.getAddress(event.args[0]).toLowerCase(),
      userAddress: ethers.utils.getAddress(event.args[1]).toLowerCase(),
      toAddress: ethers.utils.getAddress(event.args[2]).toLowerCase(),
      amount: event.args[3],
    };
  }
  parseBorrowEvent(event: EvmLogEventParams): MmBorrowEventParams {
    return {
      eventName: EvmEventName.Borrow,
      contractName: event.contractName,
      reserveAddress: ethers.utils.getAddress(event.args[0]).toLowerCase(),
      userAddress: ethers.utils.getAddress(event.args[1]).toLowerCase(),
      onBehalfOfUserAddress: ethers.utils
        .getAddress(event.args[2])
        .toLowerCase(),
      amount: event.args[3],
      interestRateMode: event.args[4],
      borrowRate: event.args[5],
      referralCode: event.args[6],
    };
  }
  parseUserEModeSetEvent(event: EvmLogEventParams): MmUserEModeSetEventParams {
    return {
      eventName: EvmEventName.UserEModeSet,
      contractName: event.contractName,
      userAddress: ethers.utils.getAddress(event.args[0]).toLowerCase(),
      categoryId: event.args[1],
    };
  }
  parseRepayEvent(event: EvmLogEventParams): MmRepayEventParams {
    return {
      eventName: EvmEventName.Repay,
      contractName: event.contractName,
      reserveAddress: ethers.utils.getAddress(event.args[0]).toLowerCase(),
      userAddress: ethers.utils.getAddress(event.args[1]).toLowerCase(),
      repayerAddress: ethers.utils.getAddress(event.args[2]).toLowerCase(),
      amount: event.args[3],
      useATokens: event.args[4],
    };
  }
  parseLiquidationCallEvent(
    event: EvmLogEventParams
  ): MmLiquidationCallEventParams {
    return {
      eventName: EvmEventName.LiquidationCall,
      contractName: event.contractName,
      collateralAssetAddress: ethers.utils
        .getAddress(event.args[0])
        .toLowerCase(),
      debtAssetAddress: ethers.utils.getAddress(event.args[1]).toLowerCase(),
      userAddress: ethers.utils.getAddress(event.args[2]).toLowerCase(),
      debtToCoverAmount: event.args[3],
      liquidatedCollateralAmount: event.args[4],
      liquidatorAddress: ethers.utils.getAddress(event.args[5]).toLowerCase(),
      receiveAToken: event.args[6],
    };
  }
  parseReserveUsedAsCollateralEnabledEvent(
    event: EvmLogEventParams
  ): MmReserveUsedAsCollateralEnabledEventParams {
    return {
      eventName: EvmEventName.ReserveUsedAsCollateralEnabled,
      contractName: event.contractName,
      reserveAddress: ethers.utils.getAddress(event.args[0]).toLowerCase(),
      userAddress: ethers.utils.getAddress(event.args[1]).toLowerCase(),
    };
  }
  parseReserveUsedAsCollateralDisabledEvent(
    event: EvmLogEventParams
  ): MmReserveUsedAsCollateralDisabledEventParams {
    return {
      eventName: EvmEventName.ReserveUsedAsCollateralDisabled,
      contractName: event.contractName,
      reserveAddress: ethers.utils.getAddress(event.args[0]).toLowerCase(),
      userAddress: ethers.utils.getAddress(event.args[1]).toLowerCase(),
    };
  }
  parseOracleUpdateEvent(event: EvmLogEventParams): OracleUpdateEventParams {
    return {
      eventName: EvmEventName.OracleUpdate,
      contractName: event.contractName,
      key: event.args[0],
      value: event.args[1],
      timestamp: event.args[2],
    };
  }
  parsePoolReserveDataUpdatedEvent(
    event: EvmLogEventParams
  ): PoolReserveDataUpdatedEventParams {
    return {
      eventName: EvmEventName.ReserveDataUpdated,
      contractName: event.contractName,
      reserveAddress: ethers.utils.getAddress(event.args[0]).toLowerCase(),
      liquidityRate: event.args[1],
      stableBorrowRate: event.args[2],
      variableBorrowRate: event.args[3],
      liquidityIndex: event.args[4],
      variableBorrowIndex: event.args[5],
    };
  }
}

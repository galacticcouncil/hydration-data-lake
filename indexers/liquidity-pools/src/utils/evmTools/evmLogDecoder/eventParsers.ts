import {
  EvmLogEventParams,
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
  MmMintedToTreasuryEventParams,
  PoolReserveInitialisedEventParams,
} from '../../../parsers/types/events';
import { EvmEventName } from '../../../model';
import { ethers } from 'ethers';
import { hexToString } from '@polkadot/util';

export class EvmLogEventParsers {
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
  parsePoolReserveInitializedEvent(
    event: EvmLogEventParams
  ): PoolReserveInitialisedEventParams {
    return {
      eventName: EvmEventName.ReserveInitialized,
      contractName: event.contractName,
      reserveAddress: ethers.utils.getAddress(event.args[0]).toLowerCase(),
      aTokenAddress: ethers.utils.getAddress(event.args[1]).toLowerCase(),
      stableDebtTokenAddress: ethers.utils
        .getAddress(event.args[2])
        .toLowerCase(),
      variableDebtTokenAddress: ethers.utils
        .getAddress(event.args[3])
        .toLowerCase(),
      interestRateStrategyAddress: ethers.utils
        .getAddress(event.args[4])
        .toLowerCase(),
    };
  }
  parseHsmFasilitatorAddedEvent(
    event: EvmLogEventParams
  ): HsmFacilitatorAddedEventParams {
    let label = null;

    try {
      label = ethers.utils.parseBytes32String(event.args[1]);
    } catch (e) {}

    if (!label) {
      try {
        label = ethers.utils.toUtf8String(event.args[1]);
      } catch (e) {}
    }
    if (!label) {
      try {
        label = event.args[1].toString();
      } catch (e) {}
    }

    if (!label) label = event.args[1];

    return {
      eventName: EvmEventName.FacilitatorAdded,
      contractName: event.contractName,
      facilitatorAddress: ethers.utils.getAddress(event.args[0]).toLowerCase(),
      label,
      bucketCapacity: event.args[2],
    };
  }
  parseHsmFasilitatorRemovedEvent(
    event: EvmLogEventParams
  ): HsmFacilitatorRemovedEventParams {
    return {
      eventName: EvmEventName.FacilitatorRemoved,
      contractName: event.contractName,
      facilitatorAddress: ethers.utils.getAddress(event.args[0]).toLowerCase(),
    };
  }
  parseHsmFacilitatorBucketCapacityUpdatedEvent(
    event: EvmLogEventParams
  ): HsmFacilitatorBucketCapacityUpdatedEventParams {
    return {
      eventName: EvmEventName.FacilitatorBucketCapacityUpdated,
      contractName: event.contractName,
      facilitatorAddress: ethers.utils.getAddress(event.args[0]).toLowerCase(),
      oldCapacity: event.args[1],
      newCapacity: event.args[2],
    };
  }
  parseHsmFacilitatorBucketLevelUpdatedEvent(
    event: EvmLogEventParams
  ): HsmFacilitatorBucketLevelUpdatedEventParams {
    return {
      eventName: EvmEventName.FacilitatorBucketLevelUpdated,
      contractName: event.contractName,
      facilitatorAddress: ethers.utils.getAddress(event.args[0]).toLowerCase(),
      oldLevel: event.args[1],
      newLevel: event.args[2],
    };
  }
  parseMintedToTreasuryEvent(
    event: EvmLogEventParams
  ): MmMintedToTreasuryEventParams {
    return {
      eventName: EvmEventName.MintedToTreasury,
      contractName: event.contractName,
      reserveAddress: ethers.utils.getAddress(event.args[0]).toLowerCase(),
      amountMinted: event.args[1],
    };
  }
}

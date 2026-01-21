import aavePoolImplementation from '../abi/aave/aavePoolImplementation.json';
import aTokenHydration from '../abi/aave/aTokenHydration.json';
import diaOracleV2 from '../abi/aave/diaOracleV2.json';
import poolConfiguratorImplementation from '../abi/aave/poolConfiguratorImplementation.json';
import hollarAbi from '../abi/aave/hollar_unstableAbi.json';
import { ethers } from 'ethers';
import { EvmLogEventParsers } from './eventParsers';
import { EvmLogEventParams } from '../../../parsers/types/events';
import { EvmEventParamsTypeDecorated } from '../types';
import { EvmContractName, EvmEventName } from '../../../model';
import { AppConfig } from '../../../appConfig';

const appConfig = AppConfig.getInstance();

export class EvmLogDecoder extends EvmLogEventParsers {
  private static instance: EvmLogDecoder;
  private interfacesMap = new Map([
    [
      aavePoolImplementation.address,
      new ethers.utils.Interface(aavePoolImplementation.abi),
    ],
    [aTokenHydration.address, new ethers.utils.Interface(aTokenHydration.abi)],
    [diaOracleV2.address, new ethers.utils.Interface(diaOracleV2.abi)],
    [
      poolConfiguratorImplementation.address,
      new ethers.utils.Interface(poolConfiguratorImplementation.abi),
    ],
    [
      appConfig.evm.HOLLAR_CONTRACT_ADDRESS,
      new ethers.utils.Interface(hollarAbi),
    ],
  ]);

  constructor() {
    super();
  }

  static getInstance(): EvmLogDecoder {
    if (!EvmLogDecoder.instance) {
      EvmLogDecoder.instance = new EvmLogDecoder();
    }
    return EvmLogDecoder.instance;
  }

  tryDecodeLog({
    address,
    data,
    topics,
  }: {
    address: string;
    data: string;
    topics: string[];
  }): {
    parsedLog: ethers.utils.LogDescription;
    contractName: EvmContractName;
  } | null {
    let parsedLog = null;
    let contractName = null;

    try {
      parsedLog = this.interfacesMap
        .get(aavePoolImplementation.address)!
        .parseLog({ topics, data });
      contractName = EvmContractName.AavePoolImpl;
    } catch (error) {}

    if (!parsedLog) {
      try {
        parsedLog = this.interfacesMap
          .get(aTokenHydration.address)!
          .parseLog({ topics, data });
        contractName = EvmContractName.AaveAToken;
      } catch (error) {}
    }

    if (!parsedLog) {
      try {
        parsedLog = this.interfacesMap
          .get(diaOracleV2.address)!
          .parseLog({ topics, data });
        contractName = EvmContractName.DiaOracleV2;
      } catch (error) {}
    }

    if (!parsedLog) {
      try {
        parsedLog = this.interfacesMap
          .get(poolConfiguratorImplementation.address)!
          .parseLog({ topics, data });
        contractName = EvmContractName.AavePoolConfiguratorImpl;
      } catch (error) {}
    }

    if (!parsedLog) {
      try {
        parsedLog = this.interfacesMap
          .get(appConfig.evm.HOLLAR_CONTRACT_ADDRESS)!
          .parseLog({ topics, data });
        contractName = EvmContractName.HollarToken;
      } catch (error) {}
    }

    if (!parsedLog || !contractName) return null;

    return { parsedLog, contractName };
  }

  getEvmEventFromLog<N extends EvmEventName>(
    evmLogParams: EvmLogEventParams
  ): EvmEventParamsTypeDecorated<N> | null {
    switch (evmLogParams.eventName) {
      case EvmEventName.Transfer:
        return this.parseTransferEvent(
          evmLogParams
        ) as unknown as EvmEventParamsTypeDecorated<N>;
      case EvmEventName.Supply:
        return this.parseSupplyEvent(
          evmLogParams
        ) as unknown as EvmEventParamsTypeDecorated<N>;
      case EvmEventName.Withdraw:
        return this.parseWithdrawEvent(
          evmLogParams
        ) as unknown as EvmEventParamsTypeDecorated<N>;
      case EvmEventName.Borrow:
        return this.parseBorrowEvent(
          evmLogParams
        ) as unknown as EvmEventParamsTypeDecorated<N>;
      case EvmEventName.Repay:
        return this.parseRepayEvent(
          evmLogParams
        ) as unknown as EvmEventParamsTypeDecorated<N>;
      case EvmEventName.UserEModeSet:
        return this.parseUserEModeSetEvent(
          evmLogParams
        ) as unknown as EvmEventParamsTypeDecorated<N>;
      case EvmEventName.LiquidationCall:
        return this.parseLiquidationCallEvent(
          evmLogParams
        ) as unknown as EvmEventParamsTypeDecorated<N>;
      case EvmEventName.ReserveUsedAsCollateralEnabled:
        return this.parseReserveUsedAsCollateralEnabledEvent(
          evmLogParams
        ) as unknown as EvmEventParamsTypeDecorated<N>;
      case EvmEventName.ReserveUsedAsCollateralDisabled:
        return this.parseReserveUsedAsCollateralDisabledEvent(
          evmLogParams
        ) as unknown as EvmEventParamsTypeDecorated<N>;
      case EvmEventName.OracleUpdate:
        return this.parseOracleUpdateEvent(
          evmLogParams
        ) as unknown as EvmEventParamsTypeDecorated<N>;
      case EvmEventName.ReserveDataUpdated:
        return this.parsePoolReserveDataUpdatedEvent(
          evmLogParams
        ) as unknown as EvmEventParamsTypeDecorated<N>;
      case EvmEventName.FacilitatorAdded:
        return this.parseHsmFasilitatorAddedEvent(
          evmLogParams
        ) as unknown as EvmEventParamsTypeDecorated<N>;
      case EvmEventName.FacilitatorRemoved:
        return this.parseHsmFasilitatorRemovedEvent(
          evmLogParams
        ) as unknown as EvmEventParamsTypeDecorated<N>;
      case EvmEventName.FacilitatorBucketCapacityUpdated:
        return this.parseHsmFacilitatorBucketCapacityUpdatedEvent(
          evmLogParams
        ) as unknown as EvmEventParamsTypeDecorated<N>;
      case EvmEventName.FacilitatorBucketLevelUpdated:
        return this.parseHsmFacilitatorBucketLevelUpdatedEvent(
          evmLogParams
        ) as unknown as EvmEventParamsTypeDecorated<N>;
      case EvmEventName.MintedToTreasury:
        return this.parseMintedToTreasuryEvent(
          evmLogParams
        ) as unknown as EvmEventParamsTypeDecorated<N>;
      default:
        return null;
    }
  }
}

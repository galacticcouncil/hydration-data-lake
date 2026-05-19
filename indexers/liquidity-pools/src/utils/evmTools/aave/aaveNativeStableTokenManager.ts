import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import hollarAbi from '../abi/aave/hollar_unstableAbi.json';
import aTokenHydration from '../abi/aave/aTokenHydration.json';
import variableDebtTokenHydration from '../abi/aave/variableDebtTokenHydration.json';
import uiPoolDataProviderV3 from '../abi/aave/uiPoolDataProviderV3.json';
import poolImplementation from '../abi/aave/aavePoolImplementation.json';
import { Contract, ContractInterface, ethers } from 'ethers';
import { AssetResourceType, EvmEventName } from '../../../model';
import { AppConfig } from '../../../appConfig';
import {
  AaveFacilitatorContractData,
  AccountMmPositionDataContractData,
  MoneyMarketResourceDetails,
  MoneyMarketTokenDetails,
  MoneyMarketTokenTotalSupply,
  UserReserveDataContractData,
} from './types';
import { BigNumber } from '../../bignumber';
import pMap from 'p-map';
import { getOrderedListByBlockNumber, retryAsync } from '../../helpers';
import { measureEvmContractCall } from '../../hydratedLogger/utils';
import { ContractsPoolManager } from '../contractsPoolManager';
import { BatchBlocksParsedDataManager } from '../../../parsers/batchBlocksParser';
import { EventName } from '../../../parsers/types/events';
import { handleEvmLog } from '../../../handlers/evmLog';

const appConfig = AppConfig.getInstance();

/**
 * Manager of AAVE native Stable token - currently in Hydraiton it's only HOLLAR
 */
export class AaveNativeStableTokenManager {
  private static instance: AaveNativeStableTokenManager;

  private readonly contractsPoolManager: ContractsPoolManager;

  // Cache for facilitators to avoid repeated EVM calls
  private facilitatorsCache: Array<AaveFacilitatorContractData> | null = null;
  private facilitatorsCacheBlockNumber: number | null = null;

  private constructor() {
    this.contractsPoolManager = ContractsPoolManager.getInstance();
  }

  /**
   * Get the next contract instance from the pool for a given address and ABI
   */
  private getContract(address: string, abi: ContractInterface): Contract {
    return this.contractsPoolManager.getContract(address, abi);
  }

  /**
   * Convenience getters for frequently used contracts
   */
  private get aaveNativeStableToken(): Contract {
    return this.getContract(
      appConfig.evm.HOLLAR_CONTRACT_ADDRESS,
      hollarAbi as any
    );
  }

  static getInstance(): AaveNativeStableTokenManager {
    if (!AaveNativeStableTokenManager.instance) {
      AaveNativeStableTokenManager.instance =
        new AaveNativeStableTokenManager();
    }
    return AaveNativeStableTokenManager.instance;
  }

  async getAllAaveFacilitators({ blockNumber }: { blockNumber?: number }) {
    // Return cached facilitators if available and within 100 blocks
    if (
      this.facilitatorsCache &&
      this.facilitatorsCacheBlockNumber &&
      blockNumber &&
      Math.abs(blockNumber - this.facilitatorsCacheBlockNumber) < 100
    ) {
      return this.facilitatorsCache;
    }

    const facilitatorsList: string[] = await measureEvmContractCall({
      call: `aaveNativeStableToken.getFacilitatorsList`,
      originFn: 'getAllAaveFacilitators',
      blockHeight: blockNumber ?? 0,
      fn: () =>
        retryAsync({
          // passThrough: true,
          fn: () =>
            this.aaveNativeStableToken.getFacilitatorsList({
              blockTag: blockNumber,
            }),
          fallbackResponse: [],
          tag: `getFacilitatorsList.at(${blockNumber})`,
        }),
    });

    if (!facilitatorsList || facilitatorsList.length === 0) {
      console.log(`No facilitators found - returning cached data if available`);
      return this.facilitatorsCache || null;
    }

    const facilitatorsData: Array<AaveFacilitatorContractData | null> = [];

    await pMap(
      facilitatorsList,
      async (facilitatorAddress: string) => {
        facilitatorsData.push(
          await this.getAaveFacilitatorWithLogs({
            facilitatorAddress,
            blockNumber,
          })
        );
      },
      { concurrency: appConfig.concurrency.EVM_CONTRACT_CALL_CONCURRENCY }
    );

    const filteredData = facilitatorsData.filter(
      (facilitator) => !!facilitator
    );

    // Cache the result
    this.facilitatorsCache = filteredData;
    this.facilitatorsCacheBlockNumber = blockNumber ?? null;

    return filteredData;
  }

  async getAaveFacilitator({
    facilitatorAddress,
    blockNumber,
  }: {
    facilitatorAddress: string;
    blockNumber?: number;
  }): Promise<AaveFacilitatorContractData | null> {
    const facilitatorData: any = await retryAsync({
      // passThrough: true,
      fn: () =>
        this.aaveNativeStableToken.getFacilitator(
          ethers.utils.getAddress(facilitatorAddress),
          blockNumber !== undefined ? { blockTag: blockNumber } : undefined
        ),
      fallbackResponse: null,
      tag: `getFacilitator(${facilitatorAddress}).at(${blockNumber})`,
    });

    if (!facilitatorData) {
      console.log(`No facilitator with address ${facilitatorAddress} found `);
      return null;
    }

    return {
      address: facilitatorAddress.toLowerCase(),
      label: facilitatorData.label,
      bucketCapacity: facilitatorData.bucketCapacity.toString(),
      bucketLevel: facilitatorData.bucketLevel.toString(),
    };
  }

  async getAaveFacilitatorWithLogs(args: {
    facilitatorAddress: string;
    blockNumber?: number;
  }): Promise<AaveFacilitatorContractData | null> {
    return measureEvmContractCall({
      call: `aaveNativeStableToken.getFacilitator`,
      originFn: 'getAaveFacilitatorWithLogs',
      blockHeight: args?.blockNumber ?? 0,
      args: args,
      fn: () => this.getAaveFacilitator(args),
    });
  }
}

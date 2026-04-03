import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import hollarAbi from './abi/aave/hollar_unstableAbi.json';
import aTokenHydration from './abi/aave/aTokenHydration.json';
import variableDebtTokenHydration from './abi/aave/variableDebtTokenHydration.json';
import uiPoolDataProviderV3 from './abi/aave/uiPoolDataProviderV3.json';
import poolImplementation from './abi/aave/aavePoolImplementation.json';
import { Contract, ContractInterface, ethers } from 'ethers';
import { AssetResourceType } from '../../model';
import { AppConfig } from '../../appConfig';
import {
  AccountMmPositionDataContractData,
  UserReserveDataContractData,
} from './types';
import { BigNumber } from '@galacticcouncil/sdk';
import pMap from 'p-map';
import { retryAsync } from '../helpers';
import { measureEvmContractCall } from '../hydratedLogger/utils';
import { ContractsPoolManager } from './contractsPoolManager';

const appConfig = AppConfig.getInstance();

export type MoneyMarketTokenDetails = {
  address: string;
  resourceType: AssetResourceType;
  underlyingAssetAddress?: string;
  name?: string;
  symbol?: string;
  decimals?: number;
};

export type MoneyMarketTokenTotalSupply = {
  address: string;
  value: string;
};

export type MoneyMarketResourceDetails = {
  underlyingAssetAddress: string;
  aTokenAddress: string;
  variableDebtTokenAddress: string;
  interestRateStrategyAddress: string;

  name: string;
  symbol: string;
  decimals: number;

  priceOracle: string;
  reserveFactor: string;
  usageAsCollateralEnabled: boolean;
  borrowingEnabled: boolean;
  isActive: boolean;
  isFrozen: boolean;
  isPaused: boolean;
  isSiloedBorrowing: boolean;
  accruedToTreasury: string;
  unbacked: string;
  flashLoanEnabled: boolean;
  debtCeiling: string;
  debtCeilingDecimals: string;
  eModeCategoryId: string;
  borrowCap: string;
  supplyCap: string;
  borrowableInIsolation: boolean;
  baseLTVasCollateral: string;
  reserveLiquidationThreshold: string;
  reserveLiquidationBonus: string;
  variableRateSlope1: string;
  variableRateSlope2: string;
  baseVariableBorrowRate: string;
  optimalUsageRatio: string;

  liquidityIndex: string;
  variableBorrowIndex: string;
  liquidityRate: string;
  variableBorrowRate: string;

  lastUpdateTimestamp: string;
};

export type AaveFacilitatorContractData = {
  address: string;
  label: string;
  bucketCapacity: string;
  bucketLevel: string;
};

export class MoneyMarketContractsManager {
  private static instance: MoneyMarketContractsManager;

  private readonly contractsPoolManager: ContractsPoolManager;

  // Track available money market token addresses and their ABIs
  private moneyMarketTokenAddresses: Map<string, ContractInterface> = new Map();

  public moneyMarketReservesDetailsMap: Map<
    string,
    MoneyMarketResourceDetails
  > = new Map();

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
   * Get a money market token contract from the pool
   */
  private getMoneyMarketTokenContract(address: string): Contract | null {
    const addressNormalized = ethers.utils.getAddress(address);
    const abi = this.moneyMarketTokenAddresses.get(addressNormalized);

    if (!abi) return null;

    return this.getContract(addressNormalized, abi);
  }

  /**
   * Convenience getters for frequently used contracts
   */
  private get hollarContractInstance(): Contract {
    return this.getContract(
      appConfig.evm.HOLLAR_CONTRACT_ADDRESS,
      hollarAbi as any
    );
  }

  private get uiPoolDataProviderContractInstance(): Contract {
    return this.getContract(
      appConfig.evm.UI_POOL_DATA_PROVIDER_CONTRACT_ADDRESS,
      uiPoolDataProviderV3.abi as any
    );
  }

  private get poolImplementationContractInstance(): Contract {
    return this.getContract(
      appConfig.evm.POOL_IMPLEMENTATION_PROXY_CONTRACT_ADDRESS,
      poolImplementation.abi as any
    );
  }

  static getInstance(): MoneyMarketContractsManager {
    if (!MoneyMarketContractsManager.instance) {
      MoneyMarketContractsManager.instance = new MoneyMarketContractsManager();
    }
    return MoneyMarketContractsManager.instance;
  }

  async getReservesData({
    blockNumber,
  }: {
    blockNumber?: number;
  }): Promise<MoneyMarketResourceDetails[] | null> {
    try {
      const reservesData = await measureEvmContractCall({
        call: `uiPoolDataProviderContractInstance.getReservesData`,
        originFn: 'getReservesData',
        blockHeight: blockNumber ?? 0,
        args: {
          POOL_ADDRESS_PROVIDER_CONTRACT_ADDRESS:
            appConfig.evm.POOL_ADDRESS_PROVIDER_CONTRACT_ADDRESS,
        },
        fn: () =>
          retryAsync({
            fn: async () =>
              this.uiPoolDataProviderContractInstance.getReservesData(
                appConfig.evm.POOL_ADDRESS_PROVIDER_CONTRACT_ADDRESS,
                { blockTag: blockNumber }
              ),
            fallbackResponse: [],
            tag: `getReservesData.at(${blockNumber})`,
          }),
      });

      if (!reservesData || reservesData.length === 0) return null;

      const reservesDecorated: MoneyMarketResourceDetails[] = [];

      for (const reserve of reservesData[0]) {
        reservesDecorated.push({
          underlyingAssetAddress: ethers.utils.getAddress(
            reserve.underlyingAsset
          ),
          aTokenAddress: ethers.utils.getAddress(reserve.aTokenAddress),
          variableDebtTokenAddress: ethers.utils.getAddress(
            reserve.variableDebtTokenAddress
          ),
          interestRateStrategyAddress: ethers.utils.getAddress(
            reserve.interestRateStrategyAddress
          ),

          name: reserve.name,
          symbol: reserve.symbol,
          decimals: +reserve.decimals.toString(),

          priceOracle: reserve.priceOracle
            ? ethers.utils.getAddress(reserve.priceOracle)
            : '',

          reserveFactor: reserve.reserveFactor.toString(),
          usageAsCollateralEnabled: reserve.usageAsCollateralEnabled,
          borrowingEnabled: reserve.borrowingEnabled,
          isActive: reserve.isActive,
          isFrozen: reserve.isFrozen,
          isPaused: reserve.isPaused,
          isSiloedBorrowing: reserve.isSiloedBorrowing,
          accruedToTreasury: reserve.accruedToTreasury.toString(),
          unbacked: reserve.unbacked.toString(),
          flashLoanEnabled: reserve.flashLoanEnabled,
          debtCeiling: reserve.debtCeiling.toString(),
          debtCeilingDecimals: reserve.debtCeilingDecimals.toString(),
          eModeCategoryId: reserve.eModeCategoryId.toString(),
          borrowCap: reserve.borrowCap.toString(),
          supplyCap: reserve.supplyCap.toString(),
          borrowableInIsolation: reserve.borrowableInIsolation,
          baseLTVasCollateral: reserve.baseLTVasCollateral.toString(),
          reserveLiquidationThreshold:
            reserve.reserveLiquidationThreshold.toString(),
          reserveLiquidationBonus: reserve.reserveLiquidationBonus.toString(),
          variableRateSlope1: reserve.variableRateSlope1.toString(),
          variableRateSlope2: reserve.variableRateSlope2.toString(),
          baseVariableBorrowRate: reserve.baseVariableBorrowRate.toString(),
          optimalUsageRatio: reserve.optimalUsageRatio.toString(),

          liquidityIndex: reserve.liquidityIndex.toString(),
          variableBorrowIndex: reserve.variableBorrowIndex.toString(),
          liquidityRate: reserve.liquidityRate.toString(),
          variableBorrowRate: reserve.variableBorrowRate.toString(),

          lastUpdateTimestamp: reserve.lastUpdateTimestamp.toString(),
        });
      }

      return reservesDecorated;
    } catch (e) {
      console.log(e);
    }
    return null;
  }

  async initContractInstances({
    blockNumber,
    ctx,
  }: {
    blockNumber?: number;
    ctx: SqdProcessorContext<Store>;
  }) {
    try {
      const reservesData = await this.getReservesData({ blockNumber });

      if (!reservesData) {
        console.log(`No reserves data found on initContractInstances`);
        return;
      }

      for (const reserve of reservesData) {
        this.moneyMarketReservesDetailsMap.set(
          reserve.underlyingAssetAddress,
          reserve
        );

        // Track available token addresses and their ABIs for pool usage
        this.moneyMarketTokenAddresses.set(
          reserve.aTokenAddress,
          aTokenHydration.abi as any
        );
        this.moneyMarketTokenAddresses.set(
          reserve.variableDebtTokenAddress,
          variableDebtTokenHydration.abi as any
        );
      }
    } catch (e) {
      console.error(e);
    }
  }

  async getReserveDetails(
    address: string
  ): Promise<MoneyMarketTokenDetails | null> {
    const addressNormalized = ethers.utils.getAddress(address);

    const response: MoneyMarketTokenDetails = {
      address: addressNormalized.toLowerCase(),
      resourceType: AssetResourceType.Underlying,
    };

    const contract = this.getMoneyMarketTokenContract(addressNormalized);
    if (!contract) return null;

    this.moneyMarketReservesDetailsMap.forEach(
      (resourceDetails, underlyingAssetAddress) => {
        if (resourceDetails.aTokenAddress === addressNormalized) {
          response.resourceType = AssetResourceType.aToken;
          response.underlyingAssetAddress = underlyingAssetAddress;
          return;
        }
        if (resourceDetails.variableDebtTokenAddress === addressNormalized) {
          response.resourceType = AssetResourceType.Debt;
          response.underlyingAssetAddress = underlyingAssetAddress;
          return;
        }
      }
    );

    try {
      response.name = await contract.name();
    } catch (e) {}
    try {
      response.symbol = await contract.symbol();
    } catch (e) {}
    try {
      response.decimals = await contract.decimals();
    } catch (e) {}

    return response;
  }

  async getResourceDetailsWithLogs(
    address: string
  ): Promise<MoneyMarketTokenDetails | null> {
    return measureEvmContractCall({
      call: `moneyMarketTokenContracts.name|symbol|decimals`,
      originFn: 'getResourceDetailsWithLogs',
      blockHeight: 0,
      args: {
        address,
      },
      fn: () => this.getReserveDetails(address),
    });
  }

  async getTokenTotalSupply(
    address: string,
    blockNumber?: number
  ): Promise<MoneyMarketTokenTotalSupply | null> {
    const addressNormalized = ethers.utils.getAddress(address);

    const response: MoneyMarketTokenTotalSupply = {
      address: ethers.utils.getAddress(address).toLowerCase(),
      value: '0',
    };

    const contract = this.getMoneyMarketTokenContract(addressNormalized);
    if (!contract) return null;

    try {
        response.value = await retryAsync({
          // passThrough: true,
          fn: async () =>
            (await contract.totalSupply({ blockTag: blockNumber })).toString(),
          fallbackResponse: '0',
          tag: `${address}.totalSupply.at(${blockNumber})`,
        });
    } catch (e) {
      console.log(e);
    }

    return response;
  }

  async getManyTokensTotalSupply({
    addresses,
    blockNumber,
  }: {
    addresses: string[];
    blockNumber?: number;
  }): Promise<MoneyMarketTokenTotalSupply[]> {
    const addressNormalizedSet = new Set(
      addresses.map((a) => ethers.utils.getAddress(a))
    );
    const totalResponse: MoneyMarketTokenTotalSupply[] = [];

    await pMap(
      Array.from(addressNormalizedSet.values()),
      async (address) => {
        const response: MoneyMarketTokenTotalSupply = {
          address: ethers.utils.getAddress(address).toLowerCase(),
          value: '0',
        };

        const contract = this.getMoneyMarketTokenContract(address);
        if (contract) {
          try {
            response.value = await retryAsync({
              // passThrough: true,
              fn: async () =>
                (
                  await contract.totalSupply({ blockTag: blockNumber })
                ).toString(),
              fallbackResponse: '0',
              tag: `${address}.totalSupply.at(${blockNumber})`,
            });
          } catch (e) {}
        }

        totalResponse.push(response);
      },
      { concurrency: appConfig.concurrency.EVM_CONTRACT_CALL_CONCURRENCY }
    );

    return totalResponse;
  }

  async getManyTokensTotalSupplyWithLogs(args: {
    addresses: string[];
    blockNumber?: number;
  }): Promise<MoneyMarketTokenTotalSupply[]> {
    return measureEvmContractCall({
      call: `moneyMarketTokenContracts.get(address).totalSupply`,
      originFn: 'getManyTokensTotalSupplyWithLogs',
      blockHeight: args?.blockNumber ?? 0,
      args: args,
      fn: () => this.getManyTokensTotalSupply(args),
    });
  }

  async getAccountTokenBalance({
    accountAddress,
    contractAddress,
    blockNumber,
  }: {
    accountAddress: string;
    contractAddress: string;
    blockNumber?: number;
  }) {
    const contractAddressNormalized = ethers.utils.getAddress(contractAddress);
    const accountAddressNormalized = ethers.utils.getAddress(accountAddress);

    const contract = this.getMoneyMarketTokenContract(
      contractAddressNormalized
    );
    if (!contract) return null;

    try {
      const balance: any = await retryAsync({
        // passThrough: true,
        fn: () =>
          contract.balanceOf(
            accountAddressNormalized,
            blockNumber !== undefined ? { blockTag: blockNumber } : undefined
          ),
        fallbackResponse: null,
        tag: `${contractAddressNormalized}.balanceOf(${accountAddressNormalized}).at(${blockNumber})`,
      });

      if (balance !== undefined && balance !== null)
        return BigInt(balance.toString());
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getAccountTokenBalanceWithLogs(args: {
    accountAddress: string;
    contractAddress: string;
    blockNumber?: number;
  }) {
    return measureEvmContractCall({
      call: `moneyMarketTokenContracts.get().balanceOf`,
      originFn: 'getAccountTokenBalanceWithLogs',
      blockHeight: args?.blockNumber ?? 0,
      args: args,
      fn: () => this.getAccountTokenBalance(args),
    });
  }

  async getAccountMmPositionData({
    accountAddress,
    blockNumber,
  }: {
    accountAddress: string;
    blockNumber?: number;
  }): Promise<AccountMmPositionDataContractData | null> {
    const accountAddressNormalized = ethers.utils.getAddress(accountAddress);

    try {
      const data = await retryAsync<any>({
        // passThrough: true,
        fn: () =>
          this.poolImplementationContractInstance.getUserAccountData(
            accountAddressNormalized,
            blockNumber !== undefined ? { blockTag: blockNumber } : undefined
          ),
        fallbackResponse: null,
      });

      if (!data) return null;

      return {
        totalCollateralBase: ethers.utils.formatUnits(
          data.totalCollateralBase,
          8
        ),
        totalDebtBase: ethers.utils.formatUnits(data.totalDebtBase, 8),
        availableBorrowsBase: ethers.utils.formatUnits(
          data.availableBorrowsBase,
          8
        ),
        currentLiquidationThreshold: BigNumber(
          data.currentLiquidationThreshold.toString()
        )
          .div(100)
          .toFixed(), // Convert to percentage
        ltv: BigNumber(data.ltv.toString()).div(100).toFixed(), // Convert to percentage
        healthFactor: ethers.utils.formatUnits(data.healthFactor, 18),
        pool: appConfig.evm.POOL_IMPLEMENTATION_PROXY_CONTRACT_ADDRESS,
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getAccountMmPositionDataWithLogs(args: {
    accountAddress: string;
    blockNumber?: number;
  }): Promise<AccountMmPositionDataContractData | null> {
    return measureEvmContractCall({
      call: `poolImplementationContractInstance.getUserAccountData`,
      originFn: 'getAccountMmPositionDataWithLogs',
      blockHeight: args?.blockNumber ?? 0,
      args: args,
      fn: () => this.getAccountMmPositionData(args),
    });
  }

  async getUserReservesData({
    accountAddress,
    blockNumber,
  }: {
    accountAddress: string;
    blockNumber?: number;
  }): Promise<UserReserveDataContractData[] | null> {
    const accountAddressNormalized = ethers.utils.getAddress(accountAddress);

    try {
      const data = await retryAsync<any>({
        // passThrough: true,
        fn: () =>
          this.uiPoolDataProviderContractInstance.getUserReservesData(
            ethers.utils.getAddress(
              appConfig.evm.POOL_ADDRESS_PROVIDER_CONTRACT_ADDRESS
            ),
            accountAddressNormalized,
            blockNumber !== undefined ? { blockTag: blockNumber } : undefined
          ),
        fallbackResponse: null,
      });

      if (!data) return null;

      return data[0].map((reserveData: any) => ({
        underlyingAsset: ethers.utils.getAddress(reserveData.underlyingAsset),
        scaledATokenBalance: reserveData.scaledATokenBalance.toString(),
        usageAsCollateralEnabledOnUser:
          reserveData.usageAsCollateralEnabledOnUser,
        scaledVariableDebt: reserveData.scaledVariableDebt.toString(),
        stableBorrowRate: reserveData.stableBorrowRate.toString(),
        principalStableDebt: reserveData.principalStableDebt.toString(),
        stableBorrowLastUpdateTimestamp:
          reserveData.stableBorrowLastUpdateTimestamp.toString(),
      }));
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getUserReservesDataWithLogs(args: {
    accountAddress: string;
    blockNumber?: number;
  }): Promise<UserReserveDataContractData[] | null> {
    return measureEvmContractCall({
      call: `uiPoolDataProviderContractInstance.getUserReservesData`,
      originFn: 'getUserReservesDataWithLogs',
      blockHeight: args?.blockNumber ?? 0,
      args: args,
      fn: () => this.getUserReservesData(args),
    });
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
      call: `hollarContractInstance.getFacilitatorsList`,
      originFn: 'getAllAaveFacilitators',
      blockHeight: blockNumber ?? 0,
      fn: () =>
        retryAsync({
          // passThrough: true,
          fn: () =>
            this.hollarContractInstance.getFacilitatorsList({
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

  /**
   * IMPORTANT: Method cannot provide data at a specific block.
   */
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
        this.hollarContractInstance.getFacilitator(
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
      call: `hollarContractInstance.getFacilitator`,
      originFn: 'getAaveFacilitatorWithLogs',
      blockHeight: args?.blockNumber ?? 0,
      args: args,
      fn: () => this.getAaveFacilitator(args),
    });
  }
}

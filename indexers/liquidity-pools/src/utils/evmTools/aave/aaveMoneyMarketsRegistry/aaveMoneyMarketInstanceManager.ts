import { SqdProcessorContext } from '../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import aTokenHydration from '../../abi/aave/aTokenHydration.json';
import variableDebtTokenHydration from '../../abi/aave/variableDebtTokenHydration.json';
import uiPoolDataProviderV3 from '../../abi/aave/uiPoolDataProviderV3.json';
import poolImplementation from '../../abi/aave/aavePoolImplementation.json';
import { Contract, ContractInterface, ethers } from 'ethers';
import { AssetResourceType, EvmEventName } from '../../../../model';
import { AppConfig } from '../../../../appConfig';
import {
  AaveMoneyMarketInstanceConfig,
  AccountMmPositionDataContractData,
  MoneyMarketResourceDetails,
  MoneyMarketTokenDetails,
  MoneyMarketTokenTotalSupply,
  UserReserveDataContractData,
} from '../types';
import { BigNumber } from '../../../bignumber';
import pMap from 'p-map';
import { getOrderedListByBlockNumber, retryAsync } from '../../../helpers';
import { measureEvmContractCall } from '../../../hydratedLogger/utils';
import { ContractsPoolManager } from '../../contractsPoolManager';
import { BatchBlocksParsedDataManager } from '../../../../parsers/batchBlocksParser';
import { EventName } from '../../../../parsers/types/events';

const appConfig = AppConfig.getInstance();

export class AaveMoneyMarketInstanceManager {
  private readonly contractsPoolManager: ContractsPoolManager;

  private readonly config: AaveMoneyMarketInstanceConfig;

  private readonly poolImplementationProxyAddressNormalized: string;
  private readonly poolAddressProviderAddressNormalized: string;
  private readonly poolDataProviderAddressNormalized: string;

  // Track available money market token addresses and their ABIs
  private moneyMarketTokenAddresses: Map<string, ContractInterface> = new Map();

  public moneyMarketReservesDetailsMap: Map<
    string,
    MoneyMarketResourceDetails
  > = new Map();

  // Cache for MM reserves to avoid repeated EVM calls
  private reservesCacheBlockNumber: number | null = null;

  constructor(config: AaveMoneyMarketInstanceConfig) {
    this.config = config;
    this.poolImplementationProxyAddressNormalized = ethers.utils.getAddress(
      config.poolImplementationProxyAddress
    );
    this.poolAddressProviderAddressNormalized = ethers.utils.getAddress(
      config.poolAddressProviderAddress
    );
    this.poolDataProviderAddressNormalized = ethers.utils.getAddress(
      config.poolDataProviderAddress
    );
    this.contractsPoolManager = ContractsPoolManager.getInstance();
  }

  get marketId(): string {
    return this.config.marketId;
  }

  get poolImplementationProxyAddress(): string {
    return this.poolImplementationProxyAddressNormalized;
  }

  get poolAddressProviderAddress(): string {
    return this.poolAddressProviderAddressNormalized;
  }

  get poolDataProviderAddress(): string {
    return this.poolDataProviderAddressNormalized;
  }

  get treasuryAddress(): string {
    return this.config.treasuryAddress;
  }

  /**
   * Returns true if this market instance owns the given token address
   * (as underlying, aToken, or variable debt token).
   */
  hasToken(address: string): boolean {
    const normalized = ethers.utils.getAddress(address);
    return this.moneyMarketTokenAddresses.has(normalized);
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

  private get uiPoolDataProviderContractInstance(): Contract {
    return this.getContract(
      this.poolDataProviderAddressNormalized,
      uiPoolDataProviderV3.abi as any
    );
  }

  private get poolImplementationContractInstance(): Contract {
    return this.getContract(
      this.poolImplementationProxyAddressNormalized,
      poolImplementation.abi as any
    );
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
            this.poolAddressProviderAddressNormalized,
          poolImplementationProxyAddress:
            this.poolImplementationProxyAddressNormalized,
        },
        fn: () =>
          retryAsync({
            fn: async () =>
              this.uiPoolDataProviderContractInstance.getReservesData(
                this.poolAddressProviderAddressNormalized,
                { blockTag: blockNumber }
              ),
            fallbackResponse: [],
            tag: `getReservesData[${this.poolImplementationProxyAddressNormalized}].at(${blockNumber})`,
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

  isMmReservesCacheInvalidationRequired(
    parsedEvents?: BatchBlocksParsedDataManager | null
  ) {
    if (!parsedEvents) return true;

    for (const eventData of getOrderedListByBlockNumber([
      ...parsedEvents.getSectionByEventName(EventName.EVM_Log).values(),
    ])) {
      // Potentially can be tracked and checked event "Initialized" from aToken
      // and Variable Debt Token contracts
      if (
        eventData.eventData.params?.eventName ===
        EvmEventName.ReserveInitialized
      ) {
        console.log(
          `[${this.config.marketId}] New MM reserve initialisation has been detected at block ${eventData.eventData.metadata.blockHeader.height}. MM reserves cache invalidation required.`
        );
        return true;
      }
    }
    return false;
  }

  async initContractInstances({
    blockNumber,
    ctx,
    invalidateReservesCache = false,
  }: {
    blockNumber?: number;
    ctx: SqdProcessorContext<Store>;
    invalidateReservesCache?: boolean;
  }) {
    try {
      const blockNumberForCache = blockNumber ?? ctx.blocks[0].header.height;
      if (
        !invalidateReservesCache &&
        this.reservesCacheBlockNumber &&
        blockNumberForCache &&
        Math.abs(blockNumberForCache - this.reservesCacheBlockNumber) < 100
      ) {
        return;
      }
      this.reservesCacheBlockNumber = blockNumberForCache;

      const reservesData = await this.getReservesData({ blockNumber });

      if (!reservesData) {
        console.log(
          `[${this.config.marketId}] No reserves data found on initContractInstances`
        );
        return;
      }

      // Reset routing maps so removed reserves don't linger
      this.moneyMarketReservesDetailsMap.clear();
      this.moneyMarketTokenAddresses.clear();

      for (const reserve of reservesData) {
        this.moneyMarketReservesDetailsMap.set(
          reserve.underlyingAssetAddress,
          reserve
        );

        // Track available token addresses and their ABIs for pool usage.
        // This map also serves as the routing index for hasToken() lookups
        // so the registry can route per-token calls to the owning market.
        this.moneyMarketTokenAddresses.set(
          reserve.underlyingAssetAddress,
          aTokenHydration.abi as any
        );
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

  async getReserveDetailsWithLogs(
    address: string
  ): Promise<MoneyMarketTokenDetails | null> {
    return measureEvmContractCall({
      call: `moneyMarketTokenContracts.name|symbol|decimals`,
      originFn: 'getReserveDetailsWithLogs',
      blockHeight: 0,
      args: {
        address,
        poolImplementationProxyAddress:
          this.poolImplementationProxyAddressNormalized,
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
      args: {
        ...args,
        poolImplementationProxyAddress:
          this.poolImplementationProxyAddressNormalized,
      },
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
      args: {
        ...args,
        poolImplementationProxyAddress:
          this.poolImplementationProxyAddressNormalized,
      },
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
          .toFixed(18, BigNumber.ROUND_HALF_UP), // Convert to percentage
        ltv: BigNumber(data.ltv.toString())
          .div(100)
          .toFixed(18, BigNumber.ROUND_HALF_UP), // Convert to percentage
        healthFactor: ethers.utils.formatUnits(data.healthFactor, 18),
        pool: this.poolImplementationProxyAddressNormalized,
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
      args: {
        ...args,
        poolImplementationProxyAddress:
          this.poolImplementationProxyAddressNormalized,
      },
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
            this.poolAddressProviderAddressNormalized,
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
      args: {
        ...args,
        poolImplementationProxyAddress:
          this.poolImplementationProxyAddressNormalized,
      },
      fn: () => this.getUserReservesData(args),
    });
  }
}

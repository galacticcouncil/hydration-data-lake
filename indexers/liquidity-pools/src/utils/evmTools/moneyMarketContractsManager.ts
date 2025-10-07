import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import hollarAbi from './abi/aave/hollar_unstableAbi.json';
import aTokenHydration from './abi/aave/aTokenHydration.json';
import variableDebtTokenHydration from './abi/aave/variableDebtTokenHydration.json';
import uiPoolDataProviderV3 from './abi/aave/uiPoolDataProviderV3.json';
import poolImplementation from './abi/aave/aavePoolImplementation.json';
import { Contract, ContractInterface, ethers } from 'ethers';
import { ResourceType } from '../../model';
import { AppConfig } from '../../appConfig';
import { AccountMmPositionDataContractData } from './types';
import { BigNumber } from '@galacticcouncil/sdk';
import pMap from 'p-map';
import { retryAsync } from '../helpers';
import { measureEvmContractCall } from '../hydratedLogger/utils';

const appConfig = AppConfig.getInstance();

export type MoneyMarketTokenDetails = {
  address: string;
  resourceType: ResourceType;
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

  private readonly provider: ethers.providers.JsonRpcProvider;
  private hollarContractInstance: Contract;
  private erc20TokenContractInstance: Contract;
  private uiPoolDataProviderContractInstance: Contract;
  private poolImplementationContractInstance: Contract;
  private moneyMarketTokenContracts: Map<string, Contract> = new Map();
  public moneyMarketReservesDetailsMap: Map<
    string,
    MoneyMarketResourceDetails
  > = new Map();

  private constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(
      appConfig.RPC_URL_HTTPS || 'https://archive.rpc.hydration.cloud'
    );

    this.erc20TokenContractInstance = new Contract(
      appConfig.evm.ATOKEN_CONTRACT_ADDRESS,
      aTokenHydration.abi,
      this.provider
    );

    this.uiPoolDataProviderContractInstance = new Contract(
      appConfig.evm.UI_POOL_DATA_PROVIDER_CONTRACT_ADDRESS,
      uiPoolDataProviderV3.abi,
      this.provider
    );

    this.poolImplementationContractInstance = new Contract(
      appConfig.evm.POOL_IMPLEMENTATION_PROXY_CONTRACT_ADDRESS,
      poolImplementation.abi,
      this.provider
    );

    this.hollarContractInstance = new Contract(
      appConfig.evm.HOLLAR_CONTRACT_ADDRESS,
      hollarAbi,
      this.provider
    );
  }

  static getInstance(): MoneyMarketContractsManager {
    if (!MoneyMarketContractsManager.instance) {
      MoneyMarketContractsManager.instance = new MoneyMarketContractsManager();
    }
    return MoneyMarketContractsManager.instance;
  }

  private getContractInstance(
    address: string,
    abi: ContractInterface
  ): Contract {
    return new Contract(address, abi, this.provider);
  }

  async getReservesData({
    blockNumber,
  }: {
    blockNumber?: number;
  }): Promise<MoneyMarketResourceDetails[] | null> {
    try {
      // const reservesData = await retryAsync({
      //   fn: async () =>
      //     this.uiPoolDataProviderContractInstance.getReservesData(
      //       appConfig.evm.POOL_ADDRESS_PROVIDER_CONTRACT_ADDRESS,
      //       { blockTag: blockNumber }
      //     ),
      //   fallbackResponse: [],
      //   tag: `getReservesData.at(${blockNumber})`,
      // });

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

        this.moneyMarketTokenContracts.set(
          reserve.aTokenAddress,
          this.getContractInstance(reserve.aTokenAddress, aTokenHydration.abi)
        );
        this.moneyMarketTokenContracts.set(
          reserve.variableDebtTokenAddress,
          this.getContractInstance(
            reserve.variableDebtTokenAddress,
            variableDebtTokenHydration.abi
          )
        );
      }
    } catch (e) {
      console.error(e);
    }
  }

  async getResourceDetails(
    address: string
  ): Promise<MoneyMarketTokenDetails | null> {
    const addressNormalized = ethers.utils.getAddress(address);

    const response: MoneyMarketTokenDetails = {
      address: addressNormalized.toLowerCase(),
      resourceType: ResourceType.Underlying,
    };

    if (!this.moneyMarketTokenContracts.has(addressNormalized)) return null;

    this.moneyMarketReservesDetailsMap.forEach(
      (resourceDetails, underlyingAssetAddress) => {
        if (resourceDetails.aTokenAddress === addressNormalized) {
          response.resourceType = ResourceType.Collateral;
          response.underlyingAssetAddress = underlyingAssetAddress;
          return;
        }
        if (resourceDetails.variableDebtTokenAddress === addressNormalized) {
          response.resourceType = ResourceType.Debt;
          response.underlyingAssetAddress = underlyingAssetAddress;
          return;
        }
      }
    );

    try {
      response.name = await this.moneyMarketTokenContracts
        .get(addressNormalized)!
        .name();
    } catch (e) {}
    try {
      response.symbol = await this.moneyMarketTokenContracts
        .get(addressNormalized)!
        .symbol();
    } catch (e) {}
    try {
      response.decimals = await this.moneyMarketTokenContracts
        .get(addressNormalized)!
        .decimals();
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
      fn: () => this.getResourceDetails(address),
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

    if (!this.moneyMarketTokenContracts.has(addressNormalized)) return null;

    try {
      response.value = await retryAsync({
        // passThrough: true,
        fn: async () =>
          (
            await this.moneyMarketTokenContracts
              .get(address)!
              .totalSupply({ blockTag: blockNumber })
          ).toString(),
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

        if (this.moneyMarketTokenContracts.has(address))
          try {
            response.value = await retryAsync({
              // passThrough: true,
              fn: async () =>
                (
                  await this.moneyMarketTokenContracts
                    .get(address)!
                    .totalSupply({ blockTag: blockNumber })
                ).toString(),
              fallbackResponse: '0',
              tag: `${address}.totalSupply.at(${blockNumber})`,
            });
          } catch (e) {}

        totalResponse.push(response);
      },
      { concurrency: appConfig.concurrency.RUNTIME_API_CALLS_CONCURRENCY }
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
    if (!this.moneyMarketTokenContracts.has(contractAddressNormalized))
      return null;

    try {
      const balance: any = await retryAsync({
        // passThrough: true,
        fn: () =>
          this.moneyMarketTokenContracts
            .get(contractAddressNormalized)!
            .balanceOf(
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

  /**
   * IMPORTANT: Method cannot provide data at a specific block.
   */
  async getAllAaveFacilitators({ blockNumber }: { blockNumber?: number }) {
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

    if (!facilitatorsList) {
      console.log(`No facilitators found`);
      return null;
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

    return facilitatorsData.filter((facilitator) => !!facilitator);
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

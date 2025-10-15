import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import aTokenHydration from './abi/aave/aTokenHydration.json';
import variableDebtTokenHydration from './abi/aave/variableDebtTokenHydration.json';
import uiPoolDataProviderV3 from './abi/aave/uiPoolDataProviderV3.json';
import poolImplementation from './abi/aave/aavePoolImplementation.json';
import { Contract, ContractInterface, ethers } from 'ethers';
import { ResourceType } from '../../model';
import { AppConfig } from '../../appConfig';
import {
  AccountMmPositionDataContractData,
  MoneyMarketReserveDetails,
  MoneyMarketTokenDetails,
} from './types';
import { BigNumber } from '@galacticcouncil/sdk';
import { retryAsync } from '../helpers';

const appConfig = AppConfig.getInstance();

export class MoneyMarketContractsManager {
  private static instance: MoneyMarketContractsManager;

  private readonly provider: ethers.providers.JsonRpcProvider;
  private erc20TokenContractInstance: Contract;
  private uiPoolDataProviderContractInstance: Contract;
  private poolImplementationContractInstance: Contract;
  private moneyMarketTokenContracts: Map<string, Contract> = new Map();
  public moneyMarketReservesDetailsMap: Map<string, MoneyMarketReserveDetails> =
    new Map();

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
  }): Promise<MoneyMarketReserveDetails[] | null> {
    try {
      const reservesData = await retryAsync({
        fn: async () =>
          this.uiPoolDataProviderContractInstance.getReservesData(
            appConfig.evm.POOL_ADDRESS_PROVIDER_CONTRACT_ADDRESS,
            { blockTag: blockNumber }
          ),
        fallbackResponse: [],
        tag: `getReservesData.at(${blockNumber})`,
      });

      const reservesDecorated: MoneyMarketReserveDetails[] = [];

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
    ctx: ProcessorContext<Store>;
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

  async getTokenDetails(
    address: string
  ): Promise<MoneyMarketTokenDetails | null> {
    const addressNormalized = ethers.utils.getAddress(address);

    const response: MoneyMarketTokenDetails = {
      address: ethers.utils.getAddress(address).toLowerCase(),
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
        tag: `getAccountMmPositionData :: getUserAccountData(${accountAddressNormalized}).at(${blockNumber})`,
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
}

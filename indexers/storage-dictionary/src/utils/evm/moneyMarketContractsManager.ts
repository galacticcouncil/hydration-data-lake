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
  MoneyMarketResourceDetails,
  MoneyMarketTokenDetails,
} from './types';
import { BigNumber } from '@galacticcouncil/sdk';

const appConfig = AppConfig.getInstance();

export class MoneyMarketContractsManager {
  private static instance: MoneyMarketContractsManager;

  private readonly provider: ethers.providers.JsonRpcProvider;
  private erc20TokenContractInstance: Contract;
  private uiPoolDataProviderContractInstance: Contract;
  private poolImplementationContractInstance: Contract;
  private moneyMarketTokenContracts: Map<string, Contract> = new Map();
  public moneyMarketResourcesDetailsMap: Map<
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

  async initContractInstances({
    blockNumber,
    ctx,
  }: {
    blockNumber?: number;
    ctx: ProcessorContext<Store>;
  }) {
    try {
      const resourcesData =
        await this.uiPoolDataProviderContractInstance.getReservesData(
          appConfig.evm.POOL_ADDRESS_PROVIDER_CONTRACT_ADDRESS,
          { blockTag: blockNumber }
        );

      for (const {
        underlyingAsset,
        aTokenAddress,
        variableDebtTokenAddress,
        priceOracle,
      } of resourcesData[0]) {
        this.moneyMarketResourcesDetailsMap.set(underlyingAsset, {
          underlyingAssetAddress: underlyingAsset,
          aTokenAddress: aTokenAddress,
          variableDebtTokenAddress: variableDebtTokenAddress,
          priceOracle: priceOracle,
        });

        this.moneyMarketTokenContracts.set(
          aTokenAddress,
          this.getContractInstance(aTokenAddress, aTokenHydration.abi)
        );
        this.moneyMarketTokenContracts.set(
          variableDebtTokenAddress,
          this.getContractInstance(
            variableDebtTokenAddress,
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

    this.moneyMarketResourcesDetailsMap.forEach(
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
      const balance = await this.moneyMarketTokenContracts
        .get(contractAddressNormalized)!
        .balanceOf(
          accountAddressNormalized,
          blockNumber !== undefined ? { blockTag: blockNumber } : undefined
        );

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
      const data =
        await this.poolImplementationContractInstance.getUserAccountData(
          accountAddressNormalized,
          blockNumber !== undefined ? { blockTag: blockNumber } : undefined
        );

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

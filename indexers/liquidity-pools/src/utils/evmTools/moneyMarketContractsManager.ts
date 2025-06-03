import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import aTokenHydration from './abi/aave/aTokenHydration.json';
import variableDebtTokenHydration from './abi/aave/variableDebtTokenHydration.json';
import uiPoolDataProviderV3 from './abi/aave/uiPoolDataProviderV3.json';
import { Contract, ContractInterface, ethers } from 'ethers';
import { ResourceType } from '../../model';

export type MoneyMarketResourceDetails = {
  underlyingAssetAddress: string;
  aTokenAddress: string;
  variableDebtTokenAddress: string;
  priceOracle: string;
};

export type MoneyMarketTokenDetails = {
  address: string;
  resourceType: ResourceType;
  underlyingAssetAddress?: string;
  name?: string;
  symbol?: string;
  decimals?: number;
};

export class MoneyMarketContractsManager {
  private static instance: MoneyMarketContractsManager;

  private readonly provider: ethers.providers.JsonRpcProvider;
  private erc20TokenContractInstance: Contract;
  private uiPoolDataProviderContractInstance: Contract;
  private moneyMarketTokenContracts: Map<string, Contract> = new Map();
  public moneyMarketResourcesDetailsMap: Map<
    string,
    MoneyMarketResourceDetails
  > = new Map();

  private constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(
      'https://archive.rpc.hydration.cloud'
    );

    this.erc20TokenContractInstance = new Contract(
      '0xc0DF4c545BaFA1788a4Ee55f79704D12fC2c7B5C',
      aTokenHydration.abi,
      this.provider
    );

    this.uiPoolDataProviderContractInstance = new Contract(
      '0x112b087b60C1a166130d59266363C45F8aa99db0',
      uiPoolDataProviderV3.abi,
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
    ctx: SqdProcessorContext<Store>;
  }) {
    try {
      const resourcesData =
        await this.uiPoolDataProviderContractInstance.getReservesData(
          '0xf3Ba4D1b50f78301BDD7EAEa9B67822A15FCA691',
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

  // async getUserPoolReservesData({
  //   ctx,
  //   blockHeader,
  //   contractAddress,
  //   accountH160Address,
  // }: {
  //   ctx: SqdProcessorContext<Store>;
  //   blockHeader: SqdBlock;
  //   contractAddress: string;
  //   accountH160Address: string;
  // }) {
  //   // const userReserves = await this.poolDataProviderContract.getReservesHumanized({
  //   //   lendingPoolAddressProvider: contractAddress,
  //   // });
  //   const userReserves =
  //     await this.poolDataProviderContract.getReservesHumanized({
  //       lendingPoolAddressProvider: contractAddress,
  //       // user: accountH160Address,
  //     });
  //
  //   return userReserves;
  // }

  // async getUserWalletBalances({
  //   ctx,
  //   blockHeader,
  //   contractAddress,
  //   accountH160Address,
  // }: {
  //   ctx: SqdProcessorContext<Store>;
  //   blockHeader: SqdBlock;
  //   contractAddress: string;
  //   accountH160Address: string;
  // }) {
  //   const userReserves =
  //     await this.walletBalanceProviderContract.getUserWalletBalancesForLendingPoolProvider(
  //       accountH160Address,
  //       contractAddress
  //     );
  //
  //   return userReserves;
  // }

  // async getATokenBalance({
  //   ctx,
  //   blockHeader,
  //   token,
  //   accountH160Address,
  // }: {
  //   ctx: SqdProcessorContext<Store>;
  //   blockHeader: SqdBlock;
  //   token: 'USDT' | 'USDC';
  //   accountH160Address: string;
  // }) {
  //   const userReserves =
  //     await this.usdtATokenV3ServiceContract.balanceOf(accountH160Address);
  //
  //   return userReserves;
  // }

  // private static async contractRpcCall({
  //   ctx,
  //   blockNumber = 'latest',
  //   abi,
  //   toAddress,
  //   functionName,
  //   functionData,
  // }: {
  //   ctx: SqdProcessorContext<Store>;
  //   blockNumber?: number | string;
  //   abi: any[];
  //   toAddress: string;
  //   functionName: string;
  //   functionData: any[];
  // }) {
  //   const iface = new Interface(abi);
  //
  //   const response = await fetch(ctx.appConfig.RPC_URL_HTTPS || '', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       id: 1,
  //       jsonrpc: '2.0',
  //       method: 'eth_call',
  //       params: [
  //         {
  //           to: toAddress,
  //           data: iface.encodeFunctionData(functionName, functionData),
  //         },
  //         blockNumber,
  //       ],
  //     }),
  //   });
  //
  //   if (response.status !== 200) {
  //     const message = `[${response.statusText}]: Error fetching ${toAddress}.${functionName}(...)`;
  //     console.error(message);
  //     return null;
  //   }
  //
  //   const { result } = await response.json();
  //
  //   if (!result) return null;
  //
  //   try {
  //     return iface.decodeFunctionResult(functionName, result);
  //   } catch (error) {
  //     const message = `Error decoding Result [${toAddress}.${functionName}]`;
  //     console.error(message);
  //     return null;
  //   }
  //
  //   // return formatReserves({
  //   //   reserves: decodedResult,
  //   //   currentTimestamp: Math.floor(Date.now() / 1000),
  //   //   marketReferencePriceInUsd: decodedResult[1].marketReferencePriceInUsd,
  //   //   marketReferenceCurrencyDecimals:
  //   //     decodedResult[1].marketReferenceCurrencyDecimals,
  //   // });
  //
  //   // const result = decoders.v264.EthCall.balanceOf.dec(
  //   //   await blockHeader._runtime.rpc.call(`eth_call`, [
  //   //     {
  //   //       to: toAddress,
  //   //       data: iface.encodeFunctionData(functionName, functionData),
  //   //     },
  //   //   ])
  //   // );
  //   // const result = await blockHeader._runtime.rpc.call(`eth_call`, [
  //   //   {
  //   //     to: toAddress,
  //   //     data: iface.encodeFunctionData(functionName, functionData),
  //   //   },
  //   // ]);
  //
  //   // return result;
  // }

  // static async getATokenAccountBalance({
  //   ctx,
  //   blockNumber,
  //   contractAddress,
  //   accountH160Address,
  // }: {
  //   ctx: SqdProcessorContext<Store>;
  //   blockNumber?: number;
  //   contractAddress: string;
  //   accountH160Address: string;
  // }) {
  //   // return this.contractRpcCall({
  //   //   ctx,
  //   //   blockNumber,
  //   //   abi: aTokenHydration.abi,
  //   //   toAddress: contractAddress,
  //   //   functionName: 'balanceOf',
  //   //   functionData: [accountH160Address],
  //   // });
  //
  //   const provider = new ethers.providers.JsonRpcProvider(
  //     'https://archive.rpc.hydration.cloud'
  //   );
  //
  //   const contract = new Contract(
  //     contractAddress,
  //     aTokenHydration.abi,
  //     provider
  //   );
  //
  //   return contract.balanceOf(accountH160Address, { blockTag: blockNumber });
  // }

  // static async getReservesData({
  //   ctx,
  //   blockNumber,
  // }: {
  //   ctx: SqdProcessorContext<Store>;
  //   blockNumber?: number;
  // }) {
  //   // return this.contractRpcCall({
  //   //   ctx,
  //   //   blockNumber,
  //   //   abi: uiPoolDataProviderV3.abi,
  //   //   toAddress: '0x112b087b60C1a166130d59266363C45F8aa99db0',
  //   //   functionName: 'getReservesData',
  //   //   functionData: ['0xf3Ba4D1b50f78301BDD7EAEa9B67822A15FCA691'],
  //   // });
  //
  //   const provider = new ethers.providers.JsonRpcProvider(
  //     'https://archive.rpc.hydration.cloud'
  //   );
  //
  //   // const contract = new Contract(
  //   //   '0x112b087b60C1a166130d59266363C45F8aa99db0',
  //   //   uiPoolDataProviderV3.abi,
  //   //   provider
  //   // );
  //
  //   const contract = new Contract(
  //     '0x32a8090E20748e530670FF520C4AbC903dB7e127',
  //     aTokenHydration.abi,
  //     provider
  //   );
  //
  //   // return contract.getReservesData(
  //   //   '0xf3Ba4D1b50f78301BDD7EAEa9B67822A15FCA691',
  //   //   { blockTag: blockNumber }
  //   // );
  //
  //   return contract.symbol({ blockTag: blockNumber });
  // }

  // static async getDebtTokenContractDetails({
  //   ctx,
  //   blockNumber,
  //   contractAddress,
  // }: {
  //   ctx: SqdProcessorContext<Store>;
  //   blockNumber?: number;
  //   contractAddress: string;
  // }) {
  //   return this.contractRpcCall({
  //     ctx,
  //     blockNumber,
  //     abi: variableDebtTokenHydration.abi,
  //     toAddress: contractAddress,
  //     functionName: 'getReservesData',
  //     functionData: [],
  //   });
  // }
}

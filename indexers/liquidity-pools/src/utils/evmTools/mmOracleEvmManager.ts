import { Contract, ContractInterface, ethers, BigNumber } from 'ethers';
import { AppConfig } from '../../appConfig';
import { AGGREGATOR_V3_ABI } from './abi/mmOracle/mmOracleAbi';
import { PQueueManager } from '../pQueueManager';
import type { pool } from '@galacticcouncil/sdk-next';
type IPersistentMmOracleEntry = pool.IPersistentMmOracleEntry;

export class MmOracleManager {
  private static instance: MmOracleManager;
  private readonly provider: ethers.providers.JsonRpcProvider;

  static getInstance(): MmOracleManager {
    if (!MmOracleManager.instance) {
      MmOracleManager.instance = new MmOracleManager();
    }
    return MmOracleManager.instance;
  }

  constructor() {
    const appConfig = AppConfig.getInstance();
    this.provider = new ethers.providers.JsonRpcProvider(
      appConfig.RPC_URL_HTTPS || 'https://archive.rpc.hydration.cloud'
    );
  }

  private getAggregatorContractInstance(address: string): Contract {
    return new Contract(address, AGGREGATOR_V3_ABI, this.provider);
  }

  async getAggregatorMmOracleData({
    address,
    blockHeight,
    blockTimeInSec = 6,
  }: {
    blockHeight: number;
    address: string;
    blockTimeInSec?: number;
  }): Promise<IPersistentMmOracleEntry | null> {
    try {
      const aggregatorContract = this.getAggregatorContractInstance(address);

      const [data, decimals, block] = await Promise.all([
        retryAsync({
          fn: async () =>
        aggregatorContract.latestRoundData({
          blockTag: blockHeight,
        }),
          throwErrorOnRetriesLimit: true,
          fallbackResponse: 0,
          tag: `aggregatorContract.latestRoundData.at(${blockHeight})`,
        }),
        retryAsync({
          fn: async () =>
        aggregatorContract.decimals({
          blockTag: blockHeight,
        }),
          throwErrorOnRetriesLimit: true,
          fallbackResponse: 0,
          tag: `aggregatorContract.decimals.at(${blockHeight})`,
        }),
        retryAsync({
          fn: async () => this.provider.getBlock(blockHeight),
          throwErrorOnRetriesLimit: true,
          fallbackResponse: {} as unknown as any,
          tag: `provider.getBlock.at(${blockHeight})`,
        }),
      ]);

      if (decimals === 0) throw Error('Decimals is 0');

      const [roundId, answer, startedAt, updatedAt] = data;
      const updatedAtBlock =
        block.number - (block.timestamp - updatedAt) / blockTimeInSec;
      const updatedAtNum = Math.round(updatedAtBlock);

      return {
        address,
        price: (answer as BigNumber).toString(),
        decimals: decimals,
        updatedAt: updatedAtNum < 0 ? 0 : updatedAtNum,
      };
    } catch (e) {
      console.log(e);
    }
    return null;
  }
}

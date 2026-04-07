import { Contract, ContractInterface, ethers, BigNumber } from 'ethers';
import { AppConfig } from '../../appConfig';
import { AGGREGATOR_V3_ABI } from './abi/mmOracle/mmOracleAbi';
import { PQueueManager } from '../pQueueManager';
import type { pool } from '@galacticcouncil/sdk-next';
import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { retryAsync } from '../helpers';
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
    ctx,
  }: {
    blockHeight: number;
    address: string;
    blockTimeInSec?: number;
    ctx: SqdProcessorContext<Store>;
  }): Promise<IPersistentMmOracleEntry | null> {
    try {
      const aggregatorContract = this.getAggregatorContractInstance(address);

      // const [data, decimals, block] = await Promise.all([
      //   aggregatorContract.latestRoundData({
      //     blockTag: blockHeight,
      //   }),
      //   aggregatorContract.decimals({
      //     blockTag: blockHeight,
      //   }),
      //   this.provider.getBlock(blockHeight),
      // ]);
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

      let evmBlockNumber = block?.number;
      let evmBlockTimestamp = block?.timestamp;

      if (!block) {
        const substrateBlock =
          ctx.batchState.getBlockHeaderByBlockHeight(blockHeight);
        evmBlockNumber = blockHeight;

        if (!substrateBlock.timestamp) throw Error('No timestamp');

        evmBlockTimestamp = substrateBlock.timestamp / 1000;
      }

      const [roundId, answer, startedAt, updatedAt] = data;
      const updatedAtBlock =
        evmBlockNumber - (evmBlockTimestamp - updatedAt) / blockTimeInSec;
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

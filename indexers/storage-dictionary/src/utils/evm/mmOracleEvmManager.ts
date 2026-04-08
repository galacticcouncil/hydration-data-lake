import { Contract, ContractInterface, ethers, BigNumber } from 'ethers';
import { AppConfig } from '../../appConfig';
import { AGGREGATOR_V3_ABI } from './abi/mmOracle/mmOracleAbi';
import { Store } from '@subsquid/typeorm-store';
import { ProcessorContext } from '../../processor';

export interface IPersistentMmOracleEntry {
  address: string;
  price: string;
  decimals: number;
  updatedAt: number;
}

const appConfig = AppConfig.getInstance();

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
    ctx: ProcessorContext<Store>;
  }): Promise<IPersistentMmOracleEntry | null> {
    try {
      const aggregatorContract = this.getAggregatorContractInstance(address);

      const [data, decimals, block] = await Promise.all([
        aggregatorContract.latestRoundData({
          blockTag: blockHeight,
        }),
        aggregatorContract.decimals({
          blockTag: blockHeight,
        }),
        this.provider.getBlock(blockHeight),
      ]);

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

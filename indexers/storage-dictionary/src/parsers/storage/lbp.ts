import { BlockHeader } from '@subsquid/substrate-processor';
import { LbpPoolData } from '../types/storage';
import { storage } from '../../typegenTypes/';
import { UnknownVersionError } from '../../utils/errors';

async function getAllPoolData(block: BlockHeader): Promise<LbpPoolData[]> {
  let pairsPaged: LbpPoolData[] = [];

  if (block.specVersion < 176) return [];

  if (storage.lbp.poolData.v176.is(block)) {
    for await (let page of storage.lbp.poolData.v176.getPairsPaged(100, block))
      pairsPaged.push(
        ...page
          .filter((p) => !!p && !!p[1])
          .map(([poolAddress, poolData]) => ({
            poolAddress,
            assetAId: poolData!.assets[0],
            assetBId: poolData!.assets[1],
            owner: poolData!.owner,
            start: poolData!.start,
            end: poolData!.end,
            initialWeight: poolData!.initialWeight,
            finalWeight: poolData!.finalWeight,
            weightCurve: poolData!.weightCurve,
            fee: poolData!.fee,
            feeCollector: poolData!.feeCollector,
            repayTarget: BigInt(poolData!.repayTarget),
          }))
      );
    return pairsPaged;
  }

  throw new UnknownVersionError('storage.lbp.poolData');
}

export default { getAllPoolData };

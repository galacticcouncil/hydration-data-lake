import { storage } from '../typegenTypes/';
import {
  LbpGetAllPoolsDataInput,
  LbpGetPoolDataInput,
  LbpPoolData,
} from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';

async function getPoolData({
  poolAddress,
  block,
}: LbpGetPoolDataInput): Promise<LbpPoolData | null> {
  if (block.specVersion < 276) return null;

  if (storage.lbp.poolData.v276.is(block)) {
    const resp = await storage.lbp.poolData.v276.get(block, poolAddress);

    if (!resp) return null;

    return {
      poolAddress,
      assetAId: resp.assets[0],
      assetBId: resp.assets[1],
      owner: resp.owner,
      start: resp.start,
      end: resp.end,
      initialWeight: resp.initialWeight,
      finalWeight: resp.finalWeight,
      weightCurve: resp.weightCurve,
      fee: resp.fee,
      feeCollector: resp.feeCollector,
      repayTarget: BigInt(resp.repayTarget),
    };
  }

  throw new UnknownVersionError('storage.lbp.poolData');
}

async function getAllPoolsData({
  block,
}: LbpGetAllPoolsDataInput): Promise<LbpPoolData[]> {
  let pairsPaged: LbpPoolData[] = [];

  if (block.specVersion < 276) return [];

  if (storage.lbp.poolData.v276.is(block)) {
    for await (let page of storage.lbp.poolData.v276.getPairsPaged(100, block))
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

export default { getPoolData, getAllPoolsData };
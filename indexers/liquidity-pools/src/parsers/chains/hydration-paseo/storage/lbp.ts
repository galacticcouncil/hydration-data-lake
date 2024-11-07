import { storage } from '../typegenTypes/';
import { LbpGetPoolDataInput, LbpPoolData } from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';

async function getPoolData({
  poolAddress,
  block,
}: LbpGetPoolDataInput): Promise<LbpPoolData | null> {
  if (block.specVersion < 257) return null;

  if (storage.lbp.poolData.v257.is(block)) {
    const resp = await storage.lbp.poolData.v257.get(block, poolAddress);

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

export default { getPoolData };

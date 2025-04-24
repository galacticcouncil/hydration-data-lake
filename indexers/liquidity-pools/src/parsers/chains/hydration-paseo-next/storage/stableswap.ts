import { storage } from '../typegenTypes/';
import {
  StablepoolGetPoolDataInput,
  StablepoolInfo,
} from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';

async function getPoolData({
  poolId,
  block,
}: StablepoolGetPoolDataInput): Promise<StablepoolInfo | null> {
  if (storage.stableswap.pools.v276.is(block)) {
    const resp = await storage.stableswap.pools.v276.get(block, poolId);
    if (!resp) return null;

    return {
      ...resp,
      // maxInRatio: 0n,
      // maxOutRatio: 0n,
      // minTradingLimit: 0n,
      // amplificationRange: [0, 0],
      // minPoolLiquidity: 0n,
    };
  }

  throw new UnknownVersionError('storage.stableswap.pools');
}

export default { getPoolData };

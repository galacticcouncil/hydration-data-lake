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
  if (storage.stableswap.pools.v183.is(block)) {
    const resp = await storage.stableswap.pools.v183.get(block, poolId);
    return resp ?? null;
  }

  throw new UnknownVersionError('storage.stableswap.pools');
}

export default { getPoolData };

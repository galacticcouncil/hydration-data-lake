import { BlockHeader } from '@subsquid/substrate-processor';
import { storage } from '../typegenTypes/';
import { UnknownVersionError } from '../../../../utils/errors';

async function getTotalIssuance(block: BlockHeader): Promise<bigint | null> {
  if (storage.balances.totalIssuance.v100.is(block)) {
    const resp = await storage.balances.totalIssuance.v100.get(block);
    return resp ?? null;
  }

  throw new UnknownVersionError('storage.balances.totalIssuance');
}

export default {
  getTotalIssuance,
};

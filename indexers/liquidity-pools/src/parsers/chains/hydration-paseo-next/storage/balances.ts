import { storage } from '../typegenTypes/';
import { UnknownVersionError } from '../../../../utils/errors';
import { GetConstantsInput } from '../../../types/storage';

async function getTotalIssuance({
  block,
}: GetConstantsInput): Promise<bigint | null> {
  if (storage.balances.totalIssuance.v324.is(block)) {
    const resp = await storage.balances.totalIssuance.v324.get(block);
    return resp ?? null;
  }

  throw new UnknownVersionError('storage.balances.totalIssuance');
}

export default {
  getTotalIssuance,
};

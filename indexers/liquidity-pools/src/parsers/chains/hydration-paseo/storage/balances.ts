import { BlockHeader } from '@subsquid/substrate-processor';
import { storage } from '../typegenTypes/';
import { UnknownVersionError } from '../../../../utils/errors';
import {
  BalancesAccountInfoWithAccountId,
  GetConstantsInput,
  GetNativeTokenBalanceManyInput,
} from '../../../types/storage';
import { tryExecOrReturnFallback } from '../../../../utils/helpers';

async function getTotalIssuance({
  block,
}: GetConstantsInput): Promise<bigint | null> {
  if (storage.balances.totalIssuance.v287.is(block)) {
    const resp = await storage.balances.totalIssuance.v287.get(block);
    return resp ?? null;
  }

  throw new UnknownVersionError('storage.balances.totalIssuance');
}

export default {
  getTotalIssuance,
};

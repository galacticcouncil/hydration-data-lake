import { storage } from '../typegenTypes/';
import { UnknownVersionError } from '../../../../utils/errors';
import {
  BalancesAccountInfoWithAccountId,
  GetConstantsInput,
  GetNativeTokenBalanceManyInput,
} from '../../../types/storage';
import { tryExecOrReturnFallback } from '../../../../utils/helpers';
import { measureStorageFetch } from '../../../../utils/hydratedLogger/utils';

async function getTotalIssuance({
  block,
}: GetConstantsInput): Promise<bigint | null> {
  return measureStorageFetch({
    storageName: 'balances.totalIssuance.get',
    originFn: 'getTotalIssuance',
    blockHeight: block.height,
    fn: async () => {
      if (block.specVersion < 100) return null;
      if (
        storage.balances.totalIssuance.v100.is(block) ||
        block.specVersion >= 100
      ) {
        return tryExecOrReturnFallback(async () => {
          const resp = await storage.balances.totalIssuance.v100.get(block);
          return resp ?? null;
        }, null);
      }

      throw new UnknownVersionError('storage.balances.totalIssuance');
    },
  });
}

export default {
  getTotalIssuance,
};

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
  if (storage.balances.totalIssuance.v324.is(block)) {
    const resp = await storage.balances.totalIssuance.v324.get(block);
    return resp ?? null;
  }

  throw new UnknownVersionError('storage.balances.totalIssuance');
}

async function getNativeTokenBalanceMany({
  accountIds,
  block,
}: GetNativeTokenBalanceManyInput): Promise<
  BalancesAccountInfoWithAccountId[]
> {
  if (block.specVersion < 324) return [];

  if (storage.balances.account.v324.is(block) || block.specVersion >= 324) {
    return tryExecOrReturnFallback(async () => {
      const resp = await storage.balances.account.v324.getMany(
        block,
        accountIds
      );

      const decoratedResp: BalancesAccountInfoWithAccountId[] = [];

      accountIds.forEach((accountId, index) => {
        if (!resp[index]) {
          decoratedResp.push({
            accountId,
            data: {
              free: 0n,
              reserved: 0n,
              miscFrozen: 0n,
              feeFrozen: 0n,
              flags: 0n,
            },
          });
        } else {
          decoratedResp.push({
            accountId,
            data: {
              free: resp[index].free,
              reserved: resp[index].reserved,
              frozen: resp[index].frozen,
              miscFrozen: 0n,
              feeFrozen: 0n,
              flags: resp[index].flags,
            },
          });
        }
      });

      return decoratedResp;
    }, []);
  }

  throw new UnknownVersionError('storage.balances.account');
}

export default {
  getTotalIssuance,
  getNativeTokenBalanceMany,
};

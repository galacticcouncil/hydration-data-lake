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
}

async function getNativeTokenBalanceMany({
  accountIds,
  block,
}: GetNativeTokenBalanceManyInput): Promise<
  BalancesAccountInfoWithAccountId[]
> {
  if (block.specVersion < 100) return [];

  if (
    storage.balances.account.v100.is(block) ||
    (block.specVersion >= 100 && block.specVersion < 205)
  ) {
    return tryExecOrReturnFallback(async () => {
      const resp = await storage.balances.account.v100.getMany(
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
              miscFrozen: resp[index].miscFrozen,
              feeFrozen: 0n,
              flags: 0n,
            },
          });
        }
      });

      return decoratedResp;
    }, []);
  }

  if (storage.balances.account.v205.is(block) || block.specVersion >= 205) {
    return tryExecOrReturnFallback(async () => {
      const resp = await storage.balances.account.v205.getMany(
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

import { BlockHeader } from '@subsquid/substrate-processor';
import { storage } from '../typegenTypes/';
import {
  BalancesAccountInfoWithAccountId,
  GetDataAtBlockInput,
  GetNativeTokenBalanceManyInput,
  SystemAccountInfo,
} from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';
import { measureStorageFetch } from '../../../../utils/hydratedLogger/utils';
import { tryExecOrReturnFallback } from '../../../../utils/helpers';

async function getSystemAccount(
  account: string,
  block: BlockHeader
): Promise<SystemAccountInfo | null> {
  return measureStorageFetch({
    storageName: 'system.account.get',
    originFn: 'getSystemAccount',
    blockHeight: block.height,
    args: { account },
    fn: async () => {
      if (storage.system.account.v205.is(block)) {
        const resp = await storage.system.account.v205.get(block, account);
        if (!resp) return null;

        return {
          nonce: resp.nonce,
          consumers: resp.consumers,
          providers: resp.providers,
          sufficients: resp.sufficients,
          data: {
            free: resp.data.free,
            reserved: resp.data.reserved,
            miscFrozen: BigInt(0),
            feeFrozen: BigInt(0),
            frozen: resp.data.frozen,
            flags: resp.data.flags,
          },
        };
      }

      if (storage.system.account.v100.is(block)) {
        const resp = await storage.system.account.v100.get(block, account);
        if (!resp) return null;

        return {
          nonce: resp.nonce,
          consumers: resp.consumers,
          providers: resp.providers,
          sufficients: resp.sufficients,
          data: {
            free: resp.data.free,
            reserved: resp.data.reserved,
            miscFrozen: resp.data.miscFrozen,
            feeFrozen: resp.data.feeFrozen,
            flags: BigInt(0),
            frozen: BigInt(0),
          },
        };
      }

      throw new UnknownVersionError('storage.system.account');
    },
  });
}

async function getAllSystemAccountKeys({
  block,
}: GetDataAtBlockInput): Promise<string[] | null> {
  return measureStorageFetch({
    storageName: 'system.account.getKeysPaged',
    originFn: 'getAllSystemAccountKeys',
    blockHeight: block.height,
    fn: async () => {
      if (storage.system.account.v205.is(block)) {
        const resp = [];

        for await (const page of storage.system.account.v205.getKeysPaged(
          500,
          block
        )) {
          resp.push(page);
        }

        return resp.flat();
      }

      if (storage.system.account.v100.is(block)) {
        const resp = [];

        for await (const page of storage.system.account.v100.getKeysPaged(
          500,
          block
        )) {
          resp.push(page);
        }

        return resp.flat();
      }

      throw new UnknownVersionError('storage.system.account');
    },
  });
}

async function getNativeTokenBalanceMany({
  accountIds,
  block,
}: GetNativeTokenBalanceManyInput): Promise<
  BalancesAccountInfoWithAccountId[]
> {
  return measureStorageFetch({
    storageName: 'system.account.getMany',
    originFn: 'getNativeTokenBalanceMany',
    blockHeight: block.height,
    args: { accountIds },
    fn: async () => {
      if (block.specVersion < 100) return [];

      if (
        storage.system.account.v100.is(block) ||
        (block.specVersion >= 100 && block.specVersion < 205)
      ) {
        return tryExecOrReturnFallback(async () => {
          const resp = await storage.system.account.v100.getMany(
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
                  free: resp[index].data.free,
                  reserved: resp[index].data.reserved,
                  miscFrozen: resp[index].data.miscFrozen,
                  feeFrozen: resp[index].data.feeFrozen,
                  flags: 0n,
                },
              });
            }
          });

          return decoratedResp;
        }, []);
      }

      if (storage.system.account.v205.is(block) || block.specVersion >= 205) {
        return tryExecOrReturnFallback(async () => {
          const resp = await storage.system.account.v205.getMany(
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
                  free: resp[index].data.free,
                  reserved: resp[index].data.reserved,
                  frozen: resp[index].data.frozen,
                  miscFrozen: 0n,
                  feeFrozen: 0n,
                  flags: resp[index].data.flags,
                },
              });
            }
          });

          return decoratedResp;
        }, []);
      }

      throw new UnknownVersionError('storage.system.account');
    },
  });
}

export default {
  getNativeTokenBalanceMany,
  getSystemAccount,
  getAllSystemAccountKeys,
};

import { BlockHeader } from '@subsquid/substrate-processor';
import { storage } from '../typegenTypes/';
import {
  GetTokenBalancesManyInput,
  TokenAccountBalancesWithAccountId,
  TokenAccountBalanceWithAssetId,
  TokensAccountsAssetBalances,
  TokensGetTokensTotalIssuanceInput,
  TokensGetTokenTotalIssuanceInput,
  TokenTotalIssuance,
} from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';
import { tryExecOrReturnFallback } from '../../../../utils/helpers';
import { measureStorageFetch } from '../../../../utils/hydratedLogger/utils';

async function getTokensAccountsAssetBalances(
  account: string,
  assetId: number,
  block: BlockHeader
): Promise<TokensAccountsAssetBalances | null> {
  return measureStorageFetch({
    storageName: 'tokens.accounts.get',
    originFn: 'getTokensAccountsAssetBalances',
    blockHeight: block.height,
    args: { account, assetId },
    fn: async () => {
      if (block.specVersion < 108) return null;
      if (storage.tokens.accounts.v108.is(block)) {
        const resp = await storage.tokens.accounts.v108.get(
          block,
          account,
          assetId
        );
        return resp ?? null;
      }

      throw new UnknownVersionError('storage.tokens.accounts');
    },
  });
}

async function getTokenTotalIssuance({
  tokenId,
  block,
}: TokensGetTokenTotalIssuanceInput): Promise<bigint | null> {
  return measureStorageFetch({
    storageName: 'tokens.totalIssuance.get',
    originFn: 'getTokenTotalIssuance',
    blockHeight: block.height,
    args: { tokenId },
    fn: async () => {
      if (block.specVersion < 108) return null;
      if (storage.tokens.totalIssuance.v108.is(block)) {
        const resp = await storage.tokens.totalIssuance.v108.get(
          block,
          tokenId
        );
        return resp ?? null;
      }

      throw new UnknownVersionError('storage.tokens.totalIssuance');
    },
  });
}

async function getManyTokensTotalIssuance({
  tokenIds,
  block,
}: TokensGetTokensTotalIssuanceInput): Promise<TokenTotalIssuance[]> {
  return measureStorageFetch({
    storageName: 'tokens.totalIssuance.getPairsPaged',
    originFn: 'getManyTokensTotalIssuance',
    blockHeight: block.height,
    args: { tokenIds },
    fn: async () => {
      if (block.specVersion < 108) return [];

      const tokenIdsSet = new Set(tokenIds.map((id) => `${id}`));

      if (storage.tokens.totalIssuance.v108.is(block)) {
        const pairsPaged = [];

        for await (const page of storage.tokens.totalIssuance.v108.getPairsPaged(
          500,
          block
        )) {
          pairsPaged.push(
            ...page
              // .filter((p) => !!p && p[1] !== undefined && p[1] !== null)
              .map(([assetId, amount]) => ({
                tokenId: `${assetId}`,
                amount: amount ?? null,
              }))
              .filter((p) => tokenIdsSet.has(p.tokenId))
          );
        }
        return pairsPaged;
      }

      throw new UnknownVersionError('storage.tokens.totalIssuance');
    },
  });
}

async function getTokenBalancesMany({
  accountIds,
  block,
}: GetTokenBalancesManyInput): Promise<TokenAccountBalancesWithAccountId[]> {
  return measureStorageFetch({
    storageName: 'tokens.accounts.getPairsPaged',
    originFn: 'getTokenBalancesMany',
    blockHeight: block.height,
    args: { accountIds },
    fn: async () => {
      if (block.specVersion < 108) return [];

      if (storage.tokens.accounts.v108.is(block) || block.specVersion >= 108) {
        return tryExecOrReturnFallback(async () => {
          const accountBalances: TokenAccountBalancesWithAccountId[] = [];

          for (const accountId of accountIds) {
            const assetBalances: TokenAccountBalanceWithAssetId[] = [];

            for await (const page of storage.tokens.accounts.v108.getPairsPaged(
              500,
              block,
              accountId
            ))
              assetBalances.push(
                ...page
                  .filter((p) => !!p && !!p[0] && !!p[0][1])
                  .map(([[accId, assetId], balance]) => ({
                    assetId: `${assetId}`,
                    data: {
                      free: balance!.free,
                      reserved: balance!.reserved,
                      frozen: balance!.frozen,
                      miscFrozen: 0n,
                      feeFrozen: 0n,
                      flags: 0n,
                    },
                  }))
              );

            accountBalances.push({
              accountId,
              assetBalances,
            });
          }

          return accountBalances;
        }, []);
      }

      throw new UnknownVersionError('storage.balances.account');
    },
  });
}

export default {
  getTokensAccountsAssetBalances,
  getTokenTotalIssuance,
  getManyTokensTotalIssuance,
  getTokenBalancesMany,
};

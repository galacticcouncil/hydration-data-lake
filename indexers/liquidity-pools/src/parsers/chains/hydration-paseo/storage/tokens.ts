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

async function getTokensAccountsAssetBalances(
  account: string,
  assetId: number,
  block: BlockHeader
): Promise<TokensAccountsAssetBalances | null> {
  if (storage.tokens.accounts.v287.is(block)) {
    const resp = await storage.tokens.accounts.v287.get(
      block,
      account,
      assetId
    );
    return resp ?? null;
  }

  throw new UnknownVersionError('storage.tokens.accounts');
}

async function getTokenTotalIssuance({
  tokenId,
  block,
}: TokensGetTokenTotalIssuanceInput): Promise<bigint | null> {
  if (storage.tokens.totalIssuance.v287.is(block)) {
    const resp = await storage.tokens.totalIssuance.v287.get(block, tokenId);
    return resp ?? null;
  }

  throw new UnknownVersionError('storage.tokens.totalIssuance');
}

async function getManyTokensTotalIssuance({
  tokenIds,
  block,
}: TokensGetTokensTotalIssuanceInput): Promise<TokenTotalIssuance[]> {
  if (block.specVersion < 287) return [];

  if (storage.tokens.totalIssuance.v287.is(block)) {
    const resp = await storage.tokens.totalIssuance.v287.getMany(
      block,
      tokenIds.map((id) => +id)
    );
    if (!resp) return [];

    const decoratedResp: TokenTotalIssuance[] = [];
    tokenIds.forEach((tokenId, index) => {
      if (!resp[index]) {
        decoratedResp.push({ tokenId: `${tokenId}`, amount: null });
      } else {
        decoratedResp.push({
          tokenId: `${tokenId}`,
          amount: resp[index],
        });
      }
    });
    return decoratedResp;
  }

  throw new UnknownVersionError('storage.tokens.totalIssuance');
}

async function getTokenBalancesMany({
  accountIds,
  block,
}: GetTokenBalancesManyInput): Promise<TokenAccountBalancesWithAccountId[]> {
  if (block.specVersion < 287) return [];

  if (storage.tokens.accounts.v287.is(block) || block.specVersion >= 287) {
    return tryExecOrReturnFallback(async () => {
      const accountBalances: TokenAccountBalancesWithAccountId[] = [];

      for (const accountId of accountIds) {
        const assetBalances: TokenAccountBalanceWithAssetId[] = [];

        for await (const page of storage.tokens.accounts.v287.getPairsPaged(
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
}

export default {
  getTokensAccountsAssetBalances,
  getTokenTotalIssuance,
  getManyTokensTotalIssuance,
  getTokenBalancesMany,
};

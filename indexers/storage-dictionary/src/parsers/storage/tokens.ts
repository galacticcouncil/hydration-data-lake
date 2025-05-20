import { BlockHeader } from '@subsquid/substrate-processor';
import {
  TokensAccountsAssetBalances, TokensGetTokensTotalIssuanceInput,
  TokensGetTokenTotalIssuanceInput, TokenTotalIssuance,
} from '../types/storage';
import { UnknownVersionError } from '../../utils/errors';
import { storage } from '../../typegenTypes/';

async function getTokensAccountsAssetBalances(
  account: string,
  assetId: number,
  block: BlockHeader
): Promise<TokensAccountsAssetBalances | null> {
  if (storage.tokens.accounts.v108.is(block)) {
    const resp = await storage.tokens.accounts.v108.get(
      block,
      account,
      assetId
    );
    return resp ?? null;
  }

  throw new UnknownVersionError('storage.tokens.accounts');
}

//TODO add processing keys lists bigger than 1000 items
async function getTokensAccountsAssetBalancesMany(
  keys: [string, number][],
  block: BlockHeader
): Promise<Array<TokensAccountsAssetBalances | null>> {
  let pairsPaged: Array<TokensAccountsAssetBalances | null> = [];

  if (block.specVersion < 108) return [];

  if (storage.tokens.accounts.v108.is(block)) {
    for (let accountInfo of await storage.tokens.accounts.v108.getMany(
      block,
      keys
    )) {
      pairsPaged.push(!accountInfo ? null : accountInfo);
    }
    return pairsPaged;
  }

  throw new UnknownVersionError('storage.tokens.accounts');
}

async function getTokenTotalIssuance({
  tokenId,
  block,
}: TokensGetTokenTotalIssuanceInput): Promise<bigint | null> {
  if (storage.tokens.totalIssuance.v108.is(block)) {
    const resp = await storage.tokens.totalIssuance.v108.get(block, tokenId);
    return resp ?? null;
  }

  throw new UnknownVersionError('storage.tokens.totalIssuance');
}

async function getManyTokensTotalIssuance({
  tokenIds,
  block,
}: TokensGetTokensTotalIssuanceInput): Promise<TokenTotalIssuance[]> {
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
}

export default {
  getTokensAccountsAssetBalances,
  getTokensAccountsAssetBalancesMany,
  getTokenTotalIssuance,
  getManyTokensTotalIssuance,
};

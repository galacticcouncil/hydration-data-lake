import { BlockHeader } from '@subsquid/substrate-processor';
import {
  SystemAccountInfo,
  TokensAccountsAssetBalances,
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

export default {
  getTokensAccountsAssetBalances,
  getTokensAccountsAssetBalancesMany,
};

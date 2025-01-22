import { BlockHeader } from '@subsquid/substrate-processor';
import { storage } from '../typegenTypes/';
import { TokensAccountsAssetBalances } from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';

async function getTokensAccountsAssetBalances(
  account: string,
  assetId: number,
  block: BlockHeader
): Promise<TokensAccountsAssetBalances | null> {
  if (storage.tokens.accounts.v257.is(block)) {
    const resp = await storage.tokens.accounts.v257.get(
      block,
      account,
      assetId
    );
    return resp ?? null;
  }

  throw new UnknownVersionError('storage.tokens.accounts');
}

export default { getTokensAccountsAssetBalances };

import { BlockHeader } from '@subsquid/substrate-processor';
import { storage } from '../typegenTypes/';
import {
  TokensAccountsAssetBalances,
  TokensGetTokenTotalIssuanceInput,
} from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';

async function getTokensAccountsAssetBalances(
  account: string,
  assetId: number,
  block: BlockHeader
): Promise<TokensAccountsAssetBalances | null> {
  if (storage.tokens.accounts.v276.is(block)) {
    const resp = await storage.tokens.accounts.v276.get(
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
  if (storage.tokens.totalIssuance.v276.is(block)) {
    const resp = await storage.tokens.totalIssuance.v276.get(block, tokenId);
    return resp ?? null;
  }

  throw new UnknownVersionError('storage.tokens.totalIssuance');
}

export default { getTokensAccountsAssetBalances, getTokenTotalIssuance };

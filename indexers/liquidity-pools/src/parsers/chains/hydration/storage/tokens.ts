import { BlockHeader } from '@subsquid/substrate-processor';
import { storage } from '../typegenTypes/';
import {
  TokensAccountsAssetBalances,
  TokensGetTokensTotalIssuanceInput,
  TokensGetTokenTotalIssuanceInput,
  TokenTotalIssuance,
} from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';

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

  if (storage.tokens.totalIssuance.v108.is(block)) {
    const resp = await storage.tokens.totalIssuance.v108.getMany(
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

export default {
  getTokensAccountsAssetBalances,
  getTokenTotalIssuance,
  getManyTokensTotalIssuance,
};

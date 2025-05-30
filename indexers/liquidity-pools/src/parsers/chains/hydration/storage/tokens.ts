import { BlockHeader } from '@subsquid/substrate-processor';
import { storage } from '../typegenTypes/';
import {
  TokensAccountsAssetBalances,
  TokensGetTokensTotalIssuanceInput,
  TokensGetTokenTotalIssuanceInput,
  TokenTotalIssuance,
} from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';
import { hexToStrWithNullCharCheck } from '../../../../utils/helpers';
import { AssetType } from '../../../../model';

async function getTokensAccountsAssetBalances(
  account: string,
  assetId: number,
  block: BlockHeader
): Promise<TokensAccountsAssetBalances | null> {
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
}

async function getTokenTotalIssuance({
  tokenId,
  block,
}: TokensGetTokenTotalIssuanceInput): Promise<bigint | null> {
  if (block.specVersion < 108) return null;
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
  getTokenTotalIssuance,
  getManyTokensTotalIssuance,
};

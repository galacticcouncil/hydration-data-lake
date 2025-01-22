import { BlockHeader } from '@subsquid/substrate-processor';
import parsers from '../../parsers';
import {
  AccountData,
  GetPoolAssetInfoInput,
} from '../../parsers/types/storage';

export async function getAccountBalances({
  poolAddress,
  assetId,
  block,
}: GetPoolAssetInfoInput): Promise<AccountData | null> {
  if (!poolAddress) return null;

  if (assetId === 0) {
    return parsers.storage.system
      .getSystemAccount(poolAddress, block)
      .then((accountInfo) => {
        if (!accountInfo || !accountInfo.data) return null;
        return {
          free: accountInfo.data.free,
          reserved: accountInfo.data.reserved,
          frozen: accountInfo.data.frozen,
          miscFrozen: accountInfo.data.miscFrozen,
          feeFrozen: accountInfo.data.feeFrozen,
          flags: accountInfo.data.flags,
        };
      });
  } else {
    return parsers.storage.tokens
      .getTokensAccountsAssetBalances(poolAddress, assetId, block)
      .then((accountInfo) => {
        if (!accountInfo) return null;
        return {
          free: accountInfo.free,
          reserved: accountInfo.reserved,
          frozen: accountInfo.frozen,
          miscFrozen: BigInt(0),
          feeFrozen: BigInt(0),
          flags: BigInt(0),
        };
      });
  }
}

export async function getAssetFreeBalance(
  block: BlockHeader,
  assetId: number,
  account: string
): Promise<bigint> {
  if (assetId === 0) {
    return parsers.storage.system
      .getSystemAccount(account, block)
      .then((accountInfo) => {
        return accountInfo?.data.free || BigInt(0);
      });
  } else {
    return parsers.storage.tokens
      .getTokensAccountsAssetBalances(account, assetId, block)
      .then((accountInfo) => {
        return accountInfo?.free || BigInt(0);
      });
  }
}

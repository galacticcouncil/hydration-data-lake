import { Block } from '../../processor';
import parsers from '../../parsers';
import { PoolAssetBalances } from '../../parsers/types/storage';
import { AccountBalances } from '../../model';
import { encodeAddress } from '@polkadot/util-crypto';

export async function getAssetBalance(
  block: Block,
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

export async function getAssetBalancesMany(
  block: Block,
  keyPairs: { address: string; assetId: number }[]
): Promise<PoolAssetBalances[]> {
  const response: PoolAssetBalances[] = [];
  const nativeTokenKeyPairs = [];
  const assetsKeyPairs = [];

  for (const kp of keyPairs) {
    if (kp.assetId === 0) {
      nativeTokenKeyPairs.push(kp);
      continue;
    }
    assetsKeyPairs.push(kp);
  }

  if (nativeTokenKeyPairs.length > 0) {
    const unmarkedData = await parsers.storage.system.getSystemAccountsMany(
      nativeTokenKeyPairs.map((kPair) => kPair.address),
      block
    );
    nativeTokenKeyPairs.forEach((kPair, index) => {
      if (!unmarkedData[index]) {
        response.push({
          poolAddress: kPair.address,
          assetId: kPair.assetId,
          balances: new AccountBalances({
            free: BigInt(0),
            reserved: BigInt(0),
            miscFrozen: BigInt(0),
            feeFrozen: BigInt(0),
            frozen: BigInt(0),
            flags: BigInt(0),
          }),
        });
      } else {
        response.push({
          poolAddress: kPair.address,
          assetId: kPair.assetId,
          balances: new AccountBalances({
            free: BigInt(unmarkedData[index].data.free),
            reserved: BigInt(unmarkedData[index].data.reserved),
            miscFrozen: BigInt(unmarkedData[index].data.miscFrozen),
            feeFrozen: BigInt(unmarkedData[index].data.feeFrozen),
            frozen: BigInt(unmarkedData[index].data.frozen),
            flags: BigInt(unmarkedData[index].data.flags),
          }),
        });
      }
    });
  }

  if (assetsKeyPairs.length > 0) {
    const unmarkedData =
      await parsers.storage.tokens.getTokensAccountsAssetBalancesMany(
        assetsKeyPairs.map((kPair) => [kPair.address, kPair.assetId]),
        block
      );

    assetsKeyPairs.forEach((kPair, index) => {
      if (!unmarkedData[index]) {
        response.push({
          poolAddress: kPair.address,
          assetId: kPair.assetId,
          balances: new AccountBalances({
            free: BigInt(0),
            reserved: BigInt(0),
            frozen: BigInt(0),
          }),
        });
      } else {
        response.push({
          poolAddress: kPair.address,
          assetId: kPair.assetId,
          balances: new AccountBalances({
            free: BigInt(unmarkedData[index].free),
            reserved: BigInt(unmarkedData[index].reserved),
            frozen: BigInt(unmarkedData[index].frozen),
          }),
        });
      }
    });
  }

  return response;
}

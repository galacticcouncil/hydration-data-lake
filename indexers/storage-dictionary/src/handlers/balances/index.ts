import { Block, ProcessorContext } from '../../processor';
import parsers from '../../parsers';
import {
  AccountData,
  GetAssetBalancesInput,
  PoolAssetBalances,
} from '../../parsers/types/storage';
import { AccountBalances, AssetType } from '../../model';
import { Store } from '@subsquid/typeorm-store';
import { getAsset } from '../asset/assetRegistry';
import {
  CurrenciesApiAccountInput,
  RuntimeApiMethodName,
  RuntimeApiName,
} from '../../parsers/runtimeApiResolver/types';
import { RuntimeApiResolver } from '../../parsers/runtimeApiResolver';

export async function getAccountBalances({
  address,
  assetId,
  block,
}: GetAssetBalancesInput): Promise<AccountData | null> {
  if (!address) return null;

  if (assetId === 0) {
    return parsers.storage.system
      .getSystemAccount(address, block)
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
      .getTokensAccountsAssetBalances(address, assetId, block)
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

export async function getAssetBalancesMany({
  ctx,
  block,
  keyPairs,
}: {
  ctx: ProcessorContext<Store>;
  block: Block;
  keyPairs: { address: string; assetId: number }[];
}): Promise<PoolAssetBalances[]> {
  const response: PoolAssetBalances[] = [];
  const nativeTokenKeyPairs: { address: string; assetId: number }[] = [];
  const assetsKeyPairs: { address: string; assetId: number }[] = [];
  const ercTokens: { address: string; assetId: number }[] = [];

  for (const kp of keyPairs) {
    if (kp.assetId === 0) {
      nativeTokenKeyPairs.push(kp);
      continue;
    }
    const assetData = await getAsset({ ctx, id: kp.assetId });

    if (assetData && assetData.assetType === AssetType.Erc20) {
      ercTokens.push(kp);
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
            miscFrozen: BigInt(0),
            feeFrozen: BigInt(0),
            flags: BigInt(0),
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
            miscFrozen: BigInt(0),
            feeFrozen: BigInt(0),
            flags: BigInt(0),
          }),
        });
      }
    });
  }

  if (ercTokens.length > 0) {
    const unmarkedData = await Promise.all(
      ercTokens.map(async ({ assetId, address }) => {
        return (
          (await new RuntimeApiResolver().resolveRuntimeApiCall<
            CurrenciesApiAccountInput,
            AccountData | null
          >({
            apiName: RuntimeApiName.CurrenciesApi,
            apiMethod: RuntimeApiMethodName.account,
            args: {
              block,
              assetId,
              address,
            },
          })) || (await getAccountBalances({ block, assetId, address }))
        );
      })
    );

    ercTokens.forEach((kPair, index) => {
      if (!unmarkedData[index]) {
        response.push({
          poolAddress: kPair.address,
          assetId: kPair.assetId,
          balances: new AccountBalances({
            free: BigInt(0),
            reserved: BigInt(0),
            frozen: BigInt(0),
            miscFrozen: BigInt(0),
            feeFrozen: BigInt(0),
            flags: BigInt(0),
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
            miscFrozen: BigInt(0),
            feeFrozen: BigInt(0),
            flags: BigInt(0),
          }),
        });
      }
    });
  }

  return response;
}

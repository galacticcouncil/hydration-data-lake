import { BlockHeader } from '@subsquid/substrate-processor';
import { SystemAccountInfo, XykPoolWithAssets } from '../types/storage';
import { UnknownVersionError } from '../../utils/errors';
import { storage } from '../../typegenTypes/';

async function getSystemAccount(
  account: string,
  block: BlockHeader
): Promise<SystemAccountInfo | null> {
  if (block.specVersion < 100) return null;

  if (storage.system.account.v100.is(block)) {
    const resp = await storage.system.account.v100.get(block, account);
    if (!resp) return null;

    return {
      nonce: resp.nonce,
      consumers: resp.consumers,
      providers: resp.providers,
      sufficients: resp.sufficients,
      data: {
        free: resp.data.free,
        reserved: resp.data.reserved,
        miscFrozen: resp.data.miscFrozen,
        feeFrozen: resp.data.feeFrozen,
        flags: BigInt(0),
        frozen: BigInt(0),
      },
    };
  }
  if (storage.system.account.v205.is(block)) {
    const resp = await storage.system.account.v205.get(block, account);
    if (!resp) return null;

    return {
      nonce: resp.nonce,
      consumers: resp.consumers,
      providers: resp.providers,
      sufficients: resp.sufficients,
      data: {
        free: resp.data.free,
        reserved: resp.data.reserved,
        miscFrozen: BigInt(0),
        feeFrozen: BigInt(0),
        flags: resp.data.flags,
        frozen: BigInt(0),
      },
    };
  }

  throw new UnknownVersionError('storage.system.account');
}

//TODO add processing keys lists bigger than 1000 items
async function getSystemAccountsMany(
  keys: string[],
  block: BlockHeader
): Promise<Array<SystemAccountInfo | null>> {
  let pairsPaged: Array<SystemAccountInfo | null> = [];

  if (block.specVersion < 100) return [];

  if (storage.system.account.v100.is(block)) {
    for (let accountInfo of await storage.system.account.v100.getMany(
      block,
      keys
    )) {
      pairsPaged.push(
        !accountInfo
          ? null
          : {
              nonce: accountInfo.nonce,
              consumers: accountInfo.consumers,
              providers: accountInfo.providers,
              sufficients: accountInfo.sufficients,
              data: {
                free: accountInfo.data.free,
                reserved: accountInfo.data.reserved,
                miscFrozen: accountInfo.data.miscFrozen,
                feeFrozen: accountInfo.data.feeFrozen,
                flags: BigInt(0),
                frozen: BigInt(0),
              },
            }
      );
    }
    return pairsPaged;
  }
  if (storage.system.account.v205.is(block)) {
    for (let accountInfo of await storage.system.account.v205.getMany(
      block,
      keys
    )) {
      pairsPaged.push(
        !accountInfo
          ? null
          : {
              nonce: accountInfo.nonce,
              consumers: accountInfo.consumers,
              providers: accountInfo.providers,
              sufficients: accountInfo.sufficients,
              data: {
                free: accountInfo.data.free,
                reserved: accountInfo.data.reserved,
                miscFrozen: BigInt(0),
                feeFrozen: BigInt(0),
                flags: accountInfo.data.flags,
                frozen: BigInt(0),
              },
            }
      );
    }
    return pairsPaged;
  }

  throw new UnknownVersionError('storage.system.account');
}

export default { getSystemAccount, getSystemAccountsMany };

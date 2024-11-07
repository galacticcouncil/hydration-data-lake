import { BlockHeader } from '@subsquid/substrate-processor';
import { storage } from '../typegenTypes/';
import { SystemAccountInfo } from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';

async function getSystemAccount(
  account: string,
  block: BlockHeader
): Promise<SystemAccountInfo | null> {
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
        frozen: resp.data.frozen,
        flags: resp.data.flags,
      },
    };
  }

  throw new UnknownVersionError('storage.system.account');
}

export default { getSystemAccount };

import { BlockHeader } from '@subsquid/substrate-processor';
import { storage } from '../typegenTypes/';
import { SystemAccountInfo } from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';

async function getSystemAccount(
  account: string,
  block: BlockHeader
): Promise<SystemAccountInfo | null> {
  if (storage.system.account.v276.is(block)) {
    const resp = await storage.system.account.v276.get(block, account);
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
        frozen: resp.data.frozen,
      },
    };
  }

  throw new UnknownVersionError('storage.system.account');
}

export default { getSystemAccount };

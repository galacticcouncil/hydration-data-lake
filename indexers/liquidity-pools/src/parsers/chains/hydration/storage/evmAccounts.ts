import { storage } from '../typegenTypes/';
import {
  EvmAccountsAccountExtension,
  EvmAccountsGetAccountExtensionInput,
} from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';

async function getAccountExtension({
  evmAddress,
  block,
}: EvmAccountsGetAccountExtensionInput): Promise<EvmAccountsAccountExtension | null> {
  if (block.specVersion < 222) return null;
  if (storage.evmAccounts.accountExtension.v222.is(block)) {
    const resp = await storage.evmAccounts.accountExtension.v222.get(
      block,
      evmAddress
    );

    if (!resp) return null;

    return resp;
  }

  throw new UnknownVersionError('storage.evmAccounts.accountExtension');
}

export default { getAccountExtension };

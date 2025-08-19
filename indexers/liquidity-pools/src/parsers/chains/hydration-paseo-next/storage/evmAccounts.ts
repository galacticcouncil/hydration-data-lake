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
  if (storage.evmAccounts.accountExtension.v324.is(block)) {
    const resp = await storage.evmAccounts.accountExtension.v324.get(
      block,
      evmAddress
    );

    if (!resp) return null;

    return resp;
  }

  throw new UnknownVersionError('storage.evmAccounts.accountExtension');
}

export default { getAccountExtension };

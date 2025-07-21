import { storage } from '../typegenTypes/';
import {
  EvmAccountsAccountExtension,
  EvmAccountsAccountExtensionWithEvmAddress,
  EvmAccountsGetAccountExtensionInput,
  GetDataAtBlockInput,
} from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';
import { tryExecOrReturnFallback } from '../../../../utils/helpers';

async function getAccountExtension({
  evmAddress,
  block,
}: EvmAccountsGetAccountExtensionInput): Promise<EvmAccountsAccountExtension | null> {
  if (block.specVersion < 222) return null;
  if (
    storage.evmAccounts.accountExtension.v222.is(block) ||
    block.specVersion >= 222
  ) {
    return tryExecOrReturnFallback(async () => {
      const resp = await storage.evmAccounts.accountExtension.v222.get(
        block,
        evmAddress
      );

      if (!resp) return null;

      return resp;
    }, null);
  }

  throw new UnknownVersionError('storage.evmAccounts.accountExtension');
}

async function getAllAccountsExtensions({
  block,
}: GetDataAtBlockInput): Promise<
  EvmAccountsAccountExtensionWithEvmAddress[] | null
> {
  if (block.specVersion < 222) return null;
  if (
    storage.evmAccounts.accountExtension.v222.is(block) ||
    block.specVersion >= 222
  ) {
    return tryExecOrReturnFallback(async () => {
      try {
        const pairsPaged: EvmAccountsAccountExtensionWithEvmAddress[] = [];

        for await (const page of storage.evmAccounts.accountExtension.v222.getPairsPaged(
          500,
          block
        )) {
          pairsPaged.push(
            ...page
              .filter((p) => !!p)
              .map(
                ([h160Address, extension]) =>
                  ({
                    h160Address,
                    extension,
                  }) as EvmAccountsAccountExtensionWithEvmAddress
              )
          );
        }
        return pairsPaged;
      } catch (e) {
        throw e;
      }
    }, null);
  }

  throw new UnknownVersionError('storage.evmAccounts.accountExtension');
}

export default { getAccountExtension, getAllAccountsExtensions };

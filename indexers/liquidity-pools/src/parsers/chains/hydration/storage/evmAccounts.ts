import { storage } from '../typegenTypes/';
import {
  EvmAccountsAccountExtension,
  EvmAccountsAccountExtensionWithEvmAddress,
  EvmAccountsGetAccountExtensionInput,
  EvmAccountsGetAccountExtensionManyInput,
  GetDataAtBlockInput,
} from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';
import { tryExecOrReturnFallback } from '../../../../utils/helpers';
import pMap from 'p-map';
import { measureStorageFetch } from '../../../../utils/hydratedLogger/utils';

async function getAccountExtension({
  evmAddress,
  block,
}: EvmAccountsGetAccountExtensionInput): Promise<EvmAccountsAccountExtension | null> {
  return measureStorageFetch({
    storageName: 'evmAccounts.accountExtension.get',
    originFn: 'getAccountExtension',
    blockHeight: block.height,
    args: { evmAddress },
    fn: async () => {
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
    },
  });
}

async function getAllAccountsExtensions({
  block,
}: GetDataAtBlockInput): Promise<
  EvmAccountsAccountExtensionWithEvmAddress[] | null
> {
  return measureStorageFetch({
    storageName: 'evmAccounts.accountExtension.getPairsPaged',
    originFn: 'getAllAccountsExtensions',
    blockHeight: block.height,
    fn: async () => {
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
    },
  });
}

async function getAccountExtensionsMany({
  evmAddresses,
  block,
}: EvmAccountsGetAccountExtensionManyInput): Promise<
  EvmAccountsAccountExtensionWithEvmAddress[] | null
> {
  return measureStorageFetch({
    storageName: 'evmAccounts.accountExtension.get',
    originFn: 'getAccountExtensionsMany',
    blockHeight: block.height,
    args: { evmAddresses },
    fn: async () => {
      if (block.specVersion < 222) return null;
      if (
        storage.evmAccounts.accountExtension.v222.is(block) ||
        block.specVersion >= 222
      ) {
        return tryExecOrReturnFallback(async () => {
          try {
            const pairsPaged: EvmAccountsAccountExtensionWithEvmAddress[] = (
              await pMap(evmAddresses, async (h160Address) => {
                const extension =
                  await storage.evmAccounts.accountExtension.v222.get(
                    block,
                    h160Address
                  );

                if (!extension) return null;

                return {
                  h160Address,
                  extension,
                };
              })
            ).filter((resp) => !!resp);

            return pairsPaged;
          } catch (e) {
            throw e;
          }
        }, null);
      }

      throw new UnknownVersionError('storage.evmAccounts.accountExtension');
    },
  });
}

export default {
  getAccountExtension,
  getAllAccountsExtensions,
  getAccountExtensionsMany,
};

import { StorageDictionaryManager } from '../storageDictionaryManager';
import { BlockHeader } from '@subsquid/substrate-processor';
import {
  BalancesAccountInfoWithAccountId,
  GetNativeTokenBalanceManyInput,
  GetTokenBalancesManyInput,
  TokenAccountBalancesWithAccountId,
} from '../../../types/storage';
import { SqdProcessorContext } from '../../../../processor';
import { Store } from '@subsquid/typeorm-store';

export class StorageResolverHelpersManager {
  storageDictionaryManager: StorageDictionaryManager | null = null;

  get storageDictionaryManagerInstance() {
    if (!this.storageDictionaryManager)
      throw Error(`Storage Dictionary Manager is not initialised.`);
    return this.storageDictionaryManager;
  }

  async init({
    ctx,
    blockNumberFrom,
    blockNumberTo,
  }: {
    ctx: SqdProcessorContext<Store>;
    blockNumberFrom: number;
    blockNumberTo: number;
  }) {
    if (!this.storageDictionaryManager)
      this.storageDictionaryManager = new StorageDictionaryManager({
        batchCtx: ctx,
      });

    this.storageDictionaryManager.setBatchContext(ctx);

    this.storageDictionaryManager.wipeBatchStorageState();

    if (ctx.appConfig.USE_STORAGE_DICTIONARY)
      await this.storageDictionaryManager.fetchBatchStorageStateAllPallets({
        blockNumberFrom,
        blockNumberTo,
        ctx,
      });
  }

  // TODO add fallback function response status to check is it failed or response is null
  //  fallbackFn: (args) => Promise<{success: boolean; data: R | null}>
  protected async resolveFallbackFunctions<
    Args extends { block: BlockHeader },
    R,
  >(args: Args, fnsList: Array<(args: Args) => Promise<R>>) {
    for (const fallbackFn of fnsList) {
      const result = await fallbackFn(args);
      if (result) return result;
    }
    return null;
  }

  protected async resolveAccountAssetBalanceHistDataGetTokenBalancesMany<
    Args extends { block: BlockHeader; skipCache?: boolean },
    R,
  >(args: Args, fallbackFns: Array<(args: Args) => Promise<R>>) {
    if (args.skipCache) return this.resolveFallbackFunctions(args, fallbackFns);

    const dictionaryResp =
      this.storageDictionaryManagerInstance.getTokenBalancesMany(
        args as unknown as GetNativeTokenBalanceManyInput // TODO fix types
      ) as TokenAccountBalancesWithAccountId[] | null;

    if (dictionaryResp) {
      const keysResolvedByDictionaryData = new Set(
        (dictionaryResp as TokenAccountBalancesWithAccountId[]).map(
          (i) => i.accountId
        )
      );

      const keysUnresolvedByDictionaryData = (
        args as unknown as GetTokenBalancesManyInput
      ).accountIds.filter((accId) => !keysResolvedByDictionaryData.has(accId));

      if (!keysUnresolvedByDictionaryData.length) return dictionaryResp as R;

      const storageResolvedData = await this.resolveFallbackFunctions<
        GetTokenBalancesManyInput,
        TokenAccountBalancesWithAccountId[]
      >(
        {
          block: args.block,
          accountIds: keysUnresolvedByDictionaryData,
        },
        // @ts-ignore
        fallbackFns
      );

      return [...dictionaryResp, ...(storageResolvedData ?? [])] as R;
    } else {
      return this.resolveFallbackFunctions(args, fallbackFns);
    }
  }
  protected async resolveAccountAssetBalanceHistDataGetNativeTokenBalanceMany<
    Args extends { block: BlockHeader; skipCache?: boolean },
    R,
  >(args: Args, fallbackFns: Array<(args: Args) => Promise<R>>) {
    if (args.skipCache) return this.resolveFallbackFunctions(args, fallbackFns);

    const dictionaryResp =
      this.storageDictionaryManagerInstance.getNativeTokenBalanceMany(
        args as unknown as GetNativeTokenBalanceManyInput // TODO fix types
      ) as BalancesAccountInfoWithAccountId[] | null;

    if (dictionaryResp) {
      const keysResolvedByDictionaryData = new Set(
        (dictionaryResp as BalancesAccountInfoWithAccountId[]).map(
          (i) => i.accountId
        )
      );

      const keysUnresolvedByDictionaryData = (
        args as unknown as GetNativeTokenBalanceManyInput
      ).accountIds.filter((accId) => !keysResolvedByDictionaryData.has(accId));

      if (!keysUnresolvedByDictionaryData.length) return dictionaryResp as R;

      const storageResolvedData = await this.resolveFallbackFunctions<
        GetNativeTokenBalanceManyInput,
        BalancesAccountInfoWithAccountId[]
      >(
        {
          block: args.block,
          accountIds: keysUnresolvedByDictionaryData,
        },
        // @ts-ignore
        fallbackFns
      );

      return [...dictionaryResp, ...(storageResolvedData ?? [])] as R;
    } else {
      return this.resolveFallbackFunctions(args, fallbackFns);
    }
  }
}

import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { StorageDictionaryManager } from './dictionaryUtils/storageDictionaryManager';
import { ProcessingPallets } from './dictionaryUtils/types';
import { BlockHeader } from '@subsquid/substrate-processor';
import {
  AccountData,
  GetPoolAssetInfoInput,
  LbpGetPoolDataInput,
  OmnipoolGetAssetDataInput,
  StablepoolGetPoolDataInput,
  StablepoolInfo,
  XykGetAssetsInput,
} from '../types/storage';

export class StorageResolver {
  private static instance: StorageResolver;
  storageDictionaryManager: StorageDictionaryManager | null = null;

  static getInstance(): StorageResolver {
    if (!StorageResolver.instance) {
      StorageResolver.instance = new StorageResolver();
    }
    return StorageResolver.instance;
  }

  async init({
    ctx,
    blockNumberFrom,
    blockNumberTo,
  }: {
    ctx: ProcessorContext<Store>;
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
      });
  }

  // TODO add fallback function response status to check is it failed or response is null
  //  fallbackFn: (args) => Promise<{success: boolean; data: R | null}>
  private async resolveFallbackFunctions<
    Args extends { block: BlockHeader },
    R,
  >(args: Args, fnsList: Array<(args: Args) => Promise<R>>) {
    for (const fallbackFn of fnsList) {
      const result = await fallbackFn(args);
      if (result) return result;
    }
    return null;
  }

  /**
   * @param pallet
   * @param method
   * @param args
   * @param fallbackFns - List of functions which will be executed sequentially
   *                      if previous one returned null or failed
   */
  async resolveStorageData<Args extends { block: BlockHeader }, R>({
    pallet,
    method,
    args,
    fallbackFns = [],
  }: {
    pallet: ProcessingPallets;
    method:
      | 'getPoolData'
      | 'getPoolAssetInfo'
      | 'getAssetData'
      | 'getPoolAssets';
    args: Args;
    fallbackFns: Array<(args: Args) => Promise<R>>;
  }): Promise<R | null> {
    if (!this.storageDictionaryManager)
      throw Error(`Storage Dictionary Manager is not initialised.`);

    try {
      switch (pallet) {
        case ProcessingPallets.STABLESWAP: {
          if (method === 'getPoolData') {
            const resp = this.storageDictionaryManager.getStableswapPoolData(
              args as unknown as StablepoolGetPoolDataInput // TOD fix types
            ) as R;

            if (resp) return resp;

            return this.resolveFallbackFunctions(args, fallbackFns);
            // return (
            //   (this.storageDictionaryManager.getStableswapPoolData(
            //     args as unknown as StablepoolGetPoolDataInput // TOD fix types
            //   ) as R) ?? (fallbackFn ? await fallbackFn(args) : null)
            // );
          }
          if (method === 'getPoolAssetInfo') {
            const resp =
              this.storageDictionaryManager.getStableswapPoolAssetInfo(
                args as unknown as GetPoolAssetInfoInput // TOD fix types
              ) as R;

            if (resp) return resp;

            return this.resolveFallbackFunctions(args, fallbackFns);
            // return (
            //   (this.storageDictionaryManager.getStableswapPoolAssetInfo(
            //     args as unknown as GetPoolAssetInfoInput // TOD fix types
            //   ) as R) ?? (fallbackFn ? await fallbackFn(args) : null)
            // );
          }
          break;
        }
        case ProcessingPallets.OMNIPOOL: {
          if (method === 'getAssetData') {
            const resp = this.storageDictionaryManager.getOmnipoolAssetState(
              args as unknown as OmnipoolGetAssetDataInput // TOD fix types
            ) as R;

            if (resp) return resp;

            return this.resolveFallbackFunctions(args, fallbackFns);
            // return (
            //   (this.storageDictionaryManager.getOmnipoolAssetState(
            //     args as unknown as OmnipoolGetAssetDataInput // TOD fix types
            //   ) as R) ?? (fallbackFn ? await fallbackFn(args) : null)
            // );
          }

          if (method === 'getPoolAssetInfo') {
            const resp = this.storageDictionaryManager.getOmnipoolAssetInfo(
              args as unknown as GetPoolAssetInfoInput // TOD fix types
            ) as R;

            if (resp) return resp;

            return this.resolveFallbackFunctions(args, fallbackFns);
            // return (
            //   (this.storageDictionaryManager.getOmnipoolAssetInfo(
            //     args as unknown as GetPoolAssetInfoInput // TOD fix types
            //   ) as R) ?? (fallbackFn ? await fallbackFn(args) : null)
            // );
          }

          break;
        }
        case ProcessingPallets.XYK: {
          if (method === 'getPoolAssets') {
            const resp = this.storageDictionaryManager.getXykPoolAssets(
              args as unknown as XykGetAssetsInput // TOD fix types
            ) as R;

            if (resp) return resp;

            return this.resolveFallbackFunctions(args, fallbackFns);
            // return (
            //   (this.storageDictionaryManager.getXykPoolAssets(
            //     args as unknown as XykGetAssetsInput // TOD fix types
            //   ) as R) ?? (fallbackFn ? await fallbackFn(args) : null)
            // );
          }

          if (method === 'getPoolAssetInfo') {
            const resp = this.storageDictionaryManager.getXykPoolAssetInfo(
              args as unknown as GetPoolAssetInfoInput // TOD fix types
            ) as R;

            if (resp) return resp;

            return this.resolveFallbackFunctions(args, fallbackFns);
            // return (
            //   (this.storageDictionaryManager.getXykPoolAssetInfo(
            //     args as unknown as GetPoolAssetInfoInput // TOD fix types
            //   ) as R) ?? (fallbackFn ? await fallbackFn(args) : null)
            // );
          }

          break;
        }
        case ProcessingPallets.LBP: {
          if (method === 'getPoolData') {
            const resp = this.storageDictionaryManager.getLbpPoolData(
              args as unknown as LbpGetPoolDataInput // TOD fix types
            ) as R;

            if (resp) return resp;

            return this.resolveFallbackFunctions(args, fallbackFns);
            // return (
            //   (this.storageDictionaryManager.getLbpPoolData(
            //     args as unknown as LbpGetPoolDataInput // TOD fix types
            //   ) as R) ?? (fallbackFn ? await fallbackFn(args) : null)
            // );
          }

          if (method === 'getPoolAssetInfo') {
            const resp = this.storageDictionaryManager.getLbpPoolAssetInfo(
              args as unknown as GetPoolAssetInfoInput // TOD fix types
            ) as R;

            if (resp) return resp;

            return this.resolveFallbackFunctions(args, fallbackFns);
            // return (
            //   (this.storageDictionaryManager.getLbpPoolAssetInfo(
            //     args as unknown as GetPoolAssetInfoInput // TOD fix types
            //   ) as R) ?? (fallbackFn ? await fallbackFn(args) : null)
            // );
          }

          break;
        }
        default:
          return null;
      }
    } catch (e) {
      console.log(e);
    }
    return null;
  }
}

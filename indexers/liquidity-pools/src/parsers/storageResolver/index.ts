import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { StorageDictionaryManager } from './dictionaryUtils/storageDictionaryManager';
import { ProcessingTopic } from './dictionaryUtils/types';
import { BlockHeader } from '@subsquid/substrate-processor';
import {
  AccountData,
  GetAssetsDynamicFeesAllInput,
  GetConstantsInput,
  GetDataAtBlockInput,
  GetEmaOraclesInput,
  GetNativeTokenBalanceManyInput,
  GetPoolAssetInfoInput,
  GetTokenBalancesManyInput,
  LbpGetPoolDataInput,
  OmnipoolGetAllAssetIdsInput,
  OmnipoolGetAssetDataInput,
  OmnipoolGetHubAssetTradabilityInput,
  OmnipoolGetPoolDataInput,
  StablepoolGetPoolDataInput,
  StablepoolGetPoolPegsInput,
  StablepoolInfo,
  TokenAccountBalancesWithAccountId,
  TokensGetTokensTotalIssuanceInput,
  TokensGetTokenTotalIssuanceInput,
  XykGetAssetsInput,
  XykGetPoolDataInput,
  XykGetPoolShareTokenPairsManyInput,
  XykGetShareTokenInput,
  XykPoolData,
} from '../types/storage';
import { AaveTradeExecutorPoolsInput } from '../runtimeApiResolver/types';
import { StorageResolverHelpersManager } from './dictionaryUtils/helpers/storageResolverHelpersManager';

export class StorageResolver extends StorageResolverHelpersManager {
  private static instance: StorageResolver;

  static getInstance(): StorageResolver {
    if (!StorageResolver.instance) {
      StorageResolver.instance = new StorageResolver();
    }
    return StorageResolver.instance;
  }

  constructor() {
    super();
  }

  /**
   * @param pallet
   * @param method
   * @param args
   * @param fallbackFns - List of functions which will be executed sequentially
   *                      if previous one returned null or failed
   */
  async resolveStorageData<
    Args extends { block: BlockHeader; skipCache?: boolean },
    R,
  >({
    pallet,
    method,
    args,
    fallbackFns = [],
  }: {
    pallet: ProcessingTopic;
    method:
      | 'getPoolData'
      | 'getAllPoolsData'
      | 'getPools'
      | 'getPoolAssetInfo'
      | 'getPoolAssetStorageData'
      | 'getAssetData'
      | 'getPoolAssets'
      | 'getPoolPegs'
      | 'getAllPoolsPegs'
      | 'getOmnipoolHubAssetTradability'
      | 'getOmnipoolAllAssetIds'
      | 'getPoolShareTokenPairsMany'
      | 'getPoolShareToken'
      | 'getAssetDynamicFeesAll'
      | 'getOracleEntries'
      | 'getTokenTotalIssuance'
      | 'getTokenBalancesMany'
      | 'getManyTokensTotalIssuance'
      | 'getNativeTokenTotalIssuance'
      | 'getNativeTokenBalanceMany'
      | 'getAssetsExistentialDepositAll';
    args: Args;
    fallbackFns: Array<(args: Args) => Promise<R>>;
  }): Promise<R | null> {
    if (!this.storageDictionaryManager)
      throw Error(`Storage Dictionary Manager is not initialised.`);

    try {
      switch (pallet) {
        case ProcessingTopic.STABLESWAP: {
          if (method === 'getPoolData') {
            const resp = this.storageDictionaryManager.getStableswapPoolData(
              args as unknown as StablepoolGetPoolDataInput // TODO fix types
            ) as R;

            if (resp) return resp;

            return this.resolveFallbackFunctions(args, fallbackFns);
            // return (
            //   (this.storageDictionaryManager.getStableswapPoolData(
            //     args as unknown as StablepoolGetPoolDataInput // TODO fix types
            //   ) as R) ?? (fallbackFn ? await fallbackFn(args) : null)
            // );
          }
          if (method === 'getAllPoolsData') {
            const resp =
              this.storageDictionaryManager.getStableswapAllPoolsData(
                args as unknown as GetDataAtBlockInput // TODO fix types
              ) as R;

            if (resp) return resp;

            return this.resolveFallbackFunctions(args, fallbackFns);
          }
          if (method === 'getPoolAssetInfo') {
            const resp =
              this.storageDictionaryManager.getStableswapPoolAssetInfo(
                args as unknown as GetPoolAssetInfoInput // TODO fix types
              ) as R;

            if (
              resp &&
              this.isFreeBalanceExisting(resp as unknown as AccountData) // TODO fix type casting
            )
              return resp;

            return this.resolveFallbackFunctions(args, fallbackFns);
            // return (
            //   (this.storageDictionaryManager.getStableswapPoolAssetInfo(
            //     args as unknown as GetPoolAssetInfoInput // TODO fix types
            //   ) as R) ?? (fallbackFn ? await fallbackFn(args) : null)
            // );
          }
          if (method === 'getPoolAssetStorageData') {
            const resp =
              this.storageDictionaryManager.getStableswapPoolAssetState(
                args as unknown as GetPoolAssetInfoInput // TODO fix types
              ) as R;

            if (resp) return resp;

            return this.resolveFallbackFunctions(args, fallbackFns);
          }
          if (method === 'getPoolPegs') {
            const resp = this.storageDictionaryManager.getStableswapPegsData(
              args as unknown as StablepoolGetPoolPegsInput // TODO fix types
            ) as R;

            if (resp) return resp;

            return this.resolveFallbackFunctions(args, fallbackFns);
          }
          if (method === 'getAllPoolsPegs') {
            const resp =
              this.storageDictionaryManager.getStableswapAllPoolsPegsData(
                args as unknown as GetDataAtBlockInput // TODO fix types
              ) as R;

            if (resp) return resp;

            return this.resolveFallbackFunctions(args, fallbackFns);
          }
          break;
        }
        case ProcessingTopic.OMNIPOOL: {
          if (method === 'getAssetData') {
            const resp = this.storageDictionaryManager.getOmnipoolAssetState(
              args as unknown as OmnipoolGetAssetDataInput // TODO fix types
            ) as R;

            if (resp) return resp;

            return this.resolveFallbackFunctions(args, fallbackFns);
            // return (
            //   (this.storageDictionaryManager.getOmnipoolAssetState(
            //     args as unknown as OmnipoolGetAssetDataInput // TODO fix types
            //   ) as R) ?? (fallbackFn ? await fallbackFn(args) : null)
            // );
          }

          if (method === 'getPoolAssetInfo') {
            const resp = this.storageDictionaryManager.getOmnipoolAssetInfo(
              args as unknown as GetPoolAssetInfoInput // TODO fix types
            ) as R;

            if (
              resp &&
              this.isFreeBalanceExisting(resp as unknown as AccountData) // TODO fix type casting
            )
              return resp;

            return this.resolveFallbackFunctions(args, fallbackFns);
            // return (
            //   (this.storageDictionaryManager.getOmnipoolAssetInfo(
            //     args as unknown as GetPoolAssetInfoInput // TODO fix types
            //   ) as R) ?? (fallbackFn ? await fallbackFn(args) : null)
            // );
          }

          if (method === 'getOmnipoolHubAssetTradability') {
            const resp =
              this.storageDictionaryManager.getOmnipoolHubAssetTradability(
                args as unknown as OmnipoolGetHubAssetTradabilityInput // TODO fix types
              ) as R;

            if (resp) return resp;

            return this.resolveFallbackFunctions(args, fallbackFns);
          }

          if (method === 'getOmnipoolAllAssetIds') {
            const resp = this.storageDictionaryManager.getOmnipoolAllAssetIds(
              args as unknown as OmnipoolGetAllAssetIdsInput // TODO fix types
            ) as R;

            if (resp) return resp;

            return this.resolveFallbackFunctions(args, fallbackFns);
          }

          break;
        }
        case ProcessingTopic.XYK: {
          if (method === 'getPoolAssets') {
            const resp = this.storageDictionaryManager.getXykPoolAssets(
              args as unknown as XykGetAssetsInput // TODO fix types
            ) as R;

            if (resp) return resp;

            return this.resolveFallbackFunctions(args, fallbackFns);
            // return (
            //   (this.storageDictionaryManager.getXykPoolAssets(
            //     args as unknown as XykGetAssetsInput // TODO fix types
            //   ) as R) ?? (fallbackFn ? await fallbackFn(args) : null)
            // );
          }
          if (method === 'getPoolData') {
            const resp = this.storageDictionaryManager.getXykpoolData(
              args as unknown as XykGetPoolDataInput // TODO fix types
            ) as R;

            if (resp) return resp;

            return this.resolveFallbackFunctions(args, fallbackFns);
            // return (
            //   (this.storageDictionaryManager.getXykPoolAssets(
            //     args as unknown as XykGetAssetsInput // TODO fix types
            //   ) as R) ?? (fallbackFn ? await fallbackFn(args) : null)
            // );
          }

          if (method === 'getPoolAssetInfo') {
            const resp = this.storageDictionaryManager.getXykPoolAssetInfo(
              args as unknown as GetPoolAssetInfoInput // TODO fix types
            ) as R;

            if (
              resp &&
              this.isFreeBalanceExisting(resp as unknown as AccountData) // TODO fix type casting
            )
              return resp;

            return this.resolveFallbackFunctions(args, fallbackFns);
            // return (
            //   (this.storageDictionaryManager.getXykPoolAssetInfo(
            //     args as unknown as GetPoolAssetInfoInput // TODO fix types
            //   ) as R) ?? (fallbackFn ? await fallbackFn(args) : null)
            // );
          }

          if (method === 'getPoolShareToken') {
            const resp = this.storageDictionaryManager.getXykpoolShareTokenId(
              args as unknown as XykGetShareTokenInput // TODO fix types
            ) as R;

            if (resp) return resp;

            return this.resolveFallbackFunctions(args, fallbackFns);
          }

          if (method === 'getPoolShareTokenPairsMany') {
            const resp =
              this.storageDictionaryManager.getXykpoolShareTokenPairsAll(
                args as unknown as XykGetPoolShareTokenPairsManyInput // TODO fix types
              ) as R;

            if (resp) return resp;

            return this.resolveFallbackFunctions(args, fallbackFns);
          }

          break;
        }
        case ProcessingTopic.LBP: {
          if (method === 'getPoolData') {
            const resp = this.storageDictionaryManager.getLbpPoolData(
              args as unknown as LbpGetPoolDataInput // TODO fix types
            ) as R;

            if (resp) return resp;

            return this.resolveFallbackFunctions(args, fallbackFns);
            // return (
            //   (this.storageDictionaryManager.getLbpPoolData(
            //     args as unknown as LbpGetPoolDataInput // TODO fix types
            //   ) as R) ?? (fallbackFn ? await fallbackFn(args) : null)
            // );
          }

          if (method === 'getPoolAssetInfo') {
            const resp = this.storageDictionaryManager.getLbpPoolAssetInfo(
              args as unknown as GetPoolAssetInfoInput // TODO fix types
            ) as R;

            if (
              resp &&
              this.isFreeBalanceExisting(resp as unknown as AccountData) // TODO fix type casting
            )
              return resp;

            return this.resolveFallbackFunctions(args, fallbackFns);
            // return (
            //   (this.storageDictionaryManager.getLbpPoolAssetInfo(
            //     args as unknown as GetPoolAssetInfoInput // TODO fix types
            //   ) as R) ?? (fallbackFn ? await fallbackFn(args) : null)
            // );
          }

          break;
        }
        case ProcessingTopic.AAVE: {
          if (method === 'getPools') {
            const resp = this.storageDictionaryManager.getAavepoolsAll(
              args as unknown as AaveTradeExecutorPoolsInput // TODO fix types
            ) as R;

            if (resp) return resp;

            return this.resolveFallbackFunctions(args, fallbackFns);
          }

          break;
        }
        case ProcessingTopic.ASSET_HIST_DATA: {
          if (method === 'getAssetDynamicFeesAll') {
            const resp = this.storageDictionaryManager.getAssetDynamicFeesAll(
              args as unknown as GetAssetsDynamicFeesAllInput // TODO fix types
            ) as R;

            if (resp) return resp;

            return this.resolveFallbackFunctions(args, fallbackFns);
          }
          if (method === 'getTokenTotalIssuance') {
            const resp = this.storageDictionaryManager.getTokenTotalIssuance(
              args as unknown as TokensGetTokenTotalIssuanceInput // TODO fix types
            ) as R;

            if (resp) return resp;

            return this.resolveFallbackFunctions(args, fallbackFns);
          }

          if (method === 'getNativeTokenTotalIssuance') {
            const resp =
              this.storageDictionaryManager.getNativeTokenTotalIssuance(
                args as unknown as GetConstantsInput // TODO fix types
              ) as R;

            if (resp) return resp;

            return this.resolveFallbackFunctions(args, fallbackFns);
          }
          if (method === 'getManyTokensTotalIssuance') {
            const resp =
              this.storageDictionaryManager.getManyTokensTotalIssuance(
                args as unknown as TokensGetTokensTotalIssuanceInput // TODO fix types
              ) as R;

            if (resp) return resp;

            return this.resolveFallbackFunctions(args, fallbackFns);
          }
          if (method === 'getAssetsExistentialDepositAll') {
            const resp =
              this.storageDictionaryManager.getAssetsExistentialDepositAll(
                args as unknown as GetDataAtBlockInput // TODO fix types
              ) as R;

            if (resp) return resp;

            return this.resolveFallbackFunctions(args, fallbackFns);
          }

          break;
        }
        case ProcessingTopic.EMA_ORACLE: {
          if (method === 'getOracleEntries') {
            const resp = this.storageDictionaryManager.getEmaOracleEntriesAll(
              args as unknown as GetEmaOraclesInput // TODO fix types
            ) as R;

            if (resp) return resp;

            return this.resolveFallbackFunctions(args, fallbackFns);
          }

          break;
        }
        case ProcessingTopic.ACCOUNT_ASSET_BALANCE_HIST_DATA: {
          if (method === 'getTokenBalancesMany') {
            return this.resolveAccountAssetBalanceHistDataGetTokenBalancesMany(
              args,
              fallbackFns
            );
          }

          if (method === 'getNativeTokenBalanceMany') {
            return this.resolveAccountAssetBalanceHistDataGetNativeTokenBalanceMany(
              args,
              fallbackFns
            );
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

  private isFreeBalanceExisting(accountData: AccountData) {
    if (!accountData || !accountData.free || accountData.free === 0n)
      return false;
    return true;
  }
}

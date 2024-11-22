import system from './system';
import tokens from './tokens';
import omnipool from './omnipool';
import assetRegistry from './assetRegistry';
import parachainSystem from './parachainSystem';
import stableswap from './stableswap';
import xyk from './xyk';
import lbp from './lbp';
import { StorageResolver } from '../../../storageResolver';
import { ProcessingPallets } from '../../../storageResolver/dictionaryUtils/types';
import {
  AccountData,
  GetPoolAssetInfoInput,
  LbpGetPoolDataInput,
  LbpPoolData,
  OmnipoolAssetData,
  OmnipoolGetAssetDataInput,
  StablepoolGetPoolDataInput,
  StablepoolInfo,
  XykGetAssetsInput,
  XykPoolWithAssets,
} from '../../../types/storage';
import { getAccountBalances } from '../../../../handlers/assets/balances';
import { StorageParserMethods } from '../../../types/common';
import { RuntimeApiResolver } from '../../../runtimeApiResolver';
import {
  CurrenciesApiAccountInput,
  RuntimeApiMethodName,
  RuntimeApiName,
} from '../../../runtimeApiResolver/types';

export default {
  system,
  tokens,
  assetRegistry,
  parachainSystem,
  stableswap: {
    getPoolData: (
      args: StablepoolGetPoolDataInput
    ): Promise<StablepoolInfo | null> =>
      StorageResolver.getInstance().resolveStorageData<
        StablepoolGetPoolDataInput,
        StablepoolInfo | null
      >({
        args,
        pallet: ProcessingPallets.STABLESWAP,
        method: 'getPoolData',
        fallbackFns: [stableswap.getPoolData],
      }),
    getPoolAssetInfo: (
      args: GetPoolAssetInfoInput
    ): Promise<AccountData | null> =>
      StorageResolver.getInstance().resolveStorageData<
        GetPoolAssetInfoInput,
        AccountData | null
      >({
        args,
        pallet: ProcessingPallets.STABLESWAP,
        method: 'getPoolAssetInfo',
        fallbackFns: [
          async (fallbackFnArgs) =>
            await new RuntimeApiResolver().resolveRuntimeApiCall<
              CurrenciesApiAccountInput,
              AccountData | null
            >({
              apiName: RuntimeApiName.CurrenciesApi,
              apiMethod: RuntimeApiMethodName.account,
              args: {
                block: fallbackFnArgs.block,
                assetId: fallbackFnArgs.assetId,
                address: fallbackFnArgs.poolAddress!,
              },
            }),
          getAccountBalances,
        ],
      }),
  },
  omnipool: {
    getOmnipoolAssetData: (
      args: OmnipoolGetAssetDataInput
    ): Promise<OmnipoolAssetData | null> =>
      StorageResolver.getInstance().resolveStorageData<
        OmnipoolGetAssetDataInput,
        OmnipoolAssetData | null
      >({
        args,
        pallet: ProcessingPallets.OMNIPOOL,
        method: 'getAssetData',
        fallbackFns: [omnipool.getOmnipoolAssetData],
      }),
    getPoolAssetInfo: (
      args: GetPoolAssetInfoInput
    ): Promise<AccountData | null> =>
      StorageResolver.getInstance().resolveStorageData<
        GetPoolAssetInfoInput,
        AccountData | null
      >({
        args,
        pallet: ProcessingPallets.OMNIPOOL,
        method: 'getPoolAssetInfo',
        fallbackFns: [
          async (fallbackFnArgs) =>
            await new RuntimeApiResolver().resolveRuntimeApiCall<
              CurrenciesApiAccountInput,
              AccountData | null
            >({
              apiName: RuntimeApiName.CurrenciesApi,
              apiMethod: RuntimeApiMethodName.account,
              args: {
                block: fallbackFnArgs.block,
                assetId: fallbackFnArgs.assetId,
                address: fallbackFnArgs.poolAddress!,
              },
            }),
          getAccountBalances,
        ],
      }),
  },
  xyk: {
    getShareToken: xyk.getShareToken,
    getPoolAssets: (
      args: XykGetAssetsInput
    ): Promise<XykPoolWithAssets | null> =>
      StorageResolver.getInstance().resolveStorageData<
        XykGetAssetsInput,
        XykPoolWithAssets | null
      >({
        args,
        pallet: ProcessingPallets.XYK,
        method: 'getPoolAssets',
        fallbackFns: [xyk.getPoolAssets],
      }),
    getPoolAssetInfo: (
      args: GetPoolAssetInfoInput
    ): Promise<AccountData | null> =>
      StorageResolver.getInstance().resolveStorageData<
        GetPoolAssetInfoInput,
        AccountData | null
      >({
        args,
        pallet: ProcessingPallets.XYK,
        method: 'getPoolAssetInfo',
        fallbackFns: [
          async (fallbackFnArgs) =>
            await new RuntimeApiResolver().resolveRuntimeApiCall<
              CurrenciesApiAccountInput,
              AccountData | null
            >({
              apiName: RuntimeApiName.CurrenciesApi,
              apiMethod: RuntimeApiMethodName.account,
              args: {
                block: fallbackFnArgs.block,
                assetId: fallbackFnArgs.assetId,
                address: fallbackFnArgs.poolAddress!,
              },
            }),
          getAccountBalances,
        ],
      }),
  },
  lbp: {
    getPoolData: (args: LbpGetPoolDataInput): Promise<LbpPoolData | null> =>
      StorageResolver.getInstance().resolveStorageData<
        LbpGetPoolDataInput,
        LbpPoolData | null
      >({
        args,
        pallet: ProcessingPallets.LBP,
        method: 'getPoolData',
        fallbackFns: [lbp.getPoolData],
      }),
    getAllPoolsData: lbp.getAllPoolsData,
    getPoolAssetInfo: (
      args: GetPoolAssetInfoInput
    ): Promise<AccountData | null> =>
      StorageResolver.getInstance().resolveStorageData<
        GetPoolAssetInfoInput,
        AccountData | null
      >({
        args,
        pallet: ProcessingPallets.LBP,
        method: 'getPoolAssetInfo',
        fallbackFns: [
          async (fallbackFnArgs) =>
            await new RuntimeApiResolver().resolveRuntimeApiCall<
              CurrenciesApiAccountInput,
              AccountData | null
            >({
              apiName: RuntimeApiName.CurrenciesApi,
              apiMethod: RuntimeApiMethodName.account,
              args: {
                block: fallbackFnArgs.block,
                assetId: fallbackFnArgs.assetId,
                address: fallbackFnArgs.poolAddress!,
              },
            }),
          getAccountBalances,
        ],
      }),
  },
} as StorageParserMethods;

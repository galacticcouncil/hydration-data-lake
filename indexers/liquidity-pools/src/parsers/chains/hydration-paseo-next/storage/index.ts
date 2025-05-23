import system from './system';
import tokens from './tokens';
import omnipool from './omnipool';
import assetRegistry from './assetRegistry';
import parachainSystem from './parachainSystem';
import stableswap from './stableswap';
import xyk from './xyk';
import lbp from './lbp';
import dca from './dca';
import otc from './otc';
import { StorageResolver } from '../../../storageResolver';
import { ProcessingTopic } from '../../../storageResolver/dictionaryUtils/types';
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
  XykPoolAssetIds,
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
  tokens: {
    ...tokens,
    getTokenTotalIssuance: tokens.getTokenTotalIssuance,
  },
  assetRegistry,
  parachainSystem,
  dca,
  otc,
  stableswap: {
    getPoolData: (
      args: StablepoolGetPoolDataInput
    ): Promise<StablepoolInfo | null> =>
      StorageResolver.getInstance().resolveStorageData<
        StablepoolGetPoolDataInput,
        StablepoolInfo | null
      >({
        args,
        pallet: ProcessingTopic.STABLESWAP,
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
        pallet: ProcessingTopic.STABLESWAP,
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
        pallet: ProcessingTopic.OMNIPOOL,
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
        pallet: ProcessingTopic.OMNIPOOL,
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
    ): Promise<XykPoolAssetIds | null> =>
      StorageResolver.getInstance().resolveStorageData<
        XykGetAssetsInput,
        XykPoolAssetIds | null
      >({
        args,
        pallet: ProcessingTopic.XYK,
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
        pallet: ProcessingTopic.XYK,
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
        pallet: ProcessingTopic.LBP,
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
        pallet: ProcessingTopic.LBP,
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

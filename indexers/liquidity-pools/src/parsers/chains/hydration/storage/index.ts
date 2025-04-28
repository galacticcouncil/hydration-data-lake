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
import emaOracle from './emaOracle';
import balances from './balances';
import evmAccounts from './evmAccounts';
import dynamicFees from './dynamicFees';
import { StorageResolver } from '../../../storageResolver';
import { ProcessingPallets } from '../../../storageResolver/dictionaryUtils/types';
import {
  AccountData,
  GetPoolAssetInfoInput,
  LbpGetPoolDataInput,
  LbpPoolData,
  OmnipoolAssetData,
  OmnipoolData,
  OmnipoolGetAssetDataInput,
  OmnipoolGetPoolDataInput,
  StablepoolAssetState,
  StablepoolGetPoolDataInput,
  StablepoolInfo,
  XykGetAssetsInput,
  XykGetPoolShareTokenPairsManyInput,
  XykPoolAssetIds,
  XykPoolData,
  XykPoolShareTokenPair,
} from '../../../types/storage';
import { getAccountBalances } from '../../../../handlers/assets/balances';
import { StorageParserMethods } from '../../../types/common';
import { RuntimeApiResolver } from '../../../runtimeApiResolver';
import {
  AaveTradeExecutorPoolDataWithPoolId,
  AaveTradeExecutorPoolsInput,
  CurrenciesApiAccountInput,
  RuntimeApiMethodName,
  RuntimeApiName,
} from '../../../runtimeApiResolver/types';

export default {
  system,
  balances: {
    getTotalIssuance: balances.getTotalIssuance,
  },
  tokens: {
    ...tokens,
    getTokenTotalIssuance: tokens.getTokenTotalIssuance,
    getManyTokensTotalIssuance: tokens.getManyTokensTotalIssuance,
  },
  assetRegistry,
  parachainSystem,
  dca,
  otc,
  evmAccounts,
  stableswap: {
    getAllPoolIds: stableswap.getAllPoolIds,
    getConstants: stableswap.getConstants,
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
    getPoolAssetStorageData: (
      args: GetPoolAssetInfoInput
    ): Promise<StablepoolAssetState | null> =>
      StorageResolver.getInstance().resolveStorageData<
        GetPoolAssetInfoInput,
        StablepoolAssetState | null
      >({
        args,
        pallet: ProcessingPallets.STABLESWAP,
        method: 'getPoolAssetStorageData',
        fallbackFns: [stableswap.getPoolAssetStorageData],
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
    getConstants: omnipool.getConstants,
    getOmnipoolAllAssetIds: omnipool.getOmnipoolAllAssetIds,
    getOmnipoolHubAssetTradability: omnipool.getOmnipoolHubAssetTradability,
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
    getPoolData: (
      args: OmnipoolGetPoolDataInput
    ): Promise<OmnipoolData | null> =>
      StorageResolver.getInstance().resolveStorageData<
        OmnipoolGetPoolDataInput,
        OmnipoolData | null
      >({
        args,
        pallet: ProcessingPallets.OMNIPOOL,
        method: 'getPoolData',
        fallbackFns: [omnipool.getPoolData],
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
    getConstants: xyk.getConstants,
    getShareToken: xyk.getShareToken,
    getPoolShareTokenPairsMany: xyk.getPoolShareTokenPairsMany,
    getPoolAssets: (args: XykGetAssetsInput): Promise<XykPoolAssetIds | null> =>
      StorageResolver.getInstance().resolveStorageData<
        XykGetAssetsInput,
        XykPoolAssetIds | null
      >({
        args,
        pallet: ProcessingPallets.XYK,
        method: 'getPoolAssets',
        fallbackFns: [xyk.getPoolAssets],
      }),
    getPoolData: (args: XykGetAssetsInput): Promise<XykPoolData | null> =>
      StorageResolver.getInstance().resolveStorageData<
        XykGetAssetsInput,
        XykPoolData | null
      >({
        args,
        pallet: ProcessingPallets.XYK,
        method: 'getPoolData',
        fallbackFns: [xyk.getPoolData],
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
    getConstants: lbp.getConstants,
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
    getAllPoolIds: lbp.getAllPoolIds,
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
  aaveTradeExecutor: {
    getPools: (
      args: AaveTradeExecutorPoolsInput
    ): Promise<AaveTradeExecutorPoolDataWithPoolId[] | null> =>
      StorageResolver.getInstance().resolveStorageData<
        AaveTradeExecutorPoolsInput,
        AaveTradeExecutorPoolDataWithPoolId[] | null
      >({
        args,
        pallet: ProcessingPallets.AAVE,
        method: 'getPools',
        fallbackFns: [
          async (fallbackFnArgs) =>
            await new RuntimeApiResolver().resolveRuntimeApiCall<
              AaveTradeExecutorPoolsInput,
              AaveTradeExecutorPoolDataWithPoolId[] | null
            >({
              apiName: RuntimeApiName.AaveTradeExecutor,
              apiMethod: RuntimeApiMethodName.pools,
              args: {
                block: fallbackFnArgs.block,
              },
            }),
        ],
      }),
  },
  dynamicFees: {
    getConstants: dynamicFees.getConstants,
    getAssetFeesAll: dynamicFees.getAssetFeesAll,
  },
  emaOracle: {
    getOracles: emaOracle.getOracles,
  },
} as StorageParserMethods;

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
import hsm from './hsm';
import balances from './balances';
import evmAccounts from './evmAccounts';
import dynamicFees from './dynamicFees';
import emaOracle from './emaOracle';
import transactionPayment from './transactionPayment';
import { StorageResolver } from '../../../storageResolver';
import { ProcessingTopic } from '../../../storageResolver/dictionaryUtils/types';
import {
  AccountData,
  GetPoolAssetInfoInput,
  GetTokenBalancesManyInput,
  LbpGetPoolDataInput,
  LbpPoolData,
  OmnipoolAssetData,
  OmnipoolGetAssetDataInput,
  StablepoolGetPoolDataInput,
  StablepoolInfo,
  TokenAccountBalancesWithAccountId,
  XykGetAssetsInput,
  XykPoolAssetIds,
  XykPoolData,
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
import bonds from '../../hydration/storage/bonds';

export default {
  system,
  transactionPayment,
  tokens: {
    ...tokens,
    getTokenTotalIssuance: tokens.getTokenTotalIssuance,
    getManyTokensTotalIssuance: tokens.getManyTokensTotalIssuance,
    getTokenBalancesMany: (
      args: GetTokenBalancesManyInput
    ): Promise<TokenAccountBalancesWithAccountId[] | null> =>
      StorageResolver.getInstance().resolveStorageData<
        GetTokenBalancesManyInput,
        TokenAccountBalancesWithAccountId[] | null
      >({
        args,
        pallet: ProcessingTopic.ASSET_HIST_DATA,
        method: 'getTokenBalancesMany',
        fallbackFns: [
          async (fallbackFnArgs) =>
            await new RuntimeApiResolver().resolveRuntimeApiCall<
              GetTokenBalancesManyInput,
              TokenAccountBalancesWithAccountId[] | null
            >({
              apiName: RuntimeApiName.CurrenciesApi,
              apiMethod: RuntimeApiMethodName.synthAccountsMany,
              args: {
                block: fallbackFnArgs.block,
                accountIds: fallbackFnArgs.accountIds!,
              },
            }),
          tokens.getTokenBalancesMany,
        ],
      }),
  },
  balances: {
    getTotalIssuance: balances.getTotalIssuance,
    getNativeTokenBalanceMany: balances.getNativeTokenBalanceMany,
  },
  bonds: {
    getBond: bonds.getBond,
    getBondsAll: bonds.getBondsAll,
  },
  assetRegistry,
  parachainSystem,
  dca,
  otc,
  evmAccounts,
  stableswap: {
    getConstants: stableswap.getConstants,
    getPoolPegs: stableswap.getPoolPegs,
    getAllPoolIds: stableswap.getAllPoolIds,
    getAllPoolsPegs: stableswap.getAllPoolsPegs,
    getAllPoolsData: stableswap.getAllPoolsData,
    getPoolAssetStorageData: stableswap.getPoolAssetStorageData,
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
    getConstants: omnipool.getConstants,
    getOmnipoolAllAssetIds: omnipool.getOmnipoolAllAssetIds,
    getOmnipoolHubAssetTradability: omnipool.getOmnipoolHubAssetTradability,
    getPoolData: omnipool.getPoolData,
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
    getConstants: xyk.getConstants,
    getShareToken: xyk.getShareToken,
    getPoolShareTokenPairsMany: xyk.getPoolShareTokenPairsMany,
    getPoolAssets: (args: XykGetAssetsInput): Promise<XykPoolAssetIds | null> =>
      StorageResolver.getInstance().resolveStorageData<
        XykGetAssetsInput,
        XykPoolAssetIds | null
      >({
        args,
        pallet: ProcessingTopic.XYK,
        method: 'getPoolAssets',
        fallbackFns: [xyk.getPoolAssets],
      }),
    getPoolData: (args: XykGetAssetsInput): Promise<XykPoolData | null> =>
      StorageResolver.getInstance().resolveStorageData<
        XykGetAssetsInput,
        XykPoolData | null
      >({
        args,
        pallet: ProcessingTopic.XYK,
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
    getConstants: lbp.getConstants,
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
    getAllPoolIds: lbp.getAllPoolIds,
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
  aaveTradeExecutor: {
    getPools: (
      args: AaveTradeExecutorPoolsInput
    ): Promise<AaveTradeExecutorPoolDataWithPoolId[] | null> =>
      StorageResolver.getInstance().resolveStorageData<
        AaveTradeExecutorPoolsInput,
        AaveTradeExecutorPoolDataWithPoolId[] | null
      >({
        args,
        pallet: ProcessingTopic.AAVE,
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
  hsm,
} as StorageParserMethods;

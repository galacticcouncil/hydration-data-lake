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
  OmnipoolAssetData,
  OmnipoolGetAssetDataInput,
  GetPoolAssetInfoInput,
  StablepoolGetPoolDataInput,
  StablepoolInfo,
  XykPoolWithAssets,
  XykGetAssetsInput,
  LbpGetPoolDataInput,
  LbpPoolData,
} from '../../../types/storage';
import { getAccountBalances } from '../../../../handlers/assets/balances';
import { StorageParserMethods } from '../../../types/common';

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
        fallbackFn: stableswap.getPoolData,
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
        fallbackFn: getAccountBalances,
      }),
  },
  omnipool: {
    getOmnipoolAssetData: (
      args: StablepoolGetPoolDataInput
    ): Promise<OmnipoolAssetData | null> =>
      StorageResolver.getInstance().resolveStorageData<
        OmnipoolGetAssetDataInput,
        OmnipoolAssetData | null
      >({
        args,
        pallet: ProcessingPallets.OMNIPOOL,
        method: 'getAssetData',
        fallbackFn: omnipool.getOmnipoolAssetData,
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
        fallbackFn: getAccountBalances,
      }),
  },
  xyk: {
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
        fallbackFn: xyk.getPoolAssets,
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
        fallbackFn: getAccountBalances,
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
        fallbackFn: lbp.getPoolData,
      }),
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
        fallbackFn: getAccountBalances,
      }),
  },
} as StorageParserMethods;

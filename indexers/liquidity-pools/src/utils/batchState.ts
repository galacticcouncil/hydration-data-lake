import {
  Account,
  AccountChainActivityTrace,
  Asset,
  Block as BlockEntity,
  Event as EventEntity,
  Call as CallEntity,
  ChainActivityTrace,
  Extrinsic as ExtrinsicEntity,
  AssetVolumeHistoricalData,
  Lbppool,
  LbppoolHistoricalData,
  LbppoolPriceHistoricalData,
  LbppoolVolumeHistoricalData,
  Omnipool,
  OmnipoolAsset,
  OmnipoolAssetHistoricalData,
  OmnipoolAssetVolumeHistoricalData,
  Stableswap,
  StableswapAsset,
  StableswapAssetHistoricalData,
  StableswapAssetVolumeHistoricalData,
  StableswapAssetLiquidityAmount,
  StableswapHistoricalData,
  StableswapVolumeHistoricalData,
  StableswapLiquidityEvent,
  Swap,
  SwapFee,
  SwapAssetBalance,
  Transfer,
  Xykpool,
  XykpoolHistoricalData,
  XykpoolPriceHistoricalData,
  XykpoolVolumeHistoricalData,
  DcaSchedule,
  DcaScheduleOrderRouteHop,
  DcaScheduleExecution,
  DcaScheduleExecutionEvent,
  OtcOrder,
  OtcOrderEvent,
  ChainActivityTraceRelation,
  DcaScheduleEvent,
  RoutedTrade,
  RoutedTradeAssetBalance,
  AccountSwapFeeHistoricalData,
  AccountAssetSwapFeeHistoricalData,
  AssetSwapFeeHistoricalData,
  MoneyMarketEvent,
  MmSupply,
  MmWithdraw,
  MmBorrow,
  MmUserEModeSet,
  MmRepay,
  MmLiquidationCall,
  MmReserveUsedAsCollateralEnabledEvent,
  MmReserveUsedAsCollateralDisabledEvent,
  AccountAssetBalanceHistoricalData,
  OmnipoolHistoricalData,
  AssetHistoricalData,
  Aavepool,
  AavepoolHistoricalData,
  ConstantsHistoricalData,
  EmaOracleEntryHistoricalData,
  AssetSpotPriceHistoricalData,
  AssetsPairVolumeHistoricalData,
  AssetAssetsPairVolume,
} from '../model';
import { RelayChainInfo } from '../parsers/types/events';
import { BlockHeader } from '@subsquid/substrate-processor';
import { SwapFillerContextDetails } from './types';

type ParachainBlockNumber = number;

export type BatchStatePayload = {
  relayChainInfo: Map<ParachainBlockNumber, RelayChainInfo>;

  batchBlocks: Map<string, BlockEntity>;
  batchExtrinsics: Map<string, ExtrinsicEntity>;
  batchCalls: Map<string, CallEntity>;
  batchEvents: Map<string, EventEntity>;
  chainActivityTraces: Map<string, ChainActivityTrace>;
  chainActivityTraceRelations: Map<string, ChainActivityTraceRelation>;
  accountChainActivityTraces: Map<string, AccountChainActivityTrace>;
  // operationStacks: Map<string, OperationStack>;

  constantsHistoricalData: Map<string, ConstantsHistoricalData>;

  accounts: Map<string, Account>;
  accountIdForPrefetch: Set<string>;

  transfers: Map<string, Transfer>;
  assetVolumes: Map<string, AssetVolumeHistoricalData>;

  assetIdsToSave: Set<string>;
  assetsAllBatch: Map<string, Asset>;
  assetsHistoricalDataBatch: Map<string, AssetHistoricalData>;
  assetsSpotPriceHistoricalDataBatch: Map<string, AssetSpotPriceHistoricalData>;
  assetsPairVolumeHistoricalDataBatch: Map<
    string,
    AssetsPairVolumeHistoricalData
  >;
  assetAssetsPairVolumesBatch: Map<string, AssetAssetsPairVolume>;

  accountAssetBalanceHistoricalData: Map<
    string,
    AccountAssetBalanceHistoricalData
  >;

  swaps: Map<string, Swap>;
  swapFees: Map<string, SwapFee>;
  swapInputs: Map<string, SwapAssetBalance>;
  swapOutputs: Map<string, SwapAssetBalance>;
  swapFillerContexts: Map<string, SwapFillerContextDetails>;
  routeTrades: Map<string, RoutedTrade>;
  routeTradesInputs: Map<string, RoutedTradeAssetBalance>;
  routeTradesOutputs: Map<string, RoutedTradeAssetBalance>;

  lbpPoolIdsToSave: Set<string>;
  lbpAllBatchPools: Map<string, Lbppool>;
  lbpPoolVolumes: Map<string, LbppoolVolumeHistoricalData>;
  lbpPoolHistoricalPrices: Map<string, LbppoolPriceHistoricalData>;
  lbppoolAssetIdsForStoragePrefetch: Map<
    number,
    { blockHeader: BlockHeader; ids: Set<string> } // ... ids: Set<"assetAId-assetBId">
  >;
  lbpPoolAllHistoricalData: Map<string, LbppoolHistoricalData>;

  xykPoolIdsToSave: Set<string>;
  xykAllBatchPools: Map<string, Xykpool>;
  xykPoolVolumes: Map<string, XykpoolVolumeHistoricalData>;
  xykPoolHistoricalPrices: Map<string, XykpoolPriceHistoricalData>;
  xykPoolIdsForStoragePrefetch: Map<
    number,
    { blockHeader: BlockHeader; ids: Set<string> }
  >;
  xykPoolAllHistoricalData: Map<string, XykpoolHistoricalData>;

  aavePools: Map<string, Aavepool>;
  aavePoolsHistoricalData: Map<string, AavepoolHistoricalData>;

  omnipoolEntity: Omnipool | null;
  omnipoolAssets: Map<string, OmnipoolAsset>;
  omnipoolAssetIdsToSave: Set<string>;
  omnipoolAssetVolumes: Map<string, OmnipoolAssetVolumeHistoricalData>;
  omnipoolAssetIdsForStoragePrefetch: Map<
    number,
    { blockHeader: BlockHeader; ids: Set<number> }
  >;
  omnipoolAllHistoricalData: Map<string, OmnipoolHistoricalData>;
  omnipoolAssetAllHistoricalData: Map<string, OmnipoolAssetHistoricalData>;

  stableswapIdsToSave: Set<string>;
  stableswapAssetsAllBatch: Map<string, StableswapAsset>;
  stableswapAllBatchPools: Map<string, Stableswap>;
  stablepoolVolumeCollections: Map<string, StableswapVolumeHistoricalData>;
  stablepoolAssetVolumes: Map<string, StableswapAssetVolumeHistoricalData>;
  stablepoolAssetVolumeIdsToSave: Set<string>;
  stablepoolAssetBatchLiquidityAmounts: Map<
    string,
    StableswapAssetLiquidityAmount
  >;
  stablepoolBatchLiquidityActions: Map<string, StableswapLiquidityEvent>;

  stablepoolAllHistoricalData: Map<string, StableswapHistoricalData>;
  stablepoolAssetsAllHistoricalData: Map<string, StableswapAssetHistoricalData>;
  stableswapIdsForStoragePrefetch: Map<
    number,
    { blockHeader: BlockHeader; ids: Set<number> }
  >;

  dcaSchedules: Map<string, DcaSchedule>;
  dcaScheduleEvents: Map<string, DcaScheduleEvent>;
  dcaScheduleOrderRoutes: Map<string, DcaScheduleOrderRouteHop>;
  dcaScheduleExecutions: Map<string, DcaScheduleExecution>;
  dcaScheduleExecutionEvents: Map<string, DcaScheduleExecutionEvent>;

  otcOrders: Map<string, OtcOrder>;
  otcOrderEvents: Map<string, OtcOrderEvent>;

  historicalAssetSwapFees: Map<string, AssetSwapFeeHistoricalData>;
  historicalAccountSwapFees: Map<string, AccountSwapFeeHistoricalData>;
  historicalAccountAssetSwapFees: Map<
    string,
    AccountAssetSwapFeeHistoricalData
  >;

  moneyMarketEvents: Map<string, MoneyMarketEvent>;
  mmSupplies: Map<string, MmSupply>;
  mmWithdrawals: Map<string, MmWithdraw>;
  mmBorrows: Map<string, MmBorrow>;
  mmUserEModeSetEvents: Map<string, MmUserEModeSet>;
  mmRepays: Map<string, MmRepay>;
  mmLiquidationCalls: Map<string, MmLiquidationCall>;
  mmReserveUsedAsCollateralEnabledEvents: Map<
    string,
    MmReserveUsedAsCollateralEnabledEvent
  >;
  mmReserveUsedAsCollateralDisabledEvents: Map<
    string,
    MmReserveUsedAsCollateralDisabledEvent
  >;

  emaOracleEntriesHistoricalData: Map<string, EmaOracleEntryHistoricalData>;
};

export class BatchState {
  public state: BatchStatePayload = {
    relayChainInfo: new Map(),

    batchBlocks: new Map(),
    batchExtrinsics: new Map(),
    batchCalls: new Map(),
    batchEvents: new Map(),
    chainActivityTraces: new Map(),
    chainActivityTraceRelations: new Map(),
    accountChainActivityTraces: new Map(),
    // operationStacks: new Map(),

    constantsHistoricalData: new Map(),

    accounts: new Map(),
    accountIdForPrefetch: new Set(),
    transfers: new Map(),
    assetVolumes: new Map(),
    assetsHistoricalDataBatch: new Map(),
    assetsSpotPriceHistoricalDataBatch: new Map(),
    assetsPairVolumeHistoricalDataBatch: new Map(),
    assetAssetsPairVolumesBatch: new Map(),

    assetIdsToSave: new Set(),
    assetsAllBatch: new Map(),

    accountAssetBalanceHistoricalData: new Map(),

    swaps: new Map(),
    swapFees: new Map(),
    swapInputs: new Map(),
    swapOutputs: new Map(),
    swapFillerContexts: new Map(),
    routeTrades: new Map(),
    routeTradesInputs: new Map(),
    routeTradesOutputs: new Map(),

    lbpPoolIdsToSave: new Set(),
    lbpAllBatchPools: new Map(),
    lbpPoolVolumes: new Map(),
    lbpPoolHistoricalPrices: new Map(),
    lbppoolAssetIdsForStoragePrefetch: new Map(),
    lbpPoolAllHistoricalData: new Map(),

    xykPoolIdsToSave: new Set(),
    xykAllBatchPools: new Map(),
    xykPoolVolumes: new Map(),
    xykPoolHistoricalPrices: new Map(),
    xykPoolIdsForStoragePrefetch: new Map(),
    xykPoolAllHistoricalData: new Map(),

    aavePools: new Map(),
    aavePoolsHistoricalData: new Map(),

    omnipoolEntity: null,
    omnipoolAssets: new Map(),
    omnipoolAssetIdsToSave: new Set(),
    omnipoolAssetVolumes: new Map(),
    omnipoolAssetIdsForStoragePrefetch: new Map(),
    omnipoolAllHistoricalData: new Map(),
    omnipoolAssetAllHistoricalData: new Map(),

    stableswapIdsToSave: new Set(),
    stableswapAllBatchPools: new Map(),
    stableswapAssetsAllBatch: new Map(),
    stablepoolAssetVolumes: new Map(),
    stablepoolAssetVolumeIdsToSave: new Set(),
    stablepoolVolumeCollections: new Map(),
    stablepoolAssetBatchLiquidityAmounts: new Map(),
    stablepoolBatchLiquidityActions: new Map(),
    stablepoolAllHistoricalData: new Map(),
    stablepoolAssetsAllHistoricalData: new Map(),
    stableswapIdsForStoragePrefetch: new Map(),

    dcaSchedules: new Map(),
    dcaScheduleEvents: new Map(),
    dcaScheduleOrderRoutes: new Map(),
    dcaScheduleExecutions: new Map(),
    dcaScheduleExecutionEvents: new Map(),

    otcOrders: new Map(),
    otcOrderEvents: new Map(),

    historicalAssetSwapFees: new Map(),
    historicalAccountSwapFees: new Map(),
    historicalAccountAssetSwapFees: new Map(),

    moneyMarketEvents: new Map(),
    mmSupplies: new Map(),
    mmWithdrawals: new Map(),
    mmBorrows: new Map(),
    mmUserEModeSetEvents: new Map(),
    mmRepays: new Map(),
    mmLiquidationCalls: new Map(),
    mmReserveUsedAsCollateralEnabledEvents: new Map(),
    mmReserveUsedAsCollateralDisabledEvents: new Map(),

    emaOracleEntriesHistoricalData: new Map(),
  };

  getRelayChainBlockDataFromCache(paraBlockHeight: number): {
    height: number;
  } {
    const blockData = this.state.relayChainInfo.get(paraBlockHeight);

    return {
      height: blockData?.relaychainBlockNumber ?? 0,
    };
  }
  getParaBlockFromCacheByHeight(
    paraBlockHeight: number
  ): BlockEntity | undefined {
    const blockData = [...this.state.batchBlocks.values()].find(
      (b) => b.height === paraBlockHeight
    );

    return blockData;
  }
}

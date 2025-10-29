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
  AccountTotalBalanceHistoricalData,
  AccountMmPositionHistoricalData,
  MoneyMarketReserve,
  MmReserveIndexesHistoricalData,
  MmReserveConfigHistoricalData,
  Hsmpool,
  HsmCollateral,
  HsmpoolHistoricalData,
  HsmCollateralConfigHistoricalData,
  HsmpoolAssetHistoricalData,
  AaveFacilitator,
  AaveFacilitatorHistoricalData,
  TransactionPaymentHistoricalData,
  OmnipoolLiquidityPositionEvent,
  OmnipoolLiquidityPosition,
  OmnipoolGlobalFarm,
  OmnipoolYieldFarm,
  OmnipoolYieldFarmDeposit,
  OmnipoolYieldFarmEntry,
  OmnipoolYieldFarmDepositEvent,
  XykGlobalFarm,
  XykYieldFarm,
  XykYieldFarmDeposit,
  XykYieldFarmEntry,
  XykYieldFarmDepositEvent,
} from '../model';
import { RelayChainInfo } from '../parsers/types/events';
import { BlockHeader } from '@subsquid/substrate-processor';
import { BalanceImpactedEventData, SwapFillerContextDetails } from './types';
import { SqdBlock, SqdProcessorContext } from '../processor';
import { Store } from '@subsquid/typeorm-store';

type ParachainBlockNumber = number;

export type BatchStatePayload = {
  relayChainInfo: Map<ParachainBlockNumber, RelayChainInfo>;
  blockHeadersByHeight: Map<ParachainBlockNumber, SqdBlock>;

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
  assetsAll: Map<string, Asset>;
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
  accountTotalBalanceHistoricalData: Map<
    string,
    AccountTotalBalanceHistoricalData
  >;
  balanceImpactingEvents: Map<string, BalanceImpactedEventData>;
  accountMmPositionHistoricalData: Map<string, AccountMmPositionHistoricalData>;

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

  hsmpoolEntity: Hsmpool | null;
  hsmpoolHistData: Map<string, HsmpoolHistoricalData>;
  hsmCollaterals: Map<string, HsmCollateral>;
  hsmCollateralsConfigHistData: Map<string, HsmCollateralConfigHistoricalData>;
  hsmpoolAssetHistData: Map<string, HsmpoolAssetHistoricalData>;
  aaveFacilitators: Map<string, AaveFacilitator>;
  aaveFacilitatorsHistData: Map<string, AaveFacilitatorHistoricalData>;

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
  stableswapAssets: Map<string, StableswapAsset>;
  stableswapPools: Map<string, Stableswap>;
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

  moneyMarketReserves: Map<string, MoneyMarketReserve>;
  moneyMarketReserveIndexesHistData: Map<
    string,
    MmReserveIndexesHistoricalData
  >;
  moneyMarketReserveConfigHistData: Map<string, MmReserveConfigHistoricalData>;

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

  transactionPaymentHistData: Map<string, TransactionPaymentHistoricalData>;

  // omnipoolLiquidityPositions: Map<string, OmnipoolLiquidityPosition>;
  // omnipoolLiquidityPositionEvents: Map<string, OmnipoolLiquidityPositionEvent>;
  // omnipoolGlobalFarms: Map<string, OmnipoolGlobalFarm>;
  // omnipoolYieldFarms: Map<string, OmnipoolYieldFarm>;
  // omnipoolYieldFarmDeposits: Map<string, OmnipoolYieldFarmDeposit>;
  // omnipoolYieldFarmEntries: Map<string, OmnipoolYieldFarmEntry>;
  // omnipoolYieldFarmDepositEvents: Map<string, OmnipoolYieldFarmDepositEvent>;
  //
  // xykGlobalFarms: Map<string, XykGlobalFarm>;
  // xykYieldFarms: Map<string, XykYieldFarm>;
  // xykYieldFarmDeposits: Map<string, XykYieldFarmDeposit>;
  // xykYieldFarmEntries: Map<string, XykYieldFarmEntry>;
  // xykYieldFarmDepositEvents: Map<string, XykYieldFarmDepositEvent>;
};

export class BatchState {
  public state: BatchStatePayload = {
    relayChainInfo: new Map(),
    blockHeadersByHeight: new Map(),

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
    assetsAll: new Map(),

    accountAssetBalanceHistoricalData: new Map(),
    accountTotalBalanceHistoricalData: new Map(),
    balanceImpactingEvents: new Map(),
    accountMmPositionHistoricalData: new Map(),

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

    hsmpoolEntity: null,
    hsmpoolHistData: new Map(),
    hsmCollaterals: new Map(),
    hsmCollateralsConfigHistData: new Map(),
    hsmpoolAssetHistData: new Map(),
    aaveFacilitators: new Map(),
    aaveFacilitatorsHistData: new Map(),

    omnipoolEntity: null,
    omnipoolAssets: new Map(),
    omnipoolAssetIdsToSave: new Set(),
    omnipoolAssetVolumes: new Map(),
    omnipoolAssetIdsForStoragePrefetch: new Map(),
    omnipoolAllHistoricalData: new Map(),
    omnipoolAssetAllHistoricalData: new Map(),

    stableswapIdsToSave: new Set(),
    stableswapPools: new Map(),
    stableswapAssets: new Map(),
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

    moneyMarketReserves: new Map(),
    moneyMarketReserveIndexesHistData: new Map(),
    moneyMarketReserveConfigHistData: new Map(),
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

    transactionPaymentHistData: new Map(),
  };

  constructor(ctx: SqdProcessorContext<Store>) {
    this.initState();
    this.indexBlockHeadersByHeight(ctx);
  }

  initState() {
    this.state = {
      relayChainInfo: new Map(),
      blockHeadersByHeight: new Map(),

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
      assetsAll: new Map(),

      accountAssetBalanceHistoricalData: new Map(),
      accountTotalBalanceHistoricalData: new Map(),
      balanceImpactingEvents: new Map(),
      accountMmPositionHistoricalData: new Map(),

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

      hsmpoolEntity: null,
      hsmpoolHistData: new Map(),
      hsmCollaterals: new Map(),
      hsmCollateralsConfigHistData: new Map(),
      hsmpoolAssetHistData: new Map(),
      aaveFacilitators: new Map(),
      aaveFacilitatorsHistData: new Map(),

      omnipoolEntity: null,
      omnipoolAssets: new Map(),
      omnipoolAssetIdsToSave: new Set(),
      omnipoolAssetVolumes: new Map(),
      omnipoolAssetIdsForStoragePrefetch: new Map(),
      omnipoolAllHistoricalData: new Map(),
      omnipoolAssetAllHistoricalData: new Map(),

      stableswapIdsToSave: new Set(),
      stableswapPools: new Map(),
      stableswapAssets: new Map(),
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

      moneyMarketReserves: new Map(),
      moneyMarketReserveIndexesHistData: new Map(),
      moneyMarketReserveConfigHistData: new Map(),
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

      transactionPaymentHistData: new Map(),
    };
  }

  indexBlockHeadersByHeight(ctx: SqdProcessorContext<Store>) {
    this.state.blockHeadersByHeight = new Map(
      ctx.blocks.map((b) => [b.header.height, b.header])
    );
  }

  wipeState() {
    this.initState();
  }

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

  getParaBlockFromCacheById(id: string): BlockEntity | undefined {
    return this.state.batchBlocks.get(id);
  }

  getBlockHeaderByBlockHeight(height: number): SqdBlock {
    if (!this.state.blockHeadersByHeight.has(height))
      throw new Error(`Block header cannot be found for height ${height}`);

    return this.state.blockHeadersByHeight.get(height)!;
  }

  getPreviousHistDataEntity<E extends { id: string }>({
    entitiesMap,
    entityId,
    currentBlockHeight,
    blockHeightValPosition,
    separator = '-',
  }: {
    entitiesMap: Map<string, E>;
    entityId: string;
    currentBlockHeight: number;
    blockHeightValPosition: number;
    separator?: string;
  }) {
    return entitiesMap.get(
      Array.from(entitiesMap.keys())
        .filter((k) => {
          return (
            k.startsWith(entityId + separator) &&
            parseInt(k.split(separator)[blockHeightValPosition]) <
              currentBlockHeight
          );
        })
        .sort((a, b) => {
          return (
            parseInt(b.split(separator)[blockHeightValPosition]) -
            parseInt(a.split(separator)[blockHeightValPosition])
          );
        })[0]
    );
  }
}

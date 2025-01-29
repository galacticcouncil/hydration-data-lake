import {
  Account,
  AccountChainActivityTrace,
  Asset,
  Block as BlockEntity,
  Event as EventEntity,
  Call as CallEntity,
  ChainActivityTrace,
  Extrinsic as ExtrinsicEntity,
  HistoricalAssetVolume,
  Lbppool,
  LbppoolHistoricalData,
  LbppoolHistoricalPrice,
  LbppoolHistoricalVolume,
  Omnipool,
  OmnipoolAsset,
  OmnipoolAssetHistoricalData,
  OmnipoolAssetHistoricalVolume,
  Stableswap,
  StableswapAsset,
  StableswapAssetHistoricalData,
  StableswapAssetHistoricalVolume,
  StableswapAssetLiquidityAmount,
  StableswapHistoricalData,
  StableswapHistoricalVolume,
  StableswapLiquidityEvent,
  Swap,
  SwapFee,
  SwapAssetBalance,
  Transfer,
  Xykpool,
  XykpoolHistoricalData,
  XykpoolHistoricalPrice,
  XykpoolHistoricalVolume,
  DcaSchedule,
  DcaScheduleOrderRouteHop,
  DcaScheduleExecution,
  DcaScheduleExecutionEvent,
  OtcOrder,
  OtcOrderEvent,
  ChainActivityTraceRelation,
  DcaScheduleEvent,
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

  accounts: Map<string, Account>;
  transfers: Map<string, Transfer>;
  assetVolumes: Map<string, HistoricalAssetVolume>;

  assetIdsToSave: Set<string>;
  assetsAllBatch: Map<string, Asset>;

  swaps: Map<string, Swap>;
  swapFees: Map<string, SwapFee>;
  swapInputs: Map<string, SwapAssetBalance>;
  swapOutputs: Map<string, SwapAssetBalance>;
  swapFillerContexts: Map<string, SwapFillerContextDetails>;

  lbpPoolIdsToSave: Set<string>;
  lbpAllBatchPools: Map<string, Lbppool>;
  lbpPoolVolumes: Map<string, LbppoolHistoricalVolume>;
  lbpPoolHistoricalPrices: Map<string, LbppoolHistoricalPrice>;
  lbppoolAssetIdsForStoragePrefetch: Map<
    number,
    { blockHeader: BlockHeader; ids: Set<string> } // ... ids: Set<"assetAId-assetBId">
  >;
  lbpPoolAllHistoricalData: LbppoolHistoricalData[];

  xykPoolIdsToSave: Set<string>;
  xykAllBatchPools: Map<string, Xykpool>;
  xykPoolVolumes: Map<string, XykpoolHistoricalVolume>;
  xykPoolHistoricalPrices: Map<string, XykpoolHistoricalPrice>;
  xykPoolIdsForStoragePrefetch: Map<
    number,
    { blockHeader: BlockHeader; ids: Set<string> }
  >;
  xykPoolAllHistoricalData: XykpoolHistoricalData[];

  omnipoolEntity: Omnipool | null;
  omnipoolAssets: Map<string, OmnipoolAsset>;
  omnipoolAssetIdsToSave: Set<string>;
  omnipoolAssetVolumes: Map<string, OmnipoolAssetHistoricalVolume>;
  omnipoolAssetIdsForStoragePrefetch: Map<
    number,
    { blockHeader: BlockHeader; ids: Set<number> }
  >;
  omnipoolAssetAllHistoricalData: OmnipoolAssetHistoricalData[];

  stableswapIdsToSave: Set<string>;
  stableswapAssetsAllBatch: Map<number, StableswapAsset>;
  stableswapAllBatchPools: Map<string, Stableswap>;
  stablepoolVolumeCollections: Map<string, StableswapHistoricalVolume>;
  stablepoolAssetVolumes: Map<string, StableswapAssetHistoricalVolume>;
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

    accounts: new Map(),
    transfers: new Map(),
    assetVolumes: new Map(),

    assetIdsToSave: new Set(),
    assetsAllBatch: new Map(),

    swaps: new Map(),
    swapFees: new Map(),
    swapInputs: new Map(),
    swapOutputs: new Map(),
    swapFillerContexts: new Map(),

    lbpPoolIdsToSave: new Set(),
    lbpAllBatchPools: new Map(),
    lbpPoolVolumes: new Map(),
    lbpPoolHistoricalPrices: new Map(),
    lbppoolAssetIdsForStoragePrefetch: new Map(),
    lbpPoolAllHistoricalData: [],

    xykPoolIdsToSave: new Set(),
    xykAllBatchPools: new Map(),
    xykPoolVolumes: new Map(),
    xykPoolHistoricalPrices: new Map(),
    xykPoolIdsForStoragePrefetch: new Map(),
    xykPoolAllHistoricalData: [],

    omnipoolEntity: null,
    omnipoolAssets: new Map(),
    omnipoolAssetIdsToSave: new Set(),
    omnipoolAssetVolumes: new Map(),
    omnipoolAssetIdsForStoragePrefetch: new Map(),
    omnipoolAssetAllHistoricalData: [],

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
  };

  getRelayChainBlockDataFromCache(paraBlockHeight: number): {
    height: number;
  } {
    const blockData = this.state.relayChainInfo.get(paraBlockHeight);

    return {
      height: blockData?.relaychainBlockNumber ?? 0,
    };
  }
}

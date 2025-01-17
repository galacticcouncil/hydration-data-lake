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
  LbpPool,
  LbpPoolHistoricalData,
  LbpPoolHistoricalPrice,
  LbpPoolHistoricalVolume,
  Omnipool,
  OmnipoolAsset,
  OmnipoolAssetHistoricalData,
  OmnipoolAssetHistoricalVolume,
  Stablepool,
  StablepoolAsset,
  StablepoolAssetHistoricalData,
  StablepoolAssetHistoricalVolume,
  StablepoolAssetLiquidityAmount,
  StablepoolHistoricalData,
  StablepoolHistoricalVolume,
  StablepoolLiquidityAction,
  Swap,
  SwapFee,
  SwapInputAssetBalance,
  SwapOutputAssetBalance,
  Transfer,
  XykPool,
  XykPoolHistoricalData,
  XykPoolHistoricalPrice,
  XykPoolHistoricalVolume,
  DcaSchedule,
  DcaScheduleOrderRoute,
  DcaScheduleExecution,
  DcaRandomnessGenerationFailedError,
  DcaScheduleExecutionAction,
  OtcOrder,
  OtcOrderAction,
  OperationStack,
  ChainActivityTraceRelation,
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
  operationStacks: Map<string, OperationStack>;

  accounts: Map<string, Account>;
  transfers: Map<string, Transfer>;
  assetVolumes: Map<string, HistoricalAssetVolume>;

  assetIdsToSave: Set<string>;
  assetsAllBatch: Map<string, Asset>;

  swaps: Map<string, Swap>;
  swapFees: Map<string, SwapFee>;
  swapInputs: Map<string, SwapInputAssetBalance>;
  swapOutputs: Map<string, SwapOutputAssetBalance>;
  swapFillerContexts: Map<string, SwapFillerContextDetails>;

  lbpPoolIdsToSave: Set<string>;
  lbpAllBatchPools: Map<string, LbpPool>;
  lbpPoolVolumes: Map<string, LbpPoolHistoricalVolume>;
  lbpPoolHistoricalPrices: Map<string, LbpPoolHistoricalPrice>;
  lbpPoolAssetIdsForStoragePrefetch: Map<
    number,
    { blockHeader: BlockHeader; ids: Set<string> } // ... ids: Set<"assetAId-assetBId">
  >;
  lbpPoolAllHistoricalData: LbpPoolHistoricalData[];

  xykPoolIdsToSave: Set<string>;
  xykAllBatchPools: Map<string, XykPool>;
  xykPoolVolumes: Map<string, XykPoolHistoricalVolume>;
  xykPoolHistoricalPrices: Map<string, XykPoolHistoricalPrice>;
  xykPoolIdsForStoragePrefetch: Map<
    number,
    { blockHeader: BlockHeader; ids: Set<string> }
  >;
  xykPoolAllHistoricalData: XykPoolHistoricalData[];

  omnipoolEntity: Omnipool | null;
  omnipoolAssets: Map<string, OmnipoolAsset>;
  omnipoolAssetIdsToSave: Set<string>;
  omnipoolAssetVolumes: Map<string, OmnipoolAssetHistoricalVolume>;
  omnipoolAssetIdsForStoragePrefetch: Map<
    number,
    { blockHeader: BlockHeader; ids: Set<number> }
  >;
  omnipoolAssetAllHistoricalData: OmnipoolAssetHistoricalData[];

  stablepoolIdsToSave: Set<string>;
  stablepoolAssetsAllBatch: Map<number, StablepoolAsset>;
  stablepoolAllBatchPools: Map<string, Stablepool>;
  stablepoolVolumeCollections: Map<string, StablepoolHistoricalVolume>;
  stablepoolAssetVolumes: Map<string, StablepoolAssetHistoricalVolume>;
  stablepoolAssetVolumeIdsToSave: Set<string>;
  stablepoolAssetBatchLiquidityAmounts: Map<
    string,
    StablepoolAssetLiquidityAmount
  >;
  stablepoolBatchLiquidityActions: Map<string, StablepoolLiquidityAction>;

  stablepoolAllHistoricalData: Map<string, StablepoolHistoricalData>;
  stablepoolAssetsAllHistoricalData: Map<string, StablepoolAssetHistoricalData>;
  stablepoolIdsForStoragePrefetch: Map<
    number,
    { blockHeader: BlockHeader; ids: Set<number> }
  >;

  dcaSchedules: Map<string, DcaSchedule>;
  dcaScheduleOrderRoutes: Map<string, DcaScheduleOrderRoute>;
  dcaScheduleExecutions: Map<string, DcaScheduleExecution>;
  dcaScheduleExecutionActions: Map<string, DcaScheduleExecutionAction>;
  dcaRandomnessGenerationFailedErrors: Map<
    string,
    DcaRandomnessGenerationFailedError
  >;

  otcOrders: Map<string, OtcOrder>;
  otcOrderActions: Map<string, OtcOrderAction>;
};

export class BatchState {
  private statePayload: BatchStatePayload = {
    relayChainInfo: new Map(),

    batchBlocks: new Map(),
    batchExtrinsics: new Map(),
    batchCalls: new Map(),
    batchEvents: new Map(),
    chainActivityTraces: new Map(),
    chainActivityTraceRelations: new Map(),
    accountChainActivityTraces: new Map(),
    operationStacks: new Map(),

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
    lbpPoolAssetIdsForStoragePrefetch: new Map(),
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

    stablepoolIdsToSave: new Set(),
    stablepoolAllBatchPools: new Map(),
    stablepoolAssetsAllBatch: new Map(),
    stablepoolAssetVolumes: new Map(),
    stablepoolAssetVolumeIdsToSave: new Set(),
    stablepoolVolumeCollections: new Map(),
    stablepoolAssetBatchLiquidityAmounts: new Map(),
    stablepoolBatchLiquidityActions: new Map(),
    stablepoolAllHistoricalData: new Map(),
    stablepoolAssetsAllHistoricalData: new Map(),
    stablepoolIdsForStoragePrefetch: new Map(),

    dcaSchedules: new Map(),
    dcaScheduleOrderRoutes: new Map(),
    dcaScheduleExecutions: new Map(),
    dcaScheduleExecutionActions: new Map(),
    dcaRandomnessGenerationFailedErrors: new Map(),

    otcOrders: new Map(),
    otcOrderActions: new Map(),
  };

  get state(): BatchStatePayload {
    return { ...this.statePayload };
  }

  set state(partialState: Partial<BatchStatePayload>) {
    this.statePayload = { ...this.statePayload, ...partialState };
  }
}

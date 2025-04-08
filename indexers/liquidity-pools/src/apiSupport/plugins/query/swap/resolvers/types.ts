import {
  AggregationTimeRangeLabel,
  StableswapAssetHistoricalVolumeRaw,
  StableswapHistoricalVolumeRaw,
} from '../../../../types';

export type AssetSwapFeeHistoricalDataByPeriodFilter = {
  period?: AggregationTimeRangeLabel;
  startBlockNumber?: number;
  endBlockNumber?: number;
};

export type AssetSwapFeeAggregated = {
  assetId: string;
  assetRegistryId?: string;
  amount: bigint;
};

export type AssetSwapFeeHistoricalDataByPeriodResponse = {
  nodes: AssetSwapFeeAggregated[];
  totalCount: number;
};

export type SwapAssetFeeRaw = {
  id: string;
  amount: number;
  total_amount: number;
  para_block_height: number;
  relay_block_height: number;
  asset_id: string;
  asset_registry_id?: string;
  block_id: string;
};

export type AggregateSwapAssetFeesGroupedResult = {
  group_start: SwapAssetFeeRaw[];
  group_end: SwapAssetFeeRaw[];
};

export type AggregateSwapAssetFeesByBlocksRangeSqlResult = {
  grouped_result: AggregateSwapAssetFeesGroupedResult;
};

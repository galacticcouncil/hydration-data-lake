import {
  AggregationTimeRangeLabel,
  StableswapAssetHistoricalVolumeRaw,
  StableswapHistoricalVolumeRaw,
} from '../../../../types';

export type StableswapVolumesByPeriodFilter = {
  poolIds: string[];
  startBlockNumber?: number;
  endBlockNumber?: number;
  period?: AggregationTimeRangeLabel;
};

export type StablepoolAssetVolumeAggregated = {
  assetId: string;
  assetRegistryId?: string;
  swapFee: bigint;
  swapVolume: bigint;
};

export type StableswapVolumeAggregated = {
  poolId: string;
  assetVolumes: StablepoolAssetVolumeAggregated[];
};

export type StableswapVolumesByPeriodResponse = {
  nodes: StableswapVolumeAggregated[];
  totalCount: number;
};

export type AggregateStablepoolVolumesGroupedResult = {
  pool_id: string;
  start_entity: StableswapHistoricalVolumeRaw;
  end_entity: StableswapHistoricalVolumeRaw;
  start_entity_asset_volumes: StableswapAssetHistoricalVolumeRaw[];
  end_entity_asset_volumes: StableswapAssetHistoricalVolumeRaw[];
};

export type AggregateStablepoolVolumesByBlocksRangeSqlResult = {
  grouped_result: AggregateStablepoolVolumesGroupedResult[];
};

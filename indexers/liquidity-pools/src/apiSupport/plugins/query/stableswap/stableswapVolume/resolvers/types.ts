import {
  AggregationTimeRangeLabel,
  StableswapAssetHistoricalVolumeRaw,
  StableswapHistoricalVolumeRaw,
} from '../../../../../types';

export type StableswapVolumeHistoricalDataByPeriodFilter = {
  poolIds: string[];
  startBlockNumber?: number;
  endBlockNumber?: number;
  period?: AggregationTimeRangeLabel;
};

export type StablepoolAssetVolumeAggregated = {
  assetId: string;
  assetRegistryId?: string;
  assetFeeVol: bigint;
  assetVol: bigint;
  assetFeeVolNorm: string;
  assetVolNorm: string;
};

export type StableswapVolumeAggregated = {
  poolId: string;
  poolVolNorm: string;
  poolFeeVolNorm: string;
  assetVolumes: StablepoolAssetVolumeAggregated[];
};

export type StableswapVolumeHistoricalDataByPeriodResponse = {
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

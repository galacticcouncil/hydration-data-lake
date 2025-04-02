import { AggregationTimeRangeLabel } from '../../../../types';

export type OmnipoolAssetVolumesByPeriodFilter = {
  assetIds?: string[];
  startBlockNumber?: number;
  endBlockNumber?: number;
  period?: AggregationTimeRangeLabel;
};

export type OmnipoolAssetVolumeAggregated = {
  omnipoolAssetId: string;
  assetId: number;
  assetVolume: bigint;
  assetFeeVolume: bigint;
};

export type XykPoolVolumesByPeriodResponse = {
  nodes: OmnipoolAssetVolumeAggregated[];
  totalCount: number;
};

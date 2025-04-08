import { AggregationTimeRangeLabel } from '../../../../types';

export type OmnipoolAssetVolumeHistoricalDataByPeriodFilter = {
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

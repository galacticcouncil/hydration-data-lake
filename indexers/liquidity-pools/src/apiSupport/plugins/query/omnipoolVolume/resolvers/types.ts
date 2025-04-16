import { AggregationTimeRangeLabel } from '../../../../types';

export type OmnipoolAssetVolumesByPeriodFilter = {
  assetIds?: string[];
  assetRegistryIds?: string[];
  startBlockNumber?: number;
  endBlockNumber?: number;
  period?: AggregationTimeRangeLabel;
};

export type OmnipoolAssetVolumeAggregated = {
  omnipoolAssetId: string;
  assetId: string;
  assetRegistryId?: string;
  assetVolume: bigint;
  assetFeeVolume: bigint;
};

export type XykPoolVolumesByPeriodResponse = {
  nodes: OmnipoolAssetVolumeAggregated[];
  totalCount: number;
};

import { AggregationTimeRangeLabel } from '../../../../../../../types';

export type OmnipoolAssetVolumeHistoricalDataByPeriodFilter = {
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
  assetVol: bigint;
  assetFeeVol: bigint;
  assetVolNormalized: string;
  assetFeeVolNormalized: string;
};

export type XykPoolVolumesByPeriodResponse = {
  nodes: OmnipoolAssetVolumeAggregated[];
  totalCount: number;
};

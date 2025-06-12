import { AggregationTimeRangeLabel } from '../../../../types';

export type XykPoolVolumesByPeriodFilter = {
  poolIds: string[];
  startBlockNumber?: number;
  endBlockNumber?: number;
  period?: AggregationTimeRangeLabel;
};

export type XykpoolVolumeAggregated = {
  poolId: string;
  assetAId: string;
  assetAAssetRegistryId?: string;
  assetAVolume: bigint;
  assetBId: string;
  assetBAssetRegistryId?: string;
  assetBVolume: bigint;
};

export type XykPoolVolumesByPeriodResponse = {
  nodes: XykpoolVolumeAggregated[];
  totalCount: number;
};

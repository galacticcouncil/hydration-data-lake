import { AggregationTimeRangeLabel } from '../../../../types';

export type XykPoolVolumesByPeriodFilter = {
  poolIds: string[];
  startBlockNumber?: number;
  endBlockNumber?: number;
  period?: AggregationTimeRangeLabel;
};

export type XykpoolVolumeAggregated = {
  poolId: string;
  assetAId: number;
  assetAVolume: bigint;
  assetBId: number;
  assetBVolume: bigint;
};

export type XykPoolVolumesByPeriodResponse = {
  nodes: XykpoolVolumeAggregated[];
  totalCount: number;
};

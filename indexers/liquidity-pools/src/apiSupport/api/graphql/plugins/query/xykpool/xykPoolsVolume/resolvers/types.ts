import { AggregationTimeRangeLabel } from '../../../../../../../types';

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
  assetBId: string;
  assetBAssetRegistryId?: string;

  assetAVol: bigint;
  assetBVol: bigint;
  assetAFeeVol: bigint;
  assetBFeeVol: bigint;

  assetAVolNorm: string;
  assetBVolNorm: string;
  assetAFeeVolNorm: string;
  assetBFeeVolNorm: string;
};

export type XykPoolVolumesByPeriodResponse = {
  nodes: XykpoolVolumeAggregated[];
  totalCount: number;
};

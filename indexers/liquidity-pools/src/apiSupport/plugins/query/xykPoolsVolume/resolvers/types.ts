export type XykPoolVolumesByPeriodFilter = {
  poolIds: string[];
  startBlockNumber: number;
  endBlockNumber?: number;
};

export type XykPoolVolumeAggregated = {
  poolId: string;
  assetAId: number;
  assetAVolume: bigint;
  assetBId: number;
  assetBVolume: bigint;
};

export type XykPoolVolumesByPeriodResponse = {
  nodes: XykPoolVolumeAggregated[];
  totalCount: number;
};

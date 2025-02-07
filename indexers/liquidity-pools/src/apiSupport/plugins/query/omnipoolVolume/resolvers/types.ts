export type OmnipoolAssetVolumesByPeriodFilter = {
  assetIds?: string[];
  startBlockNumber: number;
  endBlockNumber?: number;
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

import { YieldMetricsInterval } from '../../../../../types';

export type OmnipoolAssetYieldMetricsFilter = {
  interval: YieldMetricsInterval;
  assetIds?: string[];
};

export type OmnipoolAssetYieldMetricsRaw = {
  projectedApyPerc: BigNumber;
  projectedAprPerc: BigNumber;
};

export type OmnipoolAssetYieldMetricsAggregated = {
  assetId: string;
  assetRegistryId: string;
  projectedApyPerc: string;
  projectedAprPerc: string;
};

export type OmnipoolAssetsYieldMetricsResponse = {
  nodes: OmnipoolAssetYieldMetricsAggregated[];
  totalCount: number;
};

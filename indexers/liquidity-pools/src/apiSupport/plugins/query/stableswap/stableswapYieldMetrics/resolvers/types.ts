import { YieldMetricsInterval } from '../../../../../types';

export type StableswapYieldMetricsFilter = {
  interval: YieldMetricsInterval;
  poolIds?: string[];
};

export type StableswapYieldMetricsRaw = {
  projectedApyPerc: BigNumber;
  projectedAprPerc: BigNumber;
};

export type StableswapYieldMetricsAggregated = {
  poolId: string;
  projectedApyPerc: string;
  projectedAprPerc: string;
};

export type StableswapYieldMetricsResponse = {
  nodes: StableswapYieldMetricsAggregated[];
  totalCount: number;
};

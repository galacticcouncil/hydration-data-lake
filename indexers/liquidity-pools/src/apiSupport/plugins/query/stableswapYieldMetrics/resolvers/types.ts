import {
  AggregationTimeRangeLabel,
  StableswapAssetHistoricalVolumeRaw,
  StableswapHistoricalVolumeRaw,
  YieldMetricsInterval,
} from '../../../../types';
import { BigNumber } from 'bignumber.js';

export type StableswapYieldMetricsFilter = {
  interval: YieldMetricsInterval;
  poolIds: string[];
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

// export type AggregateSwapAssetFeesGroupedResult = {
//   group_start: SwapAssetFeeRaw[];
//   group_end: SwapAssetFeeRaw[];
// };
//
// export type AggregateSwapAssetFeesByBlocksRangeSqlResult = {
//   grouped_result: AggregateSwapAssetFeesGroupedResult;
// };

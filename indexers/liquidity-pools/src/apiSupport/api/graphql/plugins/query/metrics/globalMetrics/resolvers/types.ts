import {
  AggregationTimeRangeLabel,
  YieldMetricsInterval,
} from '../../../../../../../types';

/**
 * -----------------------------------------
 * -------- ALL_ASSETS_YIELD_METRICS -------
 * -----------------------------------------
 */
export type AllAssetsYieldMetricsFilter = {
  feeMetricsInterval: YieldMetricsInterval;
};

export type AssetYieldMetrics = {
  id: string;
  poolType: string;
  feeApyPerc: string;
  incentivesApyPerc: string;
  incentivesTokens: string[];
};

export type AllAssetsYieldMetricsResponse = {
  nodes: AssetYieldMetrics[];
  totalCount: number;
};

export type AssetFarmsYieldMetrics = {
  id: string;
  poolType: 'omnipool' | 'isolatedpool';
  farmApy: string;
  incentivesTokens: string[];
};

/**
 * -----------------------------------------
 * ---------- PLATFORM_TOTAL_TVL -----------
 * -----------------------------------------
 */

export type PlatformTotalTvl = {
  totalTvlDecoratedNorm: string;
  omnipoolTvlNorm: string;
  stablepoolsTvlNorm: string;
  xykpoolsTvlNorm: string;
  mmSupplyTvlNorm: string;
  paraBlockHeight: number;
};

export type PlatformTotalTvlResponse = {
  nodes: PlatformTotalTvl[];
  totalCount: number;
};

/**
 * ---------------------------------------------
 * ----- PLATFORM_TOTAL_VOLUMES_BY_PERIOD ------
 * ---------------------------------------------
 */

export type PlatformTotalVolumesByPeriodFilter = {
  startBlockNumber?: number;
  endBlockNumber?: number;
  startIsoString?: string;
  endIsoString?: string;
  period?: AggregationTimeRangeLabel;
};

export type PlatformTotalVolumesByPeriod = {
  totalVolNorm: string;
  omnipoolVolNorm: string;
  omnipoolFeeVolNorm: string;
  stableswapVolNorm: string;
  stableswapFeeVolNorm: string;
  xykpoolVolNorm: string;
  xykpoolFeeVolNorm: string;
  paraBlockHeight: number;
};

export type PlatformTotalVolumesByPeriodResponse = {
  nodes: PlatformTotalVolumesByPeriod[];
  totalCount: number;
};

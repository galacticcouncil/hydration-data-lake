import { YieldMetricsInterval } from '../../../../../types';

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

import { YieldMetricsInterval } from '../../../../../../../types';

export type OmnipoolAssetsLatestTvlFilter = {
  assetIds?: string[];
  assetRegistryIds?: string[];
};

export type OmnipoolAssetLatestTvl = {
  assetId: string;
  assetRegistryId?: string;
  tvlInRefAssetNorm: string;
  paraBlockHeight: number;
};

export type OmnipoolAssetsLatestTvlResponse = {
  nodes: OmnipoolAssetLatestTvl[];
  totalCount: number;
};

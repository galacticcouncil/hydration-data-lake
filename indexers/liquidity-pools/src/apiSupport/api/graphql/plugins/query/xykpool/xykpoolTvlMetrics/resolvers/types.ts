export type XykpoolsLatestTvlFilter = {
  poolIds?: string[];
};

export type XykpoolLatestTvl = {
  poolId: string;
  tvlInRefAssetNorm: string;
  paraBlockHeight: number;
};

export type XykpoolsLatestTvlResponse = {
  nodes: XykpoolLatestTvl[];
  totalCount: number;
};

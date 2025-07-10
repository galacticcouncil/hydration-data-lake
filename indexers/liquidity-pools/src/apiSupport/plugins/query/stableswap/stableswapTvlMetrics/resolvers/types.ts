export type StableswapsLatestTvlFilter = {
  poolIds?: string[];
};

export type StableswapAssetLatestTvl = {
  assetId: string;
  assetRegistryId: string;
  tvlInRefAssetNorm: string;
};
export type StableswapLatestTvl = {
  poolId: string;
  tvlTotalInRefAssetNorm: string;
  assetsTvl: StableswapAssetLatestTvl[];
  paraBlockHeight: number;
};

export type StableswapsLatestTvlResponse = {
  nodes: StableswapLatestTvl[];
  totalCount: number;
};

export type StableswapsLatestTvlResponseRaw = {
  id: string;
  pool_id: string;
  tvl_total_in_ref_asset_norm: string;
  asset_tvls: {
    asset_id: string;
    tvl_in_ref_asset_norm: string;
  }[];
  para_block_height: number;
};

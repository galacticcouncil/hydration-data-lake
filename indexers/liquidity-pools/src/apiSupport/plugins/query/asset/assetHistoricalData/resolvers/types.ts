import { TimeSeriesBucketTimeRange } from '../../../../../types';

export type AssetLatestSpotPricesFilter = {
  assetIdPairs: string[][];
  assetRegistryIdPairs: string[][];
};

export type AssetLatestSpotPrice = {
  assetInId: string;
  assetInRegistryId?: string;
  assetOutId: string;
  assetOutRegistryId?: string;
  priceNorm: string;
  paraBlockHeight: number;
};

export type AssetLatestSpotPricesResponse = {
  nodes: AssetLatestSpotPrice[];
  totalCount: number;
};

export type AssetPairPricesAndVolumesByPeriodFilter = {
  bucketSize: TimeSeriesBucketTimeRange;
  startTimestamp?: string;
  endTimestamp?: string;
  assetInId: string;
  assetOutId?: string;
  assetInRegistryId?: string;
  assetOutRegistryId?: string;
};

export type AssetPairPriceBucket = {
  priceAvrgNorm: string;
  priceMinNorm: string;
  priceMaxNorm: string;
  priceOpenNorm: string;
  priceCloseNorm: string;
  referenceAssetVolNorm: string;
  timestamp: string;
};

export type AssetPairPriceSnapshot = {
  referenceAssetId: string;
  assetInId: string;
  assetInAssetRegistryId?: string;
  assetOutId: string;
  assetOutAssetRegistryId?: string;
  buckets: AssetPairPriceBucket[];
};

export type AssetPairPricesAndVolumeByPeriodResponse = {
  nodes: AssetPairPriceSnapshot[];
  totalCount: number;
};

export type AssetSpotPriceHistoricalDataRaw = {
  id: string;
  asset_in_asset_registry_id: string;
  asset_out_asset_registry_id: string;
  asset_out_decimals: number;
  price: string;
  price_normalised: string;
  price_route: string;
  para_block_height: number;
  asset_in_hist_data_id: string;
  asset_in_id: string;
  asset_out_id: string;
};

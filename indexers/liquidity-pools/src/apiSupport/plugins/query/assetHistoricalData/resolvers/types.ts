import { AssetsPairPriceTimeRange } from '../../../../types';

export type AssetLatestSpotPricesFilter = {
  assetInIds?: string[];
  assetInRegistryIds?: string[];
  assetOutId?: string;
  assetOutRegistryId?: string;
};

export type AssetLatestSpotPrice = {
  assetInId: string;
  assetInRegistryId?: string;
  assetOutId: string;
  assetOutRegistryId?: string;
  priceNorm: string;
  timestamp: string;
  paraBlockHeight: number;
};

export type AssetLatestSpotPricesResponse = {
  nodes: AssetLatestSpotPrice[];
  totalCount: number;
};

export type AssetPairPricesAndVolumesByPeriodFilter = {
  bucketSize: AssetsPairPriceTimeRange;
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

import { TimeSeriesBucketTimeRange } from '../../../../../types';

export type AssetPairPricesAndVolumesByPeriodFilter = {
  bucketSize: TimeSeriesBucketTimeRange;
  startTimestamp?: string;
  endTimestamp?: string;
  accountId: string;
};

export type AccountTotalBalanceBucket = {
  transferableNorm: string;
  lockedNorm: string;
  timestamp: string;
};

export type AccountTotalBalanceSnapshot = {
  referenceAssetId: string;
  accountId: string;
  buckets: AccountTotalBalanceBucket[];
};

export type AccountTotalBalancesByPeriodResponse = {
  nodes: AccountTotalBalanceSnapshot[];
  totalCount: number;
};

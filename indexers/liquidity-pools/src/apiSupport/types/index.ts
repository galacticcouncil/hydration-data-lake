import { Client } from 'pg';

export type XykpoolHistoricalVolumeRaw = {
  id: string;
  pool_id: string;
  asset_a_id: string;
  asset_a_registry_id?: string;
  asset_b_id: string;
  asset_b_registry_id?: string;
  asset_a_vol_in: number;
  asset_a_total_vol_in: number;
  asset_a_vol_out: number;
  asset_a_total_vol_out: number;
  asset_b_vol_in: number;
  asset_b_total_vol_in: number;
  asset_b_vol_out: number;
  asset_b_total_vol_out: number;

  asset_a_fee_vol: number;
  asset_a_fees_total_vol: number;
  asset_b_fee_vol: number;
  asset_b_fees_total_vol: number;

  asset_a_vol_in_norm: string;
  asset_a_vol_out_norm: string;
  asset_b_vol_in_norm: string;
  asset_b_vol_out_norm: string;
  asset_a_fee_vol_norm: string;
  asset_b_fee_vol_norm: string;

  asset_a_total_vol_in_norm: string;
  asset_a_total_vol_out_norm: string;
  asset_b_total_vol_in_norm: string;
  asset_b_total_vol_out_norm: string;
  asset_a_fees_total_vol_norm: string;
  asset_b_fees_total_vol_norm: string;

  average_price: number;
  relay_block_height: number;
  para_block_height: number;
};
export type XykpoolHistoricalVolumeGqlResponse = {
  id: string;
  poolId: string;
  assetAId: string;
  assetBId: string;
  assetAAssetRegistryId?: string;
  assetBAssetRegistryId?: string;
  assetAVolumeIn: bigint;
  assetATotalVolumeIn: bigint;
  assetAVolumeOut: bigint;
  assetATotalVolumeOut: bigint;
  assetBVolumeIn: bigint;
  assetBTotalVolumeIn: bigint;
  assetBVolumeOut: bigint;
  assetBTotalVolumeOut: bigint;
  assetAFee: bigint;
  assetBFee: bigint;
  assetATotalFees: bigint;
  assetBTotalFees: bigint;
  averagePrice: bigint;
  relayBlockHeight: number;
  paraBlockHeight: number;
};

export type OmnipoolAssetHistoricalVolumeRaw = {
  id: string;
  omnipool_asset_id: string;
  asset_vol_in: number;
  asset_total_vol_in: number;
  asset_vol_out: number;
  asset_total_vol_out: number;
  asset_fee_vol: number;
  asset_total_fees_vol: number;
  asset_vol_in_norm: string;
  asset_vol_out_norm: string;
  asset_fee_vol_norm: string;
  asset_total_vol_in_norm: string;
  asset_total_vol_out_norm: string;
  asset_total_fees_vol_norm: string;
  relay_block_height: number;
  para_block_height: number;
};
export type OmnipoolAssetHistoricalVolumeGqlResponse = {
  id: string;
  omnipoolAssetId: string;
  assetVolumeIn: number;
  assetTotalVolumeIn: number;
  assetVolumeOut: number;
  assetTotalVolumeOut: number;
  assetFee: number;
  assetTotalFees: number;
  relayBlockHeight: number;
  paraBlockHeight: number;
};

export type StableswapHistoricalVolumeRaw = {
  id: string;
  pool_id: string;
  relay_block_height: number;
  para_block_height: number;
};
export type StableswapHistoricalVolumeGqlResponse = {
  id: string;
  poolId: string;
  assetVolumes: StableswapAssetHistoricalVolumeGqlResponse[];
  relayBlockHeight: number;
  paraBlockHeight: number;
};

export type StableswapAssetHistoricalVolumeRaw = {
  id: string;
  volumes_collection_id: string;
  asset_id: string;
  asset_registry_id: string;

  asset_fee_vol: number;
  asset_total_fees_vol: number;
  asset_vol_in: number;
  asset_vol_out: number;
  asset_total_vol_in: number;
  asset_total_vol_out: number;

  asset_fee_vol_norm: string;
  asset_total_fees_vol_norm: string;
  asset_vol_in_norm: string;
  asset_vol_out_norm: string;
  asset_total_vol_in_norm: string;
  asset_total_vol_out_norm: string;

  para_block_height: number;
  relay_block_height: number;
};
export type StableswapAssetHistoricalVolumeGqlResponse = {
  id: string;
  volumesCollectionId: string;
  assetId: string;
  swapFee: number;
  swapTotalFees: number;
  swapVolumeIn: number;
  swapVolumeOut: number;
  swapTotalVolumeIn: number;
  swapTotalVolumeOut: number;
  paraBlockHeight: number;
  relayBlockHeight: number;
};

export interface QueryResolverContext {
  pgClient: Client;
  pgRole: string;
  jwtClaims: {
    user_id: number;
    role: string;
    exp: number;
    iat: number;
    aud: string;
    iss: string;
  } | null;
}

export type RoutedTradeAssetBalanceRaw = {
  asset_id: string;
  amount: number;
  asset_balance_type: string;
};
export type RoutedTradeSwapRaw = {
  id: string;
};

export type RoutedTradeRaw = {
  id: string;
  route_id?: string | null;
  all_involved_asset_ids: string[];
  participant_swappers: string[];
  participant_fillers: string[];
  fee_recipients: string[];
  swap_ids: string[];
  inputs: RoutedTradeAssetBalanceRaw[];
  outputs: RoutedTradeAssetBalanceRaw[];
  para_block_height: number;
  relay_block_height: number;
  block_id: string;
};

export type RoutedTradeAssetBalanceGqlResponse = {
  assetId: string;
  amount: number;
};
export type RoutedTradeGqlResponse = {
  id: string;
  routeId?: string | null;
  allInvolvedAssetIds: string[];
  participantSwappers: string[];
  participantFillers: string[];
  feeRecipients: string[];
  swapIds: string[];
  inputs: RoutedTradeAssetBalanceGqlResponse[];
  outputs: RoutedTradeAssetBalanceGqlResponse[];
  paraBlockHeight: number;
  relayBlockHeight: number;
  blockId: string;
};

export enum AggregationTimeRangeLabel {
  '1H' = '1H',
  '24H' = '24H',
  '1W' = '1W',
  '1M' = '1M',
  '1Y' = '1Y',
  'ALL' = 'ALL',
}

export enum YieldMetricsInterval {
  '1D' = '1D',
  '1W' = '1W',
  '1MON' = '1MON',
  '1Y' = '1Y',
}

export enum AssetsPairPriceTimeRange {
  '_15S_' = '_15S_',
  '_1M_' = '_1M_',
  '_5M_' = '_5M_',
  '_15M_' = '_15M_',
  '_30M_' = '_30M_',
  '_1H_' = '_1H_',
  '_4H_' = '_4H_',
  '_24H_' = '_24H_',
  '_1W_' = '_1W_',
  '_1MON_' = '_1MON_',
  '_1Y_' = '_1Y_',
}

import { Client } from 'pg';

export type XykpoolHistoricalVolumeRaw = {
  id: string;
  pool_id: string;
  asset_a_id: number;
  asset_b_id: number;
  asset_a_volume_in: number;
  asset_a_total_volume_in: number;
  asset_a_volume_out: number;
  asset_a_total_volume_out: number;
  asset_b_volume_in: number;
  asset_b_total_volume_in: number;
  asset_b_volume_out: number;
  asset_b_total_volume_out: number;
  asset_a_fee: number;
  asset_b_fee: number;
  asset_a_total_fees: number;
  asset_b_total_fees: number;
  average_price: number;
  relay_block_height: number;
  para_block_height: number;
};
export type XykpoolHistoricalVolumeGqlResponse = {
  id: string;
  poolId: string;
  assetAId: number;
  assetBId: number;
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
  asset_volume_in: number;
  asset_total_volume_in: number;
  asset_volume_out: number;
  asset_total_volume_out: number;
  asset_fee: number;
  asset_total_fees: number;
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
  swap_fee: number;
  swap_total_fees: number;
  swap_volume_in: number;
  swap_volume_out: number;
  swap_total_volume_in: number;
  swap_total_volume_out: number;
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

export type RouteTradeAssetBalanceRaw = {
  asset_id: string;
  amount: number;
  asset_balance_type: string;
};
export type RouteTradeSwapRaw = {
  id: string;
};

export type RouteTradeRaw = {
  id: string;
  route_id?: string | null;
  all_involved_asset_ids: string[];
  participant_swappers: string[];
  participant_fillers: string[];
  fee_recipients: string[];
  swap_ids: string[];
  inputs: RouteTradeAssetBalanceRaw[];
  outputs: RouteTradeAssetBalanceRaw[];
  para_block_height: number;
  relay_block_height: number;
  block_id: string;
};

export type RouteTradeAssetBalanceGqlResponse = {
  assetId: string;
  amount: number;
};
export type RouteTradeGqlResponse = {
  id: string;
  routeId?: string | null;
  allInvolvedAssetIds: string[];
  participantSwappers: string[];
  participantFillers: string[];
  feeRecipients: string[];
  swapIds: string[];
  inputs: RouteTradeAssetBalanceGqlResponse[];
  outputs: RouteTradeAssetBalanceGqlResponse[];
  paraBlockHeight: number;
  relayBlockHeight: number;
  blockId: string;
};

// routeId: String
// allInvolvedAssetIds: [String!]!
// participantSwappers: [String!]!
// participantFillers: [String!]!
// feeRecipients: [String!]!
// swapIds: [String!]!
// inputs: [RouteTradeAssetBalanceResponse!]!
// outputs: [RouteTradeAssetBalanceResponse!]!
//
// paraBlockHeight: Int!
// relayBlockHeight: Int!
// blockId: String!

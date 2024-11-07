import { Client } from 'pg';

export type XykPoolHistoricalVolumeRaw = {
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
  relay_chain_block_height: number;
  para_chain_block_height: number;
};
export type XykPoolHistoricalVolumeGqlResponse = {
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
  relayChainBlockHeight: number;
  paraChainBlockHeight: number;
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
  relay_chain_block_height: number;
  para_chain_block_height: number;
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
  relayChainBlockHeight: number;
  paraChainBlockHeight: number;
};

export type StablepoolHistoricalVolumeRaw = {
  id: string;
  pool_id: string;
  relay_chain_block_height: number;
  para_chain_block_height: number;
};
export type StablepoolHistoricalVolumeGqlResponse = {
  id: string;
  poolId: string;
  assetVolumes: StablepoolAssetHistoricalVolumeGqlResponse[];
  relayChainBlockHeight: number;
  paraChainBlockHeight: number;
};

export type StablepoolAssetHistoricalVolumeRaw = {
  id: string;
  volumes_collection_id: string;
  asset_id: string;
  swap_fee: number;
  swap_total_fees: number;
  liq_fee: number;
  liq_total_fees: number;
  routed_liq_fee: number;
  routed_liq_total_fees: number;
  swap_volume_in: number;
  swap_volume_out: number;
  swap_total_volume_in: number;
  swap_total_volume_out: number;
  liq_added_amount: number;
  liq_removed_amount: number;
  liq_added_total_amount: number;
  liq_removed_total_amount: number;
  routed_liq_added_amount: number;
  routed_liq_removed_amount: number;
  routed_liq_added_total_amount: number;
  routed_liq_removed_total_amount: number;
  para_chain_block_height: number;
};
export type StablepoolAssetHistoricalVolumeGqlResponse = {
  id: string;
  volumesCollectionId: string;
  assetId: string;
  swapFee: number;
  swapTotalFees: number;
  liqFee: number;
  liqTotalFees: number;
  routedLiqFee: number;
  routedLiqTotalFees: number;
  swapVolumeIn: number;
  swapVolumeOut: number;
  swapTotalVolumeIn: number;
  swapTotalVolumeOut: number;
  liqAddedAmount: number;
  liqRemovedAmount: number;
  liqAddedTotalAmount: number;
  liqRemovedTotalAmount: number;
  routedLiqAddedAmount: number;
  routedLiqRemovedAmount: number;
  routedLiqAddedTotalAmount: number;
  routedLiqRemovedTotalAmount: number;
  paraChainBlockHeight: number;
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

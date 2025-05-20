import gql from 'graphql-tag';
import {
  OmnipoolAssetDataOrderBy,
  OmnipoolAssetDatumFilter,
  StableswapFilter,
  StableswapsOrderBy,
  XykpoolFilter,
  XykpoolsOrderBy,
  LbppoolFilter,
  LbppoolsOrderBy,
} from './types';

export const GET_OMNIPOOL_BLOCKS_STORAGE_STATE = gql`
  query GetOmnipoolBlocksStorageState(
    $filter: OmnipoolFilter
    $first: Int!
    $offset: Int!
    $orderBy: [OmnipoolsOrderBy!]
  ) {
    omnipools(
      filter: $filter
      orderBy: $orderBy
      first: $first
      offset: $offset
    ) {
      nodes {
        id
        poolAddress
        hubAssetTradability
        paraBlockHeight
        omnipoolAssetDataByPoolId {
          nodes {
            assetId
            assetState
            balances
            paraBlockHeight
            id
          }
        }
      }
      totalCount
    }
  }
`;

export const GET_LBPPOOL_BLOCKS_STORAGE_STATE = gql`
  query GetLbppoolBlocksStorageState(
    $filter: LbppoolFilter
    $first: Int!
    $offset: Int!
    $orderBy: [LbppoolsOrderBy!]
  ) {
    lbppools(
      filter: $filter
      orderBy: $orderBy
      first: $first
      offset: $offset
    ) {
      nodes {
        id
        assetAId
        assetBId
        fee
        start
        end
        weightCurve
        initialWeight
        finalWeight
        feeCollector
        repayTarget
        repayFee
        poolAddress
        owner
        lbppoolAssetsDataByPoolId {
          nodes {
            id
            assetId
            poolId
            balances
            paraBlockHeight
          }
        }
      }
      totalCount
    }
  }
`;

export const GET_XYKPOOL_BLOCKS_STORAGE_STATE = gql`
  query GetXykpoolBlocksStorageState(
    $filter: XykpoolFilter
    $first: Int!
    $offset: Int!
    $orderBy: [XykpoolsOrderBy!]
  ) {
    xykpools(
      filter: $filter
      orderBy: $orderBy
      first: $first
      offset: $offset
    ) {
      nodes {
        assetAId
        assetBId
        id
        paraBlockHeight
        poolAddress
        shareTokenId
        xykpoolAssetsDataByPoolId {
          nodes {
            assetId
            balances
            id
            paraBlockHeight
            poolId
          }
        }
      }
      totalCount
    }
  }
`;

export const GET_STABLEPOOL_BLOCKS_STORAGE_STATE = gql`
  query GetStableswapBlocksStorageState(
    $filter: StableswapFilter
    $first: Int!
    $offset: Int!
    $orderBy: [StableswapsOrderBy!]
  ) {
    stableswaps(
      filter: $filter
      orderBy: $orderBy
      first: $first
      offset: $offset
    ) {
      nodes {
        fee
        finalAmplification
        finalBlock
        id
        initialAmplification
        initialBlock
        paraBlockHeight
        poolAddress
        poolId
        pegs
        pegSources
        maxPegUpdate
        stableswapAssetDataByPoolId {
          nodes {
            id
            assetId
            balances
            poolId
            tradable
            paraBlockHeight
          }
        }
      }
      totalCount
    }
  }
`;

import gql from 'graphql-tag';
import {
  OmnipoolAssetDataOrderBy,
  OmnipoolAssetDatumFilter,
  StablepoolFilter,
  StablepoolsOrderBy,
  XykPoolFilter,
  XykPoolsOrderBy,
  LbpPoolFilter,
  LbpPoolsOrderBy,
} from './types';

// export const GET_OMNIPOOL_BLOCKS_STORAGE_STATE = gql`
//   query GetOmnipoolBlocksStorageState(
//     $filter: OmnipoolAssetDatumFilter
//     $first: Int!
//     $offset: Int!
//     $orderBy: [OmnipoolAssetDataOrderBy!]
//   ) {
//     omnipoolAssetData(
//       filter: $filter
//       orderBy: $orderBy
//       first: $first
//       offset: $offset
//     ) {
//       nodes {
//         assetId
//         assetState
//         balances
//         id
//         paraChainBlockHeight
//         pool {
//           poolAddress
//         }
//       }
//       totalCount
//     }
//   }
// `;

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
        burnProtocolFee
        hdxAssetId
        hubAssetId
        maxInRatio
        maxOutRatio
        minPoolLiquidity
        minTradingLimit
        minWithdrawalFee
        paraChainBlockHeight
        poolAddress
        omnipoolAssetDataByPoolId {
          nodes {
            id
            assetId
            assetState
            balances
            paraChainBlockHeight
          }
        }
      }
      totalCount
    }
  }
`;

export const GET_LBPPOOL_BLOCKS_STORAGE_STATE = gql`
  query GetLbpPoolBlocksStorageState(
    $filter: LbpPoolFilter
    $first: Int!
    $offset: Int!
    $orderBy: [LbpPoolsOrderBy!]
  ) {
    lbpPools(
      filter: $filter
      orderBy: $orderBy
      first: $first
      offset: $offset
    ) {
      nodes {
        assetAId
        assetBId
        end
        fee
        feeCollector
        finalWeight
        id
        initialWeight
        maxInRatio
        maxOutRatio
        minPoolLiquidity
        minTradingLimit
        owner
        poolAddress
        paraChainBlockHeight
        repayFee
        repayTarget
        start
        weightCurve
        lbpPoolAssetsDataByPoolId {
          nodes {
            id
            assetId
            poolId
            balances
            paraChainBlockHeight
          }
        }
      }
      totalCount
    }
  }
`;

export const GET_XYKPOOL_BLOCKS_STORAGE_STATE = gql`
  query GetXykPoolBlocksStorageState(
    $filter: XykPoolFilter
    $first: Int!
    $offset: Int!
    $orderBy: [XykPoolsOrderBy!]
  ) {
    xykPools(
      filter: $filter
      orderBy: $orderBy
      first: $first
      offset: $offset
    ) {
      nodes {
        id
        poolAddress
        assetAId
        assetBId
        exchangeFee
        maxInRatio
        maxOutRatio
        minPoolLiquidity
        minTradingLimit
        nativeAssetId
        oracleSource
        paraChainBlockHeight
        xykPoolAssetsDataByPoolId {
          nodes {
            assetId
            balances
            id
            paraChainBlockHeight
            poolId
          }
        }
      }
      totalCount
    }
  }
`;

export const GET_STABLEPOOL_BLOCKS_STORAGE_STATE = gql`
  query GetStablepoolBlocksStorageState(
    $filter: StablepoolFilter
    $first: Int!
    $offset: Int!
    $orderBy: [StablepoolsOrderBy!]
  ) {
    stablepools(
      filter: $filter
      orderBy: $orderBy
      first: $first
      offset: $offset
    ) {
      nodes {
        id
        poolId
        poolAddress
        amplificationRange
        fee
        finalAmplification
        finalBlock
        initialAmplification
        initialBlock
        maxInRatio
        maxOutRatio
        minPoolLiquidity
        minTradingLimit
        paraChainBlockHeight
        stablepoolAssetDataByPoolId {
          nodes {
            id
            assetId
            peg
            tradable
            balances
            poolId
            paraChainBlockHeight
          }
        }
      }
      totalCount
    }
  }
`;

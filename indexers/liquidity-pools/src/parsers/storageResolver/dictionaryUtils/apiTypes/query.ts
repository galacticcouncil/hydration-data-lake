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
  MmAggregatorOracleFilter,
  MmAggregatorOraclesOrderBy,
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

export const GET_AAVE_POOL_BLOCKS_STORAGE_STATE = gql`
  query GetAavePoolBlocksStorageState(
    $filter: AavepoolFilter
    $first: Int!
    $offset: Int!
    $orderBy: [AavepoolsOrderBy!]
  ) {
    aavepools(
      filter: $filter
      orderBy: $orderBy
      first: $first
      offset: $offset
    ) {
      nodes {
        id
        aTokenId
        reserveAssetId
        liquidityIn
        liquidityOut
        paraBlockHeight
        poolId
      }
      totalCount
    }
  }
`;

export const GET_EMA_ORACLE_BLOCKS_STORAGE_STATE = gql`
  query GetEmaOracleBlocksStorageState(
    $filter: EmaOracleFilter
    $first: Int!
    $offset: Int!
    $orderBy: [EmaOraclesOrderBy!]
  ) {
    emaOracles(
      filter: $filter
      orderBy: $orderBy
      first: $first
      offset: $offset
    ) {
      nodes {
        id
        paraBlockHeight
        entries
      }
      totalCount
    }
  }
`;

export const GET_ASSET_HIST_DATA_BLOCKS_STORAGE_STATE = gql`
  query GetAssetHistDataBlocksStorageState(
    $filter: AssetHistoricalDatumFilter
    $first: Int!
    $offset: Int!
    $orderBy: [AssetHistoricalDataOrderBy!]
  ) {
    assetHistoricalData(
      filter: $filter
      orderBy: $orderBy
      first: $first
      offset: $offset
    ) {
      nodes {
        id
        assetId
        dynamicFee
        existentialDeposit
        totalIssuance
        paraBlockHeight
      }
      totalCount
    }
  }
`;

export const GET_MM_AGGREGATOR_ORACLE_BLOCKS_STORAGE_STATE = gql`
  query GetMmAggregatorOracleBlocksStorageState(
    $filter: MmAggregatorOracleFilter
    $first: Int!
    $offset: Int!
    $orderBy: [MmAggregatorOraclesOrderBy!]
  ) {
    mmAggregatorOracles(
      filter: $filter
      orderBy: $orderBy
      first: $first
      offset: $offset
    ) {
      nodes {
        id
        address
        price
        decimals
        updatedAt
        paraBlockHeight
      }
    }
  }
`;

export const GET_BLOCK_COMPRESSED_DATA = gql`
  query GetBlockCompressedData(
    $filter: BlockCompressedDatumFilter
    $first: Int!
    $offset: Int!
    $orderBy: [BlockCompressedDataOrderBy!]
  ) {
    blockCompressedData(
      filter: $filter
      orderBy: $orderBy
      first: $first
      offset: $offset
    ) {
      nodes {
        id
        algo
        compStrFormat
        data
        paraBlockHeight
      }
      totalCount
    }
  }
`;

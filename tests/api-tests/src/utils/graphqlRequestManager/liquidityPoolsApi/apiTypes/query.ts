import gql from 'graphql-tag';
import {
  LbppoolHistoricalDatumFilter,
  SwapFilter,
  XykpoolHistoricalDatumFilter,
} from './types';

export const GET_LBPPOOL_HISTORICAL_DATA = gql`
  query GetLbppoolHistoricalData($filter: LbppoolHistoricalDatumFilter) {
    lbppoolHistoricalData(filter: $filter) {
      nodes {
        startBlockNumber
        endBlockNumber
        initialWeight
        finalWeight
        feeCollectorId
        fee
        repayTarget
        weightCurve
        poolId
        assetAId
        assetBId
        assetABalance
        assetBBalance
        paraChainBlockHeight
      }
    }
  }
`;

export const GET_XYK_POOL_HISTORICAL_DATA = gql`
  query GetXykpoolHistoricalData($filter: XykpoolHistoricalDatumFilter) {
    xykpoolHistoricalData(filter: $filter) {
      nodes {
        assetABalance
        assetAId
        assetBBalance
        assetBId
        poolId
        paraChainBlockHeight
      }
    }
  }
`;

export const GET_XYK_POOL_SWAP_DATA = gql`
  query GetXykpoolSwapsData($filter: SwapFilter) {
    swaps(filter: $filter) {
      nodes {
        swapperId
        fillerId
        fillerType
        swapFees {
          nodes {
            amount
            asset {
              id
            }
            recipientId
          }
        }
        swapInputAssetBalances {
          nodes {
            amount
            asset {
              id
            }
          }
        }
        swapOutputAssetBalances {
          nodes {
            amount
            asset {
              id
            }
          }
        }
      }
    }
  }
`;

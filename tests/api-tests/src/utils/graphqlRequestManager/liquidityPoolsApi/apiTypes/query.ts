import gql from 'graphql-tag';
import {
  LbppoolHistoricalDatumFilter,
  SwapFilter,
  XykpoolHistoricalDatumFilter,
} from './index';

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
        paraBlockHeight
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
        paraBlockHeight
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
        swapInputs {
          nodes {
            amount
            asset {
              id
            }
          }
        }
        swapOutputs {
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

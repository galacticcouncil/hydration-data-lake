import gql from 'graphql-tag';
import { LbpPoolHistoricalDatumFilter } from './types';

export const GET_LBPPOOL_HISTORICAL_DATA = gql`
  query GetLbppoolHistoricalData($filter: LbpPoolHistoricalDatumFilter) {
    lbpPoolHistoricalData(filter: $filter) {
      nodes {
        start
        end
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
  query GetXykPoolHistoricalData($filter: XykPoolHistoricalDatumFilter) {
    xykPoolHistoricalData(filter: $filter) {
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
  query GetXykPoolSwapsData($filter: SwapFilter) {
    swaps(filter: $filter) {
      nodes {
        swapperId
        fillerId
        fillerType
        swapFees {
          nodes {
            amount
            assetId
            recipientId
          }
        }
        swapInputAssetBalances {
          nodes {
            amount
            assetId
          }
        }
        swapOutputAssetBalances {
          nodes {
            amount
            assetId
          }
        }
      }
    }
  }
`;

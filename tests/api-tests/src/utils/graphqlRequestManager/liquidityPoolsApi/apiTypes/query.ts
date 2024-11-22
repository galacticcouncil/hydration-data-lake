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

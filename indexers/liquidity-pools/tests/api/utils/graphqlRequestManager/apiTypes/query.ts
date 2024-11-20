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

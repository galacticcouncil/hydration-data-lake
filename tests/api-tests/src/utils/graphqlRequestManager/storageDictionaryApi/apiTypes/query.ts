import gql from 'graphql-tag';
import { LbpPoolFilter } from './types';

export const GET_LBPPOOL_DATA = gql`
  query GetLbpPoolData($filter: LbpPoolFilter) {
    lbpPools(filter: $filter) {
      nodes {
        lbpPoolAssetsDataByPoolId {
          nodes {
            assetId
            balances
            id
            paraChainBlockHeight
            relayChainBlockHeight
            poolId
          }
        }
        assetAId
        assetBId
        end
        fee
        feeCollector
        finalWeight
        id
        initialWeight
        owner
        paraChainBlockHeight
        poolAddress
        relayChainBlockHeight
        repayTarget
        start
        weightCurve
      }
    }
  }
`;

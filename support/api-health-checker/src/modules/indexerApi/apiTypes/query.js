import gql from 'graphql-tag';
export const GET_LBPPOOL_HISTORICAL_DATA = gql `
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

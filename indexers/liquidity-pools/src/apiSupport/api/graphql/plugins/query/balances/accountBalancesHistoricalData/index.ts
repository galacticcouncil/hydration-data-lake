import { gql, makeExtendSchemaPlugin, Plugin } from 'postgraphile';
import { accountTotalBalancesByPeriodResolver } from './resolvers';

export const AccountBalancesHistoricalDataPlugin: Plugin =
  makeExtendSchemaPlugin((build, options) => {
    return {
      typeDefs: gql`
        input AccountTotalBalancesByPeriodFilter {
          bucketSize: TimeSeriesBucketTimeRange = _5M_
          startTimestamp: String
          endTimestamp: String
          accountId: String!
        }

        type AccountTotalBalanceBucket {
          transferableNorm: String!
          lockedNorm: String!
          debtNorm: String!
          timestamp: String!
        }

        type AccountTotalBalanceSnapshot {
          referenceAssetId: String!
          accountId: String!
          buckets: [AccountTotalBalanceBucket!]!
        }

        type AccountTotalBalancesByPeriodResponse {
          nodes: [AccountTotalBalanceSnapshot]!
          totalCount: Int!
        }

        extend type Query {
          accountTotalBalancesByPeriod(
            filter: AccountTotalBalancesByPeriodFilter
          ): AccountTotalBalancesByPeriodResponse!
        }
      `,
      resolvers: {
        Query: {
          accountTotalBalancesByPeriod: accountTotalBalancesByPeriodResolver,
        },
      },
    };
  });

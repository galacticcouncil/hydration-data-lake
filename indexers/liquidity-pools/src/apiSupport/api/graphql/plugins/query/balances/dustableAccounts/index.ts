import { gql, makeExtendSchemaPlugin, Plugin } from 'postgraphile';
import { dustableAccountsResolver } from './resolvers';

export const DustableAccountsPlugin: Plugin = makeExtendSchemaPlugin(
  (build, options) => {
    return {
      typeDefs: gql`
        input DustableAccountsFilter {
          includeZeroAccounts: Boolean
          assetId: String
          assetRegistryId: String
          existentialDeposit: String
        }

        type DustableAccount {
          accountId: String!
          assetRegistryIds: [String!]!
        }

        type DustableAccountsResponse {
          nodes: [DustableAccount!]!
          totalCount: Int!
        }

        extend type Query {
          dustableAccounts(filter: DustableAccountsFilter): DustableAccountsResponse!
        }
      `,
      resolvers: {
        Query: {
          dustableAccounts: dustableAccountsResolver,
        },
      },
    };
  }
);

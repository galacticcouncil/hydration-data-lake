import { gql, makeExtendSchemaPlugin, Plugin } from 'postgraphile';
import { dustableAccountsResolver } from './resolvers';

export const DustableAccountsPlugin: Plugin = makeExtendSchemaPlugin(
  (build, options) => {
    return {
      typeDefs: gql`
        type DustableAccount {
          accountId: String!
          assetRegistryIds: [String!]!
        }

        type DustableAccountsResponse {
          nodes: [DustableAccount!]!
          totalCount: Int!
        }

        extend type Query {
          dustableAccounts: DustableAccountsResponse!
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

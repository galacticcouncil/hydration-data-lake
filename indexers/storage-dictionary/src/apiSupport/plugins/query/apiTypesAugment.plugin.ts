import { gql, makeExtendSchemaPlugin, Plugin } from 'postgraphile';
import type { Build } from 'graphile-build';

export const ApiTypesAugmentPlugin: Plugin = makeExtendSchemaPlugin(
  (build: Build, options) => {
    return {
      typeDefs: gql`
        type AccountBalances {
          free: String!
          reserved: String!
          miscFrozen: String
          feeFrozen: String
          frozen: String
          flags: String
        }
        type Tradability {
          bits: Int!
        }
        type OmnipoolAssetState {
          hubReserve: String!
          shares: String!
          protocolShares: String!
          cap: String!
          tradable: Tradability
        }
        type AssetDynamicFee {
          assetFee: Int!
          protocolFee: Int!
          timestamp: Int!
        }

        enum MinifiedDataStructureTypeName {
          AccountBalances
          AssetDynamicFee
          OmnipoolAssetState
        }

        type MinifiedDataStructure {
          t: MinifiedDataStructureTypeName!
          d: [String!]!
        }

        type ApiSupportResponse {
          accountBalances: AccountBalances
          tradability: Tradability
          omnipoolAssetState: OmnipoolAssetState
          assetDynamicFee: AssetDynamicFee
          minifiedDataStructure: MinifiedDataStructure
          minifiedDataStructureTypeName: MinifiedDataStructureTypeName
        }

        extend type Query {
          _apiSupport: ApiSupportResponse
        }
      `,
      resolvers: {
        MinifiedDataStructureTypeName: {
          AccountBalances: 'AccountBalances',
          AssetDynamicFee: 'AssetDynamicFee',
          OmnipoolAssetState: 'OmnipoolAssetState',
        },
      },
    };
  }
);

import { gql, makeExtendSchemaPlugin, Plugin } from 'postgraphile';
import type { Build } from 'graphile-build';
import { AppConfig } from '../../../appConfig';

export const ApiTypesAugmentPlugin: Plugin = makeExtendSchemaPlugin(
  (build: Build, options) => {
    return {
      typeDefs: gql`
        type AccountBalances {
          free: BigInt!
          reserved: BigInt!
          miscFrozen: BigInt
          feeFrozen: BigInt
          frozen: BigInt
          flags: BigInt
        }
        type Tradability {
          bits: Int!
        }
        type OmnipoolAssetState {
          hubReserve: BigInt!
          shares: BigInt!
          protocolShares: BigInt!
          cap: BigInt!
          tradable: Tradability
        }

        type ApiSupportResponse {
          accountBalances: AccountBalances
          tradability: Tradability
          omnipoolAssetState: OmnipoolAssetState
        }

        extend type Query {
          _apiSupport: ApiSupportResponse
        }
      `,
      resolvers: {},
    };
  }
);

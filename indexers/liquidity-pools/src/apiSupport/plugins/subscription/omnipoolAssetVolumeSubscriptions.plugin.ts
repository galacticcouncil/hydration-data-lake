import { gql, makeExtendSchemaPlugin, Plugin, embed } from 'postgraphile';
import {
  OmnipoolAssetHistoricalVolumeGqlResponse,
  QueryResolverContext,
} from '../../types';
import { convertObjectPropsSnakeCaseToCamelCase } from '../../../utils/helpers';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import type { QueryBuilder, SQL } from 'graphile-build-pg';

function omnipoolAssetHistoricalVolumeSelectGraphQLResult({
  sql,
  event,
  tableAlias,
  sqlBuilder,
}: {
  sql: SQL & { fragment: any; value: any };
  event: any;
  tableAlias: any;
  sqlBuilder: QueryBuilder;
}) {
  sqlBuilder.where(
    sql.fragment`${tableAlias}.id = ${sql.value(event.__node__[2])}`
  );
  sqlBuilder.select(sql.fragment`${tableAlias}.id`, 'id');
  sqlBuilder.select(
    sql.fragment`${tableAlias}.omnipool_asset_id`,
    'omnipool_asset_id'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_volume_in`,
    'asset_volume_in'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_total_volume_in`,
    'asset_total_volume_in'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_volume_out`,
    'asset_volume_out'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_total_volume_out`,
    'asset_total_volume_out'
  );
  sqlBuilder.select(sql.fragment`${tableAlias}.asset_fee`, 'asset_fee');
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_total_fees`,
    'asset_total_fees'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.relay_chain_block_height`,
    'relay_chain_block_height'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.para_chain_block_height`,
    'para_chain_block_height'
  );
}

export const OmnipoolAssetVolumeSubscriptionsPlugin: Plugin =
  makeExtendSchemaPlugin((build, options) => {
    const schemas: string[] = options.stateSchemas || ['squid_processor'];
    const { pgSql: sql } = build;

    const omnipoolAssetHistoricalVolumeSubscriptionFilter = (
      event: any,
      args: any
    ) => {
      if (
        !args ||
        !args.filter ||
        !args.filter.omnipoolAssetIds ||
        !Array.isArray(args.filter.omnipoolAssetIds) ||
        args.filter.omnipoolAssetIds.length === 0
      )
        return true;

      return new Set(args.filter.omnipoolAssetIds).has(
        event.__node__[2].match(/^([a-zA-Z0-9]+-[0-9]+)-[0-9]+$/)[1]
      );
    };

    return {
      typeDefs: gql`
        input OmnipoolAssetHistoricalVolumeSubscriptionFilter {
          omnipoolAssetIds: [String!]
        }

        type OmnipoolAssetHistoricalVolumeSubscriptionPayload {
          node: OmnipoolAssetHistoricalVolumeEntity
          event: String
        }
        type OmnipoolAssetHistoricalVolumeEntity {
          id: String!
          omnipoolAssetId: String!
          assetVolumeIn: BigInt!
          assetTotalVolumeIn: BigInt!
          assetVolumeOut: BigInt!
          assetTotalVolumeOut: BigInt!
          assetFee: BigInt!
          assetTotalFees: BigInt!
          paraChainBlockHeight: Int!
          relayChainBlockHeight: Int!
        }

        extend type Subscription {
          omnipoolAssetHistoricalVolume(
            filter: OmnipoolAssetHistoricalVolumeSubscriptionFilter
          ): OmnipoolAssetHistoricalVolumeSubscriptionPayload
            @pgSubscription(
              topic: "postgraphile:state_changed:omnipool_asset_historical_volume"
              filter: ${embed(omnipoolAssetHistoricalVolumeSubscriptionFilter)}
            )
        }
      `,
      resolvers: {
        Subscription: {
          omnipoolAssetHistoricalVolume: async (
            event: any,
            _args: any,
            _context: QueryResolverContext,
            resolveInfo: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
          ) => {
            const rows =
              await resolveInfo.graphile.selectGraphQLResultFromTable(
                sql.fragment`public.omnipool_asset_historical_volume`,
                (tableAlias: SQL, sqlBuilder: QueryBuilder) => {
                  omnipoolAssetHistoricalVolumeSelectGraphQLResult({
                    sql,
                    event,
                    tableAlias,
                    sqlBuilder,
                  });
                }
              );

            const decoratedRow = convertObjectPropsSnakeCaseToCamelCase(
              rows[0] || {}
            ) as OmnipoolAssetHistoricalVolumeGqlResponse;

            return {
              node: {
                id: decoratedRow.id,
                omnipoolAssetId: decoratedRow.omnipoolAssetId,
                assetVolumeIn: decoratedRow.assetVolumeIn,
                assetTotalVolumeIn: decoratedRow.assetTotalVolumeIn,
                assetVolumeOut: decoratedRow.assetVolumeOut,
                assetTotalVolumeOut: decoratedRow.assetTotalVolumeOut,
                assetFee: decoratedRow.assetFee,
                assetTotalFees: decoratedRow.assetTotalFees,
                relayChainBlockHeight: decoratedRow.relayChainBlockHeight,
                paraChainBlockHeight: decoratedRow.paraChainBlockHeight,
              } as OmnipoolAssetHistoricalVolumeGqlResponse,
              event: event.__node__[0],
            };
          },
        },
      },
    };
  });

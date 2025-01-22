import { gql, makeExtendSchemaPlugin, Plugin, embed } from 'postgraphile';
import {
  QueryResolverContext,
  XykPoolHistoricalVolumeGqlResponse,
} from '../../types';
import { convertObjectPropsSnakeCaseToCamelCase } from '../../../utils/helpers';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import type { QueryBuilder, SQL } from 'graphile-build-pg';

function xykPoolHistoricalVolumeSelectGraphQLResult({
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
  sqlBuilder.select(sql.fragment`${tableAlias}.pool_id`, 'pool_id');
  sqlBuilder.select(sql.fragment`${tableAlias}.asset_a_id`, 'asset_a_id');
  sqlBuilder.select(sql.fragment`${tableAlias}.asset_b_id`, 'asset_b_id');
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_a_volume_in`,
    'asset_a_volume_in'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_a_total_volume_in`,
    'asset_a_total_volume_in'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_a_volume_out`,
    'asset_a_volume_out'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_a_total_volume_out`,
    'asset_a_total_volume_out'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_b_volume_in`,
    'asset_b_volume_in'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_b_total_volume_in`,
    'asset_b_total_volume_in'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_b_volume_out`,
    'asset_b_volume_out'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_b_total_volume_out`,
    'asset_b_total_volume_out'
  );
  sqlBuilder.select(sql.fragment`${tableAlias}.asset_a_fee`, 'asset_a_fee');
  sqlBuilder.select(sql.fragment`${tableAlias}.asset_b_fee`, 'asset_b_fee');
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_a_total_fees`,
    'asset_a_total_fees'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_b_total_fees`,
    'asset_b_total_fees'
  );
  sqlBuilder.select(sql.fragment`${tableAlias}.average_price`, 'average_price');
  sqlBuilder.select(
    sql.fragment`${tableAlias}.para_chain_block_height`,
    'para_chain_block_height'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.relay_chain_block_height`,
    'relay_chain_block_height'
  );
}

export const XykPoolsVolumeSubscriptionsPlugin: Plugin = makeExtendSchemaPlugin(
  (build, options) => {
    const schemas: string[] = options.stateSchemas || ['squid_processor'];
    const { pgSql: sql } = build;

    const xykPoolHistoricalVolumeSubscriptionFilter = (
      event: any,
      args: any
    ) => {
      if (
        !args ||
        !args.filter ||
        !args.filter.poolIds ||
        !Array.isArray(args.filter.poolIds) ||
        args.filter.poolIds.length === 0
      )
        return true;

      return new Set(args.filter.poolIds).has(event.__node__[2].split('-')[0]);
    };

    return {
      typeDefs: gql`
        input XykPoolHistoricalVolumeSubscriptionFilter {
          poolIds: [String!]
        }

        type XykPoolHistoricalVolumeSubscriptionPayload {
          node: XykPoolHistoricalVolumeEntity
          event: String
        }
        type XykPoolHistoricalVolumeEntity {
          id: String!
          poolId: String!
          assetAId: String!
          assetBId: String!
          assetAVolumeIn: BigInt!
          assetATotalVolumeIn: BigInt!
          assetAVolumeOut: BigInt!
          assetATotalVolumeOut: BigInt!
          assetBVolumeIn: BigInt!
          assetBTotalVolumeIn: BigInt!
          assetBVolumeOut: BigInt!
          assetBTotalVolumeOut: BigInt!
          assetAFee: BigInt!
          assetBFee: BigInt!
          assetATotalFees: BigInt!
          assetBTotalFees: BigInt!
          averagePrice: BigInt!
          paraChainBlockHeight: Int!
          relayChainBlockHeight: Int!
        }

        extend type Subscription {
          xykPoolHistoricalVolume(
            filter: XykPoolHistoricalVolumeSubscriptionFilter
          ): XykPoolHistoricalVolumeSubscriptionPayload
            @pgSubscription(
              topic: "postgraphile:state_changed:xyk_pool_historical_volume"
              filter: ${embed(xykPoolHistoricalVolumeSubscriptionFilter)}
            )
        }
      `,
      resolvers: {
        Subscription: {
          xykPoolHistoricalVolume: async (
            event: any,
            _args: any,
            _context: QueryResolverContext,
            resolveInfo: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
          ) => {
            const rows =
              await resolveInfo.graphile.selectGraphQLResultFromTable(
                sql.fragment`public.xyk_pool_historical_volume`,
                (tableAlias: SQL, sqlBuilder: QueryBuilder) => {
                  xykPoolHistoricalVolumeSelectGraphQLResult({
                    sql,
                    event,
                    tableAlias,
                    sqlBuilder,
                  });
                }
              );

            const decoratedRow = convertObjectPropsSnakeCaseToCamelCase(
              rows[0] || {}
            );

            return {
              node: {
                id: decoratedRow.id,
                poolId: decoratedRow.poolId,
                assetAId: decoratedRow.assetAId,
                assetBId: decoratedRow.assetBId,
                assetAVolumeIn: BigInt(decoratedRow.assetAVolumeIn),
                assetATotalVolumeIn: BigInt(decoratedRow.assetATotalVolumeIn),
                assetAVolumeOut: BigInt(decoratedRow.assetAVolumeOut),
                assetATotalVolumeOut: BigInt(decoratedRow.assetATotalVolumeOut),
                assetBVolumeIn: BigInt(decoratedRow.assetBVolumeIn),
                assetBTotalVolumeIn: BigInt(decoratedRow.assetBTotalVolumeIn),
                assetBVolumeOut: BigInt(decoratedRow.assetBVolumeOut),
                assetBTotalVolumeOut: BigInt(decoratedRow.assetBTotalVolumeOut),
                assetAFee: BigInt(decoratedRow.assetAFee),
                assetBFee: BigInt(decoratedRow.assetBFee),
                assetATotalFees: BigInt(decoratedRow.assetATotalFees),
                assetBTotalFees: BigInt(decoratedRow.assetBTotalFees),
                averagePrice: decoratedRow.averagePrice,
                relayChainBlockHeight: decoratedRow.relayChainBlockHeight,
                paraChainBlockHeight: decoratedRow.paraChainBlockHeight,
              } as XykPoolHistoricalVolumeGqlResponse,
              event: event.__node__[0],
            };
          },
        },
      },
    };
  }
);

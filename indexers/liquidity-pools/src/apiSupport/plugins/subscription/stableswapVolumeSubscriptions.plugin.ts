import { gql, makeExtendSchemaPlugin, Plugin, embed } from 'postgraphile';
import {
  QueryResolverContext,
  StableswapAssetHistoricalVolumeGqlResponse,
  StableswapAssetHistoricalVolumeRaw,
  StableswapHistoricalVolumeGqlResponse,
} from '../../types';
import { convertObjectPropsSnakeCaseToCamelCase } from '../../../utils/helpers';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import type { QueryBuilder, SQL } from 'graphile-build-pg';

type StablepoolHistoricalVolumeSubscribeFilter = {
  poolIds: string[];
};

function stableswapHistoricalVolumeSelectGraphQLResult({
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
  sqlBuilder.select(
    sql.fragment`${tableAlias}.relay_chain_block_height`,
    'relay_chain_block_height'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.para_chain_block_height`,
    'para_chain_block_height'
  );
}

function stableswapAssetHistoricalVolumeSelectGraphQLResult({
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
    sql.fragment`${tableAlias}.volumes_collection_id = ${sql.value(event.__node__[2])}`
  );
  sqlBuilder.select(sql.fragment`${tableAlias}.id`, 'id');
  sqlBuilder.select(
    sql.fragment`${tableAlias}.volumes_collection_id`,
    'volumes_collection_id'
  );
  sqlBuilder.select(sql.fragment`${tableAlias}.asset_id`, 'asset_id');
  sqlBuilder.select(sql.fragment`${tableAlias}.swap_fee`, 'swap_fee');
  sqlBuilder.select(
    sql.fragment`${tableAlias}.swap_total_fees`,
    'swap_total_fees'
  );
  // sqlBuilder.select(sql.fragment`${tableAlias}.liq_fee`, 'liq_fee');
  // sqlBuilder.select(
  //   sql.fragment`${tableAlias}.liq_total_fees`,
  //   'liq_total_fees'
  // );
  // sqlBuilder.select(
  //   sql.fragment`${tableAlias}.routed_liq_fee`,
  //   'routed_liq_fee'
  // );
  // sqlBuilder.select(
  //   sql.fragment`${tableAlias}.routed_liq_total_fees`,
  //   'routed_liq_total_fees'
  // );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.swap_volume_in`,
    'swap_volume_in'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.swap_volume_out`,
    'swap_volume_out'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.swap_total_volume_in`,
    'swap_total_volume_in'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.swap_total_volume_out`,
    'swap_total_volume_out'
  );
  // sqlBuilder.select(
  //   sql.fragment`${tableAlias}.liq_added_amount`,
  //   'liq_added_amount'
  // );
  // sqlBuilder.select(
  //   sql.fragment`${tableAlias}.liq_removed_amount`,
  //   'liq_removed_amount'
  // );
  // sqlBuilder.select(
  //   sql.fragment`${tableAlias}.liq_added_total_amount`,
  //   'liq_added_total_amount'
  // );
  // sqlBuilder.select(
  //   sql.fragment`${tableAlias}.liq_removed_total_amount`,
  //   'liq_removed_total_amount'
  // );
  // sqlBuilder.select(
  //   sql.fragment`${tableAlias}.routed_liq_added_amount`,
  //   'routed_liq_added_amount'
  // );
  // sqlBuilder.select(
  //   sql.fragment`${tableAlias}.routed_liq_removed_amount`,
  //   'routed_liq_removed_amount'
  // );
  // sqlBuilder.select(
  //   sql.fragment`${tableAlias}.routed_liq_added_total_amount`,
  //   'routed_liq_added_total_amount'
  // );
  // sqlBuilder.select(
  //   sql.fragment`${tableAlias}.routed_liq_removed_total_amount`,
  //   'routed_liq_removed_total_amount'
  // );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.para_chain_block_height`,
    'para_chain_block_height'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.relay_chain_block_height`,
    'relay_chain_block_height'
  );
}

export const StableswapVolumeSubscriptionsPlugin: Plugin =
  makeExtendSchemaPlugin((build, options) => {
    const schemas: string[] = options.stateSchemas || ['squid_processor'];
    const { pgSql: sql } = build;

    const stablepoolHistoricalVolumeSubscriptionFilter = (
      event: any,
      args: { filter: StablepoolHistoricalVolumeSubscribeFilter }
    ) => {
      if (
        !args ||
        !args.filter ||
        !args.filter.poolIds ||
        !Array.isArray(args.filter.poolIds) ||
        args.filter.poolIds.length === 0
      )
        return true;

      return new Set(args.filter.poolIds).has(
        event.__node__[2].match(/^([0-9]+)-[0-9]+$/)[1]
      );
    };

    return {
      typeDefs: gql`
        input StableswapHistoricalVolumeSubscriptionFilter {
          poolIds: [String!]
        }

        type StableswapHistoricalVolumeSubscriptionPayload {
          node: StableswapHistoricalVolumeEntity
          event: String
        }

        type StableswapAssetHistoricalVolumeEntity {
            id: String!
            volumesCollectionId: String!
            assetId: Int!
            swapFee: BigInt!
            swapTotalFees: BigInt!
#            liqFee: BigInt!
#            liqTotalFees: BigInt!
#            routedLiqFee: BigInt!
#            routedLiqTotalFees: BigInt!
            swapVolumeIn: BigInt!
            swapVolumeOut: BigInt!
            swapTotalVolumeIn: BigInt!
            swapTotalVolumeOut: BigInt!
#            liqAddedAmount: BigInt!
#            liqRemovedAmount: BigInt!
#            liqAddedTotalAmount: BigInt!
#            liqRemovedTotalAmount: BigInt!
#            routedLiqAddedAmount: BigInt!
#            routedLiqRemovedAmount: BigInt!
#            routedLiqAddedTotalAmount: BigInt!
#            routedLiqRemovedTotalAmount: BigInt!
            paraBlockHeight: Int!
            relayBlockHeight: Int!
        }

        type StableswapHistoricalVolumeEntity {
          id: String!
          poolId: String!
          assetVolumes: [StableswapAssetHistoricalVolumeEntity]!
          paraBlockHeight: Int!
          relayBlockHeight: Int!
        }

        extend type Subscription {
          stableswapHistoricalVolume(
            filter: StableswapHistoricalVolumeSubscriptionFilter
          ): StableswapHistoricalVolumeSubscriptionPayload
            @pgSubscription(
              topic: "postgraphile:state_changed:stableswap_historical_volume"
              filter: ${embed(stablepoolHistoricalVolumeSubscriptionFilter)}
            )
        }
      `,
      resolvers: {
        Subscription: {
          stableswapHistoricalVolume: async (
            event: any,
            _args: any,
            _context: QueryResolverContext,
            resolveInfo: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
          ) => {
            const stablepoolHistVolRows =
              await resolveInfo.graphile.selectGraphQLResultFromTable(
                sql.fragment`public.stableswap_historical_volume`,
                (tableAlias: SQL, sqlBuilder: QueryBuilder) => {
                  stableswapHistoricalVolumeSelectGraphQLResult({
                    sql,
                    event,
                    tableAlias,
                    sqlBuilder,
                  });
                }
              );

            const stablepoolAssetHistVolRows: StableswapAssetHistoricalVolumeRaw[] =
              await resolveInfo.graphile.selectGraphQLResultFromTable(
                sql.fragment`public.stableswap_asset_historical_volume`,
                (tableAlias: SQL, sqlBuilder: QueryBuilder) => {
                  stableswapAssetHistoricalVolumeSelectGraphQLResult({
                    sql,
                    event,
                    tableAlias,
                    sqlBuilder,
                  });
                }
              );

            const decoratedStablepoolHistVolRow =
              convertObjectPropsSnakeCaseToCamelCase<StableswapHistoricalVolumeGqlResponse>(
                stablepoolHistVolRows[0] || {}
              );

            return {
              node: {
                id: decoratedStablepoolHistVolRow.id,
                poolId: decoratedStablepoolHistVolRow.poolId,
                assetVolumes: stablepoolAssetHistVolRows.map((assetVol) =>
                  convertObjectPropsSnakeCaseToCamelCase<StableswapAssetHistoricalVolumeGqlResponse>(
                    assetVol || {}
                  )
                ),
                relayBlockHeight:
                  decoratedStablepoolHistVolRow.relayBlockHeight,
                paraBlockHeight:
                  decoratedStablepoolHistVolRow.paraBlockHeight,
              } as StableswapHistoricalVolumeGqlResponse,
              event: event.__node__[0],
            };
          },
        },
      },
    };
  });

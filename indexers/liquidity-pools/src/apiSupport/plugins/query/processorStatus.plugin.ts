import { gql, makeExtendSchemaPlugin, Plugin } from 'postgraphile';
import type * as pg from 'pg';
import { QueryResolverContext } from '../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import type { QueryBuilder, SQL } from 'graphile-build-pg';
import type { Build } from 'graphile-build';

export const ProcessorStatusPlugin: Plugin = makeExtendSchemaPlugin(
  (build: Build, options) => {
    const schemas: string[] = options.stateSchemas || ['squid_processor'];
    const { pgSql: sql } = build;

    return {
      typeDefs: gql`
        type _ProcessorStatus {
          name: String!
          height: Int!
          hash: String!
        }
        type SquidStatusSubscriptionPayload {
          event: String!
          node: _ProcessorStatus!
        }

        extend type Query {
          _squidStatus: [_ProcessorStatus!]!
        }

        extend type Subscription {
          squidStatus: SquidStatusSubscriptionPayload
            @pgSubscription(
              topic: "postgraphile:state_changed:squid_processor_status"
            )
        }
      `,
      resolvers: {
        Query: {
          _squidStatus: async (parentObject, args, context, info) => {
            const pgClient: pg.Client = context.pgClient;

            const { rows } = await pgClient.query(
              schemas
                .map(
                  (s) => `SELECT '${s}' as name , height, hash FROM ${s}.status`
                )
                .join(' UNION ALL ')
            );

            return rows || [];
          },
        },
        Subscription: {
          squidStatus: async (
            event: any,
            _args: any,
            _context: QueryResolverContext,
            resolveInfo: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
          ) => {
            const rows =
              await resolveInfo.graphile.selectGraphQLResultFromTable(
                sql.fragment`squid_processor.status`,
                (tableAlias: SQL, sqlBuilder: QueryBuilder) => {
                  sqlBuilder.where(
                    sql.fragment`${tableAlias}.id = ${sql.value(event.__node__[2])}`
                  );
                  sqlBuilder.select(
                    sql.fragment`${tableAlias}.height`,
                    'height'
                  );
                  sqlBuilder.select(sql.fragment`${tableAlias}.hash`, 'hash');
                }
              );

            return {
              node: {
                name: 'squid_processor', // TODO add real value
                height: rows[0].height,
                hash: rows[0].hash,
              },
              event: event.__node__[0],
            };
          },
        },
      },
    };
  }
);

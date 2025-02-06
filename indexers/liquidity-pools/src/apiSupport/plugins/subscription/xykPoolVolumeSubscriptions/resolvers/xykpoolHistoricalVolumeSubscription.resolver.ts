import {
  QueryResolverContext,
  XykpoolHistoricalVolumeGqlResponse,
} from '../../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import type { QueryBuilder, SQL } from 'graphile-build-pg';
import { xykpoolHistoricalVolumeSelectGraphQLResult } from '../utils';
import { convertObjectPropsSnakeCaseToCamelCase } from '../../../../../utils/helpers';

export async function xykpoolHistoricalVolumeSubscriptionResolver(
  event: any,
  _args: any,
  _context: QueryResolverContext,
  resolveInfo: GraphQLResolveInfo & { graphile: GraphileHelpers<any> },
  sql: any
) {
  const rows = await resolveInfo.graphile.selectGraphQLResultFromTable(
    sql.fragment`public.xykpool_historical_volume`,
    (tableAlias: SQL, sqlBuilder: QueryBuilder) => {
      xykpoolHistoricalVolumeSelectGraphQLResult({
        sql,
        event,
        tableAlias,
        sqlBuilder,
      });
    }
  );

  const decoratedRow = convertObjectPropsSnakeCaseToCamelCase(rows[0] || {});

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
      relayBlockHeight: decoratedRow.relayBlockHeight,
      paraBlockHeight: decoratedRow.paraBlockHeight,
    } as XykpoolHistoricalVolumeGqlResponse,
    event: event.__node__.event_name,
  };
}

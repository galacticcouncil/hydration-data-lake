import {
  OmnipoolAssetHistoricalVolumeGqlResponse,
  QueryResolverContext,
} from '../../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import type { QueryBuilder, SQL } from 'graphile-build-pg';
import { omnipoolAssetHistoricalVolumeSelectGraphQLResult } from '../utils';
import { convertObjectPropsSnakeCaseToCamelCase } from '../../../../../utils/helpers';

export async function omnipoolAssetHistoricalVolumeSubscriptionResolver(
  event: any,
  _args: any,
  _context: QueryResolverContext,
  resolveInfo: GraphQLResolveInfo & { graphile: GraphileHelpers<any> },
  sql: any
) {
  const rows = await resolveInfo.graphile.selectGraphQLResultFromTable(
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
      relayBlockHeight: decoratedRow.relayBlockHeight,
      paraBlockHeight: decoratedRow.paraBlockHeight,
    } as OmnipoolAssetHistoricalVolumeGqlResponse,
    event: event.__node__.event_name,
  };
}

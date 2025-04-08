import {
  QueryResolverContext,
  StableswapAssetHistoricalVolumeGqlResponse,
  StableswapAssetHistoricalVolumeRaw,
  StableswapHistoricalVolumeGqlResponse,
} from '../../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import type { QueryBuilder, SQL } from 'graphile-build-pg';
import {
  stableswapAssetHistoricalVolumeSelectGraphQLResult,
  stableswapHistoricalVolumeSelectGraphQLResult,
} from '../utils';
import { convertObjectPropsSnakeCaseToCamelCase } from '../../../../../utils/helpers';

export async function stableswapHistoricalVolumeSubscriptionResolver(
  event: any,
  _args: any,
  _context: QueryResolverContext,
  resolveInfo: GraphQLResolveInfo & { graphile: GraphileHelpers<any> },
  sql: any
) {
  const stablepoolHistVolRows =
    await resolveInfo.graphile.selectGraphQLResultFromTable(
      sql.fragment`public.stableswap_volume_historical_data`,
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
      relayBlockHeight: decoratedStablepoolHistVolRow.relayBlockHeight,
      paraBlockHeight: decoratedStablepoolHistVolRow.paraBlockHeight,
    } as StableswapHistoricalVolumeGqlResponse,
    event: event.__node__.event_name,
  };
}

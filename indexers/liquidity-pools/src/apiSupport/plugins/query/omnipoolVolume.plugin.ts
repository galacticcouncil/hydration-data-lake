import { gql, makeExtendSchemaPlugin, Plugin, embed } from 'postgraphile';
import type * as pg from 'pg';
import {
  OmnipoolAssetHistoricalVolumeRaw,
  QueryResolverContext,
} from '../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import { aggregateOmnipoolAssetsVolumesByBlocksRange } from '../sql/omnipoolAssetsVolume.sql';

type OmnipoolAssetVolumesByPeriodFilter = {
  omnipoolAssetIds: string[];
  startBlockNumber: number;
  endBlockNumber?: number;
};

type OmnipoolAssetVolumeAggregated = {
  omnipoolAssetId: string;
  assetId: number;
  assetVolume: bigint;
  assetFeeVolume: bigint;
};

type XykPoolVolumesByPeriodResponse = {
  nodes: OmnipoolAssetVolumeAggregated[];
  totalCount: number;
};

export async function handleQueryOmnipoolAssetHistoricalVolumesByPeriod(
  parentObject: any,
  args: { filter: OmnipoolAssetVolumesByPeriodFilter },
  context: QueryResolverContext,
  info: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
): Promise<XykPoolVolumesByPeriodResponse> {
  const pgClient: pg.Client = context.pgClient;

  pgClient.setTypeParser(1700, function (val) {
    return val;
  });

  const {
    filter: { omnipoolAssetIds, startBlockNumber, endBlockNumber },
  } = args;

  const squidStatus = (
    await pgClient.query(`SELECT height FROM squid_processor.status`)
  ).rows[0];

  const groupedResult = await pgClient.query(
    aggregateOmnipoolAssetsVolumesByBlocksRange,
    [omnipoolAssetIds, startBlockNumber, endBlockNumber ?? squidStatus.height]
  );

  const decoratedNodes = new Map<string, OmnipoolAssetVolumeAggregated>(
    groupedResult.rows
      .map((item) => item.grouped_result.flat())
      .map((group: Array<OmnipoolAssetHistoricalVolumeRaw>) => {
        const resp: OmnipoolAssetVolumeAggregated = {
          omnipoolAssetId: group[0].omnipool_asset_id,
          assetId: +group[0].omnipool_asset_id.split('-')[1],
          assetVolume: BigInt(0),
          assetFeeVolume: BigInt(0),
        };

        // Should not occur in normal conditions because SQL query will return
        // either 2 elements in the group or nothing.
        if (group.length === 1) return resp;

        if (
          group[0].para_chain_block_height === group[1].para_chain_block_height
        ) {
          resp.assetVolume =
            BigInt(group[0].asset_volume_in) +
            BigInt(group[0].asset_volume_out);
          resp.assetFeeVolume = BigInt(group[0].asset_fee);
          return resp;
        }

        resp.assetVolume =
          BigInt(group[1].asset_total_volume_in) +
          BigInt(group[1].asset_total_volume_out) -
          BigInt(group[0].asset_total_volume_in) -
          BigInt(group[0].asset_total_volume_out) +
          BigInt(group[0].asset_volume_in) +
          BigInt(group[0].asset_volume_out);

        resp.assetFeeVolume =
          BigInt(group[1].asset_total_fees) - BigInt(group[0].asset_total_fees);
        return resp;
      })
      .map((r: OmnipoolAssetVolumeAggregated) => [r.omnipoolAssetId, r])
  );

  for (const assetIdWithNoResult of omnipoolAssetIds.filter(
    (id) => !decoratedNodes.has(id)
  )) {
    decoratedNodes.set(assetIdWithNoResult, {
      omnipoolAssetId: assetIdWithNoResult,
      assetId: +(assetIdWithNoResult.split('-')[1] || -1),
      assetVolume: BigInt(0),
      assetFeeVolume: BigInt(0),
    });
  }

  return {
    nodes: [...decoratedNodes.values()],
    totalCount: decoratedNodes.size,
  };
}

export const OmnipoolAssetVolumePlugin: Plugin = makeExtendSchemaPlugin(
  (build, options) => {
    const schemas: string[] = options.stateSchemas || ['squid_processor'];

    return {
      typeDefs: gql`
        input OmnipoolAssetVolumesByPeriodFilter {
          omnipoolAssetIds: [String!]!
          startBlockNumber: Int!
          endBlockNumber: Int
        }

        type OmnipoolAssetVolumeAggregated {
          omnipoolAssetId: String!
          assetId: Int!
          assetVolume: BigFloat!
          assetFeeVolume: BigFloat!
        }

        type OmnipoolAssetVolumesByPeriodResponse {
          nodes: [OmnipoolAssetVolumeAggregated]!
          totalCount: Int!
        }

        extend type Query {
          omnipoolAssetHistoricalVolumesByPeriod(
            filter: OmnipoolAssetVolumesByPeriodFilter!
          ): OmnipoolAssetVolumesByPeriodResponse!
        }
      `,
      resolvers: {
        Query: {
          omnipoolAssetHistoricalVolumesByPeriod:
            handleQueryOmnipoolAssetHistoricalVolumesByPeriod,
        },
      },
    };
  }
);

import { gql, makeExtendSchemaPlugin, Plugin, embed } from 'postgraphile';
import type * as pg from 'pg';
import {
  aggregateXykPoolVolumesByBlocksRange,
  getAssetIdsByPoolIds,
} from '../sql/xykPoolsVolume.sql';
import { QueryResolverContext, XykPoolHistoricalVolumeRaw } from '../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';

type XykPoolVolumesByPeriodFilter = {
  poolIds: string[];
  startBlockNumber: number;
  endBlockNumber?: number;
};

type XykPoolVolumeAggregated = {
  poolId: string;
  assetAId: number;
  assetAVolume: bigint;
  assetBId: number;
  assetBVolume: bigint;
};

type XykPoolVolumesByPeriodResponse = {
  nodes: XykPoolVolumeAggregated[];
  totalCount: number;
};

export async function handleQueryXykPoolHistoricalVolumesByPeriod(
  parentObject: any,
  args: { filter: XykPoolVolumesByPeriodFilter },
  context: QueryResolverContext,
  info: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
): Promise<XykPoolVolumesByPeriodResponse> {
  const pgClient: pg.Client = context.pgClient;

  pgClient.setTypeParser(1700, function (val) {
    return val;
  });

  const {
    filter: { poolIds, startBlockNumber, endBlockNumber },
  } = args;

  const squidStatus = (
    await pgClient.query(`SELECT height FROM squid_processor.status`)
  ).rows[0];

  const groupedResult = await pgClient.query(
    aggregateXykPoolVolumesByBlocksRange,
    [poolIds, startBlockNumber, endBlockNumber ?? squidStatus.height]
  );

  const decoratedNodes = new Map<string, XykPoolVolumeAggregated>(
    groupedResult.rows
      .map((item) => item.grouped_result.flat())
      .map((group: Array<XykPoolHistoricalVolumeRaw>) => {
        const resp: XykPoolVolumeAggregated = {
          poolId: group[0].pool_id,
          assetAId: group[0].asset_a_id,
          assetAVolume: BigInt(0),
          assetBId: group[0].asset_b_id,
          assetBVolume: BigInt(0),
        };

        // Should not occur in normal conditions because SQL query will return
        // either 2 elements in the group or nothing.
        if (group.length === 1) return resp;

        if (
          group[0].para_chain_block_height === group[1].para_chain_block_height
        ) {
          resp.assetAVolume =
            BigInt(group[0].asset_a_volume_in) +
            BigInt(group[0].asset_a_volume_out);
          resp.assetBVolume =
            BigInt(group[0].asset_b_volume_in) +
            BigInt(group[0].asset_b_volume_out);

          return resp;
        }

        resp.assetAVolume =
          BigInt(group[1].asset_a_total_volume_in) +
          BigInt(group[1].asset_a_total_volume_out) -

          BigInt(group[0].asset_a_total_volume_in) -
          BigInt(group[0].asset_a_total_volume_out) +

          BigInt(group[0].asset_a_volume_in) +
          BigInt(group[0].asset_a_volume_out);

        resp.assetBVolume =
          BigInt(group[1].asset_b_total_volume_in) +
          BigInt(group[1].asset_b_total_volume_out) -

          BigInt(group[0].asset_b_total_volume_in) -
          BigInt(group[0].asset_b_total_volume_out) +

          BigInt(group[0].asset_b_volume_in) +
          BigInt(group[0].asset_b_volume_out);
        return resp;
      })
      .map((r: XykPoolVolumeAggregated) => [r.poolId, r])
  );

  const assetsData = await pgClient.query(getAssetIdsByPoolIds, [
    poolIds.filter((id) => !decoratedNodes.has(id)),
  ]);

  for (const poolWithAssetsData of assetsData.rows) {
    decoratedNodes.set(poolWithAssetsData.id, {
      poolId: poolWithAssetsData.id,
      assetAId: poolWithAssetsData.asset_a_id,
      assetBId: poolWithAssetsData.asset_b_id,
      assetAVolume: BigInt(0),
      assetBVolume: BigInt(0),
    });
  }

  return {
    nodes: [...decoratedNodes.values()],
    totalCount: decoratedNodes.size,
  };
}

export const XykPoolsVolumePlugin: Plugin = makeExtendSchemaPlugin(
  (build, options) => {
    const schemas: string[] = options.stateSchemas || ['squid_processor'];

    return {
      typeDefs: gql`
        input XykPoolVolumesByPeriodFilter {
          poolIds: [String!]!
          startBlockNumber: Int!
          endBlockNumber: Int
        }

        type XykPoolVolumeAggregated {
          poolId: String!
          assetAId: Int!
          assetBId: Int!
          assetAVolume: BigFloat!
          assetBVolume: BigFloat!
        }

        type XykPoolVolumesByPeriodResponse {
          nodes: [XykPoolVolumeAggregated]!
          totalCount: Int!
        }

        extend type Query {
          xykPoolHistoricalVolumesByPeriod(
            filter: XykPoolVolumesByPeriodFilter!
          ): XykPoolVolumesByPeriodResponse!
        }
      `,
      resolvers: {
        Query: {
          xykPoolHistoricalVolumesByPeriod:
            handleQueryXykPoolHistoricalVolumesByPeriod,
        },
      },
    };
  }
);

import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import type * as pg from 'pg';

import { buildDustableAccountsQuery } from '../../../../../../../sql/dustableAccount.sql';
import { QueryResolverContext } from '../../../../../../../types';
import {
  DustableAccount,
  DustableAccountsFilter,
  DustableAccountsResponse,
} from './types';

export async function dustableAccountsResolver(
  parentObject: any,
  args: { filter?: DustableAccountsFilter },
  context: QueryResolverContext,
  info: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
): Promise<DustableAccountsResponse> {
  const pgClient: pg.Client = context.pgClient;

  try {
    const { query, values } = buildDustableAccountsQuery(args.filter);
    const result = await pgClient.query(query, values);

    const nodes: DustableAccount[] = result.rows.map((row) => ({
      accountId: row.accountId,
      assetRegistryIds: row.assetRegistryIds || [],
    }));

    return {
      nodes,
      totalCount: nodes.length,
    };
  } catch (error) {
    console.error('Error fetching dustable accounts:', error);
    return {
      nodes: [],
      totalCount: 0,
    };
  }
}

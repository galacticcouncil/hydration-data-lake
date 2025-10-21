import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import type * as pg from 'pg';

import { query } from '../../../../../../../sql/dustableAccount.sql';
import { QueryResolverContext } from '../../../../../../../types';
import {
  DustableAccount,
  DustableAccountsResponse,
} from './types';

export async function dustableAccountsResolver(
  parentObject: any,
  args: any,
  context: QueryResolverContext,
  info: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
): Promise<DustableAccountsResponse> {
  const pgClient: pg.Client = context.pgClient;

  try {
    const result = await pgClient.query(query);

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

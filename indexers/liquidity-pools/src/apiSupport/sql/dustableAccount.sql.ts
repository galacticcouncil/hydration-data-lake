// Query to get latest balance for each account-asset pair
// where total balance > 0 AND total balance < existential deposit

import { DustableAccountsFilter } from '../api/graphql/plugins/query/balances/dustableAccounts/resolvers/types';

export interface QueryResult {
  query: string;
  values: any[];
}

export function buildDustableAccountsQuery(
  filter?: DustableAccountsFilter
): QueryResult {
  const conditions: string[] = [];
  const values: any[] = [];
  let paramCounter = 1;

  // Default: exclude zero balances unless includeZeroAccounts is true
  if (!filter?.includeZeroAccounts) {
    conditions.push('lbl.total > 0');
  }

  // Filter by assetId (database ID)
  if (filter?.assetId) {
    conditions.push(`lbl.asset_id = $${paramCounter}`);
    values.push(filter.assetId);
    paramCounter++;
  }

  // Filter by assetRegistryId (e.g., "HDX", "DOT")
  if (filter?.assetRegistryId) {
    conditions.push(`a.asset_registry_id = $${paramCounter}`);
    values.push(filter.assetRegistryId);
    paramCounter++;
  }

  // Compare against existential deposit
  // If custom ED provided, use it; otherwise use asset's ED
  const edComparison = filter?.existentialDeposit
    ? `lbl.total < $${paramCounter}`
    : 'lbl.total < a.existential_deposit';

  if (filter?.existentialDeposit) {
    values.push(filter.existentialDeposit);
    paramCounter++;
  }

  conditions.push(edComparison);

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT lbl.account_id AS "accountId",
           array_agg(a.asset_registry_id ORDER BY a.asset_registry_id) AS "assetRegistryIds"
    FROM account_asset_balance_latest lbl
           JOIN asset a ON a.id = lbl.asset_id
    ${whereClause}
    GROUP BY lbl.account_id
    ORDER BY lbl.account_id;
  `;

  return { query, values };
}

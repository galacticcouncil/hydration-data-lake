export interface DustableAccountsFilter {
  includeZeroAccounts?: boolean;
  assetId?: string;
  assetRegistryId?: string;
  existentialDeposit?: string;
}

export interface DustableAccount {
  accountId: string;
  assetRegistryIds: string[];
}

export interface DustableAccountsResponse {
  nodes: DustableAccount[];
  totalCount: number;
}

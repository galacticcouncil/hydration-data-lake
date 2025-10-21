export interface DustableAccount {
  accountId: string;
  assetRegistryIds: string[];
}

export interface DustableAccountsResponse {
  nodes: DustableAccount[];
  totalCount: number;
}

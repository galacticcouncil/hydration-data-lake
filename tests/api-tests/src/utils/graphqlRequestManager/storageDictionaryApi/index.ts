import { QueriesHelper } from '../queriesHelper';
import {
  GetLbpPoolData,
  GetLbpPoolDataQuery,
  GetLbpPoolDataQueryVariables,
} from './apiTypes/types';

export class StorageDictionaryGQLManager extends QueriesHelper {
  constructor() {
    super();
  }

  async getLbpPoolDataAtBlock({
    blockNumber,
    poolAddress,
  }: {
    blockNumber: number;
    poolAddress: string;
  }) {
    const resp = await this.gqlRequest<
      GetLbpPoolDataQuery,
      GetLbpPoolDataQueryVariables
    >({
      query: GetLbpPoolData,
      variables: {
        filter: {
          paraChainBlockHeight: { equalTo: blockNumber },
          poolAddress: { equalTo: poolAddress },
        },
      },
    });

    return resp.data?.lbpPools?.nodes[0] ?? null;
  }
}

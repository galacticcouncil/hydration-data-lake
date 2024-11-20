import { QueriesHelper } from './queriesHelper';
import {
  GetLbppoolHistoricalData,
  GetLbppoolHistoricalDataQuery,
  GetLbppoolHistoricalDataQueryVariables,
} from './apiTypes/types';

export class GraphQLRequestManager extends QueriesHelper {
  constructor() {
    super();
  }

  async getLbpPoolHistoricalDatumAtBlock({
    blockNumber,
    poolAddress,
  }: {
    blockNumber: number;
    poolAddress: string;
  }) {
    const resp = await this.gqlRequest<
      GetLbppoolHistoricalDataQuery,
      GetLbppoolHistoricalDataQueryVariables
    >({
      query: GetLbppoolHistoricalData,
      variables: {
        filter: {
          paraChainBlockHeight: { equalTo: blockNumber },
          poolId: { equalTo: poolAddress },
        },
      },
    });

    return resp.data?.lbpPoolHistoricalData?.nodes[0] ?? null;
  }
}

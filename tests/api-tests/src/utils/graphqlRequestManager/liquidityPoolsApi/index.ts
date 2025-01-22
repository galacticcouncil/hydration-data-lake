import { QueriesHelper } from '../queriesHelper';
import {
  GetLbppoolHistoricalData,
  GetLbppoolHistoricalDataQuery,
  GetLbppoolHistoricalDataQueryVariables,
  GetXykPoolHistoricalData,
  GetXykPoolHistoricalDataQuery,
  GetXykPoolHistoricalDataQueryVariables,
  GetXykPoolSwapsData,
  GetXykPoolSwapsDataQuery,
  GetXykPoolSwapsDataQueryVariables,
} from './apiTypes/types';

export class LiquidityPoolsGQLManager extends QueriesHelper {
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

  async getXykPoolHistoricalDatumAtBlock({
    blockNumber,
    poolAddress,
  }: {
    blockNumber: number;
    poolAddress: string;
  }) {
    const resp = await this.gqlRequest<
      GetXykPoolHistoricalDataQuery,
      GetXykPoolHistoricalDataQueryVariables
    >({
      query: GetXykPoolHistoricalData,
      variables: {
        filter: {
          paraChainBlockHeight: { equalTo: blockNumber },
          poolId: { equalTo: poolAddress },
        },
      },
    });

    return resp.data?.xykPoolHistoricalData?.nodes[0] ?? null;
  }

  async getXykPoolSwapAtBlock({
    blockNumber,
    poolAddress,
  }: {
    blockNumber: number;
    poolAddress: string;
  }) {
    const resp = await this.gqlRequest<
      GetXykPoolSwapsDataQuery,
      GetXykPoolSwapsDataQueryVariables
    >({
      query: GetXykPoolSwapsData,
      variables: {
        filter: {
          paraChainBlockHeight: { equalTo: blockNumber },
          fillerId: { equalTo: poolAddress },
        },
      },
    });

    return resp.data?.swaps?.nodes[0] ?? null;
  }
}

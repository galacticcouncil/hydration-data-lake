import { QueriesHelper } from '../queriesHelper';
import {
  GetLbppoolHistoricalData,
  GetLbppoolHistoricalDataQuery,
  GetLbppoolHistoricalDataQueryVariables,
  GetXykpoolHistoricalData,
  GetXykpoolHistoricalDataQuery,
  GetXykpoolHistoricalDataQueryVariables,
  GetXykpoolSwapsData,
  GetXykpoolSwapsDataQuery,
  GetXykpoolSwapsDataQueryVariables,
} from './apiTypes';

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
          paraBlockHeight: { equalTo: blockNumber },
          poolId: { equalTo: poolAddress },
        },
      },
    });

    return resp.data?.lbppoolHistoricalData?.nodes[0] ?? null;
  }

  async getXykPoolHistoricalDatumAtBlock({
    blockNumber,
    poolAddress,
  }: {
    blockNumber: number;
    poolAddress: string;
  }) {
    const resp = await this.gqlRequest<
      GetXykpoolHistoricalDataQuery,
      GetXykpoolHistoricalDataQueryVariables
    >({
      query: GetXykpoolHistoricalData,
      variables: {
        filter: {
          paraBlockHeight: { equalTo: blockNumber },
          poolId: { equalTo: poolAddress },
        },
      },
    });

    return resp.data?.xykpoolHistoricalData?.nodes[0] ?? null;
  }

  async getXykPoolSwapAtBlock({
    blockNumber,
    poolAddress,
  }: {
    blockNumber: number;
    poolAddress: string;
  }) {
    const resp = await this.gqlRequest<
      GetXykpoolSwapsDataQuery,
      GetXykpoolSwapsDataQueryVariables
    >({
      query: GetXykpoolSwapsData,
      variables: {
        filter: {
          paraBlockHeight: { equalTo: blockNumber },
          fillerId: { equalTo: poolAddress },
        },
      },
    });

    return resp.data?.swaps?.nodes[0] ?? null;
  }
}

import {
  Client as GqlClient,
  cacheExchange,
  fetchExchange,
  AnyVariables,
  DocumentInput,
} from '@urql/core';
import { retryExchange } from '@urql/exchange-retry';
import { ProcessingPallets } from './types';
import { ProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BlockHeader } from '@subsquid/substrate-processor';

export class QueriesHelper {
  private gqlClient: GqlClient | null = null;
  private gqlClientUrlsMap: Map<ProcessingPallets, string>;
  private gqlClients: Map<ProcessingPallets, GqlClient> = new Map();

  constructor({ batchCtx }: { batchCtx: ProcessorContext<Store> }) {
    this.gqlClientUrlsMap = new Map([
      [
        ProcessingPallets.XYK,
        batchCtx.appConfig.HYDRATION_STORAGE_DICTIONARY_XYKPOOL_URL,
      ],
      [
        ProcessingPallets.LBP,
        batchCtx.appConfig.HYDRATION_STORAGE_DICTIONARY_LBPPOOL_URL,
      ],
      [
        ProcessingPallets.OMNIPOOL,
        batchCtx.appConfig.HYDRATION_STORAGE_DICTIONARY_OMNIPOOL_URL,
      ],
      [
        ProcessingPallets.STABLESWAP,
        batchCtx.appConfig.HYDRATION_STORAGE_DICTIONARY_STABLEPOOL_URL,
      ],
    ]);
  }

  getGqlClient(clientName: ProcessingPallets): GqlClient {
    if (this.gqlClients.has(clientName) && !!this.gqlClients.get(clientName))
      return this.gqlClients.get(clientName)!;

    const retryOptions = {
      initialDelayMs: 1000,
      maxDelayMs: 15000,
      randomDelay: true,
      maxNumberAttempts: 2,
      retryIf: (err: any) => err && err.networkError,
    };

    const client = new GqlClient({
      url: this.gqlClientUrlsMap.get(clientName)!,
      exchanges: [fetchExchange, retryExchange(retryOptions)],
    });

    this.gqlClients.set(clientName, client);
    return client;
  }

  protected dictionaryGqlRequest<
    Data = any,
    Variables extends AnyVariables = AnyVariables,
  >({
    query,
    variables,
    dictName,
  }: {
    query: DocumentInput<Data, Variables>;
    variables: Variables;
    dictName: ProcessingPallets;
  }) {
    return this.getGqlClient(dictName).query(query, variables);
  }

  async *fetchAllPages<R = []>({
    requestPromise,
    limit,
  }: {
    requestPromise: (args: {
      pageSize: number;
      offset: number;
    }) => Promise<{ totalCount: number; data: R }>;
    limit: number;
  }) {
    const pageSize = limit;
    let offset = 0;
    let totalCount = Infinity; // Set to a high number initially to enter the loop

    while (offset < totalCount) {
      const responseWithTotal = await requestPromise({ pageSize, offset });

      yield responseWithTotal.data;

      totalCount = responseWithTotal.totalCount;
      offset += pageSize;
    }
  }

  protected getGenericFilterParams<T>(
    filtersSrc: Map<number, { blockHeader: BlockHeader; ids: Set<T> }>
  ) {
    const resp: { ids: T[]; fromBlockNumber: number; toBlockNumber: number } = {
      ids: [],
      fromBlockNumber: 0,
      toBlockNumber: 0,
    };
    filtersSrc.forEach((blockScope, blockNumber) => {
      resp.ids.push(...blockScope.ids.values());
      if (
        resp.fromBlockNumber === 0 ||
        (resp.fromBlockNumber !== 0 && blockNumber < resp.fromBlockNumber)
      )
        resp.fromBlockNumber = blockNumber;

      if (
        resp.toBlockNumber === 0 ||
        (resp.toBlockNumber !== 0 && blockNumber > resp.toBlockNumber)
      )
        resp.toBlockNumber = blockNumber;
    });

    return { ...resp, ids: [...new Set(resp.ids).values()] };
  }
}

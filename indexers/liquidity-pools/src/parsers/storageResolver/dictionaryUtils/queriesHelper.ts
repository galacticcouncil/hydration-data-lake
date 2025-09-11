import {
  Client as GqlClient,
  cacheExchange,
  fetchExchange,
  AnyVariables,
  DocumentInput,
  Exchange,
} from '@urql/core';
import { retryExchange } from '@urql/exchange-retry';
import { ProcessingTopic } from './types';
import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BlockHeader } from '@subsquid/substrate-processor';
import { pipe, tap, map } from 'wonka';
import { AppConfig } from '../../../appConfig';

const responsePreprocessingExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    return pipe(
      forward(ops$),
      map((result) => {
        if (result.error) {
          console.log(
            (result.operation.context.fetchOptions as RequestInit)?.headers
          );
          console.error(
            // @ts-ignore
            `Storage dictionary [${(result.operation.context.fetchOptions as RequestInit)?.headers?.ProcessingTopic}] GraphQL Error:`,
            result.error.message
          );
        }

        return result;
      })

      // tap((result) => {
      //   if ((result.operation.context.fetchOptions as RequestInit)?.headers?['dictionary-response-compression'] === 'full') {
      //     // TODO do decompression of response here
      //   }
      //
      //   if (result.error) {
      //     console.error(
      //       'Storage dictionary GraphQL Error:',
      //       result.error.message
      //     );
      //   }
      // })
    );
  };

export class QueriesHelper {
  private gqlClient: GqlClient | null = null;
  private gqlClientUrlsMap: Map<ProcessingTopic, string>;
  private gqlClients: Map<ProcessingTopic, GqlClient> = new Map();

  constructor({ appConfig }: { appConfig: AppConfig }) {
    this.gqlClientUrlsMap = new Map([
      [ProcessingTopic.XYK, appConfig.STORAGE_DICTIONARY_XYKPOOL_URL],
      [ProcessingTopic.LBP, appConfig.STORAGE_DICTIONARY_LBPPOOL_URL],
      [ProcessingTopic.OMNIPOOL, appConfig.STORAGE_DICTIONARY_OMNIPOOL_URL],
      [ProcessingTopic.STABLESWAP, appConfig.STORAGE_DICTIONARY_STABLEPOOL_URL],
      [
        ProcessingTopic.MM_AGGREGATOR_ORACLE,
        appConfig.STORAGE_DICTIONARY_STABLEPOOL_URL,
      ],
      [ProcessingTopic.AAVE, appConfig.STORAGE_DICTIONARY_GEN_HIST_DATA_URL],
      [
        ProcessingTopic.ASSET_HIST_DATA,
        appConfig.STORAGE_DICTIONARY_GEN_HIST_DATA_URL,
      ],
      [
        ProcessingTopic.EMA_ORACLE,
        appConfig.STORAGE_DICTIONARY_GEN_HIST_DATA_URL,
      ],
      [
        ProcessingTopic.GENERIC_HIST_DATA,
        appConfig.STORAGE_DICTIONARY_GEN_HIST_DATA_URL,
      ],
      [
        ProcessingTopic.ACCOUNT_ASSET_BALANCE_HIST_DATA,
        appConfig.STORAGE_DICTIONARY_ACCOUNT_HIST_DATA_URL,
      ],
      [
        ProcessingTopic.ACCOUNT_MM_POSITION_HIST_DATA,
        appConfig.STORAGE_DICTIONARY_ACCOUNT_HIST_DATA_URL,
      ],
    ]);
  }

  getGqlClient(clientName: ProcessingTopic): GqlClient {
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
      fetchOptions: {
        headers: {
          ProcessingTopic: clientName,
        },
      },
      exchanges: [
        retryExchange(retryOptions),
        responsePreprocessingExchange,
        fetchExchange,
      ],
    });

    this.gqlClients.set(clientName, client);
    return client;
  }

  dictionaryGqlRequest<
    Data = any,
    Variables extends AnyVariables = AnyVariables,
  >({
    query,
    variables,
    dictName,
  }: {
    query: DocumentInput<Data, Variables>;
    variables: Variables;
    dictName: ProcessingTopic;
  }) {
    return this.getGqlClient(dictName).query(query, variables);
  }

  async *fetchAllPages<R = []>({
    requestPromise,
    limit,
    topic,
  }: {
    requestPromise: (args: {
      pageSize: number;
      offset: number;
      topic: ProcessingTopic;
    }) => Promise<{ totalCount: number; data: R }>;
    limit: number;
    topic: ProcessingTopic;
  }) {
    const pageSize = limit;
    let offset = 0;
    let totalCount = Infinity; // Set to a high number initially to enter the loop

    while (offset < totalCount) {
      const responseWithTotal = await requestPromise({
        pageSize,
        offset,
        topic,
      });

      yield responseWithTotal.data;

      totalCount = responseWithTotal.totalCount;
      offset += pageSize;
    }
  }

  getGenericFilterParams<T>(
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

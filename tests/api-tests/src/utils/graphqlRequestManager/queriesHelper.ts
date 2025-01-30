import {
  Client as GqlClient,
  cacheExchange,
  fetchExchange,
  AnyVariables,
  DocumentInput,
} from '@urql/core';
import { retryExchange } from '@urql/exchange-retry';

export class QueriesHelper {
  private gqlClient: GqlClient | null = null;
  private readonly gqlClientUrl: string;

  constructor() {
    this.gqlClientUrl = process.env.GRAPHQL_API_URL || '';
  }

  getGqlClient(): GqlClient {
    if (this.gqlClient) return this.gqlClient;

    const retryOptions = {
      initialDelayMs: 1000,
      maxDelayMs: 15000,
      randomDelay: true,
      maxNumberAttempts: 2,
      retryIf: (err: any) => err && err.networkError,
    };

    const client = new GqlClient({
      url: this.gqlClientUrl,
      exchanges: [fetchExchange, retryExchange(retryOptions)],
    });

    this.gqlClient = client;
    return client;
  }

  protected gqlRequest<
    Data = any,
    Variables extends AnyVariables = AnyVariables,
  >({
    query,
    variables,
  }: {
    query: DocumentInput<Data, Variables>;
    variables: Variables;
  }) {
    return this.getGqlClient().query(query, variables);
  }
}

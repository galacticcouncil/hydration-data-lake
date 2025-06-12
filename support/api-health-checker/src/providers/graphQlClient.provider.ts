import { Injectable, Provider } from '@nestjs/common';
import {
  AnyVariables,
  Client as GqlClient,
  DocumentInput,
  fetchExchange,
} from '@urql/core';
import { retryExchange } from '@urql/exchange-retry';
import { AppConfig } from '../config.module';

@Injectable()
export class GraphQlClientProvider {
  private gqlClient: GqlClient | null = null;

  constructor(private appConfig: AppConfig) {}

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
      url: this.appConfig.INDEXER_GRAPHQL_API_URL,
      exchanges: [fetchExchange, retryExchange(retryOptions)],
    });

    this.gqlClient = client;
    return client;
  }

  gqlRequest<Data = any, Variables extends AnyVariables = AnyVariables>({
    query,
    variables,
  }: {
    query: DocumentInput<Data, Variables>;
    variables: Variables;
  }) {
    return this.getGqlClient().query(query, variables);
  }
}

export const GraphQlClientProviderToken = 'GraphQlClientProviderToken';

export const GraphQlClientProviderFactory: Provider = {
  provide: GraphQlClientProviderToken,
  useClass: GraphQlClientProvider,
};

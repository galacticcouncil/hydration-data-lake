import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import {
  GraphQlClientProvider,
  GraphQlClientProviderToken,
} from '../../providers/graphQlClient.provider';
import { BroadcastSwappedEventParams } from '../../types/events';
import { EventMetadata } from '../../types/queueJob';
import {
  GetAccountData,
  GetAccountDataQuery,
  GetAccountDataQueryVariables,
  GetBroadcastSwappedEventData,
  GetBroadcastSwappedEventDataQuery,
  GetBroadcastSwappedEventDataQueryVariables,
  GetMoneyMarketEventBorrowData,
  GetMoneyMarketEventBorrowDataQuery,
  GetMoneyMarketEventBorrowDataQueryVariables,
  GetMoneyMarketEventSupplyData,
  GetMoneyMarketEventSupplyDataQuery,
  GetMoneyMarketEventSupplyDataQueryVariables,
  GetProcessorStatusData,
  GetProcessorStatusDataQuery,
  GetProcessorStatusDataQueryVariables,
} from './apiTypes/index';
import { MmSupplyEventParams } from '../../utils/evmTools/types';

@Injectable()
export class IndexerApiService {
  constructor(
    @Inject(GraphQlClientProviderToken)
    private readonly graphQlClientProvider: GraphQlClientProvider,
  ) {}

  async getIndexerLatestProcessedBlockData() {
    try {
      const response = await this.graphQlClientProvider.gqlRequest<
        GetProcessorStatusDataQuery,
        GetProcessorStatusDataQueryVariables
      >({
        query: GetProcessorStatusData,
        variables: {
          filter: {
            id: { equalTo: '1' },
          },
        },
      });

      if (response.data?.processorStatuses?.nodes.length > 0)
        return response.data.processorStatuses.nodes;

      return null;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getAccountData({ boundEvmAddress }: { boundEvmAddress: string }) {
    try {
      const response = await this.graphQlClientProvider.gqlRequest<
        GetAccountDataQuery,
        GetAccountDataQueryVariables
      >({
        query: GetAccountData,
        variables: {
          filter: {
            boundEvmAddress: { equalTo: boundEvmAddress },
          },
        },
      });

      if (response.data?.accounts?.nodes.length > 0)
        return response.data.accounts.nodes;

      return null;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getBroadcastSwappedEventIndexerData({
    onChainEventPayload,
    onChainEventMeta,
  }: {
    onChainEventPayload: BroadcastSwappedEventParams;
    onChainEventMeta: EventMetadata;
  }) {
    try {
      const response = await this.graphQlClientProvider.gqlRequest<
        GetBroadcastSwappedEventDataQuery,
        GetBroadcastSwappedEventDataQueryVariables
      >({
        query: GetBroadcastSwappedEventData,
        variables: {
          filter: {
            paraBlockHeight: { equalTo: onChainEventMeta.blockHeight },
            name: { equalTo: onChainEventMeta.eventName },
            args: { includes: onChainEventPayload.swapper },
            and: [
              {
                args: { includes: onChainEventPayload.filler },
              },
              {
                args: { includes: onChainEventPayload.operation },
              },
              ...(onChainEventPayload.operationStack &&
              onChainEventPayload.operationStack.length > 0
                ? [
                    {
                      args: {
                        includes: `${
                          onChainEventPayload.operationStack[
                            onChainEventPayload.operationStack.length - 1
                          ].value
                        }`,
                      },
                    },
                  ]
                : [{}]),
              ...onChainEventPayload.inputs.map((input) => ({
                args: { includes: input.amount.toString() },
              })),
              ...onChainEventPayload.outputs.map((output) => ({
                args: { includes: output.amount.toString() },
              })),
            ],
          },
        },
      });

      if (response.data?.events?.nodes.length > 0)
        return response.data.events.nodes;

      return null;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getMoneyMarketEventSupplyIndexerData({
    accountSubstrateAddress,
    onChainEventPayload,
    onChainEventMeta,
  }: {
    accountSubstrateAddress: string;
    onChainEventPayload: MmSupplyEventParams;
    onChainEventMeta: EventMetadata;
  }) {
    try {
      const response = await this.graphQlClientProvider.gqlRequest<
        GetMoneyMarketEventSupplyDataQuery,
        GetMoneyMarketEventSupplyDataQueryVariables
      >({
        query: GetMoneyMarketEventSupplyData,
        variables: {
          filter: {
            paraBlockHeight: { equalTo: onChainEventMeta.blockHeight },
            eventName: { equalTo: onChainEventPayload.eventName },
            allInvolvedParticipants: {
              contains: [accountSubstrateAddress],
            },
          },
        },
      });

      if (response.data?.moneyMarketEvents?.nodes.length > 0)
        return response.data.moneyMarketEvents.nodes;

      return null;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getMoneyMarketEventBorrowIndexerData({
    accountSubstrateAddress,
    onChainEventPayload,
    onChainEventMeta,
  }: {
    accountSubstrateAddress: string;
    onChainEventPayload: MmSupplyEventParams;
    onChainEventMeta: EventMetadata;
  }) {
    try {
      const response = await this.graphQlClientProvider.gqlRequest<
        GetMoneyMarketEventBorrowDataQuery,
        GetMoneyMarketEventBorrowDataQueryVariables
      >({
        query: GetMoneyMarketEventBorrowData,
        variables: {
          filter: {
            paraBlockHeight: { equalTo: onChainEventMeta.blockHeight },
            eventName: { equalTo: onChainEventPayload.eventName },
            allInvolvedParticipants: {
              contains: [accountSubstrateAddress],
            },
          },
        },
      });

      if (response.data?.moneyMarketEvents?.nodes.length > 0)
        return response.data.moneyMarketEvents.nodes;

      return null;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}

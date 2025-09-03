import gql from 'graphql-tag';
import {
  AccountFilter,
  EventFilter,
  MoneyMarketEventFilter,
  ProcessorStatusFilter,
} from './index';

export const GET_BROADCAST_SWAPPED_EVENT_DATA = gql`
  query GetBroadcastSwappedEventData($filter: EventFilter) {
    events(filter: $filter) {
      nodes {
        args
        swaps {
          nodes {
            id
            swapper {
              id
            }
            filler {
              id
            }
            operationType
            operationId
            swapInputs {
              nodes {
                assetId
                amount
                asset {
                  assetRegistryId
                }
              }
            }
            swapOutputs {
              nodes {
                assetId
                amount
                asset {
                  assetRegistryId
                }
              }
            }
            swapFees {
              nodes {
                assetId
                amount
                recipientId
                asset {
                  assetRegistryId
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_MONEY_MARKET_EVENT_SUPPLY_DATA = gql`
  query GetMoneyMarketEventSupplyData($filter: MoneyMarketEventFilter) {
    moneyMarketEvents(filter: $filter) {
      nodes {
        eventName
        paraBlockHeight
        supply {
          amount
          asset {
            id
            assetRegistryId
            evmAddress
          }
          account {
            boundEvmAddress
          }
        }
      }
    }
  }
`;
export const GET_MONEY_MARKET_EVENT_BORROW_DATA = gql`
  query GetMoneyMarketEventBorrowData($filter: MoneyMarketEventFilter) {
    moneyMarketEvents(filter: $filter) {
      nodes {
        eventName
        paraBlockHeight
        borrow {
          amount
          asset {
            id
            assetRegistryId
            evmAddress
          }
          account {
            boundEvmAddress
          }
        }
      }
    }
  }
`;

export const GET_ACCOUNT_DATA = gql`
  query GetAccountData($filter: AccountFilter) {
    accounts(filter: $filter) {
      nodes {
        id
      }
    }
  }
`;

export const GET_PROCESSOR_STATUS_DATA = gql`
  query GetProcessorStatusData($filter: ProcessorStatusFilter) {
    processorStatuses(filter: $filter) {
      nodes {
        latestProcessedBlock
      }
    }
  }
`;

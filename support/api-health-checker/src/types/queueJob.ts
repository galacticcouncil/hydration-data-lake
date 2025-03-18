import { BestBlock, BroadcastSwappedEventParams, EventName } from './events';
import {
  MmBorrowEventParams,
  MmSupplyEventParams,
} from '../utils/evmTools/types';

export enum QueueName {
  EVENT_CHECK = 'EVENT_CHECK',
}

export type EventMetadata = {
  uuid: string;
  blockHeight: number;
  blockHash: string;
  timestamp: number;
  eventName: EventName;
  jobExecAttempt: number;
};

export type EventCheckJobPayloadData<T extends EventName> =
  T extends EventName.Broadcast_Swapped
    ? BroadcastSwappedEventParams
    : T extends EventName.BestBlock
      ? BestBlock
      : T extends EventName.MoneyMarket_Supply
        ? MmSupplyEventParams
        : T extends EventName.MoneyMarket_Borrow
          ? MmBorrowEventParams
          : never;

export type EventCheckJobPayload<T extends EventName = any> = {
  meta: EventMetadata;
  payload: EventCheckJobPayloadData<T>;
};

export type EventCheckJobResult = {
  success: boolean;
  message?: string;
  extra?: Record<string, unknown>;
};

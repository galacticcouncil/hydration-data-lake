import { Block, Extrinsic } from '../../../processor';

export * from './evm';
export * from './evmAccounts';
export * from './assetRegistry';

export type EventId = string;

export type EventParsedData<T> = {
  name: string;
  metadata: EventMetadata;
  params: T;
};

export interface EventMetadata {
  id: EventId;
  traceId: string;
  name: string;
  indexInBlock: number;
  blockHeader: Block;
  extrinsic?: Extrinsic;
}

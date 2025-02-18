import {
  MmSupplyEventParams,
  MmTransferEventParams,
} from '../../parsers/types/events';
import { EvmEventName } from '../../model';

export type EvmEventParamsTypeDecorated<N extends EvmEventName> =
  N extends EvmEventName.Transfer
    ? MmTransferEventParams
    : N extends EvmEventName.Supply
      ? MmSupplyEventParams
      : never;

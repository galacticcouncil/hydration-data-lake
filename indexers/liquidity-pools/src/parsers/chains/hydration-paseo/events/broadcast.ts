import { events } from '../typegenTypes';
import { SqdEvent } from '../../../../processor';
import {
  BroadcastSwappedEventParams,
  BroadcastSwappedExecutionType,
} from '../../../types/events';
import { UnknownVersionError } from '../../../../utils/errors';
import {
  SwapFeeDestinationType,
  SwapFillerType,
  TradeOperationType,
} from '../../../../model';
import { SwappedExecutionTypeKind } from '../../../../utils/types';

function parseSwappedParams(event: SqdEvent): BroadcastSwappedEventParams {
  if (events.broadcast.swapped.v282.is(event)) {
    const {
      swapper,
      filler,
      fillerType: fillerTypeRaw,
      inputs,
      outputs,
      fees,
      operation,
      operationStack: operationStackRaw,
    } = events.broadcast.swapped.v282.decode(event);

    const fillerType = {
      kind: fillerTypeRaw.__kind as SwapFillerType,
      // @ts-ignore
      value: fillerTypeRaw.value,
    };
    const operationStack: BroadcastSwappedExecutionType[] =
      operationStackRaw.map((stackItem) => ({
        kind: stackItem.__kind as SwappedExecutionTypeKind,
        value: stackItem.value,
      }));

    return {
      swapper,
      filler,
      fillerType,
      inputs: inputs.map((e) => ({ amount: e.amount, assetId: e.asset })),
      outputs: outputs.map((e) => ({ amount: e.amount, assetId: e.asset })),
      fees: fees.map((e) => ({
        amount: e.amount,
        assetId: e.asset,
        destinationType: e.destination.__kind as SwapFeeDestinationType,
        // @ts-ignore
        recipientId: e.destination.value,
      })),
      operationStack,
      operation: operation.__kind as TradeOperationType,
    };
  }

  throw new UnknownVersionError(event.name);
}

export default { parseSwappedParams };

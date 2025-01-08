import { events } from '../typegenTypes';
import { Event } from '../../../../processor';
import {
  AmmSupportSwappedEventParams,
  AmmSupportSwappedExecutionType,
} from '../../../types/events';
import { UnknownVersionError } from '../../../../utils/errors';
import {
  SwapFillerType,
  SwappedExecutionTypeKind,
  TradeOperationType,
} from '../../../../model';

function parseSwappedParams(event: Event): AmmSupportSwappedEventParams {
  if (events.ammSupport.swapped.v278.is(event)) {
    const {
      swapper,
      filler,
      fillerType: fillerTypeRaw,
      inputs,
      outputs,
      fees,
      operation,
      operationStack: operationStackRaw,
    } = events.ammSupport.swapped.v278.decode(event);

    const fillerType = {
      kind: fillerTypeRaw.__kind as SwapFillerType,
      // @ts-ignore
      value: fillerTypeRaw.value,
    };
    const operationStack: AmmSupportSwappedExecutionType[] =
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
        recipientId: e.recipient,
      })),
      operationStack,
      operation: operation.__kind as TradeOperationType,
    };
  }

  throw new UnknownVersionError(event.name);
}

export default { parseSwappedParams };

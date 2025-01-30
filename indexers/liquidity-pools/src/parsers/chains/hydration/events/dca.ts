import { events } from '../typegenTypes';
import { SqdEvent } from '../../../../processor';
import {
  DcaCompletedEventParams,
  DcaExecutionPlannedEventParams,
  DcaRandomnessGenerationFailedEventParams,
  DcaScheduledEventParams,
  DcaTerminatedEventParams,
  DcaTradeExecutedEventParams,
  DcaTradeFailedEventParams,
} from '../../../types/events';
import { UnknownVersionError } from '../../../../utils/errors';

function parseScheduledParams(event: SqdEvent): DcaScheduledEventParams {
  if (events.dca.scheduled.v160.is(event)) {
    const { id, who } = events.dca.scheduled.v160.decode(event);
    return {
      id,
      who,
    };
  }

  if (events.dca.scheduled.v201.is(event)) {
    const { id, who } = events.dca.scheduled.v201.decode(event);

    return {
      id,
      who,
    };
  }

  throw new UnknownVersionError(event.name);
}

function parseExecutionPlannedParams(
  event: SqdEvent
): DcaExecutionPlannedEventParams {
  if (events.dca.executionPlanned.v160.is(event)) {
    const {
      id,
      who,
      block: blockNumber,
    } = events.dca.executionPlanned.v160.decode(event);
    return {
      id,
      who,
      blockNumber,
    };
  }

  throw new UnknownVersionError(event.name);
}

function parseTradeExecutedParams(
  event: SqdEvent
): DcaTradeExecutedEventParams {
  if (events.dca.tradeExecuted.v160.is(event)) {
    const { id, who, amountIn, amountOut } =
      events.dca.tradeExecuted.v160.decode(event);
    return {
      id,
      who,
      amountIn,
      amountOut,
    };
  }

  throw new UnknownVersionError(event.name);
}

function parseTradeFailedParams(event: SqdEvent): DcaTradeFailedEventParams {
  if (events.dca.tradeFailed.v160.is(event)) {
    const { id, who, error } = events.dca.tradeFailed.v160.decode(event);
    return {
      id,
      who,
      // @ts-ignore
      error,
    };
  }
  if (events.dca.tradeFailed.v205.is(event)) {
    const { id, who, error } = events.dca.tradeFailed.v205.decode(event);
    return {
      id,
      who,
      // @ts-ignore
      error,
    };
  }

  throw new UnknownVersionError(event.name);
}

function parseTerminatedParams(event: SqdEvent): DcaTerminatedEventParams {
  if (events.dca.terminated.v160.is(event)) {
    const { id, who, error } = events.dca.terminated.v160.decode(event);
    return {
      id,
      who,
      // @ts-ignore
      error,
    };
  }
  if (events.dca.terminated.v205.is(event)) {
    const { id, who, error } = events.dca.terminated.v205.decode(event);
    return {
      id,
      who,
      // @ts-ignore
      error,
    };
  }

  throw new UnknownVersionError(event.name);
}

function parseCompletedParams(event: SqdEvent): DcaCompletedEventParams {
  if (events.dca.completed.v160.is(event)) {
    const { id, who } = events.dca.completed.v160.decode(event);
    return {
      id,
      who,
    };
  }

  throw new UnknownVersionError(event.name);
}

function parseRandomnessGenerationFailedParams(
  event: SqdEvent
): DcaRandomnessGenerationFailedEventParams {
  if (events.dca.randomnessGenerationFailed.v160.is(event)) {
    const { block, error } =
      events.dca.randomnessGenerationFailed.v160.decode(event);
    return {
      block,
      // @ts-ignore
      error,
    };
  }

  if (events.dca.randomnessGenerationFailed.v205.is(event)) {
    const { block, error } =
      events.dca.randomnessGenerationFailed.v205.decode(event);
    return {
      block,
      // @ts-ignore
      error,
    };
  }

  throw new UnknownVersionError(event.name);
}

export default {
  parseScheduledParams,
  parseExecutionPlannedParams,
  parseTradeExecutedParams,
  parseTradeFailedParams,
  parseTerminatedParams,
  parseCompletedParams,
  parseRandomnessGenerationFailedParams,
};

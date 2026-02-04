import { events } from '../typegenTypes';
import { SqdEvent } from '../../../../processor';
import {
  XykBuyExecutedEventParams,
  XykLiquidityAddedEventParams,
  XykLiquidityRemovedEventParams,
  XykPoolCreatedEventParams,
  XykPoolDestroyedEventParams,
  XykSellExecutedEventParams,
} from '../../../types/events';
import { UnknownVersionError } from '../../../../utils/errors';

function parsePoolCreatedParams(event: SqdEvent): XykPoolCreatedEventParams {
  if (events.xyk.poolCreated.v347.is(event)) {
    return events.xyk.poolCreated.v347.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parsePoolDestroyedParams(
  event: SqdEvent
): XykPoolDestroyedEventParams {
  if (events.xyk.poolDestroyed.v347.is(event)) {
    return events.xyk.poolDestroyed.v347.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseBuyExecutedParams(event: SqdEvent): XykBuyExecutedEventParams {
  if (events.xyk.buyExecuted.v347.is(event)) {
    return events.xyk.buyExecuted.v347.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseSellExecutedParams(event: SqdEvent): XykSellExecutedEventParams {
  if (events.xyk.sellExecuted.v347.is(event)) {
    return events.xyk.sellExecuted.v347.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseLiquidityAddedParams(
  event: SqdEvent
): XykLiquidityAddedEventParams {
  if (events.xyk.liquidityAdded.v347.is(event)) {
    return events.xyk.liquidityAdded.v347.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseLiquidityRemovedParams(
  event: SqdEvent
): XykLiquidityRemovedEventParams {
  if (events.xyk.liquidityRemoved.v347.is(event)) {
    return events.xyk.liquidityRemoved.v347.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

export default {
  parsePoolCreatedParams,
  parsePoolDestroyedParams,
  parseBuyExecutedParams,
  parseSellExecutedParams,
  parseLiquidityAddedParams,
  parseLiquidityRemovedParams,
};

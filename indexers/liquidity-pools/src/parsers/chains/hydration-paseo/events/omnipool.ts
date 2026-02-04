import { events } from '../typegenTypes';
import { SqdEvent } from '../../../../processor';
import {
  OmnipoolBuyExecutedEventParams,
  OmnipoolLiquidityAddedEventParams,
  OmnipoolLiquidityRemovedEventParams,
  OmnipoolPositionCreatedEventParams,
  OmnipoolPositionDestroyedEventParams,
  OmnipoolPositionUpdatedEventParams,
  OmnipoolSellExecutedEventParams,
  OmnipoolTokenAddedEventParams,
  OmnipoolTokenRemovedEventParams,
} from '../../../types/events';
import { UnknownVersionError } from '../../../../utils/errors';

function parseTokenAddedParams(event: SqdEvent): OmnipoolTokenAddedEventParams {
  if (events.omnipool.tokenAdded.v347.is(event)) {
    return events.omnipool.tokenAdded.v347.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseTokenRemovedParams(
  event: SqdEvent
): OmnipoolTokenRemovedEventParams {
  if (events.omnipool.tokenRemoved.v347.is(event)) {
    return events.omnipool.tokenRemoved.v347.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseBuyExecutedParams(
  event: SqdEvent
): OmnipoolBuyExecutedEventParams {
  if (events.omnipool.buyExecuted.v347.is(event)) {
    return events.omnipool.buyExecuted.v347.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseSellExecutedParams(
  event: SqdEvent
): OmnipoolSellExecutedEventParams {
  if (events.omnipool.sellExecuted.v347.is(event)) {
    return events.omnipool.sellExecuted.v347.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseLiquidityAddedParams(
  event: SqdEvent
): OmnipoolLiquidityAddedEventParams {
  if (events.omnipool.liquidityAdded.v347.is(event)) {
    return events.omnipool.liquidityAdded.v347.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseLiquidityRemovedParams(
  event: SqdEvent
): OmnipoolLiquidityRemovedEventParams {
  if (events.omnipool.liquidityRemoved.v347.is(event)) {
    return events.omnipool.liquidityRemoved.v347.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parsePositionCreatedParams(
  event: SqdEvent
): OmnipoolPositionCreatedEventParams {
  if (events.omnipool.positionCreated.v347.is(event)) {
    return events.omnipool.positionCreated.v347.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parsePositionDestroyedParams(
  event: SqdEvent
): OmnipoolPositionDestroyedEventParams {
  if (events.omnipool.positionDestroyed.v347.is(event)) {
    return events.omnipool.positionDestroyed.v347.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parsePositionUpdatedParams(
  event: SqdEvent
): OmnipoolPositionUpdatedEventParams {
  if (events.omnipool.positionUpdated.v347.is(event)) {
    return events.omnipool.positionUpdated.v347.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

export default {
  parseTokenAddedParams,
  parseTokenRemovedParams,
  parseBuyExecutedParams,
  parseSellExecutedParams,
  parseLiquidityAddedParams,
  parseLiquidityRemovedParams,
  parsePositionCreatedParams,
  parsePositionDestroyedParams,
  parsePositionUpdatedParams,
};

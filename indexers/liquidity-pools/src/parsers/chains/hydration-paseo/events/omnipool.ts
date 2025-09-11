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
  if (events.omnipool.tokenAdded.v287.is(event)) {
    return events.omnipool.tokenAdded.v287.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseTokenRemovedParams(
  event: SqdEvent
): OmnipoolTokenRemovedEventParams {
  if (events.omnipool.tokenRemoved.v287.is(event)) {
    return events.omnipool.tokenRemoved.v287.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseBuyExecutedParams(
  event: SqdEvent
): OmnipoolBuyExecutedEventParams {
  if (events.omnipool.buyExecuted.v287.is(event)) {
    return events.omnipool.buyExecuted.v287.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseSellExecutedParams(
  event: SqdEvent
): OmnipoolSellExecutedEventParams {
  if (events.omnipool.sellExecuted.v287.is(event)) {
    return events.omnipool.sellExecuted.v287.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseLiquidityAddedParams(
  event: SqdEvent
): OmnipoolLiquidityAddedEventParams {
  if (events.omnipool.liquidityAdded.v287.is(event)) {
    return events.omnipool.liquidityAdded.v287.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseLiquidityRemovedParams(
  event: SqdEvent
): OmnipoolLiquidityRemovedEventParams {
  if (events.omnipool.liquidityRemoved.v287.is(event)) {
    return events.omnipool.liquidityRemoved.v287.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parsePositionCreatedParams(
  event: SqdEvent
): OmnipoolPositionCreatedEventParams {
  if (events.omnipool.positionCreated.v287.is(event)) {
    return events.omnipool.positionCreated.v287.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parsePositionDestroyedParams(
  event: SqdEvent
): OmnipoolPositionDestroyedEventParams {
  if (events.omnipool.positionDestroyed.v287.is(event)) {
    return events.omnipool.positionDestroyed.v287.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parsePositionUpdatedParams(
  event: SqdEvent
): OmnipoolPositionUpdatedEventParams {
  if (events.omnipool.positionUpdated.v287.is(event)) {
    return events.omnipool.positionUpdated.v287.decode(event);
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

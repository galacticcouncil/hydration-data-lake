import { events } from '../typegenTypes';
import { SqdEvent } from '../../../../processor';
import { UnknownVersionError } from '../../../../utils/errors';
import {
  XykLMDepositDestroyedEventParams,
  XykLMGlobalFarmCreatedEventParams,
  XykLMGlobalFarmTerminatedEventParams,
  XykLMGlobalFarmUpdatedEventParams,
  XykLMRewardClaimedEventParams,
  XykLMSharesDepositedEventParams,
  XykLMSharesRedepositedEventParams,
  XykLMSharesWithdrawnEventParams,
  XykLMYieldFarmCreatedEventParams,
  XykLMYieldFarmResumedEventParams,
  XykLMYieldFarmStoppedEventParams,
  XykLMYieldFarmTerminatedEventParams,
  XykLMYieldFarmUpdatedEventParams,
} from '../../../types/events/xykLiquidityMining';

function parseGlobalFarmCreatedParams(
  event: SqdEvent
): XykLMGlobalFarmCreatedEventParams {
  if (events.xykLiquidityMining.globalFarmCreated.v347.is(event)) {
    return events.xykLiquidityMining.globalFarmCreated.v347.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseGlobalFarmUpdatedParams(
  event: SqdEvent
): XykLMGlobalFarmUpdatedEventParams {
  if (events.xykLiquidityMining.globalFarmUpdated.v347.is(event)) {
    return events.xykLiquidityMining.globalFarmUpdated.v347.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseGlobalFarmTerminatedParams(
  event: SqdEvent
): XykLMGlobalFarmTerminatedEventParams {
  if (events.xykLiquidityMining.globalFarmTerminated.v347.is(event)) {
    return events.xykLiquidityMining.globalFarmTerminated.v347.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseYieldFarmCreatedParams(
  event: SqdEvent
): XykLMYieldFarmCreatedEventParams {
  if (events.xykLiquidityMining.yieldFarmCreated.v347.is(event)) {
    return events.xykLiquidityMining.yieldFarmCreated.v347.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseYieldFarmStopedParams(
  event: SqdEvent
): XykLMYieldFarmStoppedEventParams {
  if (events.xykLiquidityMining.yieldFarmStopped.v347.is(event)) {
    return events.xykLiquidityMining.yieldFarmStopped.v347.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseYieldFarmTerminatedParams(
  event: SqdEvent
): XykLMYieldFarmTerminatedEventParams {
  if (events.xykLiquidityMining.yieldFarmTerminated.v347.is(event)) {
    return events.xykLiquidityMining.yieldFarmTerminated.v347.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseYieldFarmResumedParams(
  event: SqdEvent
): XykLMYieldFarmResumedEventParams {
  if (events.xykLiquidityMining.yieldFarmResumed.v347.is(event)) {
    return events.xykLiquidityMining.yieldFarmResumed.v347.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseYieldFarmUpdatedParams(
  event: SqdEvent
): XykLMYieldFarmUpdatedEventParams {
  if (events.xykLiquidityMining.yieldFarmUpdated.v347.is(event)) {
    return events.xykLiquidityMining.yieldFarmUpdated.v347.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseSharesDepositedParams(
  event: SqdEvent
): XykLMSharesDepositedEventParams {
  if (events.xykLiquidityMining.sharesDeposited.v347.is(event)) {
    return events.xykLiquidityMining.sharesDeposited.v347.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseSharesRedepositedParams(
  event: SqdEvent
): XykLMSharesRedepositedEventParams {
  if (events.xykLiquidityMining.sharesRedeposited.v347.is(event)) {
    return events.xykLiquidityMining.sharesRedeposited.v347.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseSharesWithdrawnParams(
  event: SqdEvent
): XykLMSharesWithdrawnEventParams {
  if (events.xykLiquidityMining.sharesWithdrawn.v347.is(event)) {
    return events.xykLiquidityMining.sharesWithdrawn.v347.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseDepositDestroyedParams(
  event: SqdEvent
): XykLMDepositDestroyedEventParams {
  if (events.xykLiquidityMining.depositDestroyed.v347.is(event)) {
    return events.xykLiquidityMining.depositDestroyed.v347.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseRewardClaimedParams(
  event: SqdEvent
): XykLMRewardClaimedEventParams {
  if (events.xykLiquidityMining.rewardClaimed.v347.is(event)) {
    return events.xykLiquidityMining.rewardClaimed.v347.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

export default {
  parseGlobalFarmCreatedParams,
  parseGlobalFarmUpdatedParams,
  parseGlobalFarmTerminatedParams,
  parseYieldFarmCreatedParams,
  parseYieldFarmStopedParams,
  parseYieldFarmTerminatedParams,
  parseYieldFarmResumedParams,
  parseYieldFarmUpdatedParams,
  parseSharesDepositedParams,
  parseSharesRedepositedParams,
  parseSharesWithdrawnParams,
  parseDepositDestroyedParams,
  parseRewardClaimedParams,
};

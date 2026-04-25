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
  if (events.xykLiquidityMining.globalFarmCreated.v405.is(event)) {
    return events.xykLiquidityMining.globalFarmCreated.v405.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseGlobalFarmUpdatedParams(
  event: SqdEvent
): XykLMGlobalFarmUpdatedEventParams {
  if (events.xykLiquidityMining.globalFarmUpdated.v405.is(event)) {
    return events.xykLiquidityMining.globalFarmUpdated.v405.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseGlobalFarmTerminatedParams(
  event: SqdEvent
): XykLMGlobalFarmTerminatedEventParams {
  if (events.xykLiquidityMining.globalFarmTerminated.v405.is(event)) {
    return events.xykLiquidityMining.globalFarmTerminated.v405.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseYieldFarmCreatedParams(
  event: SqdEvent
): XykLMYieldFarmCreatedEventParams {
  if (events.xykLiquidityMining.yieldFarmCreated.v405.is(event)) {
    return events.xykLiquidityMining.yieldFarmCreated.v405.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseYieldFarmStopedParams(
  event: SqdEvent
): XykLMYieldFarmStoppedEventParams {
  if (events.xykLiquidityMining.yieldFarmStopped.v405.is(event)) {
    return events.xykLiquidityMining.yieldFarmStopped.v405.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseYieldFarmTerminatedParams(
  event: SqdEvent
): XykLMYieldFarmTerminatedEventParams {
  if (events.xykLiquidityMining.yieldFarmTerminated.v405.is(event)) {
    return events.xykLiquidityMining.yieldFarmTerminated.v405.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseYieldFarmResumedParams(
  event: SqdEvent
): XykLMYieldFarmResumedEventParams {
  if (events.xykLiquidityMining.yieldFarmResumed.v405.is(event)) {
    return events.xykLiquidityMining.yieldFarmResumed.v405.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseYieldFarmUpdatedParams(
  event: SqdEvent
): XykLMYieldFarmUpdatedEventParams {
  if (events.xykLiquidityMining.yieldFarmUpdated.v405.is(event)) {
    return events.xykLiquidityMining.yieldFarmUpdated.v405.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseSharesDepositedParams(
  event: SqdEvent
): XykLMSharesDepositedEventParams {
  if (events.xykLiquidityMining.sharesDeposited.v405.is(event)) {
    return events.xykLiquidityMining.sharesDeposited.v405.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseSharesRedepositedParams(
  event: SqdEvent
): XykLMSharesRedepositedEventParams {
  if (events.xykLiquidityMining.sharesRedeposited.v405.is(event)) {
    return events.xykLiquidityMining.sharesRedeposited.v405.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseSharesWithdrawnParams(
  event: SqdEvent
): XykLMSharesWithdrawnEventParams {
  if (events.xykLiquidityMining.sharesWithdrawn.v405.is(event)) {
    return events.xykLiquidityMining.sharesWithdrawn.v405.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseDepositDestroyedParams(
  event: SqdEvent
): XykLMDepositDestroyedEventParams {
  if (events.xykLiquidityMining.depositDestroyed.v405.is(event)) {
    return events.xykLiquidityMining.depositDestroyed.v405.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseRewardClaimedParams(
  event: SqdEvent
): XykLMRewardClaimedEventParams {
  if (events.xykLiquidityMining.rewardClaimed.v405.is(event)) {
    return events.xykLiquidityMining.rewardClaimed.v405.decode(event);
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

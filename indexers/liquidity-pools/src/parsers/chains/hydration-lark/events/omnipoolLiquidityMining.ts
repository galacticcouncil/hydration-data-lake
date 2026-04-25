import { events } from '../typegenTypes';
import { SqdEvent } from '../../../../processor';
import {
  OmnipoolLMDepositDestroyedEventParams,
  OmnipoolLMGlobalFarmCreatedEventParams,
  OmnipoolLMGlobalFarmTerminatedEventParams,
  OmnipoolLMGlobalFarmUpdatedEventParams,
  OmnipoolLMRewardClaimedEventParams,
  OmnipoolLMSharesDepositedEventParams,
  OmnipoolLMSharesRedepositedEventParams,
  OmnipoolLMSharesWithdrawnEventParams,
  OmnipoolLMYieldFarmCreatedEventParams,
  OmnipoolLMYieldFarmResumedEventParams,
  OmnipoolLMYieldFarmStoppedEventParams,
  OmnipoolLMYieldFarmTerminatedEventParams,
  OmnipoolLMYieldFarmUpdatedEventParams,
} from '../../../types/events';
import { UnknownVersionError } from '../../../../utils/errors';

function parseGlobalFarmCreatedParams(
  event: SqdEvent
): OmnipoolLMGlobalFarmCreatedEventParams {
  if (events.omnipoolLiquidityMining.globalFarmCreated.v405.is(event)) {
    return events.omnipoolLiquidityMining.globalFarmCreated.v405.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseGlobalFarmUpdatedParams(
  event: SqdEvent
): OmnipoolLMGlobalFarmUpdatedEventParams {
  if (events.omnipoolLiquidityMining.globalFarmUpdated.v405.is(event)) {
    return events.omnipoolLiquidityMining.globalFarmUpdated.v405.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseGlobalFarmTerminatedParams(
  event: SqdEvent
): OmnipoolLMGlobalFarmTerminatedEventParams {
  if (events.omnipoolLiquidityMining.globalFarmTerminated.v405.is(event)) {
    return events.omnipoolLiquidityMining.globalFarmTerminated.v405.decode(
      event
    );
  }

  throw new UnknownVersionError(event.name);
}

function parseYieldFarmCreatedParams(
  event: SqdEvent
): OmnipoolLMYieldFarmCreatedEventParams {
  if (events.omnipoolLiquidityMining.yieldFarmCreated.v405.is(event)) {
    return events.omnipoolLiquidityMining.yieldFarmCreated.v405.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseYieldFarmStoppedParams(
  event: SqdEvent
): OmnipoolLMYieldFarmStoppedEventParams {
  if (events.omnipoolLiquidityMining.yieldFarmStopped.v405.is(event)) {
    return events.omnipoolLiquidityMining.yieldFarmStopped.v405.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseYieldFarmResumedParams(
  event: SqdEvent
): OmnipoolLMYieldFarmResumedEventParams {
  if (events.omnipoolLiquidityMining.yieldFarmResumed.v405.is(event)) {
    return events.omnipoolLiquidityMining.yieldFarmResumed.v405.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseYieldFarmUpdatedParams(
  event: SqdEvent
): OmnipoolLMYieldFarmUpdatedEventParams {
  if (events.omnipoolLiquidityMining.yieldFarmUpdated.v405.is(event)) {
    return events.omnipoolLiquidityMining.yieldFarmUpdated.v405.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseYieldFarmTerminatedParams(
  event: SqdEvent
): OmnipoolLMYieldFarmTerminatedEventParams {
  if (events.omnipoolLiquidityMining.yieldFarmTerminated.v405.is(event)) {
    return events.omnipoolLiquidityMining.yieldFarmTerminated.v405.decode(
      event
    );
  }

  throw new UnknownVersionError(event.name);
}

function parseSharesDepositedParams(
  event: SqdEvent
): OmnipoolLMSharesDepositedEventParams {
  if (events.omnipoolLiquidityMining.sharesDeposited.v405.is(event)) {
    return events.omnipoolLiquidityMining.sharesDeposited.v405.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseSharesRedepositedParams(
  event: SqdEvent
): OmnipoolLMSharesRedepositedEventParams {
  if (events.omnipoolLiquidityMining.sharesRedeposited.v405.is(event)) {
    return events.omnipoolLiquidityMining.sharesRedeposited.v405.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseRewardClaimedParams(
  event: SqdEvent
): OmnipoolLMRewardClaimedEventParams {
  if (events.omnipoolLiquidityMining.rewardClaimed.v405.is(event)) {
    return events.omnipoolLiquidityMining.rewardClaimed.v405.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseSharesWithdrawnParams(
  event: SqdEvent
): OmnipoolLMSharesWithdrawnEventParams {
  if (events.omnipoolLiquidityMining.sharesWithdrawn.v405.is(event)) {
    return events.omnipoolLiquidityMining.sharesWithdrawn.v405.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseDepositDestroyedParams(
  event: SqdEvent
): OmnipoolLMDepositDestroyedEventParams {
  if (events.omnipoolLiquidityMining.depositDestroyed.v405.is(event)) {
    return events.omnipoolLiquidityMining.depositDestroyed.v405.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

export default {
  parseGlobalFarmCreatedParams,
  parseGlobalFarmUpdatedParams,
  parseGlobalFarmTerminatedParams,
  parseYieldFarmCreatedParams,
  parseYieldFarmStoppedParams,
  parseYieldFarmResumedParams,
  parseYieldFarmUpdatedParams,
  parseYieldFarmTerminatedParams,
  parseSharesDepositedParams,
  parseSharesRedepositedParams,
  parseRewardClaimedParams,
  parseSharesWithdrawnParams,
  parseDepositDestroyedParams,
};

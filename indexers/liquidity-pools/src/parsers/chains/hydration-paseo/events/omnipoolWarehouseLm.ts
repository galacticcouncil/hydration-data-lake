import { events } from '../typegenTypes';
import { SqdEvent } from '../../../../processor';
import {
  OmnipoolWarehouseLMAllRewardsDistributedEventParams,
  OmnipoolWarehouseLMGlobalFarmAccRPZUpdatedEventParams,
  OmnipoolWarehouseLMYieldFarmAccRPVSUpdatedEventParams,
} from '../../../types/events';
import { UnknownVersionError } from '../../../../utils/errors';

function parseWarehouseLMGlobalFarmAccRPZUpdatedParams(
  event: SqdEvent
): OmnipoolWarehouseLMGlobalFarmAccRPZUpdatedEventParams {
  if (events.omnipoolWarehouseLm.globalFarmAccRpzUpdated.v347.is(event)) {
    return events.omnipoolWarehouseLm.globalFarmAccRpzUpdated.v347.decode(
      event
    );
  }

  throw new UnknownVersionError(event.name);
}

function parseYieldFarmAccRPVSUpdatedParams(
  event: SqdEvent
): OmnipoolWarehouseLMYieldFarmAccRPVSUpdatedEventParams {
  if (events.omnipoolWarehouseLm.yieldFarmAccRpvsUpdated.v347.is(event)) {
    return events.omnipoolWarehouseLm.yieldFarmAccRpvsUpdated.v347.decode(
      event
    );
  }

  throw new UnknownVersionError(event.name);
}

function parseAllRewardsDistributedParams(
  event: SqdEvent
): OmnipoolWarehouseLMAllRewardsDistributedEventParams {
  if (events.omnipoolWarehouseLm.allRewardsDistributed.v347.is(event)) {
    return events.omnipoolWarehouseLm.allRewardsDistributed.v347.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

export default {
  parseWarehouseLMGlobalFarmAccRPZUpdatedParams,
  parseYieldFarmAccRPVSUpdatedParams,
  parseAllRewardsDistributedParams,
};

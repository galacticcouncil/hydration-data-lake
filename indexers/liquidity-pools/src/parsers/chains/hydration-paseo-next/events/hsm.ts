import { SqdEvent } from '../../../../processor';
import {
  HsmCollateralAddedEventParams,
  HsmCollateralRemovedEventParams,
  HsmCollateralUpdatedEventParams,
} from '../../../types/events';
import { events } from '../typegenTypes';
import { UnknownVersionError } from '../../../../utils/errors';

function parseCollateralAddedParams(
  event: SqdEvent
): HsmCollateralAddedEventParams {
  if (events.hsm.collateralAdded.v324.is(event)) {
    return events.hsm.collateralAdded.v324.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseCollateralRemovedParams(
  event: SqdEvent
): HsmCollateralRemovedEventParams {
  if (events.hsm.collateralRemoved.v324.is(event)) {
    return events.hsm.collateralRemoved.v324.decode(event);
  }
  if (events.hsm.collateralRemoved.v337.is(event)) {
    return events.hsm.collateralRemoved.v337.decode(event);
  }
  throw new UnknownVersionError(event.name);
}

function parseCollateralUpdatedParams(
  event: SqdEvent
): HsmCollateralUpdatedEventParams {
  if (events.hsm.collateralUpdated.v324.is(event)) {
    return events.hsm.collateralUpdated.v324.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

export default {
  parseCollateralAddedParams,
  parseCollateralRemovedParams,
  parseCollateralUpdatedParams,
};

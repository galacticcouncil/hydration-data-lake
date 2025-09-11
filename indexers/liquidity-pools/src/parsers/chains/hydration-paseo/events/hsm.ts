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
  throw new UnknownVersionError(event.name);
}

function parseCollateralRemovedParams(
  event: SqdEvent
): HsmCollateralRemovedEventParams {
  throw new UnknownVersionError(event.name);
}

function parseCollateralUpdatedParams(
  event: SqdEvent
): HsmCollateralUpdatedEventParams {
  throw new UnknownVersionError(event.name);
}

export default {
  parseCollateralAddedParams,
  parseCollateralRemovedParams,
  parseCollateralUpdatedParams,
};

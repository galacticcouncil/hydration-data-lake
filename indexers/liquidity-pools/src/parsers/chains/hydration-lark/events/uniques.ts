import { events } from '../typegenTypes';
import { SqdEvent } from '../../../../processor';
import { UnknownVersionError } from '../../../../utils/errors';
import { UniquesTransferredEventParams } from '../../../types/events/uniques';

function parseUniqueTransferredParams(
  event: SqdEvent
): UniquesTransferredEventParams {
  if (events.uniques.transferred.v405.is(event)) {
    const parsedParams = events.uniques.transferred.v405.decode(event);

    return {
      collection: parsedParams.collection.toString(),
      item: parsedParams.item.toString(),
      from: parsedParams.from,
      to: parsedParams.to,
    };
  }

  throw new UnknownVersionError(event.name);
}

export default {
  parseUniqueTransferredParams,
};
